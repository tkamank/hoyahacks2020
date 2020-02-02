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

export interface DetailedRide {
  id: string;
  rider_id: string;
  location_id: string;
  latitude: string;
  longitude: string;
  formatted_address: string;
  created_at: Date;
}

export interface RequestRideRequestBody {
  location?: string;
}

export interface RegisterAsNewDriverRequestBody {
  image?: string;
}

export interface GetLocationNameFromCoordinatesQuery {
  latitude?: string;
  longitude?: string;
}
