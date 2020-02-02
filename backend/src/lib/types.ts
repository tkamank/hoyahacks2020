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
