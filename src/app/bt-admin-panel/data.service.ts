import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharingDataService {
    private ActiveSub = new BehaviorSubject<boolean>(false);
    Activedata = this.ActiveSub.asObservable();

    changeSub(message: boolean) {
        this.ActiveSub.next(message);
        console.log(message);
    }
}
