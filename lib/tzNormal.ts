import { TzGeometry, Options } from './tz';
import { Mesh } from "three";
import { generateGeometry } from './generateGeometry';

export class TzIrregularGeometry extends TzGeometry {
    readonly points: number[][];
    readonly facets: number[];
    readonly normals: number[][];
    private userData: Options;
    ///transform: [offsetX, offsetY, offsetZ, depth, rotate, axisX, axisY, axisZ]
    ///convex:[type, ...data]
    constructor(id: number | string, points: number[][], facets: number[], normals: number[][], color: string, options: Options) {
        super(id, color, options);
        this.userData = options;
        this.points = points;
        this.facets = facets;
        this.normals = normals;
    }

    get mesh() {
        const geometry = generateGeometry(this.points, this.facets, this.normals);

        // 坐标系变换
        geometry.applyMatrix4(this.matrix);

        // 经纬度变换
        geometry.rotateY(-this.lat / 180 * Math.PI);
        geometry.rotateZ(this.lon / 180 * Math.PI);

        const mesh = new Mesh(geometry, this.getMaterial());
        mesh.userData = this.userData;
        //默认name
        mesh.name = `${this.id}`;
        return mesh;
    }

}
