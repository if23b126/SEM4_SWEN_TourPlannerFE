import {Component, inject} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Tour} from '../tour';
import {MainComponent} from '../main/main.component';

@Component({
  selector: 'add-tour-dialog',
  templateUrl: '../dialogues/add-tour-dialog.html',
  imports: [
    MatDialogContent,
    MatFormFieldModule,
    MatDialogActions,
    FormsModule,
    MatInput,
    MatButton,
    MatDialogTitle,
    MatDialogClose
  ]
})


export class AddTourDialog {
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "";
  distance: number = 0;
  timeStart: string = "";
  timeEnd: string = "";
  information: string = "";

  readonly dialogRef = inject(MatDialogRef<AddTourDialog>);

  constructor() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTour(): Tour {

    return {
      name: this.name,
      description: this.description,
      start: this.startpoint,
      end: this.endpoint,
      transportMode: this.transportMode,
      distance: this.distance,
      timeStart: this.timeStart,
      timeEnd: this.timeEnd,
      information: this.information,
      timeCreated: ""
    };
  }


}
