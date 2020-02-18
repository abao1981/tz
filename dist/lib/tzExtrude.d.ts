import { Group } from 'three';
import { TzGeometry, Options } from './tz';
export declare class TzExtrudeGeometry extends TzGeometry {
    readonly transform: number[][];
    readonly convex: any;
    readonly holes: any[];
    readonly colors: number[];
    readonly solidCnt: number;
    readonly userData: Options;
    constructor(id: string | number, transform: number[], convex: any[], holes: number[][] | number[], color: string, options: Options);
    constructor(id: string | number, transform: number[][], convex: any[][], holes: number[][][] | number[], color: string[], options: Options);
    get mesh(): Group;
}
