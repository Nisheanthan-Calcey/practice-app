import { Injectable } from '@angular/core';

import { concat, Observable, of, empty } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

import { LocalStorageService, MacsJsService, LanguageService } from '@comparenetworks/imsmart-web';

import { SharedConstants } from 'src/shared/constants/shared-constants';

@Injectable()
export class UserConfigurationService {
  inited = false;
  constructor(
    private localStorageService: LocalStorageService,
    private languageService: LanguageService,
    private macsJsService: MacsJsService
  ) {}

  init(): Observable<void> {
    return concat(
      of(this.setUserRegionAndLocaleToLocalStorage()),
      this.languageService.init(['LanguageValue'], 'LanguageValue', this.getUserLocaleFromLocalStorage())
    ).pipe(
      tap(() => (this.inited = true)),
      concatMap(() => empty())
    );
  }

  setUserRegionAndLocaleToLocalStorage() {
    if (this.macsJsService.available) {
      macs.getUserRegionAndLanguage(
        (res) => {
          this.localStorageService.set(SharedConstants.storageKey.userLocaleStorageKey, res.Language);
        },
        (err) => {
          throw Error(err);
        }
      );
    }
  }

  getUserLocaleFromLocalStorage(): string {
    if (this.localStorageService.get(SharedConstants.storageKey.userLocaleStorageKey) != null) {
      return this.localStorageService.get(SharedConstants.storageKey.userLocaleStorageKey);
    } else {
      return SharedConstants.defaultUserLocale;
    }
  }
}
