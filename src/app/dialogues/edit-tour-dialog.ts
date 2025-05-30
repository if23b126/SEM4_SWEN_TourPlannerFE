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
import {Profile} from '../profile';
import {
  NgxMatDatepickerActions,
  NgxMatDatepickerApply,
  NgxMatDatepickerCancel,
  NgxMatDatepickerInput, NgxMatDatepickerToggle, NgxMatDatetimepicker
} from '@ngxmc/datetime-picker';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';

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
    MatDialogClose,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerCancel,
    NgxMatDatepickerInput,
    NgxMatDatepickerToggle,
    NgxMatDatetimepicker,
    MatOption,
    MatSelect
  ]
})

export class EditTourDialog {
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "";
  distance: number = 0;
  timeStart: Date = new Date;
  timeEnd: Date = new Date;
  information: string = "";
  timeCreated: string = "";

  orsProfiles: Profile[] = [
    { display: 'Driving (Car)', value: 'driving-car' },
    { display: 'Driving (Heavy Goods Vehicle)', value: 'driving-hgv' },
    { display: 'Cycling (Regular)', value: 'cycling-regular' },
    { display: 'Cycling (Road Bike)', value: 'cycling-road' },
    { display: 'Cycling (Mountain Bike)', value: 'cycling-mountain' },
    { display: 'Cycling (Electric Bike)', value: 'cycling-electric' },
    { display: 'Walking (Foot)', value: 'foot-walking' },
    { display: 'Hiking (Foot)', value: 'foot-hiking' },
    { display: 'Wheelchair Accessible', value: 'wheelchair' }
  ];

  disabled: boolean = false;

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
      this.timeStart = new Date(this.data.timeStart.substring(0, 19));
      this.timeEnd = new Date(this.data.timeEnd.substring(0, 19));
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
      timeStart: this.parseDate(this.timeStart),
      timeEnd: this.parseDate(this.timeEnd),
      information: this.information,
      timeCreated: this.timeCreated
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
