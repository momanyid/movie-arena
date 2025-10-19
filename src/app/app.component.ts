import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'ma-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ma-navbar />
    <div class="app-layout">
      <ma-sidebar />
      <main class="app-main" id="main-content" role="main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .app-layout {
      display: flex;
      margin-top: var(--nav-h);
      min-height: calc(100vh - var(--nav-h));
    }
    .app-main {
      flex: 1;
      overflow-y: auto;
      padding: 28px 32px;
      background: var(--surface-alt);
    }
    @media (max-width: 700px) {
      .app-main { padding: 20px 16px; }
    }
  `],
})
export class AppComponent {}
