// src/domain/User.ts

export class User {
  public id: string;
  public username: string;
  public email: string;

  constructor(id: string, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  
  // public updateEmail(newEmail: string)
}