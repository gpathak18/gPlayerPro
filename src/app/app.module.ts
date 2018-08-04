import { RouteReuseStrategy } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list/typings';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
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
import { CustomReuseStrategy } from './reuse-strategy';
import { ArtistsComponent } from './artists/artists.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { MatRippleModule, MatButtonModule, MatListModule, MatTableModule, MatMenuModule, MatSnackBarModule, MatButtonToggleModule, MatSliderModule, MatSlideToggleModule, MatProgressBarModule, MatCardModule, MatChipsModule, MatAutocompleteModule, MAT_CHIPS_DEFAULT_OPTIONS, MatBadgeModule } from '@angular/material';
import { MatchHeightDirective } from './albums/albums.directive';
import { UiService } from './core/services/ui.service';
import { EqualizerComponent } from './equalizer/equalizer.component';
import { FooterComponent } from './footer/footer.component';
import { SettingsComponent } from './settings/settings.component';
import { HoverClassDirective } from './core/directives/hover.directive';
import { EqCanvasComponent } from './eq-canvas/eq-canvas.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { ErrorHandlerService } from './core/services/error-handler.service';
import { ArtistService } from './core/services/artist.service';
import { FileHandlerModule } from './file-handler/file-handler.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http'; 
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
    HttpClientModule,
    OAuthModule.forRoot(),
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
    MatSlideToggleModule,
    MatProgressBarModule,
    FileHandlerModule,
    NgxDatatableModule,
    MatCardModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule
  ],
  providers: [
    ArtistService,
    PouchDbService,
    DatastoreService,
    PlayerService,
    PlaylistService,
    AutoplayService,
    FilehandlingService,
    UiService,
    { 
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy 
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [13, 188]
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
