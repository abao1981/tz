import { Vector3 } from "three";
import { drawLine } from "./drawLine";

export interface Grid {
    ElementId: number,
    GridName: string,
    StartPos: number[],
    EndPos: number[],
}

export function drawGrids(grids: Grid[]) {
    grids.map(({
        ElementId,
        GridName,
        StartPos: [x1, y1, z1],
        EndPos: [x2, y2, z2]
    }) => {
        let start = new Vector3(x1 / 1000, z1 / 1000, -y1 / 1000),
            end = new Vector3(x2 / 1000, z2 / 1000, -y2 / 1000),
            color = 0xff0000;
        let line = drawLine(start, end, color);
        line.name = `${ElementId}`;
        line.userData = {
            ElementId,
            GridName
        };
        return line
    });
}

