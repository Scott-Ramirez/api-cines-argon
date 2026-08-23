export class HeroSlideModel {
  constructor(
    public readonly id: string,
    public title: string,
    public tagline: string,
    public time: string,
    public rating: string,
    public durationMinutes?: number,
    public genres: string[] = [],
    public synopsis: string = '',
    public backdropUrl: string = '',
    public posterUrl?: string,
    public active: boolean = true,
    public order: number = 0,
    public movieId?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  toggleActive(): void {
    this.active = !this.active;
  }
}
