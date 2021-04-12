import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {}
  loader: Subject<boolean> = new Subject();

  private isLoading: boolean = false;

  set setIsLoading(index: boolean) {
    this.isLoading = index;
    this.loader.next(index);
  }

  get setIsLoading() {
    return this.isLoading;
  }
}
