import {
  Raycaster,
  Vector2,
  Camera,
  Scene,
  Object3D,
  Intersection
} from "three";


export class TzClickHandler{
  readonly camera: Camera;
  readonly elements: Object3D[];
  readonly raycaster: Raycaster = new Raycaster()
  readonly mouse: Vector2 = new Vector2();
  private oldIntersect: Intersection | null = null;
  private intersectNow: Intersection | null = null;

  private _onUnsel: (ele: Intersection) => void = () => {};
  private _onSel: (ele: Intersection) => void = () => {};
  private _acceptButton: (event: MouseEvent) => boolean = (event) => event.button === 0;

  userData: {[keys: string]: any} = {};

  constructor(camera: Camera, elements: Object3D[]){
    this.camera = camera;
    this.elements = elements;
  }

  set OnUnSel(fn: (ele: Intersection) => void) {
    this._onUnsel = fn.bind(this);
  }

  get OnUnSel(){
    return this._onUnsel;
  }

  set OnSel(fn: (ele: Intersection) => void) {
    this._onSel = fn.bind(this);
  }

  get OnSel(){
    return this._onSel;
  }

  set AcceptMouseButton(fn: (event: MouseEvent) => boolean) {
    this._acceptButton = fn;
  }

  get AcceptMouseButton(){
    return this._acceptButton;
  }


  private onDocumentMouseDown(event: MouseEvent): void {

    if (!this.AcceptMouseButton(event)) return;
    
    //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 获取raycaster直线和所有模型相交的数组集合
    let intersects = this.raycaster.intersectObjects(this.elements);
    if (intersects.length) {
      this.oldIntersect = intersects[0];
    } else {
      this.oldIntersect = null;
    }
  }

  private onDocumentMouseUp(event: MouseEvent) {

    //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 获取raycaster直线和所有模型相交的数组集合
    let intersects = this.raycaster.intersectObjects(this.elements);

    if (intersects.length === 0 && this.intersectNow == null) {
      return;
    }

    if (intersects.length === 0 && this.intersectNow != null) {
      this.OnUnSel(this.intersectNow);
      this.intersectNow = null;
      return;
    }

    if (!this.oldIntersect || !this.AcceptMouseButton(event)) return;

    if (intersects.length > 0 && this.intersectNow != null) {
      this.OnUnSel(this.intersectNow);
      this.oldIntersect = this.intersectNow;
      this.intersectNow = intersects[0];
      this.OnSel(this.intersectNow);
      return;
    }
    
    if (intersects.length > 0 && this.intersectNow == null) {
      this.intersectNow = intersects[0];
      this.OnSel(this.intersectNow);
    }
  }

  exec(){
    document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
    document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
  }


}