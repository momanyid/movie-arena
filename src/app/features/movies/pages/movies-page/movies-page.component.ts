import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie, Genre } from '../../../../core/models/movie.model';
import { MovieService } from '../../../../core/services/movie.service';
import { MovieCardComponent }    from '../../../../shared/components/movie-card/movie-card.component';
import { MovieModalComponent }   from '../../../../shared/components/movie-modal/movie-modal.component';
import { ToastContainerComponent } from '../../../../shared/components/toast-container/toast-container.component';
import { GenreChipsComponent }   from '../../../home/components/genre-chips/genre-chips.component';

@Component({
  selector: 'ma-movies-page',
  standalone: true,
  imports: [FormsModule, MovieCardComponent, MovieModalComponent, ToastContainerComponent, GenreChipsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="movies-page">
      <div class="movies-page__header">
        <h1>All <span>Movies</span></h1>
        <div class="movies-page__controls">
          <select
            class="sort-select"
            [ngModel]="movieService.filters().sortBy"
            (ngModelChange)="movieService.setSortBy($event)"
            aria-label="Sort movies by"
          >
            <option value="rating">Sort: Top Rated</option>
            <option value="year">Sort: Newest</option>
            <option value="title">Sort: A–Z</option>
          </select>
          <span class="movies-page__count">
            {{ movieService.filteredMovies().length }} titles
          </span>
        </div>
      </div>

      <ma-genre-chips
        [activeGenre]="movieService.filters().genre"
        (genreChange)="movieService.setGenreFilter($event)"
      />

      @if (movieService.filteredMovies().length === 0) {
        <div class="empty-state">
          <span>🎬</span>
          <p>No movies found for this filter.</p>
        </div>
      } @else {
        <div class="movies-grid" role="list">
          @for (movie of movieService.filteredMovies(); track movie.id) {
            <ma-movie-card [movie]="movie" (cardClick)="openModal($event)" />
          }
        </div>
      }
    </div>

    <ma-movie-modal [movie]="selectedMovie()" (close)="closeModal()" />
    <ma-toast-container />
  `,
  styles: [`
    .movies-page__header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
    }
    h1 {
      font-family: var(--font-display); font-size: 2rem; letter-spacing: 2px;
    }
    h1 span { color: var(--accent); }
    .movies-page__controls { display: flex; align-items: center; gap: 14px; }
    .sort-select {
      background: var(--surface-card); border: 1px solid var(--border);
      color: var(--text-primary); font-family: var(--font-body);
      font-size: 0.875rem; padding: 8px 14px; border-radius: var(--radius-sm);
      cursor: pointer; outline: none;
    }
    .sort-select:focus { border-color: var(--crimson-light); }
    .movies-page__count { font-size: 0.8125rem; color: var(--text-muted); }
    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
      gap: 20px;
    }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 80px 0; color: var(--text-muted);
    }
    .empty-state span { font-size: 3rem; }
  `],
})
export class MoviesPageComponent {
  readonly movieService = inject(MovieService);
  readonly selectedMovie = signal<Movie | null>(null);

  openModal(movie: Movie): void { this.selectedMovie.set(movie); }
  closeModal(): void { this.selectedMovie.set(null); }
}
