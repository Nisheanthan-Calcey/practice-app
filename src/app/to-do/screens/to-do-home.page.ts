import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PopoverController } from '@ionic/angular';

import { Observable } from 'rxjs';

import { RegionService } from '@comparenetworks/imsmart-web';

import { DatabaseService } from 'src/services/database.service';

import { ToDoOptionComponent } from '../components/to-do-options/to-do-option.component';

import { SharedConstants } from 'src/shared/constants/shared-constants';

@Component({
  selector: 'to-do-home',
  templateUrl: 'to-do-home.page.html',
  styleUrls: ['to-do-home.page.scss'],
})
export class ToDoHomePage implements OnInit {
  todos: any[];
  retrieveData$: Observable<any>;

  constructor(
    private databaseService: DatabaseService,
    private popoverController: PopoverController,
    public regionService: RegionService,
    private router: Router
  ) {
    this.todos = [];
  }

  ngOnInit() {
    // this.retrieveData$ = this.databaseService.retreiveRecords(SharedConstants.tableStructure.ToDoRecord.tableName);
    setTimeout(() => {
      this.retrieveAllToDo();
    }, 200);
  }

  retrieveAllToDo() {
    this.databaseService.retreiveRecords(SharedConstants.tableStructure.ToDoRecord.tableName).subscribe((records) => {
      console.log(records, 'records');
      records.forEach((record: any, index) => {
        console.log({ id: record.id, data: JSON.parse(record.data) });
        this.todos[index] = { id: record.id, data: JSON.parse(record.data) };
      });
    });
  }

  async presentPopover(toDoId: any) {
    const popover = await this.popoverController.create({
      component: ToDoOptionComponent,
      cssClass: 'to-do-option-class',
      translucent: true,
    });
    popover.present();

    return popover.onDidDismiss().then((dismissAction: any) => {
      console.log(toDoId);
      switch (dismissAction.data) {
        case 'edit':
          this.router.navigate(['/edit'], { queryParams: { id: toDoId } });
          break;
        case 'delete':
          this.deleteToDo(+toDoId);
          break;
      }
    });
  }

  searchToDo(ev: any) {
    if (ev.detail.value) {
      this.todos = [];
      this.databaseService
        .searchRecord(SharedConstants.tableStructure.ToDoRecord.tableName, `data LIKE '%${ev.detail.value}%'`)
        .subscribe((records) => {
          console.log(records, 'records');
          records.forEach((record: any, index) => {
            console.log({ id: record.id, data: JSON.parse(record.data) });
            this.todos[index] = { id: record.id, data: JSON.parse(record.data) };
          });
        });
    } else {
      this.retrieveAllToDo();
    }
  }

  navigateAddToDo() {
    this.router.navigate(['/add']);
  }

  deleteToDo(id: number) {
    this.databaseService.deleteRecord(SharedConstants.tableStructure.ToDoRecord.tableName, `id == ${id}`).subscribe(
      () => {
        console.log('Successfully deleted id: ', id);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
