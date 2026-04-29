// src/domain/User.ts

export class User {
  public _id: string | undefined;
  public username: string;
  public email: string;
  public passwordhash: string;
  public profileurl: string;
  public stats: {wins: number; losses: number;};

  constructor(
    _id: string | undefined,
    username: string,
    email: string,
    passwordHash: string,
    profileurl: string,
    stats: {wins: number; losses: number;},
  ) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.passwordhash = passwordHash;
    this.profileurl = profileurl;
    this.stats = stats;
  }

  public setProfileurl(profileurl: string){
    this.profileurl = profileurl;
  }

  // public updateEmail(newEmail: string)
}
