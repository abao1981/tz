import { Matrix4, Mesh, Object3D, Group } from "three";
export interface Options {
    lon: number;
    lat: number;
    type: string;
}
export interface Hook {
    (v: Mesh): void;
}
export declare enum TzType {
    TYPE_EXTRUDE = 1,
    TYPE_PIPE = 8,
    TYPE_NORMAL = 2,
    TYPE_BUFFERED = 3,
    TYPE_CYLINDER = 4
}
declare type OnAfterLoad = (mesh: Mesh | Group) => void;
export declare abstract class TzGeometry {
    readonly id: number | string;
    readonly color: number;
    readonly type: string;
    readonly lon: number;
    readonly lat: number;
    readonly matrix: Matrix4;
    materialClass: any;
    protected _onAfterLoad?: OnAfterLoad;
    __afterMeshMade__: boolean;
    static onAfterMeshMade: Hook;
    constructor(id: string | number, color: string, options: Options);
    abstract get mesh(): Object3D;
    set onAfterLoad(fn: OnAfterLoad);
    getMaterial(color?: number): any;
    static createInstance<T extends TzGeometry>(instance: T): T;
}
export {};
