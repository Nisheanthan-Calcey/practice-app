import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { LanguageService, LocalStorageService, MacsJsService, RegionService, SQLService } from '@comparenetworks/imsmart-web';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ToDoHomePage } from './to-do/screens/to-do-home.page';
import { AddToDoPage } from './to-do/pages/add-to-do/add-to-do.page';
import { EditToDoPage } from './to-do/pages/edit-to-do/edit-to-do.page';
import { ToDoOptionComponent } from './to-do/components/to-do-options/to-do-option.component';

import { AppService } from 'src/services/app.service';
import { DatabaseService } from 'src/services/database.service';
import { UtilityService } from 'src/services/utility.service';
import { AppInitService } from 'src/services/app-init.service';
import { UserConfigurationService } from 'src/services/user-configuration.service';

export function initApplication(appInitService: AppInitService): () => Promise<void> {
  return () => appInitService.init();
}

const COMPONENTS = [ToDoHomePage, AddToDoPage, EditToDoPage, ToDoOptionComponent];

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
