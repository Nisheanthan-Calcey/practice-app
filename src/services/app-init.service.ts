import { Injectable } from '@angular/core';

import { concat, of, iif } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { MacsJsService, SQLService, SettingOption } from '@comparenetworks/imsmart-web';

import { UserConfigurationService } from './user-configuration.service';
import { DatabaseService } from './database.service';
import { AppService } from './app.service';

import { environment } from 'src/environments/environment';

import { SharedConstants } from 'src/shared/constants/shared-constants';

interface GetAssetPathResponse {
  assetPath: string;
}

@Injectable()
export class AppInitService {
  defaultRegion: SettingOption;

  constructor(
    private macsJsService: MacsJsService,
    private sqlService: SQLService,
    private userConfigurationService: UserConfigurationService,
    private databaseService: DatabaseService,
    private appService: AppService
  ) {
    this.defaultRegion = environment.region;
  }

  private loadDefaultConfigs() {
    const getParam = (name: string): string => {
      const decodedUrl = decodeURIComponent(location.search);
      const paramObjStr = decodedUrl.split('?')[1] || '';
      const paramObj: any = paramObjStr !== '' ? JSON.parse(paramObjStr) : null; // could create a typed shape for the params

      let assetParams: string[];
      const assets: any = {};
      if (paramObj) {
        assetParams = paramObj.assetParams.split('&');
        assetParams.forEach((param: string) => {
          const parts = param.split('=');
          assets[parts[0]] = parts[1];
        });
      }

      return assets[name] || null;
    };

    const loadConfig = (path?: string) => {
      if (path) {
        // read it from file
      }
    };

    if (this.macsJsService.available) {
      const configAssetId: string = getParam(SharedConstants.CONFIGURATION_KEY.configAssetId);
      if (configAssetId) {
        macs.getAssetPath(
          configAssetId,
          (response: GetAssetPathResponse) => loadConfig(response.assetPath),
          (e: any) => {
            throw Error(e);
          }
        );
      } else {
        loadConfig();
      }
    } else {
      loadConfig();
    }
  }

  init(): Promise<void> {
    return iif(() => this.appService.isMobile, this.macsJsService.init(4), of(null))
      .pipe(
        concatMap(() => of(this.loadDefaultConfigs())),
        concatMap(() =>
          concat(
            this.sqlService.initDB('html5-sample-app.db', false, this.defaultRegion.name),
            this.userConfigurationService.init(),
            this.databaseService.init()
          )
        )
      )
      .toPromise();
  }

  showSpinner() {
    if (document.getElementById('spinner')) {
      document.getElementById('spinner').style.opacity = '1';
    }
  }
}
