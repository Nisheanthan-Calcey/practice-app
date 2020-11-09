import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RegionService } from '@comparenetworks/imsmart-web';

import { DatabaseService } from 'src/services/database.service';

import { SharedConstants } from 'src/shared/constants/shared-constants';

@Component({
  selector: 'add-to-do',
  templateUrl: 'add-to-do.page.html',
  styleUrls: ['add-to-do.page.scss'],
})
export class AddToDoPage {
  addToDoForm: FormGroup;

  constructor(
    public regionService: RegionService,
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService,
    private router: Router
  ) {
    this.addToDoForm = this.formBuilder.group({
      title: ['', Validators.required],
      createdDate: [new Date().toISOString()],
    });
  }

  addToDo() {
    const newRecord = {
      title: this.addToDoForm.controls.title.value,
      createdDate: this.addToDoForm.controls.createdDate.value,
    };
    console.log();

    this.databaseService
      .insertRecords(SharedConstants.tableStructure.ToDoRecord.tableName, {
        data: newRecord,
        id: new Date().getTime(),
      })
      .subscribe(
        () => {
          this.navigateHome();
        },
        () => {
          console.log('Error');
        }
      );
  }

  navigateHome() {
    this.addToDoForm.reset({
      title: '',
      createdDate: new Date().toISOString(),
    });
    this.router.navigate(['']);
  }
}
