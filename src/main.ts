import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import LogRocket from 'logrocket';
import { config } from './environments/configuration';

if (environment.production) {
  enableProdMode();
}

if (config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production') {
  LogRocket.init('50nqpl/azal');
} else if (config.environment?.toLowerCase() === 'demo' || config.environment?.toLowerCase() === 'test') {
  LogRocket.init('b6qklu/local');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
