export type SensorType = 'IR' | 'Relay' | 'Temp' | 'Camera' | 'Radar';

export interface SensorTypeOption {
  id: string;
  label: SensorType;
  image: any; // can be a local image or an emoji
  count: number;
}

export interface Device {
  id: string;
  name: string;
  mac: string;
}

export interface ActivityItem {
    id: string;
    building: string;
    details: string;
    time: string;
    status: 'Completed' | 'Pending';
}
export type Building = {
    id: string;
    name: string;
    description: string;
    maintenance: string;
    accessLevel: string;
}

export type Flat = {
    id: string;
    buildingId: string;
    unit: string;
}