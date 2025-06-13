import {Component, inject, OnInit} from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, toLonLat} from 'ol/proj';
import {MatButton} from '@angular/material/button';
import {MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {MatLabel} from '@angular/material/input';


@Component({
  selector: 'app-dialog',
  imports: [
    MatButton,
    MatDialogClose,
    MatLabel
  ],
  templateUrl: './map-dialog.html'
})


export class MapDialog implements OnInit {
  public map!: Map
  loaded: boolean = false;
  readonly dialogRef = inject(MatDialogRef<MapDialog>);
  coords: number[] = [];

  ngOnInit(): void {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      })
    });
    this.loaded = true;
    setTimeout(() => {
      this.map.setTarget(document.getElementById("map")!);
    }, 1000);
  }

  getCoord(event: any){
    this.coords = toLonLat(this.map.getEventCoordinate(event));
  }

  onNoClick(){
    this.dialogRef.close();
  }

  setLocation() {
    return this.coords;
  }
}
