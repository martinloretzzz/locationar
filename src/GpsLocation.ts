import { GeoMath, Vector3Type } from "./GeoMath";

export class GpsLocation implements Vector3Type {
	public x: number;
	public y: number;
	public z: number;

	constructor(gpsPosition: Vector3Type, gpsZero: Vector3Type) {
		const position = GeoMath.coordTo3dSpace(gpsPosition, gpsZero);
		this.x = position.x;
		this.y = position.y;
		this.z = position.z;
	}
}
