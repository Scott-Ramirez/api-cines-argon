import { UserModel } from '../models/user.model';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByUsername(username: string): Promise<UserModel | null>;
  findById(id: string): Promise<UserModel | null>;
  create(user: UserModel): Promise<UserModel>;
}
