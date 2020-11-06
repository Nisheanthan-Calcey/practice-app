import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { LanguageService, LocalStorageService, MacsJsService, RegionService, SQLService } from '@comparenetworks/imsmart-web';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ToDoHomePage } from './to-do/screens/to-do-home.page';
import { AppService } from 'src/services/app.service';
import { DatabaseService } from 'src/services/database.service';
import { UtilityService } from 'src/services/utility.service';
import { HttpClientModule } from '@angular/common/http';
import { AppInitService } from 'src/services/app-init.service';
import { UserConfigurationService } from 'src/services/user-configuration.service';
import { AddToDoComponent } from './to-do/modals/add-to-do/add-to-do.modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function initApplication(appInitService: AppInitService): () => Promise<void> {
  return () => appInitService.init();
}

const COMPONENTS = [ToDoHomePage, AddToDoComponent];

const IMSMART_SERVICES = [LocalStorageService, MacsJsService, SQLService, LanguageService, RegionService];

const SERVICES = [AppService, AppInitService, DatabaseService, UtilityService, UserConfigurationService];

@NgModule({
  declarations: [AppComponent, ...COMPONENTS],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [
    ...IMSMART_SERVICES,
    ...SERVICES,
    {
      provide: APP_INITIALIZER,
      useFactory: initApplication,
      deps: [AppInitService],
      multi: true,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
