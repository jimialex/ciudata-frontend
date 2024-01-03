import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { enviroment } from '../../assets/config/config';

@Injectable({
  providedIn: 'root',
})
export class DrawMapService {
  map!: Map;
  isEditableMode: WritableSignal<boolean> = signal(false);
  coordsSaved: WritableSignal<LngLatLike[]> = signal([]);

  draw: MapboxDraw;

  mark1?: Marker;
  mark2?: Marker;

  popupIni?: Popup;
  popupFin?: Popup;

  httpClient = inject(HttpClient);

  constructor() {
    this.draw = new MapboxDraw({
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
  }

  buildMap(element: any) {
    return new Promise((resolve, reject) => {
      try {
        this.map = new Map({
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

  loadCoords(coords: LngLatLike[]): void {
    this.map.fitBounds([coords[0], coords[coords.length - 1]], {
      padding: 100,
    });

    // Check if the source existsout
    if (this.map.getSource('route')) {
      this.remove();
    }

    this.mark1 = new Marker({ color: 'red' })
      .setLngLat(coords[0])
      .addTo(this.map);
    this.popupIni = new Popup({ closeOnClick: false })
      .setLngLat(coords[0])
      .setHTML('<h3>Incio de ruta</h3>')
      .addTo(this.map);

    this.mark2 = new Marker({ color: 'green' })
      .setLngLat(coords[coords.length - 1])
      .addTo(this.map);
    this.popupFin = new Popup({ closeOnClick: false })
      .setLngLat(coords[coords.length - 1])
      .setHTML('<h3>Fin de la Ruta</h3>')
      .addTo(this.map);

    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coords as any,
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
        'line-opacity': 0.8,
      },
    });
  }

  changeMode(): void {
    if (!this.isEditableMode()) {
      // Check if the source exists
      if (this.map.getSource('route')) {
        this.remove();
      }
      this.map.addControl(this.draw);
      this.map.on('draw.create', (event) => {
        const coords: LngLatLike[] = event.features[0].geometry
          .coordinates as LngLatLike[];
        this.coordsSaved.set(coords);
        this.getMatch(coords);
      });
    } else {
      this.map.removeControl(this.draw);
    }
    this.isEditableMode.update((value: boolean) => !value);
  }

  private remove(): void {
    this.map.removeLayer('route');
    this.map.removeSource('route');
    this.mark1?.remove();
    this.mark2?.remove();
    this.popupIni?.remove();
    this.popupFin?.remove();
  }

  getMatch(coords: LngLatLike[]) {
    const profile = 'driving';
    const newCoords = coords.join(';');
    const radius = coords.map(() => 25).join(';');

    const url = [
      `https://api.mapbox.com/matching/v5/mapbox/${profile}/${newCoords}`,
      `?geometries=geojson&radiuses=${radius}&steps=true`,
      `&access_token=${enviroment.mapBoxKey}`,
    ].join('');
    this.httpClient.get(url).subscribe((response: any) => {
      this.addRoute(response.matchings[0].geometry)
    });
  }

  addRoute(coords: LngLatLike[]) {
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }
    
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: coords as any
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#03AA46',
        'line-width': 8,
        'line-opacity': 0.8
      }
    });
  }
}

// 9:45 13 calacoto 8395
