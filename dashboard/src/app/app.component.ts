import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { MapdService } from './mapd.service';
import { CrossfilterService } from './cf.service';

import '@mapd/mapdc/dist/mapdc.js';

const table = 'prs';
const timeBounds = [new Date('2012-01-01T00:00:00'), new Date('2017-06-01T00:00:00')];
const margins = {left: 60, right: 10, top: 10, bottom: 30 };

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MapdService, CrossfilterService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    actors: any;
    lang: any;
    merged: any;
    records: any;
    org: any;
    langBubble: any;

    LARGE_WIDTH = window.innerWidth / 1.4;
    LARGE_HEIGHT = 180;
    SMALL_WIDTH = 220;
    SMALL_HEIGHT = 200;
    INNER_RADIUS = 40;

    subscriptions: Subscription[] = [];
    error = '';
    loading = true;

    errors = new Subject<any>();

    toolBarStyle = {'width': `${this.LARGE_WIDTH}px`};
    largeChartStyle = {'width': `${this.LARGE_WIDTH}px`, 'height': `${this.LARGE_HEIGHT}px`};
    smallChartStyle = {'width': `${this.SMALL_WIDTH}px`, 'height': `${this.SMALL_HEIGHT}px`};

    constructor(private cd: ChangeDetectorRef,
                private mapd: MapdService,
                public cf: CrossfilterService) {

        this.subscriptions.push(this.errors.subscribe((e) => {
            console.error(e);
            this.error = 'Oh no! Something bad happened check the console';
            this.cd.detectChanges();
        }));
    }

    ngOnInit() {
        this.initialise().then(() => {
            this.cd.detectChanges();
        }).catch((e) => this.errors.next(e));
    }

    initialise() {
        return this.mapd.connect().then((session) => {
            return this.cf.create(session, table).then((x: any) => {
                this.setupCharts(x);
                return dc.renderAllAsync();
            });
        });
    }

    setupCharts(x) {
        this.loading = true;

        let langDim = x.dimension('lang');
        let langBubbleDim = x.dimension('lang');
        let recordsDim = x.dimension('created_at');
        let actorsDim = x.dimension('actor');
        let mergedDim = x.dimension('merged');
        let orgDim = x.dimension('org');

        let countGroup = x.groupAll();
        dc.countWidget(".count")
            .dimension(x)
            .group(countGroup);

        this.lang = dc.pieChart('#lang')
            .width(this.SMALL_WIDTH)
            .height(this.SMALL_HEIGHT)
            .innerRadius(this.INNER_RADIUS)
            .slicesCap(20)
            .othersGrouper(false)
            .dimension(langDim)
            .group(langDim.group().reduceCount());

        this.org = dc.pieChart('#org')
            .width(this.SMALL_WIDTH)
            .height(this.SMALL_HEIGHT)
            .innerRadius(this.INNER_RADIUS)
            .slicesCap(20)
            .othersGrouper(false)
            .dimension(orgDim)
            .group(orgDim.group().reduceCount());

        this.actors = dc.pieChart('#actors')
            .width(this.SMALL_WIDTH)
            .height(this.SMALL_HEIGHT)
            .innerRadius(this.INNER_RADIUS)
            .slicesCap(12)
            .othersGrouper(false)
            .dimension(actorsDim)
            .group(actorsDim.group().reduceCount());

        this.merged = dc.pieChart('#merged')
            .width(this.SMALL_WIDTH)
            .height(this.SMALL_HEIGHT)
            .innerRadius(this.INNER_RADIUS)
            .slicesCap(20)
            .othersGrouper(false)
            .dimension(mergedDim)
            .group(mergedDim.group().reduceCount());

        this.records = dc.barChart('#records')
            .width(this.LARGE_WIDTH)
            .height(this.LARGE_HEIGHT)
            .x(d3.time.scale.utc().domain(timeBounds))
            .brushOn(true)
            .elasticY(true)
            .elasticX(true)
            .margins(margins)
            .xAxisLabel('Created At')
            .yAxisLabel('Events')
            .dimension(recordsDim)
            .renderLabel(false)
            .group(recordsDim.group().reduceCount())
            .binParams({
                numBins: 200,
                binBounds: timeBounds
            });

        this.records.prepareLabelEdit = () => {
        };

        this.records.xAxis().scale(this.records.x()).orient('bottom');


        let langReduce = [{
                expression: "additions",
                agg_mode: "avg",
                name: "x"
            },
            {
                expression: "deletions",
                agg_mode: "avg",
                name: "y"
            },
            {
                expression: "*",
                agg_mode: "count",
                name: "size"
            }];

        let langBubbleGroup = langBubbleDim
            .group()
            .reduce(langReduce)
            .order("size");

        let popup = [
            {type: "dimension", label: 'language'},
            {type: "measure", label: 'avg additions', alias: 'x'},
            {type: "measure", label: 'avg deletions', alias: 'y'},
            {type: "measure", label: 'records', alias: 'size'},
        ];

        this.langBubble = dc.bubbleChart('#lang-bubble')
            .width(this.LARGE_WIDTH)
            .height(this.LARGE_HEIGHT)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .margins(margins)
            .cap(20)
            .othersGrouper(false)
            .keyAccessor(function (d) {
                return d.x;
            })
            .valueAccessor(function (d) {
                return d.y;
            })
            .radiusValueAccessor(function (d) {
                return d.size;
            })
            .colorAccessor(function(d) {
                return d.key0;
            })
            .maxBubbleRelativeSize(0.04)
            .transitionDuration(500)
            .xAxisLabel('Avg Additions')
            .yAxisLabel('Avg Deletions')
            .setPopupHeader(popup)
            .elasticX(true)
            .elasticY(true)
            .elasticRadius(true)
            .xAxisPadding('15%')
            .yAxisPadding('15%')
            .dimension(langBubbleDim)
            .group(langBubbleGroup);

        this.langBubble.prepareLabelEdit = () => {
        };

        this.langBubble.x(d3.scale.linear().domain(d3.extent(this.langBubble.data(), this.langBubble.keyAccessor())));
        this.langBubble.xAxis().scale(this.langBubble.x()).tickFormat(d3.format(".2s"));
        this.langBubble.y(d3.scale.linear().domain(d3.extent(this.langBubble.data(), this.langBubble.valueAccessor())));
        this.langBubble.r(d3.scale.linear().domain(d3.extent(this.langBubble.data(), this.langBubble.radiusValueAccessor())));

        this.loading = false;
    }

    clearFilters() {
        dc.filterAll();
        dc.redrawAllAsync();
    }
}
