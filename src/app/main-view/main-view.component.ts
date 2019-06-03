import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {IGridData, IGridElement, IChartData} from './main-view.component.models';
import {DISTANCES} from '../mocked-data/distances';
import {TIMES} from '../mocked-data/times';


@Component({
    selector: 'app-main-view',
    templateUrl: './main-view.component.html',
    styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

    // Grid data
    public gridData: IGridData;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    // Distance chart data
    public distanceChartData: IChartData<{ time: number, distance: number }>;

    // Speed chart data
    public speedChartData: IChartData<{ time: number, speed: number }>;

    constructor() {
    }

    ngOnInit() {

        // Creating grid data
        this.gridData = this._generateGridData(TIMES, DISTANCES);

        // Creating distance chart data
        this.distanceChartData = {
            data: this.gridData.data.data.map(v => ({
                time: v.time,
                distance: v.distance
            })),
            xField: 'time',
            yField: 'distance',
            xAxisItem: {
                titleText: 'Time',
                labelFormat: '{0}h',
            },
            yAxisItem: {
                titleText: 'Distance',
                labelFormat: '{0}km',
            },
            tooltipFormat: '{1}km in {0} hours',
        };

        // Creating speed chart data
        this.speedChartData = {
            data: this._calculateSpeed(TIMES, DISTANCES).map((v, i) => ({
                time: TIMES[i],
                speed: v
            })),
            xField: 'time',
            yField: 'speed',
            xAxisItem: {
                titleText: 'Time',
                labelFormat: '{0}h',
            },
            yAxisItem: {
                titleText: 'Speed',
                labelFormat: '{0}km/h',
            },
            tooltipFormat: '{1}km/h in {0} hour',
        };

    }

    /**
     * Generates grid data from given input
     * @param times Times to display
     * @param distances Distances to display
     */
    private _generateGridData(times: number[], distances: number[]): IGridData {
        // Creating data source
        const dataSource: MatTableDataSource<IGridElement> = new MatTableDataSource(times.map((timeValue, index) => ({
            no: index + 1,
            time: timeValue,
            distance: distances[index]
        })));
        dataSource.paginator = this.paginator;

        // Return statement
        return {
            columns: [
                {
                    displayName: 'No.',
                    propertyName: 'no'
                },
                {
                    displayName: 'Time in hours',
                    propertyName: 'time'
                },
                {
                    displayName: 'Distance in kilometers',
                    propertyName: 'distance'
                },
            ],
            data: dataSource,
            extractColumnPropertyNames: (columns) => columns.map(v => v.propertyName)
        };
    }

    /**
     * Calculates speed
     * @param x Time array
     * @param y Distance array
     */
    private _calculateSpeed(x: number[], y: number[]): number[] {

        const N: number = y.length;
        const speed: number[] = new Array(N).fill(1);
        speed[0] = (y[1] - y[0]) / (x[1] - x[0]);

        for (let i = 1; i < N - 1; i++) {
            speed[i] = (y[i + 1] - y[i - 1]) / (x[i + 1] - x[i - 1]);
        }

        speed[N - 1] = (y[N - 1] - y[N - 2]) / (x[N - 1] - x[N - 2]);

        return speed;

    }

}
