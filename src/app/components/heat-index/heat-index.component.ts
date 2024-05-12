import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { NgIf } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { HeatIndexHistoryItem, Unit } from '../../types/heat-index.type';
import { formatDateTimeMinutes } from '../../utils/utils';
import { TEMPERATURE_UNITS } from '../../utils/constants';

@Component({
  selector: 'app-heat-index',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    NgIf,
  ],
  providers: [LocalStorageService],
  templateUrl: './heat-index.component.html',
  styleUrl: './heat-index.component.scss',
})
export class HeatIndexComponent implements OnInit {
  units: Unit[] | undefined;

  formGroup!: FormGroup;

  heatIndex: string | undefined;

  heatIndexHistory!: HeatIndexHistoryItem[];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.units = TEMPERATURE_UNITS;

    this.formGroup = new FormGroup({
      temperature: new FormControl(null, [
        Validators.required,
        (c) => this.minTemperatureValidator(c),
      ]),
      unit: new FormControl<Unit | null>(this.units[0]),
      humidity: new FormControl(null, [Validators.required]),
    });

    this.heatIndexHistory = this.localStorageService.getHeatIndexHistory();

    this.formGroup.get('unit')?.valueChanges.subscribe((value) => {
      this.temperature.updateValueAndValidity();
    });
  }

  onSubmit() {
    const rh = this.humidity.value;
    const t = this.getSelectedTempInFahrenheit();

    this.heatIndex = (
      -42.379 +
      2.04901523 * t +
      10.14333127 * rh -
      0.22475541 * t * rh -
      (6.83783 ^ (3 * 10) ^ (-3 * t) ^ -2) -
      ((5.481717 * 10) ^ (-2 * rh) ^ 2) +
      ((1.22874 * 10) ^ (-3 * t) ^ (2 * rh)) +
      ((8.5282 * 10) ^ (4 * t * rh) ^ 2) -
      ((1.99 * 10) ^ (-6 * t) ^ (2 * rh) ^ 2)
    ).toFixed(0);

    const newHeatIndex = {
      date: new Date(),
      heatIndex: parseInt(this.heatIndex),
    };
    this.heatIndexHistory.unshift(newHeatIndex);
    this.localStorageService.saveHeatIndex(newHeatIndex);
  }

  get temperature() {
    return this.formGroup?.get('temperature')!;
  }

  get unit() {
    return this.formGroup?.get('unit')!;
  }

  get humidity() {
    return this.formGroup?.get('humidity')!;
  }

  getSelectedTempInFahrenheit() {
    return this.unit.value.name == 'Celsius'
      ? 1.8 * this.temperature.value + 32
      : this.temperature.value;
  }

  minTemperatureValidator(control: AbstractControl): ValidationErrors | null {
    const temperature = this.temperature?.value;
    const unit = this.unit?.value;

    if (unit?.name == 'Celsius' && temperature < 26.7) {
      return { minTemperatureC: true };
    } else if (unit?.name == 'Fahrenheit' && temperature < 80) {
      return { minTemperatureF: true };
    }
    return null;
  }

  formatTime(date: Date) {
    return formatDateTimeMinutes(date);
  }
}
