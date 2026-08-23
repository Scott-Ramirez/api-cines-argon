import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IHeroSlideRepository } from '../../../domain/repositories/hero-slide.repository.interface';
import { HeroSlideModel } from '../../../domain/models/hero-slide.model';
import { HeroSlideOrmEntity } from '../entities/hero-slide.orm-entity';
import { HeroSlideMapper } from '../mappers';

@Injectable()
export class TypeormHeroSlideRepository implements IHeroSlideRepository {
  constructor(
    @InjectRepository(HeroSlideOrmEntity)
    private readonly repo: Repository<HeroSlideOrmEntity>,
  ) {}

  async findAll(onlyActive?: boolean): Promise<HeroSlideModel[]> {
    const where: any = {};
    if (onlyActive) where.active = true;

    const list = await this.repo.find({
      where,
      order: { order: 'ASC', createdAt: 'DESC' },
    });
    return list.map(HeroSlideMapper.toDomain);
  }

  async findById(id: string): Promise<HeroSlideModel | null> {
    const item = await this.repo.findOne({ where: { id } });
    return item ? HeroSlideMapper.toDomain(item) : null;
  }

  async create(slide: HeroSlideModel): Promise<HeroSlideModel> {
    const orm = HeroSlideMapper.toOrm(slide);
    const saved = await this.repo.save(orm);
    return HeroSlideMapper.toDomain(saved);
  }

  async update(id: string, slide: Partial<HeroSlideModel>): Promise<HeroSlideModel> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new Error('Slide no encontrado');
    const merged = Object.assign(existing, HeroSlideMapper.toOrm(slide));
    const saved = await this.repo.save(merged);
    return HeroSlideMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
