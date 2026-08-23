import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IHeroSlideRepository, HERO_SLIDE_REPOSITORY } from '../../../domain/repositories/hero-slide.repository.interface';
import { HeroSlideModel } from '../../../domain/models/hero-slide.model';

@Injectable()
export class GetHeroSlidesUseCase {
  constructor(
    @Inject(HERO_SLIDE_REPOSITORY)
    private readonly heroSlideRepository: IHeroSlideRepository,
  ) {}

  async execute(onlyActive: boolean = false): Promise<HeroSlideModel[]> {
    return this.heroSlideRepository.findAll(onlyActive);
  }
}

@Injectable()
export class GetHeroSlideByIdUseCase {
  constructor(
    @Inject(HERO_SLIDE_REPOSITORY)
    private readonly heroSlideRepository: IHeroSlideRepository,
  ) {}

  async execute(id: string): Promise<HeroSlideModel> {
    const slide = await this.heroSlideRepository.findById(id);
    if (!slide) {
      throw new NotFoundException(`Slide con ID '${id}' no encontrado`);
    }
    return slide;
  }
}

@Injectable()
export class CreateHeroSlideUseCase {
  constructor(
    @Inject(HERO_SLIDE_REPOSITORY)
    private readonly heroSlideRepository: IHeroSlideRepository,
  ) {}

  async execute(data: {
    id?: string;
    title: string;
    tagline: string;
    time: string;
    rating: string;
    durationMinutes?: number;
    genres: string[];
    synopsis: string;
    backdropUrl: string;
    posterUrl?: string;
    active?: boolean;
    order?: number;
    movieId?: string;
  }): Promise<HeroSlideModel> {
    const slide = new HeroSlideModel(
      data.id || '',
      data.title,
      data.tagline,
      data.time,
      data.rating,
      data.durationMinutes,
      data.genres,
      data.synopsis,
      data.backdropUrl,
      data.posterUrl,
      data.active !== undefined ? data.active : true,
      data.order || 0,
      data.movieId,
    );
    return this.heroSlideRepository.create(slide);
  }
}

@Injectable()
export class UpdateHeroSlideUseCase {
  constructor(
    @Inject(HERO_SLIDE_REPOSITORY)
    private readonly heroSlideRepository: IHeroSlideRepository,
  ) {}

  async execute(id: string, data: Partial<HeroSlideModel>): Promise<HeroSlideModel> {
    const existing = await this.heroSlideRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Slide con ID '${id}' no encontrado`);
    }
    return this.heroSlideRepository.update(id, data);
  }
}

@Injectable()
export class ToggleHeroSlideUseCase {
  constructor(
    @Inject(HERO_SLIDE_REPOSITORY)
    private readonly heroSlideRepository: IHeroSlideRepository,
  ) {}

  async execute(id: string): Promise<HeroSlideModel> {
    const slide = await this.heroSlideRepository.findById(id);
    if (!slide) {
      throw new NotFoundException(`Slide con ID '${id}' no encontrado`);
    }
    slide.toggleActive();
    return this.heroSlideRepository.update(id, { active: slide.active });
  }
}

@Injectable()
export class DeleteHeroSlideUseCase {
  constructor(
    @Inject(HERO_SLIDE_REPOSITORY)
    private readonly heroSlideRepository: IHeroSlideRepository,
  ) {}

  async execute(id: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.heroSlideRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Slide con ID '${id}' no encontrado`);
    }
    await this.heroSlideRepository.delete(id);
    return { success: true, message: `Slide '${existing.title}' eliminado exitosamente` };
  }
}
