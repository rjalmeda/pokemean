import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(input: string | null | undefined): string {
    return input ? input.charAt(0).toUpperCase() + input.slice(1).toLowerCase() : '';
  }
}
