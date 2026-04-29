// src/domain/User.ts

export class User {
  public _id: string | undefined;
  public username: string;
  public email: string;
  public passwordhash: string;
  public profileurl: string;

  constructor(
    _id: string | undefined,
    username: string,
    email: string,
    passwordHash: string,
    profileurl: string,
  ) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.passwordhash = passwordHash;
    this.profileurl = profileurl;
  }

  public setProfileurl(profileurl: string){
    this.profileurl = profileurl;
  }

  // public updateEmail(newEmail: string)
}
