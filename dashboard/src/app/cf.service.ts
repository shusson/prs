import { Injectable, OnDestroy } from '@angular/core';
import * as crossfilter from '@mapd/crossfilter/dist/mapd-crossfilter.js';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class CrossfilterService {
    x: any;
    all: any;

    constructor() {
    }

    create(session: any, name): Promise<any> {
        return crossfilter.crossfilter(session, name).then((cf) => {
            this.x = cf;
            this.all = this.x.groupAll();
            return this.x;
        });
    }
}
