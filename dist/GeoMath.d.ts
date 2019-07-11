export interface Vec3 {
	x: number;
	y: number;
	z: number;
}
export declare class GeoMath {
	static EARTHRADIUS: number;
	static PI: number;
	static degToRad(deg: number): number;
	static radToDeg(rad: number): number;
	static limit(value: number, min: number, max: number): number;
	static getFlatCoordDistance(pos1: Vec3, pos2: Vec3): number;
	static coordTo3dSpace(gpsPosition: Vec3, gpsZero: Vec3): Vec3;
	static coordOffsetGpsSpace(gpsPosition: Vec3, localOffset: Vec3): Vec3;
}
