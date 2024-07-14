import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value - minutes * 60;
    const minutesString = minutes < 10 ? '0' + minutes : minutes;
    const secondsString = seconds < 10 ? '0' + seconds : seconds;
    return `${minutesString}:${secondsString}`;
  }
}
