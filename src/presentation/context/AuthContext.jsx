import { createContext, useContext, useEffect, useState } from "react";
import { authUseCases, roleRepository } from "../../di/container.js";

const AuthContext = createContext(null);

async function loadUserRole(userProfile) {
  if (!userProfile?.roleId) return null;
  return roleRepository.getById(userProfile.roleId);
}

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const unsubscribe = authUseCases.onAuthChange(async (user) => {
      setFirebaseUser(user);
      setProfileError("");
      try {
        if (user) {
          const userProfile = await authUseCases.ensureProfile({
            uid: user.uid,
            email: user.email ?? "",
            name: user.displayName || "",
          });
          setProfile(userProfile);
          setRole(await loadUserRole(userProfile));
        } else {
          setProfile(null);
          setRole(null);
        }
      } catch (err) {
        console.error("Error cargando el perfil:", err);
        setProfile(null);
        setRole(null);
        setProfileError(
          err.message?.includes("permission")
            ? "No se pudo cargar tu perfil. Verifica que las reglas de Firestore estén publicadas."
            : err.message || "Error cargando el perfil."
        );
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    firebaseUser,
    profile,
    role,
    loading,
    profileError,
    isAdmin: Boolean(role?.isAdmin),
    can: (permission) => Boolean(role?.hasPermission(permission)),
    canWrite: (permission) => Boolean(role?.hasWritePermission(permission)),
    login: authUseCases.login,
    register: authUseCases.register,
    logout: authUseCases.logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
