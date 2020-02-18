import { Vector3, Geometry, LineBasicMaterial, Line } from "three";

export function drawLine(s: Vector3, e: Vector3, c: number) {
    let geometry = new Geometry();

    geometry.vertices.push(s, e);

    let material = new LineBasicMaterial({
        linewidth: 100,
        color: c
    });
    return new Line(geometry, material);
}
