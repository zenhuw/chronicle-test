import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullname',
  standalone: true
})
export class FullnamePipe implements PipeTransform {
  transform(name: string, firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
  }
}
