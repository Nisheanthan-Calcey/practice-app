import { Injectable } from '@angular/core';

import { Observable, from, of } from 'rxjs';
import { concatMap, mergeMap, last, tap } from 'rxjs/operators';

import * as _ from 'lodash';

import { SQLService, LocalStorageService, MacsJsService, SQLType } from '@comparenetworks/imsmart-web';

import { UtilityService } from './utility.service';

import { SharedConstants } from 'src/shared/constants/shared-constants';
import { SharedString } from 'src/shared/constants/shared-string';

@Injectable()
export class DatabaseService {
  dummyRecords = [
    {
      data: {
        title: 'abc',
        createdDate: '2020-11-06T09:46:44.006Z',
      },
      id: 1604656008109,
    },
    {
      data: {
        title: 'abc2',
        createdDate: '2020-11-06T10:46:44.006Z',
      },
      id: 1604656008110,
    },
    {
      data: {
        title: 'abc3',
        createdDate: '2020-11-06T11:46:44.006Z',
      },
      id: 1604656008111,
    },
  ];

  constructor(
    private sqlService: SQLService,
    private localStorageService: LocalStorageService,
    private macsJsService: MacsJsService,
    private utilityService: UtilityService
  ) {}

  init(): Observable<any> {
    let obs: Observable<any>;
    if (this.localStorageService.get(SharedString.initializedDatabaseStructure) === null || !this.macsJsService.available) {
      let tables = [];
      obs = from(_.keys(SharedConstants.tableStructure)).pipe(
        mergeMap((tableName: string) => {
          return this.sqlService.checkTableExist(tableName);
        }),
        tap((result) => {
          if (result.length > 0) {
            tables.push(result[0].name);
          }
        }),
        last(),
        concatMap(() => {
          const missingTables = _.difference(_.keys(SharedConstants.tableStructure), tables);
          return from(missingTables);
        }),
        concatMap((tableName: string) => {
          return this.sqlService.createTable(
            tableName,
            _.values(SharedConstants.tableStructure[tableName].fields),
            SharedConstants.tableStructure[tableName].primaryKey
          );
        }),
        last(),
        tap(() => {
          this.dummyRecords.forEach((dummy) => {
            this.insertRecords('ToDoRecord', dummy);
          });
          this.localStorageService.set(SharedString.initializedDatabaseStructure, true);
        })
      );
    } else {
      obs = of();
    }
    return obs;
  }

  insertRecords(tableName: string, records: object): Observable<any> {
    let formattedRecord = this.utilityService.convertToStringObject(records, tableName);
    return this.sqlService.insertRecord(tableName, [formattedRecord]);
  }

  insertJSONRecords(tableName: string, records: object): Observable<any> {
    /* Without Formatting */
    return this.sqlService.insertRecord(tableName, [records]);
  }

  retreiveRecords(tableName: string): Observable<any> {
    return this.sqlService.selectAllRecords(tableName);
  }

  searchRecord(tableName: string, whereClause: string): Observable<any> {
    return this.sqlService.selectRecordsWithWhereClause(tableName, whereClause);
  }

  selectRecord(tableName: string, columns: string) {
    return this.sqlService.selectRecords(tableName, columns);
  }

  updateRecord(tableName: string, fields: any, whereClause: string) {
    return this.sqlService.updateRecord(tableName, fields, whereClause);
  }

  deleteRecord(tableName: string, whereClause: string) {
    return this.sqlService.deleteRecord(tableName, whereClause);
  }

  runSQL(sql: string, cleanResults?: boolean, prePrepared?: boolean, type?: SQLType) {
    return this.sqlService.runSQL(sql, cleanResults, prePrepared, type);
  }
}
