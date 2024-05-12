import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { WeatherItem } from '../../types/weather.type';
import { formatDateTimeMinutes, formatDecimalNumber } from '../../utils/utils';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [ButtonModule, TableModule, FormsModule, InputSwitchModule, NgIf],
  providers: [WeatherService],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent implements OnInit {
  weatherItems: WeatherItem[] = [];
  isHistoryMode: boolean = false;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService
      .fetchHourlyForecast()
      .then((items) => {
        this.weatherItems = items;
      })
      .catch((error) =>
        console.error('Error occured while fetching weathed data', error)
      );
  }

  buttonClicked() {
    console.log('Get weather forecast');
    this.weatherService.fetchHourlyForecast().then(() => console.log('done'));
  }

  formatTime(date: Date) {
    return formatDateTimeMinutes(date);
  }

  formatNumber(number: number, decimalPlaces: number, grouping: boolean) {
    return formatDecimalNumber(number, decimalPlaces, grouping);
  }
}
