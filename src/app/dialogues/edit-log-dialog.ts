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
  templateUrl: '../dialogues/edit-log-dialog.html',
  styleUrl: './log.component.css'
})
export class EditLogDialog {
  id: number = 0;
  comment: string = "";
  difficulty: number = 0;
  distance: number = 0;
  rating: number = 0;
  time:  Date = new Date;
  timeEnd: Date = new Date;
  timeStart: Date = new Date;
  tourid: number = 0;

  disabled: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Log,
    private dialogRef: MatDialogRef<EditLogDialog>) {
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editLog(): Log {
    return {
      id: this.id,
      rating: this.rating,
      difficulty: this.difficulty,
      distance: this.distance,
      time: this.parseDate(this.time),
      timeStart: this.parseDate(this.timeStart),
      timeEnd: this.parseDate(this.timeEnd),
      comment: this.comment,
      tourid: this.tourid,
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

