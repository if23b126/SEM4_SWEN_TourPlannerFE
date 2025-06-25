import {NgForOf, NgIf} from '@angular/common';
import {MatCard, MatCardContent, MatCardSmImage} from '@angular/material/card';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {LayoutModule} from '@angular/cdk/layout';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatButton} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Component, Input, Output, EventEmitter, Inject} from '@angular/core';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {
  NgxMatDatepickerActions,
  NgxMatDatepickerApply,
  NgxMatDatepickerCancel,
  NgxMatDatepickerInput, NgxMatDatepickerToggle, NgxMatDatetimepicker
} from '@ngxmc/datetime-picker';
import {Tour} from '../tour';
import {Log} from '../log';


@Component({
  selector: 'app-log',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    LayoutModule,
    MatDialogModule,
    MatButton,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerCancel,
    NgxMatDatepickerInput,
    NgxMatDatepickerToggle,
    NgxMatDatetimepicker
  ],
  templateUrl: '../dialogues/add-log-dialog.html'

})
export class AddLogDialog {
  id: null = null;
  comment: null = null;
  difficulty: null = null
  distance: null = null
  rating: null = null
  time:  Date = new Date();
  timeEnd: Date = new Date();
  timeStart: Date = new Date();
  tourid: number = 0;

  disabled: boolean = false;

  constructor(
    /*@Inject(MAT_DIALOG_DATA) private data: Log,
    private dialogRef: MatDialogRef<AddLogDialog>) {
    if (this.data) {
      this.comment = this.data.comment;
      this.difficulty = this.data.difficulty;
      this.distance = this.data.distance;
      this.rating = this.data.rating;
      this.tourid = this.data.tourid;
      this.timeStart = new Date(this.data.timeStart.substring(0, 19));
      this.timeEnd = new Date(this.data.timeEnd.substring(0, 19));
      this.time = new Date(this.data.time.substring(0, 19));
    } else {
      console.log("no data passed");
    }
  }*/
    @Inject(MAT_DIALOG_DATA) public data: { tourId: number },  // ✅ RICHTIGER Typ
    private dialogRef: MatDialogRef<AddLogDialog>
  ) {
    if (this.data) {
      this.tourid = this.data.tourId;
    } else {
      console.log("no data passed");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addLog(): Log{
    return {
      id: this.id as unknown as number,
      rating: this.rating as unknown as number,
      difficulty: this.difficulty as unknown as number,
      distance: this.distance as unknown as number,
      time: this.parseDate(this.time as unknown as Date),
      timeStart: this.parseDate(this.timeStart as unknown as Date),
      timeEnd: this.parseDate(this.timeEnd as unknown as Date),
      comment: this.comment as unknown as string,
      tourid: this.tourid
    };
  }


  parseDate(time: Date): string {
    return time.getFullYear().toString().padStart(2, "0") + "-" +
      time.getMonth().toString().padStart(2, "0") + "-" +
      time.getDay().toString().padStart(2, "0") + " " +
      time.getHours().toString().padStart(2, "0") + ":" +
      time.getMinutes().toString().padStart(2, "0") + ":" +
      time.getSeconds().toString().padStart(2, "0")
  }
}

