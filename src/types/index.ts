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

