import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'ma-hero-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" aria-label="Featured movie: {{ movie.title }}">

      <!-- Background gradient -->
      <div class="hero__bg"></div>

      <!-- Cinematic SVG art -->
      <div class="hero__scene" aria-hidden="true">
        <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"
             xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="glow1" cx="60%" cy="40%" r="50%">
              <stop offset="0%" stop-color="#1a6fa8" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
            </radialGradient>
            <radialGradient id="glow2" cx="80%" cy="60%" r="40%">
              <stop offset="0%" stop-color="#8b1a1a" stop-opacity="0.4"/>
              <stop offset="100%" stop-color="transparent"/>
            </radialGradient>
          </defs>
          <rect width="800" height="400" fill="url(#glow1)"/>
          <rect width="800" height="400" fill="url(#glow2)"/>
          <rect x="550" y="60"  width="60" height="340" fill="#0a0a1a" opacity="0.8"/>
          <rect x="620" y="120" width="45" height="280" fill="#0a0a1a" opacity="0.7"/>
          <rect x="670" y="80"  width="55" height="320" fill="#0a0a1a" opacity="0.8"/>
          <rect x="730" y="100" width="70" height="300" fill="#0a0a1a" opacity="0.7"/>
          <g fill="#FFD700" opacity="0.4">
            <rect x="558" y="80"  width="8" height="6"/><rect x="574" y="80"  width="8" height="6"/>
            <rect x="558" y="100" width="8" height="6"/><rect x="574" y="100" width="8" height="6"/>
            <rect x="628" y="140" width="7" height="5"/><rect x="642" y="140" width="7" height="5"/>
          </g>
          <g transform="translate(490,80)">
            <ellipse cx="40" cy="100" rx="22" ry="35" fill="#CC1111" opacity="0.95"/>
            <ellipse cx="40" cy="60"  rx="18" ry="20" fill="#CC1111" opacity="0.95"/>
            <ellipse cx="33" cy="57"  rx="8"  ry="6"  fill="white"   opacity="0.9"/>
            <ellipse cx="47" cy="57"  rx="8"  ry="6"  fill="white"   opacity="0.9"/>
            <ellipse cx="33" cy="57"  rx="5"  ry="4"  fill="#000"    opacity="0.7"/>
            <ellipse cx="47" cy="57"  rx="5"  ry="4"  fill="#000"    opacity="0.7"/>
            <path d="M18,85 Q-10,60 -30,40"  stroke="#CC1111" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.9"/>
            <path d="M62,85 Q90,65 110,50"   stroke="#1a3a8f" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.9"/>
            <path d="M28,130 Q15,160 10,190" stroke="#CC1111" stroke-width="8"  fill="none" stroke-linecap="round" opacity="0.9"/>
            <path d="M52,130 Q65,160 70,190" stroke="#1a3a8f" stroke-width="8"  fill="none" stroke-linecap="round" opacity="0.9"/>
            <line x1="18" y1="85" x2="-100" y2="-20" stroke="rgba(200,200,200,0.3)" stroke-width="1.5"/>
            <line x1="62" y1="85" x2="200"  y2="-30" stroke="rgba(200,200,200,0.3)" stroke-width="1.5"/>
          </g>
          <circle cx="420" cy="145" r="30" fill="none" stroke="#4a9eda" stroke-width="2" opacity="0.5"/>
          <circle cx="420" cy="145" r="20" fill="none" stroke="#4a9eda" stroke-width="3" opacity="0.7"/>
          <circle cx="420" cy="145" r="8"  fill="#4a9eda" opacity="0.6"/>
        </svg>
      </div>

      <div class="hero__gradient"></div>

      <!-- Content -->
      <div class="hero__content">
        <div class="hero__badge">
          <span class="hero__badge-dot" aria-hidden="true"></span>
          Now Playing
        </div>
        <h1 class="hero__title">{{ movie.title }}</h1>
        <div class="hero__meta">
          <span class="hero__rating" aria-label="Rating {{ movie.rating }}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFB347" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {{ movie.rating }}
          </span>
          <span class="hero__dot" aria-hidden="true"></span>
          <span>{{ movie.year }}</span>
          <span class="hero__dot" aria-hidden="true"></span>
          <span>{{ movie.duration }}</span>
        </div>
        <div class="hero__actions">
          <button class="btn btn--primary" (click)="watch.emit(movie)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Watch now
          </button>
          <button class="btn btn--outline" (click)="details.emit(movie)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Details
          </button>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="hero__progress" aria-hidden="true">
        <div class="hero__progress-bar"></div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative; width: 100%; aspect-ratio: 16/6.5;
      border-radius: var(--radius-md); overflow: hidden; margin-bottom: 32px;
      box-shadow: var(--shadow-card), 0 0 0 1px var(--border);
    }
    .hero__bg {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%);
    }
    .hero__scene { position: absolute; inset: 0; display: flex; align-items: center; justify-content: flex-end; }
    .hero__scene svg { height: 100%; opacity: 0.85; }
    .hero__gradient {
      position: absolute; inset: 0;
      background: linear-gradient(to right, rgba(26,5,5,0.88) 0%, rgba(26,5,5,0.3) 50%, transparent 100%);
    }
    .hero__content {
      position: absolute; bottom: 36px; left: 36px; right: 50%;
    }
    .hero__badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,68,68,0.2); border: 1px solid rgba(255,68,68,0.4);
      color: var(--accent); font-size: 0.75rem; font-weight: 600;
      letter-spacing: 1.5px; text-transform: uppercase;
      padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
    }
    .hero__badge-dot {
      width: 6px; height: 6px; background: var(--accent); border-radius: 50%;
      animation: pulse-dot 1.5s ease-in-out infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    .hero__title {
      font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 3rem);
      letter-spacing: 2px; line-height: 1.1; color: #fff;
      text-shadow: 0 4px 20px rgba(0,0,0,0.7); margin-bottom: 12px;
    }
    .hero__meta {
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 20px; font-size: 0.875rem; color: var(--text-muted);
    }
    .hero__rating { display: flex; align-items: center; gap: 4px; color: var(--accent-gold); font-weight: 600; }
    .hero__dot { width: 3px; height: 3px; background: var(--text-dim); border-radius: 50%; }
    .hero__actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .hero__progress { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.1); }
    .hero__progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--crimson-light), var(--accent));
      width: 0%; animation: hero-progress 6s linear infinite;
    }
    @keyframes hero-progress { from { width: 0%; } to { width: 100%; } }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 600;
      padding: 10px 22px; border-radius: var(--radius-lg);
      border: none; cursor: pointer; transition: all var(--transition); white-space: nowrap;
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
    @media (max-width: 600px) {
      .hero__content { left: 20px; right: 20px; bottom: 20px; }
    }
  `],
})
export class HeroBannerComponent {
  @Input({ required: true }) movie!: Movie;
  @Output() watch   = new EventEmitter<Movie>();
  @Output() details = new EventEmitter<Movie>();
}
