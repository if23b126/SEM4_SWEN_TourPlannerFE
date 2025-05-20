import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {Tour} from '../tour'
import {MatCard, MatCardContent, MatCardHeader, MatCardSmImage, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-main',
  imports: [
    NgIf,
    NgForOf,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCard,
    MatDivider,
    MatLabel,
    MatFormField,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardSmImage
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
  img: string = "";
  //client: HttpClient = inject(HttpClient);
  restService = "http://localhost:8080/tour"

  constructor() {
  }

  ngOnInit() {
    this.getAllTours().then((tourList: Tour[]) => {
      this.tours = tourList;
    });

    this.tile = this.latLngToCoords(18, 48.23486104355502,16.371135620688413)

    /*this.getImage().subscribe(result => {
      this.img = result;
    })*/

  }



  async getAllTours(): Promise<Tour[]> {
    const data = await fetch(this.restService);
    return (await data.json()) ?? [];
  }

  latLngToCoords(zoom: number,lat: number,lon: number): {x: number, y: number} {
    const x_coord = (Math.floor((lon+180)/360*Math.pow(2,zoom)));
    const y_coord = (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    return {x: x_coord, y: y_coord};
  }

  /*getImage() {
    const url = "https://yt3.googleusercontent.com/PKRBxhCiGa8Y0vPmHa1E2cdjpLhUq2Pl-gESwP7kk2plGgxLdsbjyTd9VjcJwBMiY0HQ8bvx5Q=s900-c-k-c0x00ffffff-no-rj";
    return this.client.get(url, {responseType: 'blob'});
  }*/

  async getTile(tile: {x: number, y: number}, zoom: number){
    let url = "https://tile.openstreetmap.org/{zoom}/{x}/{y}.png";
    //url.replace("{zoom}", zoom.toString()).replace("{x}", tile.x.toString()).replace("{y}", tile.y.toString());
    //console.log(url);
    //const client: HttpClient = inject(HttpClient);
    //const image = client.get(url, { headers: {"User-Agent": "Angular App (if23b126@technikum-wien)"}});
    //const image = fetch(url);
    //return await image;
  }
}
