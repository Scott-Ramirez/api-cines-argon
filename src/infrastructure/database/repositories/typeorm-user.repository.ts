import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UserModel } from '../../../domain/models/user.model';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers';

@Injectable()
export class TypeormUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByUsername(username: string): Promise<UserModel | null> {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.username) = :username', { username: username.toLowerCase() })
      .getOne();

    return user ? UserMapper.toDomain(user) : null;
  }

  async findById(id: string): Promise<UserModel | null> {
    const user = await this.repo.findOne({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(user: UserModel): Promise<UserModel> {
    const orm = UserMapper.toOrm(user);
    const saved = await this.repo.save(orm);
    return UserMapper.toDomain(saved);
  }
}
