import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RegionService } from '@comparenetworks/imsmart-web';

import { DatabaseService } from 'src/services/database.service';

import { SharedConstants } from 'src/shared/constants/shared-constants';

@Component({
  selector: 'edit-to-do',
  templateUrl: 'edit-to-do.page.html',
  styleUrls: ['edit-to-do.page.scss'],
})
export class EditToDoPage implements OnInit {
  editToDoForm: FormGroup;
  id: number;

  constructor(
    public regionService: RegionService,
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editToDoForm = this.formBuilder.group({
      title: ['', Validators.required],
      createdDate: [new Date().toISOString()],
    });

    this.route.queryParams.subscribe((data) => {
      this.id = +data.id;
    });
  }

  ngOnInit() {
    if (this.id) {
      this.databaseService.searchRecord(SharedConstants.tableStructure.ToDoRecord.tableName, `id == ${this.id}`).subscribe((record) => {
        if (record && record[0]) {
          console.log(JSON.parse(record[0].data));
          const selectedRecord = JSON.parse(record[0].data);
          this.editToDoForm.controls.title.setValue(selectedRecord.title);
          this.editToDoForm.controls.createdDate.setValue(selectedRecord.createdDate);
        }
      });
    }
  }

  editToDo() {
    const editedRecord = {
      title: this.editToDoForm.controls.title.value,
      createdDate: this.editToDoForm.controls.createdDate.value,
    };

    this.databaseService
      .runSQL(
        `UPDATE ${SharedConstants.tableStructure.ToDoRecord.tableName} SET data = '${JSON.stringify(editedRecord)}' WHERE id == ${this.id}`
      )
      .then(() => {
        this.navigateHome();
      });
  }

  navigateHome() {
    this.editToDoForm.reset({
      title: '',
      createdDate: new Date().toISOString(),
    });
    this.router.navigate(['']);
  }
}
