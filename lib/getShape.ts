import { Shape, EllipseCurve } from "three";
import { max } from "ramda";


export function getShape(vertices: any[], inner: boolean = true, lod: number = 5) {
    let type = vertices[0];
    // isArrayOfArray(vertices)
    const shape = new Shape();
    if (type === 1) {
        shape.moveTo(vertices[1], vertices[2]);
        for (let i = 3; i < vertices.length; i += 2) {
            shape.lineTo(vertices[i], vertices[i + 1]);
        }
        shape.closePath();
        return shape;
    } else if (type === 2) {
        const [_, radius, x, y] = vertices;
        const shape = new EllipseCurve(x, y, radius, radius, 0, 2 * Math.PI, inner, 0);
        return new Shape(shape.getPoints(2 ** max(lod, 5)));
    } else {
        shape.moveTo(vertices[1][1], vertices[1][2]);
        shape.autoClose = false;
        for (let i = 1; i < vertices.length; i++) {
            const [t, x1, y1, cx, cy, r, s, e, ccw] = vertices[i];
            //x1,y1,x2,y2...
            //[1,x1,y1],[1,x2,y2],[2,x3,y3,cx, cy, r, s, e, clockwise],[1,x4,y4]....
            if (t === 2) {
                shape.absarc(cx, cy, r, s, e, ccw === 1);
            } else {
                shape.lineTo(x1, y1);
            }
        }
        return shape;
    }
};
