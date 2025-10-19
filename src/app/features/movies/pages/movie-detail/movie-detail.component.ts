import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  Input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { MovieService }    from '../../../../core/services/movie.service';
import { WatchlistService } from '../../../../core/services/watchlist.service';
import { ToastService }    from '../../../../core/services/toast.service';
import { ToastContainerComponent } from '../../../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'ma-movie-detail',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, ToastContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (movie()) {
      <div class="detail">
        <div class="detail__backdrop">
          <img [src]="backdropUrl()" [alt]="movie()!.title" width="1200" height="500"/>
          <div class="detail__backdrop-gradient"></div>
        </div>
        <div class="detail__content">
          <a class="detail__back" routerLink="/movies">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Movies
          </a>
          <div class="detail__body">
            <img class="detail__poster"
                 [src]="posterUrl()"
                 [alt]="movie()!.title + ' poster'"
                 width="220" height="330"/>
            <div class="detail__info">
              @if (movie()!.badge) {
                <span class="detail__badge detail__badge--{{ movie()!.badge }}">{{ movie()!.badge }}</span>
              }
              <h1 class="detail__title">{{ movie()!.title }}</h1>
              <div class="detail__meta">
                <span class="detail__rating">★ {{ movie()!.rating }}</span>
                <span>{{ movie()!.year }}</span>
                <span>{{ movie()!.duration }}</span>
                <span>{{ movie()!.genre | titlecase }}</span>
              </div>
              @if (movie()!.director) {
                <p class="detail__director">Directed by <strong>{{ movie()!.director }}</strong></p>
              }
              <p class="detail__cast">{{ movie()!.cast.join(' · ') }}</p>
              <p class="detail__desc">{{ movie()!.description }}</p>
              <div class="detail__actions">
                <button class="btn btn--primary" (click)="onWatch()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Watch Now
                </button>
                <button class="btn btn--outline" (click)="toggleWatchlist()">
                  <svg width="14" height="14" viewBox="0 0 24 24"
                       [attr.fill]="inWatchlist() ? 'currentColor' : 'none'"
                       stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {{ inWatchlist() ? 'In Watchlist' : 'Add to Watchlist' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="not-found">
        <p>Movie not found.</p>
        <a routerLink="/movies">← Back to Movies</a>
      </div>
    }
    <ma-toast-container />
  `,
  styles: [`
    .detail { position: relative; min-height: 80vh; }
    .detail__backdrop { position: absolute; inset: 0; max-height: 500px; overflow: hidden; }
    .detail__backdrop img { width: 100%; height: 100%; object-fit: cover; }
    .detail__backdrop-gradient {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, rgba(26,5,5,0.3) 0%, var(--surface-alt) 100%);
    }
    .detail__content { position: relative; z-index: 1; padding-top: 80px; }
    .detail__back {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--text-muted); font-size: 0.875rem; margin-bottom: 32px;
      transition: color var(--transition);
    }
    .detail__back:hover { color: var(--accent); }
    .detail__body { display: flex; gap: 40px; align-items: flex-start; flex-wrap: wrap; }
    .detail__poster {
      border-radius: var(--radius-md); box-shadow: var(--shadow-card);
      flex-shrink: 0; object-fit: cover;
    }
    .detail__info { flex: 1; min-width: 260px; }
    .detail__badge {
      display: inline-block; background: var(--crimson); color: #fff;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 1px;
      padding: 3px 10px; border-radius: 4px; text-transform: uppercase; margin-bottom: 10px;
    }
    .detail__badge--new { background: #27ae60; }
    .detail__badge--hot { background: var(--accent); }
    .detail__title {
      font-family: var(--font-display); font-size: clamp(2rem,4vw,3rem);
      letter-spacing: 2px; margin-bottom: 12px; line-height: 1.1;
    }
    .detail__meta {
      display: flex; gap: 14px; flex-wrap: wrap;
      font-size: 0.875rem; color: var(--text-muted); margin-bottom: 12px;
    }
    .detail__rating { color: var(--accent-gold); font-weight: 600; }
    .detail__director { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 6px; }
    .detail__cast { font-size: 0.8rem; color: var(--text-dim); margin-bottom: 14px; font-style: italic; }
    .detail__desc { font-size: 0.9375rem; line-height: 1.75; color: var(--text-muted); margin-bottom: 24px; }
    .detail__actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
      padding: 11px 24px; border-radius: var(--radius-lg);
      cursor: pointer; transition: all var(--transition); border: none;
    }
    .btn--primary { background: var(--crimson); color: #fff; }
    .btn--primary:hover { background: var(--crimson-light); transform: translateY(-1px); }
    .btn--outline {
      background: rgba(255,255,255,0.08); color: #fff;
      border: 1px solid rgba(255,255,255,0.2) !important;
    }
    .btn--outline:hover { background: rgba(255,255,255,0.15); }
    .not-found { text-align: center; padding: 80px 0; color: var(--text-muted); }
    .not-found a { color: var(--accent); }
  `],
})
export class MovieDetailComponent {
  // Angular 17+ route input binding (withComponentInputBinding())
  @Input() id!: string;

  private readonly movieService    = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly toastService    = inject(ToastService);

  readonly movie = computed(() =>
    this.movieService.getById(Number(this.id)) ?? null
  );

  readonly inWatchlist = computed(() =>
    this.movie() ? this.watchlistService.isInWatchlist(this.movie()!.id) : false
  );

  readonly posterUrl = computed(() =>
    `https://picsum.photos/seed/${this.movie()?.posterSeed}/220/330`
  );

  readonly backdropUrl = computed(() =>
    `https://picsum.photos/seed/${this.movie()?.backdropSeed}/1200/500`
  );

  onWatch(): void {
    const m = this.movie();
    if (m) this.toastService.show(`▶ Playing "${m.title}"...`);
  }

  toggleWatchlist(): void {
    const m = this.movie();
    if (!m) return;
    this.watchlistService.toggle(m);
    const msg = this.inWatchlist()
      ? `❤️ "${m.title}" added to watchlist`
      : `"${m.title}" removed from watchlist`;
    this.toastService.show(msg);
  }
}
