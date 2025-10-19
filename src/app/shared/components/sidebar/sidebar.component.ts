import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { Genre } from '../../../core/models/movie.model';

interface SidebarItem {
  label: string;
  genre: Genre | 'all' | 'trending';
}

@Component({
  selector: 'ma-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar" role="navigation" aria-label="Category navigation">
      <ul role="list">
        @for (item of topItems; track item.label) {
          <li
            class="sidebar__item"
            [class.active]="activeGenre() === item.genre"
            role="listitem"
            tabindex="0"
            (click)="selectGenre(item.genre)"
            (keydown.enter)="selectGenre(item.genre)"
            (keydown.space)="selectGenre(item.genre)"
            [attr.aria-current]="activeGenre() === item.genre ? 'page' : null"
          >
            {{ item.label }}
          </li>
        }

        <li class="sidebar__divider" role="separator"></li>

        @for (item of genreItems; track item.genre) {
          <li
            class="sidebar__item"
            [class.active]="activeGenre() === item.genre"
            role="listitem"
            tabindex="0"
            (click)="selectGenre(item.genre)"
            (keydown.enter)="selectGenre(item.genre)"
            (keydown.space)="selectGenre(item.genre)"
            [attr.aria-current]="activeGenre() === item.genre ? 'page' : null"
          >
            {{ item.label }}
          </li>
        }

        <li class="sidebar__divider" role="separator"></li>

        <li class="sidebar__item" routerLink="/watchlist" routerLinkActive="active" role="listitem">
          My Watchlist
        </li>
      </ul>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-w); flex-shrink: 0;
      background: var(--sidebar-bg); border-right: 1px solid var(--border);
      position: sticky; top: var(--nav-h);
      height: calc(100vh - var(--nav-h));
      overflow-y: auto; padding: 16px 0;
    }
    ul { list-style: none; }
    .sidebar__item {
      display: flex; align-items: center;
      padding: 13px 20px; font-size: 0.9rem; font-weight: 400;
      color: var(--text-muted); cursor: pointer;
      border-left: 3px solid transparent;
      transition: all var(--transition); user-select: none;
    }
    .sidebar__item:hover {
      color: var(--text-primary);
      background: rgba(139,0,0,0.15);
      border-left-color: var(--crimson-light);
    }
    .sidebar__item.active {
      color: #fff; background: var(--crimson);
      border-left-color: var(--accent); font-weight: 500;
    }
    .sidebar__item.active:hover { background: var(--crimson-light); }
    .sidebar__divider { height: 1px; background: var(--border); margin: 10px 16px; }
    @media (max-width: 700px) { .sidebar { display: none; } }
  `],
})
export class SidebarComponent {
  private readonly movieService = inject(MovieService);

  // ✅ Fix: read only the genre property, not the whole MovieFilters object
  readonly activeGenre = () => this.movieService.filters().genre;

  readonly topItems: SidebarItem[] = [
    { label: 'All Movies', genre: 'all' },
    { label: 'Trending',   genre: 'trending' },
  ];

  readonly genreItems: SidebarItem[] = [
    { label: 'Comedy',      genre: 'comedy' },
    { label: 'Horror',      genre: 'horror' },
    { label: 'Romance',     genre: 'romance' },
    { label: 'Adventure',   genre: 'adventure' },
    { label: 'Action',      genre: 'action' },
    { label: 'Drama',       genre: 'drama' },
    { label: 'Sci-Fi',      genre: 'scifi' },
    { label: 'Documentary', genre: 'documentary' },
    { label: 'Animation',   genre: 'animation' },
  ];

  selectGenre(genre: Genre | 'all' | 'trending'): void {
    const g = genre === 'trending' ? 'all' : genre as Genre | 'all';
    this.movieService.setGenreFilter(g);
  }
}
