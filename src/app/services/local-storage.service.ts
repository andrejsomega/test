import { Injectable } from '@angular/core';
import { HeatIndexHistoryItem } from '../types/heat-index.type';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  public saveHeatIndex(heatIndex: HeatIndexHistoryItem) {
    const history = this.getHeatIndexHistory();

    console.log('History was', history);

    history.push(heatIndex);

    const newHistory = history.slice(-5);

    console.log('New history was', newHistory);

    localStorage.setItem('history', JSON.stringify(newHistory));
  }

  public getHeatIndexHistory(): HeatIndexHistoryItem[] {
    const historyString = localStorage.getItem('history');

    if (historyString !== undefined && historyString !== null) {
      const temp = JSON.parse(historyString) as any[];
      return temp.map((value) => {return {date: new Date(value.date), heatIndex: value.heatIndex}}).reverse();
    } else {
      return [];
    }
  }
}
