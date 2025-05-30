import {Component, inject} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Tour} from '../tour';
import {Profile} from '../profile';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {
  NgxMatDatepickerActions,
  NgxMatDatepickerApply,
  NgxMatDatepickerCancel,
  NgxMatDatepickerInput, NgxMatDatepickerToggle,
  NgxMatDatetimepicker,
} from '@ngxmc/datetime-picker';

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
    MatDialogClose,
    MatSelect,
    MatOption,
    NgxMatDatepickerActions,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerCancel,
    NgxMatDatepickerInput,
    NgxMatDatetimepicker,
    NgxMatDatepickerToggle,
    ReactiveFormsModule
  ]
})

export class AddTourDialog {
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "foot-walking";
  distance: number = 0;
  timeStart: Date = new Date();
  timeEnd: Date = new Date();
  information: string = "";

  disabled: boolean = false;

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
      timeStart: this.parseDate(this.timeStart),
      timeEnd: this.parseDate(this.timeEnd),
      information: this.information,
      timeCreated: ""
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
