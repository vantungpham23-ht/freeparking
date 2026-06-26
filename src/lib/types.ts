export interface Parking {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity?: number;
  isFree: boolean;
  freeReason: string;
  feePerHour?: number;
  distance?: number;
  isWeekendFree?: boolean;
  hasConditionalAccess?: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
}
