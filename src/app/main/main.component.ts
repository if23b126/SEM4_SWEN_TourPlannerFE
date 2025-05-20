import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {Tour} from '../tour'
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatDivider} from '@angular/material/divider';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-main',
  imports: [
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
    MatInputModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {

  tours: Tour[] = [{
    name: "Budapest - Wien",
    description: "test",
    start: "test",
    end: "test",
    transportMode: "test",
    distance: 2,
    timeStart: "2025-05-16 8:30:00",
    timeEnd: "2025-05-16 10:30:00",
    information: "test",
    timeCreated: "2025-05-16"
  },
    {
      name: "Budapest - Wien",
      description: "test",
      start: "test",
      end: "test",
      transportMode: "test",
      distance: 2,
      timeStart: "2025-05-16 8:30:00",
      timeEnd: "2025-05-16 10:30:00",
      information: "test",
      timeCreated: "2025-05-16"
    },
    {
      name: "Budapest - Wien",
      description: "test",
      start: "test",
      end: "test",
      transportMode: "test",
      distance: 2,
      timeStart: "2025-05-16 8:30:00",
      timeEnd: "2025-05-16 10:30:00",
      information: "test",
      timeCreated: "2025-05-16"
    }

  ];

  constructor() {
    this.getAllTours().then((tourList: Tour[]) => {
      this.tours = tourList;
    });
    console.log(this.latLngToCoords(10, 48.23468632642535, 16.37102223829667));
  }

  url = "http://localhost:8080/tour"

  async getAllTours(): Promise<Tour[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async latLngToCoords(zoom: number,lat: number,lon: number): Promise<{x: number, y: number}> {
    const n = Math.pow(2,zoom);
    const lat_rad = lat * (Math.PI / 180);
    const x_coord = n * ((lon + 180) / 360);
    const y_coord = .5 * n * (1 - (Math.log (Math.tan(lat_rad) + (1/Math.cos(lat_rad))) /  Math.PI));
    return {x: Math.floor(x_coord), y: Math.floor(y_coord)};
  }
}
