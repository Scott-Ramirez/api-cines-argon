export type MovieRating = 'APT' | '14+' | '18+' | 'TE';
export type MovieStatus = 'CARTELERA' | 'PROXIMAMENTE' | 'ARCHIVADA';

export class MovieModel {
  constructor(
    public readonly id: string,
    public title: string,
    public originalTitle?: string,
    public synopsis: string = '',
    public durationMinutes: number = 0,
    public rating: MovieRating = 'APT',
    public genre: string[] = [],
    public posterUrl: string = '',
    public backdropUrl?: string,
    public trailerUrl?: string,
    public status: MovieStatus = 'CARTELERA',
    public director?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
