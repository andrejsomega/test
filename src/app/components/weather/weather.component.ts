import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() weatherItemsValueChange: EventEmitter<WeatherItem[]> =
    new EventEmitter<WeatherItem[]>();

  isHistoryMode: boolean = false;
  rangeDates: Date[] = [];
  weatherItems: WeatherItem[] = [];
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
    if (!this.isHistoryMode) {
      this.fetchAndProcessForecast();
    }
  }

  fetchAndProcessForecast() {
    this.weatherService
      .fetchHourlyForecast()
      .then((items) => {
        this.weatherItems = items;

        console.log('New forecast items', items);
        this.weatherItemsValueChange.emit(this.weatherItems);
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

        console.log('New history items', items);
        this.weatherItemsValueChange.emit(this.weatherItems);
      })
      .catch((error) =>
        console.error('Error occured while fetching historical data', error)
      );
  }
}
