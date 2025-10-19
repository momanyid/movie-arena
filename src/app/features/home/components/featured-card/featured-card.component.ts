import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FeaturedMovie } from '../../../../core/models/movie.model';

@Component({
  selector: 'ma-featured-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="wide-card"
      [attr.aria-label]="movie.title + ' – featured'"
      tabindex="0"
      role="button"
      (click)="cardClick.emit(movie)"
      (keydown.enter)="cardClick.emit(movie)"
      (keydown.space)="cardClick.emit(movie)"
    >
      <img
        class="wide-card__bg"
        [src]="backdropUrl"
        [alt]="movie.title + ' scene'"
        loading="lazy"
        width="400" height="225"
      />
      <div class="wide-card__overlay">
        <div class="wide-card__title">{{ movie.title }}</div>
        <div class="wide-card__sub">
          <span class="wide-card__tag">{{ movie.tagLabel }}</span>
          <span>{{ movie.year }}</span>
          <span>★ {{ movie.rating }}</span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .wide-card {
      position: relative; border-radius: var(--radius-md); overflow: hidden;
      background: var(--surface-card); box-shadow: var(--shadow-card);
      cursor: pointer; aspect-ratio: 16/9;
      transition: transform var(--transition), box-shadow var(--transition);
    }
    .wide-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.7), 0 0 0 2px var(--crimson-light);
    }
    .wide-card__bg {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform 0.4s ease;
    }
    .wide-card:hover .wide-card__bg { transform: scale(1.05); }
    .wide-card__overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
      padding: 16px; display: flex; flex-direction: column; justify-content: flex-end;
    }
    .wide-card__title {
      font-family: var(--font-display); font-size: 1.1rem;
      letter-spacing: 1px; color: #fff; margin-bottom: 6px;
    }
    .wide-card__sub {
      font-size: 0.75rem; color: var(--text-muted);
      display: flex; gap: 10px; align-items: center;
    }
    .wide-card__tag {
      background: var(--crimson); color: #fff;
      font-size: 0.65rem; padding: 2px 8px; border-radius: 4px;
      text-transform: uppercase; font-weight: 600;
    }
  `],
})
export class FeaturedCardComponent {
  @Input({ required: true }) movie!: FeaturedMovie;
  @Output() cardClick = new EventEmitter<FeaturedMovie>();

  get backdropUrl(): string {
    return `https://picsum.photos/seed/${this.movie.backdropSeed}/400/225`;
  }
}
