import {Component, Inject, inject, model, OnInit, Optional} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Tour} from '../tour'
import {MatCard, MatCardContent, MatCardSmImage} from '@angular/material/card';
import {MatFormField, MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {parseJson} from '@angular/cli/src/utilities/json-file';
import {MatButton} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {
  MatDialogContent,
  MatDialog,
  MatDialogActions,
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA, MatDialogTitle
} from '@angular/material/dialog';

@Component({
  selector: 'app-main',
  imports: [
    NgIf,
    NgForOf,
    MatCardContent,
    MatCard,
    MatLabel,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardSmImage,
    LayoutModule,
    MatGridList,
    MatGridTile,
    MatButton,
    MatDialogModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }
  ]
})

export class MainComponent implements OnInit{

  tours: Tour[] = [{
    name: "",
    description: "",
    start: "",
    end: "",
    transportMode: "",
    distance: 0,
    timeStart: "",
    timeEnd: "",
    information: "",
    timeCreated: ""
  }];
  tile: {x: number, y: number} = {x: 0, y: 0};
  hoveredTour: any = null;
  updateTour: any = null;
  img: any;
  readonly addRouteDialog = inject(MatDialog);
  restService: string = "http://localhost:8080/"
  addTourDialogService: any = undefined;
  editTourDialogService: any = undefined;
  readonly dialog = inject(MatDialog);

  constructor(private client: HttpClient, private sanitizer: DomSanitizer) {
    this.addTourDialogService = new AddTourDialogService(this.client);
    this.editTourDialogService = new EditTourDialogService();
  }

  ngOnInit() {
    this.getAllTours().then((tours: Observable<object>) => {
      tours.subscribe(result => {
        this.tours = parseJson(JSON.stringify(result));
      })
    })

    this.tile = this.latLngToCoords(18, 48.23486104355502,16.371135620688413)

    this.getTile(this.tile, 18).then((img: Observable<Blob>) => {
      img.subscribe(result => {
        let objectURL = URL.createObjectURL(result);
        this.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    })

  }


  async getAllTours() {
    const tourURL = this.restService + "tour";
    return this.client.get(tourURL, {responseType: 'json'});
  }

  latLngToCoords(zoom: number,lat: number,lon: number): {x: number, y: number} {
    const x_coord = (Math.floor((lon+180)/360*Math.pow(2,zoom)));
    const y_coord = (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    return {x: x_coord, y: y_coord};
  }

  async getTile(tile: {x: number, y: number}, zoom: number): Promise<Observable<Blob>>{
    let osmURL = this.restService + "osm/" + zoom.toString() + "/" + tile.x.toString() + "/" + tile.y.toString();
    return this.client.get(osmURL, {responseType: 'blob'});
  }

  openAddTourDialog(): void {
    const addTourDialog = this.dialog.open(AddTourDialogService);

    addTourDialog.afterClosed().subscribe(result => {
      console.log("dialog closed");

      if(result !== undefined) {
        this.addTourDialogService.clearAddTourInputs();
      }
    })
  }

  openEditTourDialog(tour: Tour){
    const editTourDialog = this.dialog.open(EditTourDialogService, {
      data: tour
    });

    editTourDialog.afterClosed().subscribe(result => {
      console.log("dialog closed");

      if(result !== undefined) {
        this.editTourDialogService.clearEditTourInputs();
      }
    })
  }
}


@Component({
  selector: 'add-tour-dialog',
  templateUrl: 'add-tour-dialog.html',
  imports: [
    MatDialogContent,
    MatFormFieldModule,
    MatDialogActions,
    FormsModule,
    MatInput,
    MatButton,
    MatDialogTitle
  ],
  providers: [
    {
      provide: MainComponent,
      useValue: {}
    },
    {
      provide: String,
      useValue: {}
    }
  ]
})


export class AddTourDialogService {
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "";
  distance: number = 0;
  timeStart: string = "";
  timeEnd: string = "";
  information: string = "";
  restService: string = "http://localhost:8080/";

  readonly dialogRef = inject(MatDialogRef<AddTourDialogService>);

  constructor(private client: HttpClient) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTour(): void {
    let name = this.name;
    let description = this.description;
    let startpoint = this.startpoint;
    let endpoint = this.endpoint;
    let transportMode = this.transportMode;
    let distance = this.distance;
    let timeStart = this.timeStart;
    let timeEnd = this.timeEnd;
    let information = this.information;

    let body: Tour = {
      name: name,
      description: description,
      start: startpoint,
      end: endpoint,
      transportMode: transportMode,
      distance: distance,
      timeStart: timeStart,
      timeEnd: timeEnd,
      information: information,
      timeCreated: ""
    }

    console.log(body);

    this.sendTour(body).then((answ) => {
      answ.subscribe(result => {
        console.log(result);
      })
    })

    this.onNoClick();
  }

  async sendTour(body: Tour) {
    console.log(this.restService)
    const tourURL = this.restService + "tour";
    console.log(tourURL);
    return this.client.post(tourURL, body);
  }

  clearAddTourInputs(): void {

    this.name = "";
    this.description = "";
    this.startpoint = "";
    this.endpoint = "";
    this.transportMode = "";
    this.distance = 0;
    this.timeStart = "";
    this.timeEnd = "";
    this.information = "";
  }
}



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
    MatDialogTitle
  ],
  providers: [
    {
      provide: MainComponent,
      useValue: {}
    },
    {
      provide: MAT_DIALOG_DATA,
      useValue: {}
    }
  ]
})

export class EditTourDialogService {
  name: string = "";
  description: string = "";
  startpoint: string = "";
  endpoint: string = "";
  transportMode: string = "";
  distance: number = 0;
  timeStart: string = "";
  timeEnd: string = "";
  information: string = "";
  readonly dialogRef = inject(MatDialogRef<EditTourDialogService>);
  //readonly data = inject<Tour>(MAT_DIALOG_DATA)
  //updateTour: any = model(this.data);

  constructor() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editTour(): void {

    this.onNoClick();
  }

  clearEditTourInputs(): void {

    this.name = "";
    this.description = "";
    this.startpoint = "";
    this.endpoint = "";
    this.transportMode = "";
    this.distance = 0;
    this.timeStart = "";
    this.timeEnd = "";
    this.information = "";
  }
}



