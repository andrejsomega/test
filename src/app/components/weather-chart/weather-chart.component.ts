import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { WeatherItem } from '../../types/weather.type';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './weather-chart.component.html',
  styleUrl: './weather-chart.component.scss',
})
export class WeatherChartComponent {
  isHistoryMode: boolean = false;
  rangeDates: Date[] | undefined;
  weatherItems: WeatherItem[] = [];

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
}
