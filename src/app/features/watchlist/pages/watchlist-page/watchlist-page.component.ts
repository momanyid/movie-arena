import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';
import { WatchlistService } from '../../../../core/services/watchlist.service';
import { MovieCardComponent }    from '../../../../shared/components/movie-card/movie-card.component';
import { MovieModalComponent }   from '../../../../shared/components/movie-modal/movie-modal.component';
import { ToastContainerComponent } from '../../../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'ma-watchlist-page',
  standalone: true,
  imports: [MovieCardComponent, MovieModalComponent, ToastContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="watchlist-page">
      <div class="watchlist-page__header">
        <h1>My <span>Watchlist</span></h1>
        <span class="count">{{ watchlistService.count() }} titles</span>
      </div>

      @if (watchlistService.items().length === 0) {
        <div class="empty-state">
          <span class="empty-state__icon">❤️</span>
          <h2>Your watchlist is empty</h2>
          <p>Start adding movies by clicking the heart icon on any movie card.</p>
        </div>
      } @else {
        <div class="watchlist-grid" role="list">
          @for (movie of watchlistService.items(); track movie.id) {
            <ma-movie-card [movie]="movie" (cardClick)="openModal($event)" />
          }
        </div>
      }
    </div>

    <ma-movie-modal [movie]="selectedMovie()" (close)="closeModal()" />
    <ma-toast-container />
  `,
  styles: [`
    .watchlist-page__header {
      display: flex; align-items: center; gap: 16px; margin-bottom: 28px;
    }
    h1 {
      font-family: var(--font-display); font-size: 2rem; letter-spacing: 2px;
    }
    h1 span { color: var(--accent); }
    .count {
      font-size: 0.8125rem; color: var(--text-muted);
      background: rgba(139,0,0,0.2); border: 1px solid var(--border);
      padding: 3px 12px; border-radius: 12px;
    }
    .watchlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
      gap: 20px;
    }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 80px 0; text-align: center;
    }
    .empty-state__icon { font-size: 3.5rem; }
    h2 { font-family: var(--font-display); letter-spacing: 1px; font-size: 1.5rem; }
    p { color: var(--text-muted); max-width: 340px; line-height: 1.6; }
  `],
})
export class WatchlistPageComponent {
  readonly watchlistService = inject(WatchlistService);
  readonly selectedMovie = signal<Movie | null>(null);

  openModal(movie: Movie): void { this.selectedMovie.set(movie); }
  closeModal(): void { this.selectedMovie.set(null); }
}
