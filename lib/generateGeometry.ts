import { times, compose, unnest, map, splitEvery } from "ramda";
import { Vector3, Face3, Geometry, Vector2, BufferGeometry } from "three";
import { assignUVs } from "./assignUV";

export function generateGeometry(inPoints: number[][], inFacets: number[], inNormals: number[][]) {
    let expand = (arr: number[]) => times(() => new Vector3(arr[1], arr[2], arr[2]), arr[0]);
    let expandNormals = compose(unnest, map(expand));

    let getVertices = map((point: number[]) => new Vector3(...point));
    let getFacets = (normals: Vector3[]) => compose(map((facet: number[]) => new Face3(facet[0], facet[1], facet[2], normals[facet[0]])), splitEvery(3));
    let getFaces = compose(getFacets, expandNormals);

    const geometry = new Geometry();
    // geometry.uvsNeedUpdate = true;
    // geometry.verticesNeedUpdate = true;
    // geometry.normalsNeedUpdate = true;

    geometry.faces.push(...getFaces(inNormals)(inFacets))
    geometry.vertices.push(...getVertices(inPoints));

    let assign = (uv: Vector2[]) => map((face: Face3) => [uv[face.a], uv[face.b], uv[face.c]]);
    let assignUV = compose(assign, assignUVs);
    geometry.faceVertexUvs[0] = assignUV(inPoints)(geometry.faces);
    return new BufferGeometry().fromGeometry(geometry);
};