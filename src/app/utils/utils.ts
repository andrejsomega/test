import { WeatherState } from '../types/weather.type';
import { WEATHER_CODES_MAP } from './constants';

export function parseWeatherCode(weatherCode: number): WeatherState | null {
  const desc = WEATHER_CODES_MAP.get(weatherCode.toString());

  if (desc !== undefined && desc !== null) {
    return {
      code: weatherCode,
      description: desc,
    };
  }
  return {
    code: weatherCode,
    description: "",
  };
}

export function formatDateTimeMinutes(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function formatDecimalNumber(
  number: number,
  decimalPlaces: number,
  grouping: boolean
) {
  let formattedNumber = number.toFixed(decimalPlaces);

  if (grouping) {
    formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return formattedNumber;
}
