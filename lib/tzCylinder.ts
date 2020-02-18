import { TzGeometry, Options } from './tz';
import { LineCurve3, TubeGeometry, Mesh, Vector3, Object3D, TubeBufferGeometry } from "three";
import { isArray } from './utils';

export class TzCylinderGeometry extends TzGeometry {

    points: number[][];
    diameter: number;
    length: number;
    userData: any;
    static lod: number = 8;

    constructor(id: number | string, points: number[][], diameter: number, length: number, color: string, options: Options) {
        super(id, color, options);
        this.userData = options;
        this.points = points;
        this.diameter = diameter;
        this.length = length;
    }

    get mesh(): Object3D {
        let [startP, endP] = this.points.map(arr => new Vector3(...arr));

        let path = startP.z < endP.z ? new LineCurve3(endP, startP) : new LineCurve3(startP, endP);

        let geometry = new TubeBufferGeometry(path, 2, this.diameter / 2, TzCylinderGeometry.lod, true);
        // 坐标系变换
        geometry.applyMatrix4(this.matrix);

        // 经纬度变换
        geometry.rotateY(-this.lat / 180 * Math.PI);
        geometry.rotateZ(this.lon / 180 * Math.PI);

        let mesh = new Mesh(geometry, this.getMaterial());
        mesh.userData = this.userData;
        mesh.name = `${this.id}`;
        return mesh;
    }

    static from(ids: number[], points: number[][], diameter: number, length: number, colors: string | string[], options: Options): TzCylinderGeometry[] {
        let objects: TzCylinderGeometry[] = [];
        for (let i = 0; i < ids.length; i += 2) {
            let startP = points[i];
            let endP = points[i + 1];
            let id = ids[i / 2];
            let color: string = isArray(colors) ? colors[i / 2] : <string>colors;
            objects.push(new TzCylinderGeometry(id, [startP, endP], diameter, length, color, options));
        }
        return objects;
    }
}