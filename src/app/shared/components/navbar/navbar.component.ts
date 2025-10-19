import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { WatchlistService } from '../../../core/services/watchlist.service';

@Component({
  selector: 'ma-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar" role="navigation" aria-label="Main navigation">

      <a class="navbar__brand" routerLink="/home" aria-label="Movie Arena home">
        Movie Arena
      </a>

      <div class="navbar__nav">
        <a routerLink="/home"      routerLinkActive="active">Movies</a>
        <a routerLink="/tv-shows"  routerLinkActive="active">TV Shows</a>
        <a routerLink="/watchlist" routerLinkActive="active">
          My List
          @if (watchlistCount() > 0) {
            <span class="navbar__badge">{{ watchlistCount() }}</span>
          }
        </a>
      </div>

      <div class="navbar__search" role="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          placeholder="Quick Search"
          aria-label="Search movies and shows"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch($event)"
        />
        @if (searchQuery()) {
          <button class="navbar__clear" (click)="clearSearch()" aria-label="Clear search">✕</button>
        }
      </div>

      <button class="navbar__avatar" aria-label="User profile" aria-haspopup="true">
        <img src="https://i.pravatar.cc/80?img=12" alt="User avatar" width="40" height="40" />
      </button>

    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      height: var(--nav-h);
      background: rgba(26,5,5,0.92);
      backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
      padding: 0 28px; gap: 36px;
    }
    .navbar__brand {
      background: var(--crimson); color: #fff;
      font-family: var(--font-display); font-size: 1.25rem; letter-spacing: 1px;
      padding: 10px 20px; border-radius: var(--radius-lg); white-space: nowrap;
      flex-shrink: 0; transition: background var(--transition);
    }
    .navbar__brand:hover { background: var(--crimson-light); }
    .navbar__nav { display: flex; gap: 32px; flex: 1; }
    .navbar__nav a {
      font-size: 1rem; font-weight: 500; color: var(--text-primary);
      position: relative; padding-bottom: 4px; transition: color var(--transition);
      display: flex; align-items: center; gap: 6px;
    }
    .navbar__nav a::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 0; height: 2px; background: var(--accent);
      border-radius: 2px; transition: width var(--transition);
    }
    .navbar__nav a:hover { color: #fff; }
    .navbar__nav a:hover::after, .navbar__nav a.active::after { width: 100%; }
    .navbar__badge {
      background: var(--accent); color: #fff;
      font-size: 0.65rem; font-weight: 700;
      padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center;
    }
    .navbar__search {
      flex: 1; max-width: 360px;
      display: flex; align-items: center;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border); border-radius: 24px;
      padding: 8px 16px; gap: 10px;
      transition: border-color var(--transition), background var(--transition);
    }
    .navbar__search:focus-within {
      border-color: var(--crimson-light); background: rgba(255,255,255,0.09);
    }
    .navbar__search input {
      background: none; border: none; outline: none;
      color: var(--text-primary); font-family: var(--font-body);
      font-size: 0.875rem; flex: 1; width: 100%;
    }
    .navbar__search input::placeholder { color: var(--text-dim); }
    .navbar__clear {
      color: var(--text-dim); font-size: 12px; padding: 2px;
      transition: color var(--transition);
    }
    .navbar__clear:hover { color: var(--accent); }
    .navbar__avatar {
      width: 40px; height: 40px; border-radius: 50%;
      overflow: hidden; border: 2px solid var(--crimson);
      flex-shrink: 0; cursor: pointer;
      transition: border-color var(--transition), transform var(--transition);
      padding: 0;
    }
    .navbar__avatar:hover { border-color: var(--accent); transform: scale(1.07); }
    .navbar__avatar img { width: 100%; height: 100%; object-fit: cover; }
    svg { color: var(--text-dim); flex-shrink: 0; }
    @media (max-width: 480px) {
      .navbar { gap: 16px; padding: 0 16px; }
      .navbar__nav { display: none; }
      .navbar__search { max-width: 200px; }
    }
  `],
})
export class NavbarComponent {
  private readonly movieService = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);

  readonly searchQuery = signal('');
  readonly watchlistCount = this.watchlistService.count;

  onSearch(query: string): void {
    this.movieService.setSearchQuery(query);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.movieService.setSearchQuery('');
  }
}
