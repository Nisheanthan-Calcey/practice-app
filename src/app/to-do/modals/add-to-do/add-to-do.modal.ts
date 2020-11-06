import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegionService } from '@comparenetworks/imsmart-web';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/services/database.service';
import { SharedConstants } from 'src/shared/constants/shared-constants';

@Component({
  selector: 'add-to-do',
  templateUrl: 'add-to-do.modal.html',
  styleUrls: ['add-to-do.modal.scss'],
})
export class AddToDoComponent {
  addToDoForm: FormGroup;

  constructor(
    private modalController: ModalController,
    public regionService: RegionService,
    private formBuilder: FormBuilder,
    private databaseService: DatabaseService
  ) {
    this.addToDoForm = this.formBuilder.group({
      title: ['', Validators.required],
      createdDate: [new Date().toISOString()],
    });
  }

  addJson() {
    const records = {
      title: this.addToDoForm.controls.title.value,
      createdDate: this.addToDoForm.controls.createdDate.value,
    };

    this.databaseService
      .insertRecords(SharedConstants.tableStructure.ToDoRecord.tableName, {
        data: records,
        id: new Date().getTime(),
      })
      .subscribe(
        () => {
          this.addToDoForm.reset({
            title: '',
            createdDate: new Date().toISOString(),
          });
          this.dismiss();
        },
        () => {
          console.log('Error');
        }
      );
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
