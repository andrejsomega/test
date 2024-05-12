import { Component, Input, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { WeatherItem } from '../../types/weather.type';
import { formatDateTimeMinutes } from '../../utils/utils';

@Component({
  selector: 'app-weather-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './weather-chart.component.html',
  styleUrl: './weather-chart.component.scss',
})
export class WeatherChartComponent {
  @Input() weatherItems: WeatherItem[] = [];

  chartData: any[] = [];

  data: any;

  options: any;

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Temperature',
          },
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weatherItems']) {
      const documentStyle = getComputedStyle(document.documentElement);

      this.data = {
        labels: this.weatherItems.map((item) =>
          formatDateTimeMinutes(item.time)
        ),
        datasets: [
          {
            label: 'Temperatures',
            data: this.weatherItems.map((item) => item.temperature),
            fill: false,
            borderColor: documentStyle.getPropertyValue('--blue-500'),
            tension: 0.4,
          },
        ],
      };

      console.log('Chart data changed', this.data);
    }
  }
}
