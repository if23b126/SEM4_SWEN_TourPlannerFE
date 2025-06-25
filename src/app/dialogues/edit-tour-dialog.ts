import {Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose, MatDialogConfig,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Tour} from '../tour';
import {Profile} from '../profile';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MapDialog} from './map-dialog';

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
    MatOption,
    MatSelect,
    MatIcon,
    MatIconButton
  ]
})

export class EditTourDialog {
  id: number = 0;
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "";
  distance: number = 0;
  duration: number = 0;
  information: string = "";
  timeCreated: string = "";
  popularity: number = 0;
  childfriendliness = 0;

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

  readonly dialog = inject(MatDialog);

  constructor(
    private mapDialog: MatDialogRef<MapDialog>,
    @Inject(MAT_DIALOG_DATA) private data: Tour,
    private dialogRef: MatDialogRef<EditTourDialog>) {
    if (this.data) {
      this.name = this.data.name;
      this.description = this.data.description;
      this.startpoint = this.data.start;
      this.endpoint = this.data.end;
      this.transportMode = this.data.transportMode;
      this.distance = this.data.distance;
      this.duration = this.data.duration;
      this.information = this.data.information;
      this.timeCreated = this.data.timeCreated;
      this.popularity = this.popularity;
      this.childfriendliness = this.childfriendliness;
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
      id: this.id,
      name: this.name,
      description: this.description,
      start: this.startpoint,
      end: this.endpoint,
      transportMode: this.transportMode,
      distance: this.distance,
      duration: this.duration,
      information: this.information,
      timeCreated: this.timeCreated,
      popularity: this.popularity,
      childfriendliness: this.childfriendliness
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
