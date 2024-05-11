import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { HeatIndexComponent } from '../../components/heat-index/heat-index.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TabViewModule, ButtonModule, CardModule, HeatIndexComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
