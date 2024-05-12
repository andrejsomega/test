export interface WeatherState {
  code: number;
  description: string;
}

export interface WeatherItem {
  time: Date;
  temperature: number;
  humidity: number;
  weatherState: WeatherState | null;
  surfacePressure: number;
}
