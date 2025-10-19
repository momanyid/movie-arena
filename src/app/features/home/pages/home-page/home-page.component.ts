import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
// ✅ Fix: removed unused TitleCasePipe import
import { Movie, FeaturedMovie, Genre } from '../../../../core/models/movie.model';
import { MovieService } from '../../../../core/services/movie.service';
import { ToastService } from '../../../../core/services/toast.service';

import { HeroBannerComponent }    from '../../components/hero-banner/hero-banner.component';
import { GenreChipsComponent }    from '../../components/genre-chips/genre-chips.component';
import { SectionHeaderComponent } from '../../components/section-header/section-header.component';
import { FeaturedCardComponent }  from '../../components/featured-card/featured-card.component';
import { MovieCardComponent }     from '../../../../shared/components/movie-card/movie-card.component';
import { MovieModalComponent }    from '../../../../shared/components/movie-modal/movie-modal.component';
import { ToastContainerComponent } from '../../../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'ma-home-page',
  standalone: true,
  imports: [
    // ✅ Fix: TitleCasePipe removed — it was imported but never used in this template
    HeroBannerComponent,
    GenreChipsComponent,
    SectionHeaderComponent,
    FeaturedCardComponent,
    MovieCardComponent,
    MovieModalComponent,
    ToastContainerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Banner -->
    <ma-hero-banner
      [movie]="heroBanner"
      (watch)="onWatch($event)"
      (details)="openModal($event)"
    />

    <!-- Genre Chips -->
    <ma-genre-chips
      [activeGenre]="movieService.filters().genre"
      (genreChange)="onGenreChange($event)"
    />

    <!-- Trending Section -->
    <section aria-labelledby="trending-heading">
      <ma-section-header
        title="Trending"
        highlight="Now"
        seeAllRoute="/movies"
      />
      <div class="movie-row" role="list" aria-label="Trending movies">
        @for (movie of trending; track movie.id) {
          <ma-movie-card [movie]="movie" (cardClick)="openModal($event)" />
        }
      </div>
    </section>

    <!-- Popular Grid -->
    <section aria-labelledby="popular-heading">
      <ma-section-header
        title="Popular"
        highlight="Movies"
        seeAllRoute="/movies"
      />
      @if (movieService.filteredMovies().length === 0) {
        <div class="empty-state">
          <span class="empty-state__icon">🎬</span>
          <p>No movies found. Try a different genre or search term.</p>
        </div>
      } @else {
        <div class="movie-grid" role="list" aria-label="Popular movies">
          @for (movie of movieService.filteredMovies(); track movie.id) {
            <ma-movie-card [movie]="movie" (cardClick)="openModal($event)" />
          }
        </div>
      }
    </section>

    <!-- Editor's Picks -->
    <section aria-labelledby="featured-heading">
      <ma-section-header
        title="Editor's"
        highlight="Picks"
        seeAllRoute="/movies"
      />
      <div class="featured-row" role="list" aria-label="Editor's picks">
        @for (movie of featured; track movie.id) {
          <ma-featured-card [movie]="movie" (cardClick)="openModal($event)" />
        }
      </div>
    </section>

    <!-- Movie Modal -->
    <ma-movie-modal
      [movie]="selectedMovie()"
      (close)="closeModal()"
      (watch)="onWatch($event)"
    />

    <!-- Toast Notifications -->
    <ma-toast-container />
  `,
  styles: [`
    section { margin-bottom: 44px; }

    .movie-row {
      display: flex; gap: 16px;
      overflow-x: auto; padding-bottom: 12px;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .movie-row::-webkit-scrollbar { height: 4px; }
    .movie-row::-webkit-scrollbar-thumb { background: var(--crimson-muted); border-radius: 2px; }
    .movie-row ma-movie-card { flex: 0 0 160px; scroll-snap-align: start; }

    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
      gap: 20px;
    }

    .featured-row {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      gap: 12px; padding: 60px 0; color: var(--text-muted); text-align: center;
    }
    .empty-state__icon { font-size: 3rem; }

    @media (max-width: 600px) {
      .movie-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 14px; }
      .featured-row { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 400px) {
      .featured-row { grid-template-columns: 1fr; }
    }
  `],
})
export class HomePageComponent {
  readonly movieService = inject(MovieService);
  private readonly toastService = inject(ToastService);

  readonly heroBanner = this.movieService.getHeroBanner();
  readonly trending   = this.movieService.getTrending();
  readonly featured   = this.movieService.getFeatured();

  readonly selectedMovie = signal<Movie | null>(null);

  openModal(movie: Movie | FeaturedMovie): void {
    this.selectedMovie.set(movie as Movie);
  }

  closeModal(): void {
    this.selectedMovie.set(null);
  }

  onGenreChange(genre: Genre | 'all'): void {
    this.movieService.setGenreFilter(genre);
  }

  onWatch(movie: Movie): void {
    this.toastService.show(`▶ Playing "${movie.title}"...`);
  }
}
