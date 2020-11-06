import { Injectable } from '@angular/core';

@Injectable()
export class SharedConstants {
  public static defaultUserLocale = 'en';

  public static storageKey = {
    userLocaleStorageKey: 'userLocale',
  };

  public static LOCAL_STORAGE_APP_KEY = 'practice_app';

  public static INPUT_FIELD_TYPES = {
    text: 'TEXT',
    tel: 'tel',
    email: 'email',
  };

  public static CONFIGURATION_KEY = {
    configAssetId: 'configAssetId',
  };

  public static tableStructure = {
    Record: {
      tableName: 'Record',
      fields: {
        title: {
          name: 'title',
          type: 'TEXT',
        },
        createdDate: {
          name: 'createdDate',
          type: 'TEXT',
        },
        id: {
          name: 'id',
          type: 'INTEGER',
        },
      },
      primaryKey: 'id',
    },
    ToDoRecord: {
      tableName: 'ToDoRecord',
      fields: {
        data: {
          name: 'data',
          type: 'TEXT',
        },
        id: {
          name: 'id',
          type: 'INTEGER',
        },
      },
      primaryKey: 'id',
    },
  };
}
