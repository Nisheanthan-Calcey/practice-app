import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { SharedConstants } from 'src/shared/constants/shared-constants';
import { SharedString } from 'src/shared/constants/shared-string';

@Injectable()
export class UtilityService {
  convertToStringObject(object, tableName: string) {
    const keys = _.keys(object);
    const obj = {};
    _.values(object).map((value, index) => {
      if (
        SharedConstants.tableStructure[tableName].fields[keys[index]] &&
        SharedConstants.tableStructure[tableName].fields[keys[index]].type === SharedString.integer
      ) {
        obj[keys[index]] = typeof value === SharedString.string ? Number(value) : value;
      } else if (typeof value === SharedString.object) {
        // tslint:disable-next-line:quotemark
        obj[keys[index]] = "'" + JSON.stringify(value) + "'";
      } else if (
        SharedConstants.tableStructure[tableName].fields[keys[index]] &&
        SharedConstants.tableStructure[tableName].fields[keys[index]].type === SharedString.text
      ) {
        // tslint:disable-next-line:quotemark
        obj[keys[index]] = "'" + value + "'";
      } else {
        obj[keys[index]] = value;
      }
    });
    return obj;
  }
}
