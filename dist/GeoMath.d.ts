import { Vector3 } from "./math/Vector3";
export interface Vector3Type {
    x: number;
    y: number;
    z: number;
}
export interface QuaternionType {
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare class GeoUtil {
    static setDefault: <T>(value: T | undefined, def: T) => T;
}
export declare class GeoMath {
    static EARTHRADIUS: number;
    static PI: number;
    static degToRad(deg: number): number;
    static radToDeg(rad: number): number;
    static limit(value: number, min: number, max: number): number;
    static getFlatCoordDistance(pos1: Vector3Type, pos2: Vector3Type): number;
    static coordTo3dSpace(gpsPosition: Vector3Type, gpsZero: Vector3Type): Vector3Type;
    static coordOffsetGpsSpace(gpsPosition: Vector3Type, localOffset: Vector3Type): Vector3Type;
    static interpolate(point1: {
        time: number;
        pos: Vector3Type;
    }, point2: {
        time: number;
        pos: Vector3Type;
    }, lastPoint: number, now: number): Vector3;
}
