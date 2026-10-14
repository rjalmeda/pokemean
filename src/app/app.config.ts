import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MapService } from './services/map.service';
import { StorageService } from './services/storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // Saved data and the built-in world must be in memory before any page asks for them.
    provideAppInitializer(async () => {
      const storage = inject(StorageService);
      const maps = inject(MapService);
      await storage.load();
      await maps.loadWorld();
    }),
  ],
};
