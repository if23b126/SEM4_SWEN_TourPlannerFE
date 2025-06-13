import {
  Component,
  inject
} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose, MatDialogConfig,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Tour} from '../tour';
import {Profile} from '../profile';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import { NgxMatTimepickerComponent } from '@ngxmc/datetime-picker';
import { MapDialog } from './map-dialog';
import { MatIconModule } from '@angular/material/icon';

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
    ReactiveFormsModule,
    MatIconButton,
    MatIconModule,
    NgxMatTimepickerComponent
  ]
})

export class AddTourDialog {
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "foot-walking";
  distance: number = 0;
  duration: number = 0;
  information: string = "";

  disabled: boolean = false;
  readonly dialog = inject(MatDialog);

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

  constructor(
    private mapDialog: MatDialogRef<MapDialog>
  ) {
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
      duration: this.duration,
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

  openMapDialog(mode: string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.height = "100vh";
    dialogConfig.width = "100vh";
    this.mapDialog = this.dialog.open(MapDialog, dialogConfig);

    this.mapDialog.afterClosed().subscribe((result: number[]) => {

      if(result !== undefined) {
        switch (mode) {
          case "start":
            this.startpoint = result[0] + "," + result[1];
            break;
          case "end":
            this.endpoint = result[0] + "," + result[1];
            break;
        }
      }
    })
  }
}
