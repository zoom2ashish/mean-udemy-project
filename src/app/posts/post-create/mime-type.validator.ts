import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

export const mimeType = (control: AbstractControl): Observable<ValidationErrors|null> => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }

  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs: Observable<ValidationErrors|null> = Observable.create((observer: Observer<ValidationErrors>) => {
    fileReader.addEventListener('loadend', () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
        case '89504e47':     // png
        case '47494638':     // gif
        case 'ffd8ffe0':     // jpg ...
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }

      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });

    fileReader.readAsArrayBuffer(file);
  });

  return frObs;
};
