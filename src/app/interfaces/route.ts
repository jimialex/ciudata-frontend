import { LngLatLike } from "mapbox-gl";

export interface Route {
  id: number;
  slug: string;
  name: string;
  area: Area;
  geo_route: LngLatLike[];
}

export interface Area {
  id: number;
  slug: string;
  name: string;
  geofence: LngLatLike;
}

