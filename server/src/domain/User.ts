// src/domain/User.ts

export class User {
  public _id: string | undefined;
  public username: string;
  public email: string;
  public passwordhash: string;

  constructor(
    _id: string | undefined,
    username: string,
    email: string,
    passwordHash: string,
  ) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.passwordhash = passwordHash;
  }

  // public updateEmail(newEmail: string)
}
