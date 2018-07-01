import {RouteReuseStrategy} from '@angular/router';

import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MatIconModule} from '@angular/material/icon'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
// import {MatTableModule} from '@angular/material/table/typings';
// import {MatButtonModule} from '@angular/material/button/typings';
// import {MatListModule} from '@angular/material/list/typings';
import {MatGridListModule} from '@angular/material/grid-list/typings';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { PlayerComponent } from './player/player.component';
import { TabComponent } from './tab/tab.component';
import { AllmusicComponent } from './allmusic/allmusic.component';
import { WaveformComponent } from './waveform/waveform.component';
import { FilehandlingService } from './core/services/filehandling.service';
import { AutoplayService } from './core/services/autoplay.service';
import { PlaylistService } from './core/services/playlist.service';
import { PlayerService } from './core/services/player.service';
import { DatastoreService } from './core/services/datastore.service';
import { PouchDbService } from './core/services/pouch-db.service';
import { TableviewComponent } from './tableview/tableview.component';
import { ImageComponent } from './image/image.component';
import { AlbumsComponent } from './albums/albums.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomReuseStrategy } from 'src/app/reuse-strategy';
import { ArtistsComponent } from './artists/artists.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { MatRippleModule, MatButtonModule, MatListModule, MatTableModule, MatMenuModule, MatSnackBarModule, MatButtonToggleModule, MatSliderModule, MatSlideToggleModule } from '@angular/material';
import { MatchHeightDirective } from './albums/albums.directive';
import { UiService } from './core/services/ui.service';
import { EqualizerComponent } from './equalizer/equalizer.component';
import { FooterComponent } from './footer/footer.component';
import { SettingsComponent } from './settings/settings.component';
import { HoverClassDirective } from './core/directives/hover.directive';
import { EqCanvasComponent } from './eq-canvas/eq-canvas.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    TabComponent,
    AllmusicComponent,
    WaveformComponent,
    TableviewComponent,
    ImageComponent,
    AlbumsComponent,
    ArtistsComponent,
    PlaylistsComponent,
    MatchHeightDirective,
    HoverClassDirective,
    EqualizerComponent,
    FooterComponent,
    SettingsComponent,
    EqCanvasComponent,
    AlbumDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatTabsModule,
    MatButtonModule,
    MatTableModule,
    MatListModule,
    MatInputModule,
    MatRippleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatSlideToggleModule
  ],
  providers: [
    PouchDbService, 
    DatastoreService, 
    PlayerService, 
    PlaylistService, 
    AutoplayService,
    FilehandlingService,
    UiService,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
