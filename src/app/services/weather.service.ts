import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherItem } from '../types/weather.type';
import { parseWeatherCode } from '../utils/utils';

const params = {
  latitude: 52.52,
  longitude: 13.41,
  hourly: [
    'temperature_2m',
    'relative_humidity_2m',
    'weather_code',
    'surface_pressure',
  ],
};

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  URL = 'https://api.open-meteo.com/v1/forecast';

  constructor() {}

  public async fetchHourlyForecast() {
    const responses = await fetchWeatherApi(this.URL, params);

    return this.parseWeatherResponse(responses);
  }

  private parseWeatherResponse(responses: any): WeatherItem[] {
    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherDataHourly = {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
      weatherCode: hourly.variables(2)!.valuesArray()!,
      surfacePressure: hourly.variables(3)!.valuesArray()!,
    };

    const weatherItems: WeatherItem[] = [];
    for (let i = 0; i < weatherDataHourly.time.length; i++) {
      console.log(
        weatherDataHourly.time[i].toISOString(),
        weatherDataHourly.temperature2m[i],
        weatherDataHourly.relativeHumidity2m[i],
        weatherDataHourly.weatherCode[i],
        weatherDataHourly.surfacePressure[i]
      );

      const item: WeatherItem = {
        time: weatherDataHourly.time[i],
        temperature: weatherDataHourly.temperature2m[i],
        humidity: weatherDataHourly.relativeHumidity2m[i],
        weatherState: parseWeatherCode(weatherDataHourly.weatherCode[i]),
        surfacePressure: weatherDataHourly.surfacePressure[i],
      };

      weatherItems.push(item);
    }

    const filtered = weatherItems.filter((item) => item.weatherState?.description == "");
    console.log('filtered', filtered);

    return weatherItems;
  }
}
