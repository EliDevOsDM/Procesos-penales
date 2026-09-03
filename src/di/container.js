// Composición de dependencias (única capa que conoce las implementaciones).
import { FirebaseAuthService } from "../infrastructure/firebase/FirebaseAuthService.js";
import { FirestoreRoleRepository } from "../infrastructure/firebase/FirestoreRoleRepository.js";
import { FirestoreUserRepository } from "../infrastructure/firebase/FirestoreUserRepository.js";
import { FirestoreCrudRepository } from "../infrastructure/firebase/FirestoreCrudRepository.js";
import { FirestoreCatalogRepository } from "../infrastructure/firebase/FirestoreCatalogRepository.js";
import { FirebaseStorageService } from "../infrastructure/firebase/FirebaseStorageService.js";

import { makeAuthUseCases } from "../application/usecases/authUseCases.js";
import { makeRoleUseCases } from "../application/usecases/roleUseCases.js";
import { makeUserUseCases } from "../application/usecases/userUseCases.js";
import { makeCrudUseCases } from "../application/usecases/crudUseCases.js";
import { makeCatalogUseCases } from "../application/usecases/catalogUseCases.js";
import { FirestoreFieldConfigRepository } from "../infrastructure/firebase/FirestoreFieldConfigRepository.js";
import { makeFieldConfigUseCases } from "../application/usecases/fieldConfigUseCases.js";

import { makeStatsUseCases } from "../application/usecases/statsUseCases.js";
import { makeCalendarUseCases } from "../application/usecases/calendarUseCases.js";

import { MODULE_LIST } from "../domain/modules.js";

const authService = new FirebaseAuthService();
const roleRepository = new FirestoreRoleRepository();
const userRepository = new FirestoreUserRepository();
const catalogRepository = new FirestoreCatalogRepository();
const fieldConfigRepository = new FirestoreFieldConfigRepository();
export const storageService = new FirebaseStorageService();

export const authUseCases = makeAuthUseCases(authService, userRepository, roleRepository);
export const roleUseCases = makeRoleUseCases(roleRepository);
export const userUseCases = makeUserUseCases(userRepository);
export const catalogUseCases = makeCatalogUseCases(catalogRepository);
export const fieldConfigUseCases = makeFieldConfigUseCases(fieldConfigRepository);

const repositoriesByModule = Object.fromEntries(
  MODULE_LIST.map((m) => [m.key, new FirestoreCrudRepository(m.collection)])
);

export const statsUseCases = makeStatsUseCases(repositoriesByModule);

export const crudUseCasesByModule = Object.fromEntries(
  MODULE_LIST.map((module) => [
    module.key,
    makeCrudUseCases(
      repositoriesByModule[module.key],
      module,
      catalogRepository,
      fieldConfigRepository
    ),
  ])
);

export const calendarUseCases = makeCalendarUseCases(
  repositoriesByModule.procesos_penales
);

export { userRepository, roleRepository };
