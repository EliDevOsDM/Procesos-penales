import { Role } from "../../domain/entities/Role.js";
import { UserProfile } from "../../domain/entities/UserProfile.js";
import { ALL_PERMISSIONS } from "../../domain/permissions.js";

export function makeAuthUseCases(authService, userRepository, roleRepository) {
  const inflight = new Map();

  const getOrCreateAdminRole = async () => {
    const roles = await roleRepository.getAll();
    let adminRole = roles.find((r) => r.isAdmin);
    if (!adminRole) {
      adminRole = await roleRepository.create(
        new Role({
          name: "Administrador",
          description: "Acceso total al panel",
          permissions: [...ALL_PERMISSIONS],
          isAdmin: true,
        })
      );
      return adminRole;
    }

    const missing = ALL_PERMISSIONS.filter((p) => !adminRole.permissions.includes(p));
    if (missing.length > 0) {
      adminRole.permissions = [...ALL_PERMISSIONS];
      await roleRepository.update(adminRole);
    }

    return adminRole;
  };

  /** True si este usuario debe recibir (o conservar) el rol admin. */
  const shouldGrantAdmin = async (uid) => {
    const [users, roles] = await Promise.all([
      userRepository.getAll(),
      roleRepository.getAll(),
    ]);

    // Primer usuario del sistema → siempre admin
    if (users.length === 0) return true;

    const adminRole = roles.find((r) => r.isAdmin);
    if (!adminRole) return true;

    const usersWithAdmin = users.filter((u) => u.roleId === adminRole.id);

    // Nadie tiene admin asignado (estado roto tras error de permisos)
    if (usersWithAdmin.length === 0) return true;

    // Solo hay un usuario registrado → admin
    if (users.length === 1 && users[0].uid === uid) return true;

    // El usuario actual es el único admin o no hay otro admin distinto a él
    const otherAdmins = usersWithAdmin.filter((u) => u.uid !== uid);
    return otherAdmins.length === 0;
  };

  const grantAdminToUser = async ({ uid, email, name, existing }) => {
    const adminRole = await getOrCreateAdminRole();

    if (existing) {
      await userRepository.assignRole(uid, adminRole.id);
      return new UserProfile({
        ...existing,
        email: email || existing.email,
        name: name || existing.name,
        roleId: adminRole.id,
      });
    }

    const profile = new UserProfile({
      uid,
      email,
      name,
      roleId: adminRole.id,
    });
    await userRepository.save(profile);
    return profile;
  };

  /**
   * Crea o repara el perfil en Firestore.
   * Si no hay otro administrador, el usuario actual recibe el rol admin.
   */
  const doEnsureProfile = async ({ uid, email, name = "" }) => {
    const existing = await userRepository.getByUid(uid);
    const grantAdmin = await shouldGrantAdmin(uid);

    if (grantAdmin) {
      return grantAdminToUser({ uid, email, name, existing });
    }

    if (existing) {
      // Reparar perfil existente sin rol si nadie más es admin
      if (!existing.roleId) {
        const retryGrant = await shouldGrantAdmin(uid);
        if (retryGrant) {
          return grantAdminToUser({ uid, email, name, existing });
        }
      }
      return new UserProfile({
        ...existing,
        email: email || existing.email,
        name: name || existing.name,
      });
    }

    const profile = new UserProfile({ uid, email, name, roleId: null });
    await userRepository.save(profile);
    return profile;
  };

  const ensureProfile = (params) => {
    if (!inflight.has(params.uid)) {
      const promise = doEnsureProfile(params).finally(() =>
        inflight.delete(params.uid)
      );
      inflight.set(params.uid, promise);
    }
    return inflight.get(params.uid);
  };

  return {
    login: (email, password) => authService.login(email, password),

    logout: () => authService.logout(),

    register: async ({ name, email, password }) => {
      let credential;
      try {
        credential = await authService.register(email, password);
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          credential = await authService.login(email, password);
        } else {
          throw err;
        }
      }
      return ensureProfile({ uid: credential.user.uid, email, name });
    },

    ensureProfile,

    onAuthChange: (callback) => authService.onAuthChange(callback),
  };
}
