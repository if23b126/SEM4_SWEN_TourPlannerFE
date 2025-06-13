import {Component, Inject, inject, OnInit} from '@angular/core';
import {NgFor, NgForOf, NgIf, CommonModule} from '@angular/common';
import {Tour} from '../tour'
import {Log} from '../log'
import {MatCard, MatCardContent, MatCardSmImage} from '@angular/material/card';
import {MatInput, MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {count, Observable} from 'rxjs';
import {parseJson} from '@angular/cli/src/utilities/json-file';
import {MatButton} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { AddTourDialog } from '../dialogues/add-tour-dialog';
import {EditTourDialog} from '../dialogues/edit-tour-dialog';
import {LogComponent} from '../log/log.component';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [
    NgIf,
    NgFor,
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
    MatDialogModule,
    CommonModule
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

  logs: Log[] =[{
    id: 0,
    comment: "",
    difficulty: 0,
    distance: 0,
    rating: 0,
    time: "",
    timeEnd: "",
    timeStart: "",
    tourid: 0,
  }]

  tours: Tour[] = [{
    id: 0,
    name: "",
    description: "",
    start: "",
    end: "",
    transportMode: "",
    distance: 0,
    duration: 0,
    information: "",
    timeCreated: ""
  }];
  tile: {x: number, y: number} = {x: 0, y: 0};
  hoveredTour: any = null;
  hoveredLog: any = null;
  img: any;
  readonly addRouteDialog = inject(MatDialog);
  restService: string = "http://localhost:8080/"
  readonly dialog = inject(MatDialog);

  constructor(
    private client: HttpClient,
    private sanitizer: DomSanitizer,
    private addTourDialog: MatDialogRef<AddTourDialog>,
    private getLog: MatDialogRef<LogComponent>,
    private editTourDialog: MatDialogRef<EditTourDialog>) {
  }

  isDisabled: boolean = false;

  enableDisable() {
    this.isDisabled = this.isDisabled ? false : true;
  }

  ngOnInit() {
    this.getAllTours().then((tours: Observable<object>) => {
      tours.subscribe(result => {
        this.tours = parseJson(JSON.stringify(result));
      })
    })

    /*this.tile = this.latLngToCoords(18,27.09258226095784, 17.80118434475323)

    this.getTile(this.tile, 18).then((img: Observable<Blob>) => {
      img.subscribe(result => {
        let objectURL = URL.createObjectURL(result);
        this.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    })*/

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

  setMap(tile: {x: number, y: number}, zoom: number): void {
    this.getTile(this.tile, 18).then((img: Observable<Blob>) => {
      img.subscribe(result => {
        let objectURL = URL.createObjectURL(result);
        this.img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      })
    })
  }

  openAddTourDialog(): void {
    this.addTourDialog = this.dialog.open(AddTourDialog);

    this.addTourDialog.afterClosed().subscribe((result: Tour) => {
      if(result !== undefined) {
        this.addTour(result).then(r => r.subscribe(a => {console.log("tour added")}));
      }
    })
    this.getAllTours();
  }

  openAddLogButton(): void{
    this.getLog = this.dialog.open(LogComponent);

    this.getLog.afterClosed().subscribe((result: Log) => {
      if(result !== undefined) {
        this.addLog(result).then(r => r.subscribe(a => {console.log("tour added")}));
      }
    })
  }

  openEditTourDialog(tour: Tour){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = tour;
    dialogConfig.autoFocus = true;
    this.editTourDialog = this.dialog.open(EditTourDialog, dialogConfig);

    this.editTourDialog.afterClosed().subscribe((result: Tour) => {
      console.log("dialog closed");

      if(result !== undefined) {
        result.id = tour.id
        this.updateTour(result).then(r => r.subscribe(a => {console.log("tour edited")}));
      }
    })
    return this.getAllTours();
  }

  openEditLogDialog(log: Log){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = log;
    dialogConfig.autoFocus = true;
    this.getLog = this.dialog.open(LogComponent, dialogConfig);
    this.getLog.afterClosed().subscribe((result: Log) => {
      console.log("dialog closed");

      if(result !== undefined) {
        result.id = log.id;
        result.tourid = log.tourid;
        this.updateLog(result).then(r => r.subscribe(a => {console.log("tour edited")}));
      }
    })
    return this.getAllTours();
  }

  deleteTourButton(tour: Tour){
    if(tour !== undefined) {
      this.deleteTour(tour).then(r => r.subscribe(a => {console.log("tour deleted" );}));
    }
    return this.getAllTours();
  }

  deleteLogButton(log: Log){
    if(log !== undefined) {
      this.deleteLog(log).then(r => r.subscribe(a => {console.log("log deleted" );}));
    }
  }

  async getAllLogs(tour: Tour) {
    const logURL = this.restService + "logs/" + tour.id;
    return this.client.get(logURL, {responseType: 'json'});
  }

  openGetLog(tour: Tour){
    this.isDisabled = this.isDisabled ? false : true;
    this.getAllLogs(tour).then((logs: Observable<object>) => {
      logs.subscribe(result => {
        this.logs = parseJson(JSON.stringify(result));
      })
    })
  }


  async addTour(body: Tour) {
    const tourURL = this.restService + "tour";
    return this.client.post(tourURL, body);
  }

  async addLog(body: Log) {
    const tourURL = this.restService + "logs";
    return this.client.post(tourURL, body);
  }

  async updateTour(body: Tour) {
    const tourURL = this.restService + "tour/"+ body.id;
    return this.client.put(tourURL, body);
  }

  protected readonly Number = Number;

  async updateLog(body: Log) {
    const tourURL = this.restService + "logs/"+ body.id;
    return this.client.put(tourURL, body);
  }

  async deleteTour(body: Tour) {
    const tourURL = this.restService + "tour/"+ body.id;
    return this.client.delete(tourURL);
  }

  async deleteLog(body: Log) {
    const tourURL = this.restService + "logs/"+ body.id;
    return this.client.delete(tourURL);
  }

  protected readonly count = count;
}
