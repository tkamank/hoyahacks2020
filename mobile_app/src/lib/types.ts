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

export interface Ride {
  id: string;
  rider_id: string;
  driver_id?: string;
  status: number;
  created_at: Date;
}

export interface DetailedRide {
  id: string;
  rider_id: string;
  status: number;
  location_id: string;
  latitude: string;
  longitude: string;
  user_latitude: string;
  user_longitude: string;
  formatted_address: string;
  created_at: Date;
}

export interface DetailedRideWithDistance {
  distanceToRider?: number;
  distanceToDestination?: number;
  ride: DetailedRide;
}