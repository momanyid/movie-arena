import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ma-tv-shows-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="coming-soon">
      <div class="coming-soon__icon">📺</div>
      <h1>TV Shows</h1>
      <p>Coming soon – binge-worthy series are on their way.</p>
    </div>
  `,
  styles: [`
    .coming-soon {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 60vh;
      gap: 16px; text-align: center;
    }
    .coming-soon__icon { font-size: 4rem; }
    h1 {
      font-family: var(--font-display); font-size: 2.5rem;
      letter-spacing: 2px; color: var(--text-primary);
    }
    p { color: var(--text-muted); font-size: 1rem; }
  `],
})
export class TvShowsPageComponent {}
