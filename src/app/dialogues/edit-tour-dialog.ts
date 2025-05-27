import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Tour} from '../tour';

@Component({
  selector: 'edit-tour-dialog',
  templateUrl: 'edit-tour-dialog.html',
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

export class EditTourDialog {
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "";
  distance: number = 0;
  timeStart: string = "";
  timeEnd: string = "";
  information: string = "";
  timeCreated: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Tour,
    private dialogRef: MatDialogRef<EditTourDialog>) {
    if (this.data) {
      this.name = this.data.name;
      this.description = this.data.description;
      this.startpoint = this.data.start;
      this.endpoint = this.data.end;
      this.transportMode = this.data.transportMode;
      this.distance = this.data.distance;
      this.timeStart = this.data.timeStart;
      this.timeEnd = this.data.timeEnd;
      this.information = this.data.information;
      this.timeCreated = this.data.timeCreated;
    } else {
      console.log("no data passed");
    }
  }

  onNoClick(): void {
    console.log(this.name);
    this.dialogRef.close();
  }

  editTour(): Tour {
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
      timeCreated: this.timeCreated
    };
  }
}
