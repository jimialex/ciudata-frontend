import { Injectable, WritableSignal, signal } from '@angular/core';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as mapboxgl from 'mapbox-gl';
import { Coordinates } from '../interfaces/route';

@Injectable({
  providedIn: 'root',
})
export class DrawMapService {
  constructor() {}

  map!: mapboxgl.Map;
  isEditableMode: WritableSignal<boolean> = signal(false);
  draw = new MapboxDraw({
    // Instead of showing all the draw tools, show only the line string and delete tools.
    displayControlsDefault: false,
    controls: {
      line_string: true,
      trash: true,
    },
    // Set the draw mode to draw LineStrings by default.
    defaultMode: 'draw_line_string',
    styles: [
      // Set the line style for the user-input coordinates.
      {
        id: 'gl-draw-line',
        type: 'line',
        filter: [
          'all',
          ['==', '$type', 'LineString'],
          ['!=', 'mode', 'static'],
        ],
        layout: {
          'line-cap': 'round',
          'line-join': 'round',
        },
        paint: {
          'line-color': '#438EE4',
          'line-dasharray': [0.2, 2],
          'line-width': 4,
          'line-opacity': 0.7,
        },
      },
      // Style the vertex point halos.
      {
        id: 'gl-draw-polygon-and-line-vertex-halo-active',
        type: 'circle',
        filter: [
          'all',
          ['==', 'meta', 'vertex'],
          ['==', '$type', 'Point'],
          ['!=', 'mode', 'static'],
        ],
        paint: {
          'circle-radius': 12,
          'circle-color': '#FFF',
        },
      },
      // Style the vertex points.
      {
        id: 'gl-draw-polygon-and-line-vertex-active',
        type: 'circle',
        filter: [
          'all',
          ['==', 'meta', 'vertex'],
          ['==', '$type', 'Point'],
          ['!=', 'mode', 'static'],
        ],
        paint: {
          'circle-radius': 8,
          'circle-color': '#438EE4',
        },
      },
    ],
  });

  buildMap(element: any) {
    return new Promise((resolve, reject) => {
      try {
        this.map = new mapboxgl.Map({
          container: element,
          style: 'mapbox://styles/mapbox/streets-v12', // style URL
          center: [-68.12460801485163, -16.499381437724754], // starting position [lng, lat]
          zoom: 9, // starting zoom
        });
        resolve(this.map);
      } catch (error) {
        reject(error);
      }
    });
  }

  loadCoords(coords: any): void {
    this.map.fitBounds([coords[0], coords[coords.length - 1]], {
      padding: 100,
    });

    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coords,
        },
      },
    });
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#438EE4',
        'line-dasharray': [0.2, 2],
        'line-width': 4,
        'line-opacity': 0.7,
      },
    });

    // this.map.removeSource('route');
  }

  changeMode(): void{
    if (!this.isEditableMode()) {
      this.map.addControl(this.draw);
    } else {
      this.map.removeControl(this.draw);
    }
    this.isEditableMode.update((value: boolean) => !value);
  }
}
