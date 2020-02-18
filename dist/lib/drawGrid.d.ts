export interface Grid {
    ElementId: number;
    GridName: string;
    StartPos: number[];
    EndPos: number[];
}
export declare function drawGrids(grids: Grid[]): void;
