export class UserModel {
  constructor(
    public readonly id: string,
    public name: string,
    public username: string,
    public password?: string,
    public role: string = 'ADMIN',
    public avatar?: string,
    public assignedTerminal?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
