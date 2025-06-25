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
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
    MatIconModule
  ]
})

export class AddTourDialog {
  id: number = 0;
  name: string | undefined;
  description: string | undefined;
  startpoint: string | undefined;
  endpoint: string | undefined;
  transportMode: string = "foot-walking";
  distance: number = 0;
  duration: number = 0;
  information: string | undefined;

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

  addTour() {
    return {
      id: this.id,
      name: this.name as string,
      description: this.description as string,
      start: this.startpoint as string,
      end: this.endpoint as string,
      transportMode: this.transportMode as string,
      distance: this.distance,
      duration: this.duration,
      information: this.information as string,
      timeCreated: ""
    };
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
