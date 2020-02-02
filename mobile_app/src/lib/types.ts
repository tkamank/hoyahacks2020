export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Location {
  id: string;
  latitude: string;
  longitude: string;
  owner: string;
  formatted_address: string;
}

export interface LocationWithDistance {
  distance?: number;
  location: Location;
}

export interface DetailedRide {
  id: string;
  rider_id: string;
  location_id: string;
  latitude: string;
  longitude: string;
  formatted_address: string;
  created_at: Date;
}

export interface DetailedRideWithDistance {
  distance?: number;
  ride: DetailedRide;
}