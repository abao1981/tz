import { Vector2 } from "three";
import { reduce, max, min, map, apply } from "ramda";


let getMaxMin = reduce((acc: number[], curr: number[]) =>
    isNaN(acc[0]) ? [curr[0], curr[0], curr[1], curr[1]] : [
        max(curr[0], acc[0]),
        min(curr[0], acc[1]),
        max(curr[1], acc[2]),
        min(curr[1], acc[3]),
    ], [NaN, NaN, NaN, NaN]);


let _assignUV = (maxU: number, minU: number, maxV: number, minV: number) => 
    map((uv: number[]) => new Vector2((uv[0] - minU) / (maxU - minU), (uv[1] - minV) / (maxV - minV)));

export const assignUVs = (points: number[][]): Vector2[] => 
    apply(_assignUV, getMaxMin(points))(points)

