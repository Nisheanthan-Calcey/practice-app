import { Component } from '@angular/core';

import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'to-do-option',
  templateUrl: 'to-do-option.component.html',
  styleUrls: ['to-do-option.component.scss'],
})
export class ToDoOptionComponent {
  options = [
    {
      name: 'Edit',
      icon: 'create',
      click: () => this.popover.dismiss('edit'),
    },
    {
      name: 'Delete',
      icon: 'trash',
      click: () => this.popover.dismiss('delete'),
    },
  ];

  constructor(private popover: PopoverController) {}
}
