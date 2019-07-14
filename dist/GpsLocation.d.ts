import { Vector3Type } from "./GeoMath";
export declare class GpsLocation implements Vector3Type {
    x: number;
    y: number;
    z: number;
    constructor(gpsPosition: Vector3Type, gpsZero: Vector3Type);
}
