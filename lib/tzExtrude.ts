import { Mesh, Group, Vector3, Matrix4, ExtrudeBufferGeometry } from 'three';
import { TzGeometry, Options } from './tz';
import { isArrayOfArray } from "./utils";
import { getShape } from "./getShape";

export class TzExtrudeGeometry extends TzGeometry {

    readonly transform: number[][];
    readonly convex: any;
    readonly holes: any[];
    readonly colors: number[];
    readonly solidCnt: number;

    readonly userData: Options;

    constructor(id: string | number, transform: number[], convex: any[], holes: number[][] | number[], color: string, options: Options)
    constructor(id: string | number, transform: number[][], convex: any[][], holes: number[][][] | number[], color: string[], options: Options)
    ///transform: [offsetX, offsetY, offsetZ, depth, rotate, axisX, axisY, axisZ]
    ///convex:[type, ...data]
    constructor(id: string | number, transform: any, convex: any, holes: any, color: any, options: Options) {
        super(id, color, options);
        this.userData = options;
        if (isArrayOfArray(transform)) {
            this.transform = transform;
            this.convex = convex;
            this.holes = holes;
            this.colors = color.map((c: string) => parseInt(c, 16));
            this.solidCnt = transform.length;
        } else {
            this.transform = [transform];
            this.convex = [convex];
            this.holes = [holes];
            this.colors = [parseInt(color, 16)];
            this.solidCnt = 1;
        }
    }

    get mesh() {
        let group = new Group();
        for (let i = 0; i < this.solidCnt; i++) {
            const [x, y, z, depth, rotate, axisX, axisY, axisZ] = this.transform[i];
            const axis = new Vector3(axisX, axisY, axisZ);//.applyMatrix4(this.matrix);

            const shape = getShape(this.convex[i], false);
            if (this.holes.length)
                shape.holes.push(...this.holes[i].map(getShape));

            const extrudeSettings = {
                depth: -depth,
                amount: -depth,
                bevelEnabled: false,
            };

            const geometry = new ExtrudeBufferGeometry(shape, extrudeSettings);
            const r = new Matrix4()
                .makeRotationAxis(axis, Math.PI / 180 * rotate)
                .premultiply(new Matrix4().makeTranslation(x, y, z));

            geometry.applyMatrix4(r);
            geometry.applyMatrix4(this.matrix);

            geometry.rotateY(-this.lat / 180 * Math.PI);
            geometry.rotateZ(this.lon / 180 * Math.PI);

            const mesh = new Mesh(geometry, new this.materialClass({ color: this.colors[i] }));
            mesh.name = `${this.id}`;
            group.add(mesh);
        }

        group.userData = this.userData;
        group.name = `${this.id}`;
        if (this._onAfterLoad) this._onAfterLoad(group);
        return group;
    }
    // static createInstance(lon: number, lat: number, id: number | string, transform: number[], convex: number[], holes: number[], color: string, options: Options): TzGeometry;
    // static createInstance(lon: number, lat: number, id: number | string, transform: number[][], convex: number[][], holes: number[][], color: string, options: Options): TzGeometry;
    // static createInstance(lon: number, lat: number, id: number | string, transform: any, convex: any, holes: any, color: string): TzGeometry {
    //     let options: Options = {
    //         lat: lat,
    //         lon: lon,
    //         type: 'mesh'
    //     };
    //     let ins = new TzExtrudeGeometry(id, transform, convex, holes, color, options);
    //     return TzGeometry.createInstance(<TzGeometry>ins);
    // }
}

