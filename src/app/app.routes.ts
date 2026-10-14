import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { PlayerService } from './services/player.service';

/** Unhatched eggs go to the splash screen; otherwise straight into the world. */
const start = () => (inject(PlayerService).player().eggs.length > 0 ? '/splash' : '/world');

export const routes: Routes = [
  { path: 'splash', loadComponent: () => import('./pages/splash/splash').then((m) => m.Splash) },
  { path: 'world', loadComponent: () => import('./pages/world/world').then((m) => m.World) },
  {
    path: 'mapeditor',
    loadComponent: () => import('./pages/map-editor/map-editor').then((m) => m.MapEditor),
  },
  { path: '**', redirectTo: start },
];
