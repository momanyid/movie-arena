import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ma-not-found',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="not-found">
      <div class="not-found__code">404</div>
      <h1 class="not-found__title">Scene Not Found</h1>
      <p class="not-found__desc">The page you're looking for has gone off-script.</p>
      <a class="btn btn--primary" routerLink="/home">Back to Home</a>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 60vh; text-align: center; gap: 16px;
    }
    .not-found__code {
      font-family: var(--font-display); font-size: 8rem;
      color: var(--crimson); line-height: 1; opacity: 0.4;
    }
    .not-found__title {
      font-family: var(--font-display); font-size: 2rem; letter-spacing: 2px;
    }
    .not-found__desc { color: var(--text-muted); margin-bottom: 8px; }
    .btn--primary {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
      padding: 10px 24px; border-radius: var(--radius-lg); border: none;
      background: var(--crimson); color: #fff; cursor: pointer;
      transition: background var(--transition);
    }
    .btn--primary:hover { background: var(--crimson-light); }
  `],
})
export class NotFoundComponent {}
