import { Pipe, PipeTransform } from '@angular/core';

/** Converts minutes (e.g. 129) to "2h 9m" */
@Pipe({ name: 'runtime', standalone: true })
export class RuntimePipe implements PipeTransform {
  transform(minutes: number): string {
    if (!minutes || minutes <= 0) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }
}
