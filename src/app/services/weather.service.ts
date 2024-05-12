import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { WeatherItem } from '../types/weather.type';
import { parseWeatherCode } from '../utils/utils';

const PARAMS_DEFAULT = {
  latitude: 52.52,
  longitude: 13.41,
  hourly: [
    'temperature_2m',
    'relative_humidity_2m',
    'weather_code',
    'surface_pressure',
  ],
};

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
  ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

  constructor() {}

  public async fetchHourlyForecast() {
    const responses = await fetchWeatherApi(this.FORECAST_URL, PARAMS_DEFAULT);

    return this.parseWeatherResponse(responses);
  }

  public async fetchHourlyHistoricalData(dateFrom: Date, dateTo: Date) {
    const paramaters = {
      ...PARAMS_DEFAULT,
      start_date: this.formatDateParameter(dateFrom),
      end_date: this.formatDateParameter(dateTo),
    };

    const params2 = {
      latitude: 52.52,
      longitude: 13.41,
      start_date: '2024-04-26',
      end_date: '2024-05-10',
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'weather_code',
        'surface_pressure',
      ],
    };

    console.log(paramaters);

    const responses = await fetchWeatherApi(this.ARCHIVE_URL, paramaters);

    return this.parseWeatherResponse(responses);
  }

  parseWeatherResponse(responses: any): WeatherItem[] {
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
      const item: WeatherItem = {
        time: weatherDataHourly.time[i],
        temperature: weatherDataHourly.temperature2m[i],
        humidity: weatherDataHourly.relativeHumidity2m[i],
        weatherState: parseWeatherCode(weatherDataHourly.weatherCode[i]),
        surfacePressure: weatherDataHourly.surfacePressure[i],
      };

      weatherItems.push(item);
    }

    return weatherItems;
  }

  formatDateParameter(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
}
