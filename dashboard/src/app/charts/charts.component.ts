import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MapdService } from '../mapd.service';
import { CrossfilterService } from '../cf.service';

const MAPD_TABLE = 'prs';
const TIME_BOUNDS = [new Date('2012-01-01T00:00:00'), new Date('2018-01-01T00:00:00')];
const MARGINS = {left: 60, right: 10, top: 10, bottom: 30 };
const LARGE_WIDTH = window.innerWidth / 1.4;
const LARGE_HEIGHT = 180;
const SMALL_WIDTH = 270;
const SMALL_HEIGHT = 320;
const PIE_WIDTH = 200;
const PIE_HEIGHT = 200;
const INNER_RADIUS = 30;

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
    actors: any;
    lang: any;
    merged: any;
    records: any;
    org: any;
    langBubble: any;

    error = '';
    loading = true;

    toolBarStyle = {'width': `${LARGE_WIDTH}px`};
    largeChartStyle = {'width': `${LARGE_WIDTH}px`, 'height': `${LARGE_HEIGHT}px`};
    smallChartStyle = {'width': `${SMALL_WIDTH}px`, 'height': `${SMALL_HEIGHT}px`};
    pieChartStyle = {'width': `${PIE_WIDTH}px`, 'height': `${PIE_HEIGHT}px`};

    constructor(private cd: ChangeDetectorRef,
                private mapd: MapdService,
                public cf: CrossfilterService) {
    }


    ngOnInit() {
        this.initialise().then(() => {
            this.cd.detectChanges();
        }).catch((e) => {
            console.error(e);
            this.error = 'Oh no! Something bad happened check the console';
            this.cd.detectChanges();
        });
    }

    initialise() {
        return this.mapd.connect().then((session) => {
            return this.cf.create(session, MAPD_TABLE).then((x: any) => {
                this.setupCharts(x);
                return dc.renderAllAsync();
            });
        });
    }

    setupCharts(x) {
        this.loading = true;

        const langDim = x.dimension('lang');
        const langBubbleDim = x.dimension('lang');
        const recordsDim = x.dimension('created_at');
        const actorsDim = x.dimension('actor');
        const mergedDim = x.dimension('merged');
        const orgDim = x.dimension('org');

        const countGroup = x.groupAll();
        dc.countWidget(".count")
            .dimension(x)
            .group(countGroup);

        this.lang = dc.rowChart('#lang')
            .width(SMALL_WIDTH)
            .height(SMALL_HEIGHT)
            .cap(20)
            .elasticX(true)
            .othersGrouper(false)
            .dimension(langDim)
            .margins({left: 10, right: 10, top: 10, bottom: 30})
            .group(langDim.group().reduceCount());
        this.lang.xAxis().ticks(2);

        this.org = dc.rowChart('#org')
            .width(SMALL_WIDTH)
            .height(SMALL_HEIGHT)
            .cap(20)
            .elasticX(true)
            .othersGrouper(false)
            .dimension(orgDim)
            .margins({left: 10, right: 10, top: 10, bottom: 30})
            .group(orgDim.group().reduceCount());
        this.org.xAxis().ticks(2);

        this.actors = dc.rowChart('#actors')
            .width(SMALL_WIDTH)
            .height(SMALL_HEIGHT)
            .cap(20)
            .elasticX(true)
            .othersGrouper(false)
            .dimension(actorsDim)
            .margins({left: 10, right: 10, top: 10, bottom: 30})
            .group(actorsDim.group().reduceCount());
        this.actors.xAxis().ticks(2);

        this.merged = dc.pieChart('#merged')
            .width(PIE_WIDTH)
            .height(PIE_HEIGHT)
            .innerRadius(INNER_RADIUS)
            .slicesCap(20)
            .othersGrouper(false)
            .dimension(mergedDim)
            .group(mergedDim.group().reduceCount());

        this.records = dc.barChart('#records')
            .width(LARGE_WIDTH)
            .height(LARGE_HEIGHT)
            .x(d3.time.scale.utc().domain(TIME_BOUNDS))
            .brushOn(true)
            .elasticY(true)
            .elasticX(true)
            .margins(MARGINS)
            .xAxisLabel('Created At')
            .yAxisLabel('Events')
            .dimension(recordsDim)
            .renderLabel(false)
            .group(recordsDim.group().reduceCount())
            .binParams({
                numBins: 300,
                binBounds: TIME_BOUNDS
            });

        this.records.prepareLabelEdit = () => {
        };

        this.records.xAxis().scale(this.records.x()).orient('bottom');


        const langReduce = [{
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

        const langBubbleGroup = langBubbleDim
            .group()
            .reduce(langReduce)
            .order("size");

        const popup = [
            {type: "dimension", label: 'language'},
            {type: "measure", label: 'avg additions', alias: 'x'},
            {type: "measure", label: 'avg deletions', alias: 'y'},
            {type: "measure", label: 'records', alias: 'size'},
        ];

        this.langBubble = dc.bubbleChart('#lang-bubble')
            .width(LARGE_WIDTH)
            .height(LARGE_HEIGHT)
            .renderHorizontalGridLines(true)
            .renderVerticalGridLines(true)
            .margins(MARGINS)
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
            .colorAccessor(function (d) {
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
