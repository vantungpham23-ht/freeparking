import type { Parking } from '$lib/types';
import { vinhParkings, vinhCenter } from './vinh-parkings';
import { kosiceParkings, kosiceCenter } from './kosice-parkings';

export interface CityData {
  id: string;
  name: string;
  nameVi: string;
  center: { lat: number; lng: number };
  parkings: Parking[];
}

export const cities: CityData[] = [
  {
    id: 'vinh',
    name: 'Vinh',
    nameVi: 'Thành phố Vinh',
    center: vinhCenter,
    parkings: vinhParkings,
  },
  {
    id: 'kosice',
    name: 'Košice',
    nameVi: 'Košice',
    center: kosiceCenter,
    parkings: kosiceParkings,
  },
];

export function detectCity(lat: number, lng: number): CityData {
  const kosiceDistance = Math.sqrt(
    Math.pow(lat - kosiceCenter.lat, 2) + Math.pow(lng - kosiceCenter.lng, 2)
  );
  const vinhDistance = Math.sqrt(
    Math.pow(lat - vinhCenter.lat, 2) + Math.pow(lng - vinhCenter.lng, 2)
  );

  if (vinhDistance < kosiceDistance) {
    return cities.find(c => c.id === 'vinh')!;
  }
  return cities.find(c => c.id === 'kosice')!;
}

export function getParkingForCity(cityId: string): Parking[] {
  const city = cities.find(c => c.id === cityId);
  return city?.parkings ?? [];
}

export function getParkingCounts(): Record<string, number> {
  return cities.reduce((acc, city) => {
    acc[city.id] = city.parkings.length;
    return acc;
  }, {} as Record<string, number>);
}

export { vinhParkings, vinhCenter };
export { kosiceParkings, kosiceCenter };
