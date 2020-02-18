import { Raycaster, Vector2, Camera, Object3D, Intersection } from "three";
export declare class TzClickHandler {
    readonly camera: Camera;
    readonly elements: Object3D[];
    readonly raycaster: Raycaster;
    readonly mouse: Vector2;
    private oldIntersect;
    private intersectNow;
    private _onUnsel;
    private _onSel;
    private _acceptButton;
    userData: {
        [keys: string]: any;
    };
    constructor(camera: Camera, elements: Object3D[]);
    set OnUnSel(fn: (ele: Intersection) => void);
    get OnUnSel(): (ele: Intersection) => void;
    set OnSel(fn: (ele: Intersection) => void);
    get OnSel(): (ele: Intersection) => void;
    set AcceptMouseButton(fn: (event: MouseEvent) => boolean);
    get AcceptMouseButton(): (event: MouseEvent) => boolean;
    private onDocumentMouseDown;
    private onDocumentMouseUp;
    exec(): void;
}
