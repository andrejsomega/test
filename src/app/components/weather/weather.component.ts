import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { WeatherItem } from '../../types/weather.type';
import { formatDateTimeMinutes, formatDecimalNumber } from '../../utils/utils';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    ButtonModule,
    TableModule,
    FormsModule,
    InputSwitchModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    CalendarModule,
    NgIf,
  ],
  providers: [WeatherService],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit {
  isHistoryMode: boolean = false;
  rangeDates: Date[] | undefined;
  weatherItems: WeatherItem[] = [];
  formattedWeatherItems: any[] = [];
  today = new Date();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.fetchAndProcessForecast();
  }

  formatTime(date: Date) {
    return formatDateTimeMinutes(date);
  }

  formatNumber(number: number, decimalPlaces: number, grouping: boolean) {
    return formatDecimalNumber(number, decimalPlaces, grouping);
  }

  onDateRangeSelect(event: any) {
    console.log('Range selected', this.rangeDates);
    if (
      this.isHistoryMode &&
      this.rangeDates !== undefined &&
      this.rangeDates !== null &&
      this.rangeDates[0] !== null &&
      this.rangeDates[1] !== null
    ) {
      this.fetchAndProcessHistoricalData(
        this.rangeDates[0],
        this.rangeDates[1]
      );
    }
  }

  onToggleHistory(event: any) {
    console.log('History changed', this.isHistoryMode);
    if (!this.isHistoryMode) {
      this.fetchAndProcessForecast();
    }
  }

  fetchAndProcessForecast() {
    this.weatherService
      .fetchHourlyForecast()
      .then((items) => {
        this.weatherItems = items;
        this.formattedWeatherItems = items.map((item) => {
          return {
            time: this.formatTime(item.time),
            weatherStatus: item.weatherState,
            temperature: this.formatNumber(item.temperature, 1, true),
            surfacePressure: this.formatNumber(item.temperature, 1, true),
            humidity: this.formatNumber(item.humidity, 1, true),
          };
        });

        console.log(this.formattedWeatherItems);
      })
      .catch((error) =>
        console.error('Error occured while fetching weathed data', error)
      );
  }

  fetchAndProcessHistoricalData(dateFrom: Date, dateTo: Date) {
    this.weatherService
      .fetchHourlyHistoricalData(dateFrom, dateTo)
      .then((items) => {
        this.weatherItems = items;
        this.formattedWeatherItems = items.map((item) => {
          return {
            time: this.formatTime(item.time),
            weatherStatus: item.weatherState,
            temperature: this.formatNumber(item.temperature, 1, true),
            surfacePressure: this.formatNumber(item.temperature, 1, true),
            humidity: this.formatNumber(item.humidity, 1, true),
          };
        });

        console.log(this.formattedWeatherItems);
      })
      .catch((error) =>
        console.error('Error occured while fetching historical data', error)
      );
  }
}
