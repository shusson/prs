import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MapdService } from './mapd.service';
import { CrossfilterService } from './cf.service';

import '@mapd/mapdc/dist/mapdc.js';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MapdService, CrossfilterService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    show = false;

}
