import { HeroSlideModel } from '../models/hero-slide.model';

export const HERO_SLIDE_REPOSITORY = 'HERO_SLIDE_REPOSITORY';

export interface IHeroSlideRepository {
  findAll(onlyActive?: boolean): Promise<HeroSlideModel[]>;
  findById(id: string): Promise<HeroSlideModel | null>;
  create(slide: HeroSlideModel): Promise<HeroSlideModel>;
  update(id: string, slide: Partial<HeroSlideModel>): Promise<HeroSlideModel>;
  delete(id: string): Promise<void>;
}
