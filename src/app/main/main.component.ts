import {Component, Injectable, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Tour} from '../tour'
import {MatCard, MatCardContent, MatCardSmImage} from '@angular/material/card';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {parseJson} from '@angular/cli/src/utilities/json-file';
import {MatButton} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-main',
  imports: [
    NgIf,
    NgForOf,
    MatCardContent,
    MatCard,
    MatLabel,
    MatFormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardSmImage,
    LayoutModule,
    MatGridList,
    MatGridTile,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
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
  addRouteName: string = "";
  addRouteDescription: string = "";
  addRouteStartpoint: string = "";
  addRouteEndpoint: string = "";
  addRouteTransportMode: string = "";
  addRouteDistance: number = 0;
  addRouteTimeStart: string = "";
  addRouteTimeEnd: string = "";
  addRouteInformation: string = "";
  restService = "http://localhost:8080/"

  constructor(private client: HttpClient, private sanitizer: DomSanitizer) {
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

  addTour(): void {
    let tourURL = this.restService + "tour";

    let name = this.addRouteName;
    let description = this.addRouteDescription;
    let startpoint = this.addRouteStartpoint;
    let endpoint = this.addRouteEndpoint;
    let transportMode = this.addRouteTransportMode;
    let distance = this.addRouteDistance;
    let timeStart = this.addRouteTimeStart;
    let timeend = this.addRouteTimeEnd;
    let information = this.addRouteInformation;

    let body = {
      name: name,
      description: description,
      start: startpoint,
      end: endpoint,
      transportMode: transportMode,
      distance: distance,
      timeStart: Date.parse(timeStart),
      timeEnd: Date.parse(timeend),
      information: information
    }
    console.log(body);

    //this.client.post(tourURL, body);
  }
}
