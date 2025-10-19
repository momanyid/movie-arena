import 'zone.js/node';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (options: BootstrapContext) => bootstrapApplication(AppComponent, config, options);

export default bootstrap;