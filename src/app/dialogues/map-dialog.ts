import {Component, inject, OnInit} from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import {toLonLat, transform} from 'ol/proj';
import {MatButton} from '@angular/material/button';
import {MatDialogClose, MatDialogRef} from '@angular/material/dialog';
import {MatLabel} from '@angular/material/input';
import {Feature} from 'ol';
import {Point} from 'ol/geom';
import {Icon, Style} from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';


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
  public mapDialogWindow!: Map;
  loaded: boolean = false;
  readonly dialogRef = inject(MatDialogRef<MapDialog>);
  coords: number[] = [];
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

  ngOnInit(): void {
    this.mapDialogWindow = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: this.view
    });
    this.loaded = true;
    setTimeout(() => {
      this.mapDialogWindow.setTarget(document.getElementById("mapDialog")!);
    }, 1000);
  }

  getCoord(event: any){

    this.mapDialogWindow.getLayers().forEach(layer => {
      if (layer.get('name') && layer.get('name') == "currentLocation"){
        this.mapDialogWindow.removeLayer(layer);
      }
    });

    let iconFeature = new Feature({
      geometry: new Point(this.mapDialogWindow.getEventCoordinate(event)),
      name: 'Current Location'
    });

    let iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: './data/arrow.png'
      })
    })

    iconFeature.setStyle(iconStyle);

    let vectorSource = new VectorSource({
      features: [iconFeature]
    });

    let vectorLayer = new VectorLayer({
      source: vectorSource
    });

    vectorLayer.set("name", "currentLocation");

    this.mapDialogWindow.addLayer(vectorLayer);
    this.coords = toLonLat(this.mapDialogWindow.getEventCoordinate(event));
  }

  onNoClick(){
    this.dialogRef.close();
  }

  setLocation() {
    return this.coords;
  }
}
