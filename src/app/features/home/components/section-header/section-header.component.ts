import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ma-section-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="section-header">
      <h2>{{ title }} <span>{{ highlight }}</span></h2>
      @if (seeAllRoute) {
        <a [routerLink]="seeAllRoute">
          See all
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>
      }
    </div>
  `,
  styles: [`
    .section-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 18px;
    }
    h2 {
      font-family: var(--font-display); font-size: 1.6rem;
      letter-spacing: 1.5px; color: var(--text-primary);
    }
    h2 span { color: var(--accent); }
    a {
      font-size: 0.8125rem; color: var(--text-muted);
      display: flex; align-items: center; gap: 4px;
      transition: color var(--transition);
    }
    a:hover { color: var(--accent); }
  `],
})
export class SectionHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() highlight = '';
  @Input() seeAllRoute: string | null = null;
}
