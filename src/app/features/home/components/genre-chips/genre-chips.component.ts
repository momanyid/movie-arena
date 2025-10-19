import {
  Component,
  Output,
  EventEmitter,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Genre } from '../../../../core/models/movie.model';

interface GenreOption {
  label: string;
  value: Genre | 'all';
}

@Component({
  selector: 'ma-genre-chips',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="genre-chips" role="list" aria-label="Filter movies by genre">
      @for (g of genres; track g.value) {
        <button
          class="genre-chip"
          [class.active]="activeGenre === g.value"
          role="listitem"
          [attr.aria-pressed]="activeGenre === g.value"
          (click)="genreChange.emit(g.value)"
        >
          {{ g.label }}
        </button>
      }
    </div>
  `,
  styles: [`
    .genre-chips {
      display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px;
    }
    .genre-chip {
      padding: 7px 18px; border-radius: 20px;
      font-size: 0.8125rem; font-weight: 500;
      border: 1px solid var(--border); color: var(--text-muted);
      background: rgba(139,0,0,0.08); cursor: pointer;
      transition: all var(--transition); font-family: var(--font-body);
    }
    .genre-chip:hover, .genre-chip.active {
      background: var(--crimson); color: #fff; border-color: var(--crimson-light);
    }
  `],
})
export class GenreChipsComponent {
  @Input() activeGenre: Genre | 'all' = 'all';
  @Output() genreChange = new EventEmitter<Genre | 'all'>();

  readonly genres: GenreOption[] = [
    { label: 'All',       value: 'all' },
    { label: 'Action',    value: 'action' },
    { label: 'Comedy',    value: 'comedy' },
    { label: 'Horror',    value: 'horror' },
    { label: 'Sci-Fi',    value: 'scifi' },
    { label: 'Romance',   value: 'romance' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Drama',     value: 'drama' },
    { label: 'Animation', value: 'animation' },
  ];
}
