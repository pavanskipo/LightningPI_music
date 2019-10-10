import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { ViewCardsComponent } from './view-cards/view-cards.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { CommonSwitchService } from './services/common-switch.service';
import { CommonHttpService } from './services/common-http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    ViewCardsComponent,
    MusicPlayerComponent,
    VideoPlayerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  providers: [CommonSwitchService, CommonHttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }