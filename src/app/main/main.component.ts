import {Component, inject, OnInit} from '@angular/core';
import {NgFor, NgForOf, NgIf, CommonModule} from '@angular/common';
import {Tour} from '../tour'
import {Log} from '../log'
import { Coordinate } from '../coordinate';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {forkJoin, Observable} from 'rxjs';
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
import {SearchTourLogDialog} from '../dialogues/search-dialog';
import {AddLogDialog } from '../dialogues/add-log-dialog';
import {EditLogDialog} from '../dialogues/edit-log-dialog';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import {OSM} from 'ol/source';
import View from 'ol/View';
import {fromLonLat, transform, useGeographic} from 'ol/proj';
import {LineString} from 'ol/geom';
import ol from 'ol/dist/ol';
import {Feature} from 'ol';
import {Vector} from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import {Stroke, Style} from 'ol/style';
import {TourImportExport} from '../tourImportExport';
import {log} from 'ol/console';

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
    timeCreated: "",
    popularity: 0,
    childfriendliness: 0
  }];
  currentTourID: number = -1;
  hoveredTour: Tour = {
    id: 0,
    name: "",
    description: "",
    start: "",
    end: "",
    transportMode: "",
    distance: 0,
    duration: 0,
    information: "",
    timeCreated: "",
    popularity: 0,
    childfriendliness: 0
  };
  hoveredLog: any = null;
  selectedTour: any;
  img: any;
  searchText: any;
  restService: string = "http://localhost:8080/"
  readonly dialog = inject(MatDialog);
  public map!: Map;
  loaded: boolean = false;
  routeStyles = {
    'track-red': new Style({
      stroke: new Stroke({
        color: '#ff0000',
        width: 3,
      }),
    }),
    'track-black': new Style({
      stroke: new Stroke({
        color: '#000000',
        width: 3,
      }),
    }),
  };
  initialLocation = {
    lat: 48.2010386430652,
    lng: 16.37038797323949,
    zoom: 4
  }
  view = new View({
    center: transform(
      [this.initialLocation.lng, this.initialLocation.lat],
      'EPSG:4326',
      'EPSG:3857'
    ),
    zoom: this.initialLocation.zoom
  })

  constructor(
    private client: HttpClient,
    private sanitizer: DomSanitizer,
    private addTourDialog: MatDialogRef<AddTourDialog>,
    private addLogDialog: MatDialogRef<AddLogDialog>,
    private editLogDialog: MatDialogRef<EditLogDialog>,
    private searchTourLodDialog: MatDialogRef<SearchTourLogDialog>,
  private editTourDialog: MatDialogRef<EditTourDialog>) {
  }

  isDisabled: boolean = false;

  enableDisable() {
    this.isDisabled = !this.isDisabled;
  }

  ngOnInit() {
    this.getAllTours().then((tours: Observable<object>) => {
      tours.subscribe(result => {
        this.tours = result as Tour[];
      })
    })

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: this.view
    });
    this.loaded = true;
    setTimeout(() => {
      this.map.setTarget(document.getElementById("map")!);
    }, 1000);
  }


  async getAllTours() {
    const tourURL = this.restService + "tour";
    return this.client.get(tourURL, {responseType: 'json'});
  }

  async getAllLogs(tour: Tour) {
    const logURL = this.restService + "logs/" + tour.id;
    return this.client.get(logURL, {responseType: 'json'});
  }

  getOneTour(id: number): Observable<Tour> {
    const tourURL = this.restService + "tour/findTour/" + id;
    return this.client.get<Tour>(tourURL, { responseType: 'json' });
  }

  getOneLog(id: number): Observable<Log>{
    const logURL = this.restService + "logs/findOneLog/" + id;
    return this.client.get<Log>(logURL, {responseType: 'json'});
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
    this.getTile(tile, 18).then((img: Observable<Blob>) => {
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
        this.addTour(result).then(r => r.subscribe(a => {console.log("tour added"); this.refreshTours();}));
      }
    })
  }

  openAddLogButton(tourId: number): void{
    console.log('Opening dialog with tourId:', tourId); // <--- Debug
    this.addLogDialog = this.dialog.open(AddLogDialog, {
      data: { tourId: tourId }
    });

    this.addLogDialog.afterClosed().subscribe((result: Log) => {
      if(result !== undefined) {
        this.addLog(result).then(r => r.subscribe(a => {console.log("tour added"); this.refreshLogs()}));
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
        this.updateTour(result).then(r => r.subscribe(a => {console.log("tour edited"); this.refreshTours()}));
      }
    })
  }


  openSearchTourLogDialog() {
    const observable = this.searchTourLogInput();
    if (observable) {
      observable.subscribe(result => {
        const dialogRef = this.dialog.open(SearchTourLogDialog, {
          data: { searchTourLogResult: result }
        });

        dialogRef.afterClosed().subscribe(tourId => {
          if (tourId[1] == 1) {
            this.handleSelectedTour(tourId[0]);
          }else if(tourId[1] == 2){
           this.getOneLog(tourId[0]).subscribe(log => {
             this.handleSelectedTour(log.tourid);
             this.hoveredLog = log;
           })
          }
        });
      });
    }
  }

  handleSelectedTour(tourId: number) {
    this.getOneTour(tourId).subscribe(tour => {
      this.selectedTour = tour;
      this.openGetLog(tour);
    });
  }


  openEditLogDialog(log: Log){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = log;
    dialogConfig.autoFocus = true;
    this.editLogDialog = this.dialog.open(EditLogDialog, dialogConfig);
    this.editLogDialog.afterClosed().subscribe((result: Log) => {
      console.log("dialog closed");

      if(result !== undefined) {
        result.id = log.id;
        result.tourid = log.tourid;
        this.updateLog(result).then(r => r.subscribe(a => {console.log("tour edited"); this.refreshLogs()}));
      }
    })
  }

  deleteTourButton(tour: Tour){
    if(tour !== undefined) {
      this.deleteTour(tour).then(r => r.subscribe(a => {console.log("tour deleted" ); this.refreshTours()}));
    }
  }

  deleteLogButton(log: Log){
    if(log !== undefined) {
      this.deleteLog(log).then(r => r.subscribe(a => {console.log("log deleted" );this.refreshLogs()}));
    }
  }

  searchTourLogInput(): Observable<any> | null {
    if (this.searchText != null) {
      console.log(this.searchText);
      return forkJoin({
        tour: this.searchTour(this.searchText),
        log: this.searchLog(this.searchText)
      });
    }
    return null;
  }

  openGetLog(tour: Tour){
    this.currentTourID = tour.id;
    this.map.getLayers().forEach(layer => {
      if (layer.get('name') && layer.get('name') == "route"){
        this.map.removeLayer(layer);
      }
    });
    let startEnd: Coordinate[] = [{
        lat: tour.start.split(',')[1],
        lon: tour.start.split(',')[0]
      },
      {
        lat: tour.end.split(',')[1],
        lon: tour.end.split(',')[0]
      }]
    this.getRoute(startEnd, tour.transportMode).then(r => r.subscribe((a) => {

      let coords = (a as Coordinate[]).map( c => { return [Number(c.lon), Number(c.lat)]; });

      let middlePoint = coords[Math.round(coords.length/2)];

      let geometry = new LineString(coords).transform('EPSG:4326', 'EPSG:3857');

      let styles = this.routeStyles;

      let layer = new Vector({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: geometry
            })
          ]
        }),
        style: function () {
          return styles['track-black'];
        },
        zIndex: 100
      });

      layer.set("name", "route");
      this.map.addLayer(layer);

      this.view.setCenter(fromLonLat(middlePoint));
      this.view.setZoom(13);
    }));
    this.isDisabled = !this.isDisabled;
    this.getAllLogs(tour).then((logs: Observable<object>) => {
      logs.subscribe(result => {
        this.logs = result as Log[];
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

  searchTour(input: any): Observable<any> {
    console.log(input + "2");
    const tourURL = this.restService + "tour/search/" + input;
    return this.client.get(tourURL);
  }

  searchLog(input: any): Observable<any> {
    console.log(input + "2");
    const tourURL = this.restService + "logs/search/" + input;
    return this.client.get(tourURL);
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

  async getRoute(startEnd: Coordinate[], transportMode: string) {
    const tourURL = this.restService + "osm/" + transportMode;
    return this.client.post(tourURL, startEnd);
  }

  async getSummaryReport() {
    const reportURL = this.restService + "report/summary";
    return this.client.get(reportURL, { responseType: 'blob' });
  }

  async getTourReport(id: number) {
    const reportURL = this.restService + "report/tour/" + id;
    return this.client.get(reportURL, { responseType: 'blob' });
  }

  async importTourBE(body: TourImportExport) {
    const importURL = this.restService + "import";
    return this.client.post(importURL, body, { headers: { 'Content-Type': 'application/json' }});
  }

  async exportTourBE(id: number) {
    const exportURL = this.restService + "export/" + id;
    return this.client.get(exportURL, { responseType: 'blob' });
  }

  getReport(type: string) {
    if (type == "summary") {
      this.getSummaryReport().then(result => {
        result.subscribe(data => {
          let downloadURL = window.URL.createObjectURL(data);
          let link = document.createElement("a");
          link.href = downloadURL;
          link.download = "summary.pdf";
          link.click();
        })
      })
    } else if (type == "tour") {
      this.getTourReport(this.currentTourID).then(result => {
        result.subscribe(data => {
          let downloadURL = window.URL.createObjectURL(data);
          let link = document.createElement("a");
          link.href = downloadURL;
          link.download = "tour_" + this.currentTourID + ".pdf";
          link.click();
        })
      })
    }
  }

  importTour(event: any) {
    let file = event.target.files[0];

    if (file.type == "application/json") {
      let fileReader = new FileReader();
      fileReader.onloadend = (e) => {
        let body: TourImportExport = fileReader.result as unknown as TourImportExport;

        this.importTourBE(body).then(result => {
          result.subscribe(data => {
            this.refreshTours();
            console.log("tour imported");
          })
        });
      }

      fileReader.readAsText(file);
    }
  }

  exportTour() {
    this.exportTourBE(this.currentTourID).then(result => {
      result.subscribe(data => {
        let downloadURL = window.URL.createObjectURL(data);
        let link = document.createElement("a");
        link.href = downloadURL;
        link.download = "tour_" + this.currentTourID + ".json";
        link.click();
      })
    })
  }

  getDuration(time: number): string {
    if(time / 60 > 60) {
      return (time/3600).toFixed(2) + " hours";
    } else {
      return (time/60).toFixed(2) + " minutes";
    }
  }

  getDistance(distance: number): string {
    if(distance / 1000 < 1) {
      return distance.toFixed(2) + " m";
    } else {
      return (distance/1000).toFixed(2) + " km";
    }
  }


  refreshTours() {
    this.getAllTours().then((tours: Observable<object>) => {
      tours.subscribe(result => {
        this.tours = result as Tour[]
      });
    });
  }

  refreshLogs() {
    this.getAllLogs(this.selectedTour).then((logs: Observable<object>) => {
      logs.subscribe(result => {
        this.logs = result as Log[]
      });
    });
  }

  protected readonly Math = Math;
  protected readonly console = console;
}
