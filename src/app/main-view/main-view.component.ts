import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {IGridData, IGridElement, IChartData} from './main-view.component.models';
import {UploadEvent, FileSystemFileEntry, UploadFile} from 'ngx-file-drop';
import {MatSnackBar} from '@angular/material/snack-bar';

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

    constructor(
        private _matSnackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
    }

    /**
     * Executes when file has been dropped
     */
    public async onFileDropped(event: UploadEvent): Promise<void> {

        // Checking files
        const files: UploadFile[] = event.files.filter(v => v.fileEntry.isFile);

        // Two files required
        if (files.length !== 2) {
            this._showErrorSnackBar('You need to drag two files at one time');
            return;
        }

        // 'times.txt' and 'distances.txt' check
        if (
            !files.find(v => v.fileEntry.name === 'times.txt') ||
            !files.find(v => v.fileEntry.name === 'distances.txt')
        ) {
            this._showErrorSnackBar(`You need to drag one file called 'times.txt' and second called 'distances.txt'`);
            return;
        }

        // Parsing times and distances
        const [distances, times] = await Promise.all([
            files.find(v => v.fileEntry.name === 'distances.txt'),
            files.find(v => v.fileEntry.name === 'times.txt')
        ].map(fileUpload => new Promise(r => (fileUpload.fileEntry as FileSystemFileEntry).file(file => {
            const reader = new FileReader();
            reader.onload = (evt: ProgressEvent) => r(((evt.target as FileReader).result as string)
                .split('\n')
                .map(v => Number(v))
            );
            reader.readAsText(file);
        })))) as [number[], number[]];

        // Checking lengths
        if (distances.length !== times.length) {
            this._showErrorSnackBar('There need to be same amount of data in distances.txt and times.txt file');
            return;
        }

        // Checking is something is not a number
        if (distances.filter(v => isNaN(v)).length > 0) {
            this._showErrorSnackBar('distances.txt contains not number values');
            return;
        }
        if (times.filter(v => isNaN(v)).length > 0) {
            this._showErrorSnackBar('times.txt contains not number values');
            return;
        }

        // Init view
        this._initView(distances, times);

    }


    /**
     * Inits view
     * @param distances Distances data
     * @param times Times data
     */
    private _initView(distances: number[], times: number[]): void {

        // Creating grid data
        this.gridData = this._generateGridData(times, distances);

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
            data: this._calculateSpeed(times, distances).map((v, i) => ({
                time: times[i],
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
            extractColumnPropertyNames: columns => columns.map(v => v.propertyName)
        };
    }

    /**
     * Calculates speed
     * http://matlablog.ont.com.pl/rozniczkowanie-numeryczne-czyli-nie-taka-straszna-pochodna/
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

    /**
     * Shows error
     */
    private _showErrorSnackBar(message: string): void {
        this._matSnackBar.open(
            message,
            'Error',
            {duration: 2000}
        );
    }

}
