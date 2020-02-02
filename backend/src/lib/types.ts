export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}

export interface Location {
  id: string;
  owner: string;
  latitude: string;
  longitude: string;
  formatted_address: string;
}

export interface Ride {
  id: string;
  rider_id: string;
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
  formatted_address: string;
  created_at: Date;
}

export interface RequestRideRequestBody {
  location?: string;
}

export interface CancelRideRequestRequestBody {
  id?: string;
}

export interface RegisterAsNewDriverRequestBody {
  image?: string;
}

export interface UpdateUserLocationRequestBody {
  latitude?: string;
  longitude?: string;
}

export interface GetLocationNameFromCoordinatesQuery {
  latitude?: string;
  longitude?: string;
}
