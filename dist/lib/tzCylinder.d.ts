import { TzGeometry, Options } from './tz';
import { Object3D } from "three";
export declare class TzCylinderGeometry extends TzGeometry {
    points: number[][];
    diameter: number;
    length: number;
    userData: any;
    static lod: number;
    constructor(id: number | string, points: number[][], diameter: number, length: number, color: string, options: Options);
    get mesh(): Object3D;
    static from(ids: number[], points: number[][], diameter: number, length: number, colors: string | string[], options: Options): TzCylinderGeometry[];
}
