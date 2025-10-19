import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { Movie } from '../../../core/models/movie.model';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'ma-movie-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="movie-card"
      [attr.aria-label]="movie.title + ', rated ' + movie.rating"
      tabindex="0"
      role="button"
      (click)="cardClick.emit(movie)"
      (keydown.enter)="cardClick.emit(movie)"
      (keydown.space)="cardClick.emit(movie)"
    >
      @if (movie.badge) {
        <span class="movie-card__badge movie-card__badge--{{ movie.badge }}">
          {{ movie.badge }}
        </span>
      }

      <button
        class="movie-card__heart"
        [class.liked]="isInWatchlist()"
        [attr.aria-label]="(isInWatchlist() ? 'Remove from' : 'Add to') + ' watchlist: ' + movie.title"
        [attr.aria-pressed]="isInWatchlist()"
        (click)="toggleWatchlist($event)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24"
             [attr.fill]="isInWatchlist() ? 'white' : 'none'"
             stroke="white" stroke-width="2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <img
        class="movie-card__poster"
        [src]="posterUrl"
        [alt]="movie.title + ' poster'"
        loading="lazy"
        width="240"
        height="360"
      />

      <div class="movie-card__overlay">
        <div class="movie-card__play" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        <h3 class="movie-card__title">{{ movie.title }}</h3>
        <div class="movie-card__meta">
          <span class="movie-card__rating" aria-label="Rating {{ movie.rating }} out of 10">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFB347" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {{ movie.rating }}
          </span>
          <span>{{ movie.year }}</span>
          <span>{{ movie.duration }}</span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .movie-card {
      position: relative; border-radius: var(--radius-md); overflow: hidden;
      background: var(--surface-card); box-shadow: var(--shadow-card);
      cursor: pointer; aspect-ratio: 2/3;
      transition: transform var(--transition), box-shadow var(--transition);
    }
    .movie-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 20px 50px rgba(0,0,0,0.7), 0 0 0 2px var(--crimson-light);
      z-index: 2;
    }
    .movie-card__poster {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.4s ease;
    }
    .movie-card:hover .movie-card__poster { transform: scale(1.06); }
    .movie-card__overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
      opacity: 0; transition: opacity var(--transition);
      display: flex; flex-direction: column;
      justify-content: flex-end; padding: 14px;
    }
    .movie-card:hover .movie-card__overlay { opacity: 1; }
    .movie-card__title {
      font-size: 0.8125rem; font-weight: 600;
      color: #fff; margin-bottom: 6px; line-height: 1.3;
    }
    .movie-card__meta {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.7rem; color: var(--text-muted);
    }
    .movie-card__rating {
      display: flex; align-items: center; gap: 3px;
      color: var(--accent-gold); font-weight: 600;
    }
    .movie-card__play {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%,-50%) scale(0.7); opacity: 0;
      width: 48px; height: 48px;
      background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      transition: all var(--transition); border: 1px solid rgba(255,255,255,0.3);
    }
    .movie-card:hover .movie-card__play {
      opacity: 1; transform: translate(-50%,-50%) scale(1);
    }
    .movie-card__badge {
      position: absolute; top: 10px; left: 10px;
      background: var(--crimson); color: #fff;
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.5px;
      padding: 2px 8px; border-radius: 4px; text-transform: uppercase; z-index: 1;
    }
    .movie-card__badge--new { background: #27ae60; }
    .movie-card__badge--hot { background: var(--accent); }
    .movie-card__heart {
      position: absolute; top: 10px; right: 10px; z-index: 1;
      width: 30px; height: 30px;
      background: rgba(0,0,0,0.5); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity var(--transition), background var(--transition);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .movie-card:hover .movie-card__heart { opacity: 1; }
    .movie-card__heart.liked { opacity: 1; background: var(--accent); }
    .movie-card__heart:hover { background: var(--accent); }
  `],
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Output() cardClick = new EventEmitter<Movie>();

  private readonly watchlistService = inject(WatchlistService);
  private readonly toastService = inject(ToastService);

  readonly isInWatchlist = computed(() =>
    this.watchlistService.isInWatchlist(this.movie.id)
  );

  get posterUrl(): string {
    return `https://picsum.photos/seed/${this.movie.posterSeed}/240/360`;
  }

  toggleWatchlist(event: Event): void {
    event.stopPropagation();
    this.watchlistService.toggle(this.movie);
    const msg = this.isInWatchlist()
      ? `❤️ "${this.movie.title}" added to watchlist`
      : `"${this.movie.title}" removed from watchlist`;
    this.toastService.show(msg);
  }
}
