import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Observable } from 'rxjs';

import { RegionService } from '@comparenetworks/imsmart-web';

import { DatabaseService } from 'src/services/database.service';

import { AddToDoComponent } from '../modals/add-to-do/add-to-do.modal';

import { SharedConstants } from 'src/shared/constants/shared-constants';

@Component({
  selector: 'to-do-home',
  templateUrl: 'to-do-home.page.html',
  styleUrls: ['to-do-home.page.scss'],
})
export class ToDoHomePage implements OnInit {
  todos: any[];
  retrieveData$: Observable<any>;

  constructor(private databaseService: DatabaseService, private modalController: ModalController, public regionService: RegionService) {
    this.todos = [];

    setTimeout(() => {
      this.databaseService.retreiveRecords(SharedConstants.tableStructure.ToDoRecord.tableName).subscribe((records) => {
        console.log(records, 'records');
        records.forEach((record: any, index) => {
          console.log({ id: record.id, data: JSON.parse(record.data) });
          this.todos[index] = { id: record.id, data: JSON.parse(record.data) };
        });
      });
    }, 200);
  }

  ngOnInit() {
    // this.retrieveData$ = this.databaseService.retreiveRecords(SharedConstants.tableStructure.ToDoRecord.tableName);
  }

  async presentAddToDoModal() {
    const modal = await this.modalController.create({
      component: AddToDoComponent,
      cssClass: '',
      backdropDismiss: false,
    });
    modal.present();
  }
}
