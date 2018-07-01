import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { TabComponent } from './tab/tab.component';
import { AllmusicComponent } from './allmusic/allmusic.component';
import { AlbumsComponent } from './albums/albums.component';
import { ArtistsComponent } from './artists/artists.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/player',pathMatch: 'full' },
  { path: 'player', component: PlayerComponent, data: { state: 'player'} },
  { path: 'allmusic', component: AllmusicComponent, data: { state: 'allmusic'} }, 
  { path: 'albums', component: AlbumsComponent, data: { state: 'albums'}  },
  { path: 'artists', component: ArtistsComponent, data: { state: 'artists'}  },
  { path: 'playlists', component: PlaylistsComponent, data: { state: 'playlists'} },
  { path: 'radio', component: PlaylistsComponent, data: { state: 'radio'} },
  { path: 'settings', component: SettingsComponent, data: { state: 'settings'} }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

