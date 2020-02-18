import { TzGeometry, Options } from './tz';
import { Mesh } from "three";
export declare class TzIrregularGeometry extends TzGeometry {
    readonly points: number[][];
    readonly facets: number[];
    readonly normals: number[][];
    private userData;
    constructor(id: number | string, points: number[][], facets: number[], normals: number[][], color: string, options: Options);
    get mesh(): Mesh;
}
