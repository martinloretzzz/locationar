import { Vec3 } from "./GeoMath";
export declare class GpsLocation implements Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(gpsPosition: Vec3, gpsZero: Vec3);
}
