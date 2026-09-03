export function makeUserUseCases(userRepository) {
  return {
    listUsers: () => userRepository.getAll(),
    assignRole: (uid, roleId) => userRepository.assignRole(uid, roleId),
  };
}
