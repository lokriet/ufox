import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: string, highlightString: string): string {
    if (highlightString && highlightString.length > 0 && value.toLowerCase().includes(highlightString.toLowerCase())) {
      // value.replace(highlightString, `<&lt;>span class="highlight"&gt;${highlightString}&lt;/span&gt;`);

      // const esc = highlightString.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // const esc = highlightString.toLowerCase();

      const reg = new RegExp(`(${highlightString})`, 'ig');
      return value.replace(reg, `<span class="highlight">$1</span>`);
    }
    return value;

    // See https://stackoverflow.com/questions/7313395/case-insensitive-replace-all
    // See http://stackoverflow.com/a/3561711/556609
  }

}
