import { MeshBasicMaterial, Vector3, Matrix4, Mesh, Object3D, Group } from "three";
import { once } from "ramda";

export interface Options {
    lon: number,
    lat: number,
    type: string,
}

export interface Hook {
    (v: Mesh): void;
}

export enum TzType { TYPE_EXTRUDE = 1, TYPE_PIPE = 8, TYPE_NORMAL = 2, TYPE_BUFFERED = 3, TYPE_CYLINDER = 4 }


type OnAfterLoad = (mesh: Mesh | Group) => void;

export abstract class TzGeometry {

    readonly id: number | string;
    readonly color: number;
    readonly type: string;
    readonly lon: number;
    readonly lat: number;
    readonly matrix: Matrix4;
    materialClass: any;

    protected _onAfterLoad?: OnAfterLoad;

    __afterMeshMade__: boolean = false;
    static onAfterMeshMade: Hook;

    constructor(id: string | number, color: string, options: Options) {
        this.id = id;
        this.color = parseInt(color, 16);
        this.materialClass = MeshBasicMaterial;

        this.lon = options.lon || 0;
        this.lat = options.lat || 0;
        this.type = options.type || 'three';

        let newAxisX, newAxisY, newAxisZ;
        switch (this.type) {
            case 'three': {
                newAxisX = new Vector3(1, 0, 0);
                newAxisY = new Vector3(0, 0, -1);
                break;
            }
            case 'cesium': {
                newAxisX = new Vector3(0, 1, 0);
                newAxisY = new Vector3(0, 0, 1);
                break;
            }
            default: {
                newAxisX = new Vector3(1, 0, 0);
                newAxisY = new Vector3(0, 1, 0);
                break;
            }
        }
        newAxisZ = newAxisX.clone().cross(newAxisY);

        // arcgis用坐标系
        // let newAxisX = new Vector3(0, 1, 0);
        // let newAxisY = new Vector3(0, 0, 1);
        // let newAxisZ = newAxisX.clone().cross(newAxisY);
        // three用坐标系

        this.matrix = new Matrix4();
        this.matrix.makeBasis(newAxisX, newAxisY, newAxisZ);

    }

    abstract get mesh(): Object3D;

    public set onAfterLoad(fn: OnAfterLoad) {
        this._onAfterLoad = once(fn);
    }

    getMaterial(color?: number) {
        return color ? new this.materialClass({ color }) : new this.materialClass({ color: this.color });
    }

    static createInstance<T extends TzGeometry>(instance: T) {
        return new Proxy(instance, {
            get(target, name) {
                const value = Reflect.get(target, name);
                if (name === 'mesh' && !target.__afterMeshMade__) {
                    target.__afterMeshMade__ = true;
                    TzGeometry.onAfterMeshMade(value);
                }
                return value;
            },
            set(target, p, value) {
                return Reflect.set(target, p, value);
            },
        })
    }

}