import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HeatIndexComponent } from '../../components/heat-index/heat-index.component';
import { WeatherComponent } from '../../components/weather/weather.component';
import { WeatherChartComponent } from '../../components/weather-chart/weather-chart.component';
import { WeatherItem } from '../../types/weather.type';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TabViewModule,
    ButtonModule,
    CardModule,
    WeatherComponent,
    WeatherChartComponent,
    HeatIndexComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  weatherItems: WeatherItem[] = [];

  onWeatherItemsValueChange(items: WeatherItem[]) {
    this.weatherItems = items;
  }
}
