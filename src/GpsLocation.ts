import { GeoMath, Vec3 } from "./GeoMath";

export class GpsLocation implements Vec3 {
	public x: number;
	public y: number;
	public z: number;

	constructor(gpsPosition: Vec3, gpsZero: Vec3) {
		const position = GeoMath.coordTo3dSpace(gpsPosition, gpsZero);
		this.x = position.x;
		this.y = position.y;
		this.z = position.z;
	}
}
