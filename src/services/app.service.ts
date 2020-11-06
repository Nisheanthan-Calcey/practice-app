import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';

@Injectable()
export class AppService {
  constructor(private platform: Platform) {}

  public get isMobile(): boolean {
    return this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('tablet');
  }
}
