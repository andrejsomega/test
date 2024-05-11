import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Button, ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { CommonModule, NgIf } from '@angular/common';

interface Unit {
  name: string;
  symbol: string;
}

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
    NgIf,
  ],
  templateUrl: './heat-index.component.html',
  styleUrl: './heat-index.component.scss',
})
export class HeatIndexComponent implements OnInit {
  units: Unit[] | undefined;

  formGroup!: FormGroup;

  ngOnInit() {
    this.units = [
      { name: 'Celsius', symbol: '°C' },
      { name: 'Farenheit', symbol: '°F' },
    ];

    this.formGroup = new FormGroup({
      temperature: new FormControl(null, [
        Validators.required,
        (c) => this.minTemperatureValidator(c),
      ]),
      unit: new FormControl<Unit | null>(this.units[0]),
      humidity: new FormControl(null, [Validators.required]),
    });

    this.formGroup.get('unit')?.valueChanges.subscribe((value) => {
      console.log('New unit value:', value);
      this.temperature.updateValueAndValidity();
    });
  }

  onSubmit() {
    console.warn(this.formGroup.value);
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

  minTemperatureValidator(control: AbstractControl): ValidationErrors | null {
    const temperature = this.temperature?.value;
    const unit = this.unit?.value;

    if (unit?.name == 'Celsius' && temperature < 26.7) {
      console.log('zle', temperature);
      return { minTemperatureC: true };
    } else if (unit?.name == 'Farenheit' && temperature < 80) {
      return { minTemperatureF: true };
    }
    return null;
  }
}
