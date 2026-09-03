export class UserProfile {
  constructor({ uid, email, name = "", roleId = null, createdAt = null }) {
    this.uid = uid;
    this.email = email;
    this.name = name;
    this.roleId = roleId;
    this.createdAt = createdAt;
  }
}
