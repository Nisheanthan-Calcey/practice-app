import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { PopoverController } from '@ionic/angular';

import { Observable, Subscription } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

import { RegionService } from '@comparenetworks/imsmart-web';

import { DatabaseService } from 'src/services/database.service';

import { ToDoOptionComponent } from '../components/to-do-options/to-do-option.component';

import { SharedConstants } from 'src/shared/constants/shared-constants';

@Component({
  selector: 'to-do-home',
  templateUrl: 'to-do-home.page.html',
  styleUrls: ['to-do-home.page.scss'],
})
export class ToDoHomePage implements OnDestroy {
  todos: any[];
  subscription: Subscription;
  constructor(
    private databaseService: DatabaseService,
    private popoverController: PopoverController,
    public regionService: RegionService,
    private router: Router
  ) {
    this.todos = [];
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.subscriber(this.databaseService.retreiveRecords(SharedConstants.tableStructure.ToDoRecord.tableName));
      // .subscribe((records) => {
      //   console.log(records, 'records');
      //   records.forEach((record: any, index) => {
      //     console.log({ id: record.id, data: JSON.parse(record.data) });
      //     this.todos[index] = { id: record.id, data: JSON.parse(record.data) };
      //   });
      // });
    }, 200);
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
    this.todos = [];
    // const obs$ = ;
    this.subscriber(
      ev.detail.value
        ? this.databaseService.searchRecord(SharedConstants.tableStructure.ToDoRecord.tableName, `data LIKE '%${ev.detail.value}%'`)
        : this.databaseService.retreiveRecords(SharedConstants.tableStructure.ToDoRecord.tableName)
    );
    // obs$.subscribe((records) => {
    //   records.forEach((record: any, index) => {
    //     this.todos[index] = { id: record.id, data: JSON.parse(record.data) };
    //   });
    // });
  }

  navigateAddToDo() {
    this.router.navigate(['/add']);
  }

  deleteToDo(id: number) {
    this.subscriber(
      this.databaseService.deleteRecord(SharedConstants.tableStructure.ToDoRecord.tableName, `id == ${id}`).pipe(
        concatMap(() => this.databaseService.retreiveRecords(SharedConstants.tableStructure.ToDoRecord.tableName)),
        tap(() => (this.todos = []))
      )
    );
    // .subscribe((records) => {
    //   records.forEach((record: any, index) => {
    //     this.todos[index] = { id: record.id, data: JSON.parse(record.data) };
    //   });
    // });
  }

  subscriber(observable: Observable<any>) {
    // this page handles same way of subscription which assign value for this.todos, so using this method to prevent the code redundancy
    this.subscription = observable.subscribe((records) => {
      records.forEach((record: any, index) => {
        this.todos[index] = { id: record.id, data: JSON.parse(record.data) };
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
