import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  computed,
  HostListener,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common'; // ✅ Fix: import TitleCasePipe
import { Movie } from '../../../core/models/movie.model';
import { WatchlistService } from '../../../core/services/watchlist.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'ma-movie-modal',
  standalone: true,
  imports: [TitleCasePipe], // ✅ Fix: add to imports array
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="modal-overlay"
      [class.open]="!!movie"
      role="dialog"
      [attr.aria-modal]="!!movie"
      [attr.aria-hidden]="!movie"
      [attr.aria-labelledby]="movie ? 'modal-title' : null"
      (click)="onOverlayClick($event)"
    >
      @if (movie) {
        <div class="modal">
          <div class="modal__hero">
            <img
              class="modal__hero-bg"
              [src]="backdropUrl"
              [alt]="movie.title + ' backdrop'"
              width="680" height="240"
            />
            <div class="modal__hero-gradient"></div>
            <button class="modal__close" (click)="close.emit()" aria-label="Close dialog">✕</button>
          </div>

          <div class="modal__body">
            <h2 class="modal__title" id="modal-title">{{ movie.title }}</h2>
            <div class="modal__meta">
              <span>{{ movie.year }}</span>
              <span class="chip">{{ movie.genre | titlecase }}</span> <!-- ✅ Now works -->
              <span class="chip">⭐ {{ movie.rating }}</span>
              @if (movie.duration) { <span>{{ movie.duration }}</span> }
              @if (movie.director) { <span>Dir. {{ movie.director }}</span> }
            </div>
            <p class="modal__cast">{{ movie.cast.join(', ') }}</p>
            <p class="modal__desc">{{ movie.description }}</p>
            <div class="modal__actions">
              <button class="btn btn--primary" (click)="onWatch()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Watch Now
              </button>
              <button class="btn btn--outline" (click)="onWatchlistToggle()">
                <svg width="14" height="14" viewBox="0 0 24 24"
                     [attr.fill]="isInWatchlist() ? 'currentColor' : 'none'"
                     stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {{ isInWatchlist() ? 'In Watchlist' : 'Add to Watchlist' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; z-index: 200;
      background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    .modal-overlay.open { opacity: 1; pointer-events: all; }
    .modal {
      background: var(--surface-card); border-radius: var(--radius-lg);
      overflow: hidden; width: 90%; max-width: 680px;
      border: 1px solid var(--border);
      box-shadow: 0 40px 80px rgba(0,0,0,0.8);
      transform: scale(0.92) translateY(20px);
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    }
    .modal-overlay.open .modal { transform: scale(1) translateY(0); }
    .modal__hero { position: relative; aspect-ratio: 16/7; overflow: hidden; }
    .modal__hero-bg { width: 100%; height: 100%; object-fit: cover; }
    .modal__hero-gradient {
      position: absolute; inset: 0;
      background: linear-gradient(to top, var(--surface-card) 0%, transparent 70%);
    }
    .modal__close {
      position: absolute; top: 14px; right: 14px;
      width: 36px; height: 36px; background: rgba(0,0,0,0.5);
      backdrop-filter: blur(6px); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: 1px solid rgba(255,255,255,0.1);
      color: #fff; font-size: 18px; transition: all var(--transition);
    }
    .modal__close:hover { background: var(--accent); border-color: var(--accent); }
    .modal__body { padding: 20px 28px 28px; }
    .modal__title {
      font-family: var(--font-display); font-size: 1.8rem;
      letter-spacing: 2px; margin-bottom: 8px;
    }
    .modal__meta {
      display: flex; gap: 12px; flex-wrap: wrap;
      font-size: 0.8rem; color: var(--text-muted);
      margin-bottom: 8px; align-items: center;
    }
    .chip {
      background: rgba(139,0,0,0.25); border: 1px solid var(--border);
      padding: 2px 10px; border-radius: 12px;
      color: var(--text-primary); font-size: 0.75rem;
    }
    .modal__cast { font-size: 0.8rem; color: var(--text-dim); font-style: italic; margin-bottom: 10px; }
    .modal__desc { font-size: 0.875rem; line-height: 1.7; color: var(--text-muted); margin-bottom: 20px; }
    .modal__actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
      padding: 10px 22px; border-radius: var(--radius-lg);
      cursor: pointer; transition: all var(--transition); white-space: nowrap; border: none;
    }
    .btn--primary { background: #fff; color: var(--crimson-dark); }
    .btn--primary:hover {
      background: var(--accent); color: #fff;
      transform: translateY(-1px); box-shadow: 0 8px 24px rgba(255,68,68,0.35);
    }
    .btn--outline {
      background: rgba(255,255,255,0.1); color: #fff;
      border: 1px solid rgba(255,255,255,0.25) !important; backdrop-filter: blur(6px);
    }
    .btn--outline:hover { background: rgba(255,255,255,0.2); transform: translateY(-1px); }
  `],
})
export class MovieModalComponent {
  @Input() movie: Movie | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() watch = new EventEmitter<Movie>();

  private readonly watchlistService = inject(WatchlistService);
  private readonly toastService = inject(ToastService);

  readonly isInWatchlist = computed(() =>
    this.movie ? this.watchlistService.isInWatchlist(this.movie.id) : false
  );

  get backdropUrl(): string {
    return `https://picsum.photos/seed/${this.movie?.backdropSeed}/680/240`;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.movie) this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) this.close.emit();
  }

  onWatch(): void {
    if (this.movie) {
      this.watch.emit(this.movie);
      this.toastService.show(`▶ Starting "${this.movie.title}"...`);
      this.close.emit();
    }
  }

  onWatchlistToggle(): void {
    if (!this.movie) return;
    this.watchlistService.toggle(this.movie);
    const msg = this.isInWatchlist()
      ? `❤️ "${this.movie.title}" added to watchlist`
      : `"${this.movie.title}" removed from watchlist`;
    this.toastService.show(msg);
  }
}
