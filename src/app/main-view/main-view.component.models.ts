// Imports
import {MatTableDataSource} from '@angular/material/table';

// Grid element data
export interface IGridElement {
    no: number;
    time: number;
    distance: number;
}

// Grid column interface
export interface IGridColumn {
    displayName: string;
    propertyName: keyof IGridElement;
}

// Grid data interface
export interface IGridData {
    columns: IGridColumn[];
    data: MatTableDataSource<IGridElement>;
    extractColumnPropertyNames: (gridColumns: IGridColumn[]) => string[];
}

// Chart axis item interface
interface IChartAxisItem {
    titleText: string;
    labelFormat: string;
}

// Chart data interface
export interface IChartData<T extends object> {
    data: T[];
    xField: keyof T;
    yField: keyof T;
    xAxisItem: IChartAxisItem;
    yAxisItem: IChartAxisItem;
    tooltipFormat: string;
}
