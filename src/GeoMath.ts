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

export class GeoUtil {
	public static setDefault = <T>(value: T | undefined, def: T): T => {
		if (value !== undefined) {
			return value;
		}
		return def;
	};
}

// tslint:disable: max-classes-per-file
export class GeoMath {
	public static EARTHRADIUS = 6371000.0; // m
	public static PI = 3.1415926535897932;

	public static degToRad(deg: number): number {
		return 0.0174532925199432 * deg; // (deg / 180) * Math.PI
	}

	public static radToDeg(rad: number): number {
		return 57.29577951308232 * rad; // (rad / Math.PI) * 180
	}

	public static limit(value: number, min: number, max: number): number {
		return Math.max(Math.min(value, max), min);
	}

	public static getFlatCoordDistance(pos1: Vector3Type, pos2: Vector3Type): number {
		const dLat = this.degToRad(pos2.x - pos1.x);
		const dLon = this.degToRad(pos2.z - pos1.z);

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(pos1.x) * Math.cos(pos2.x);

		const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return 2 * GeoMath.EARTHRADIUS * c;
	}

	// lat[Latitude] North/South
	// lon[Longitude] West/East

	public static coordTo3dSpace(gpsPosition: Vector3Type, gpsZero: Vector3Type): Vector3Type {
		// only approx, small distances http://www.movable-type.co.uk/scripts/latlong.html

		const dLat = this.degToRad(gpsPosition.x - gpsZero.x);
		const dLon = this.degToRad(gpsPosition.z - gpsZero.z);
		const dAlt = gpsPosition.y - gpsZero.y;

		const distLat = GeoMath.EARTHRADIUS * dLat;
		const distLon = GeoMath.EARTHRADIUS * dLon * Math.cos(this.degToRad(gpsZero.x));

		return { x: -distLat, y: dAlt, z: distLon };
	}

	public static coordOffsetGpsSpace(
		gpsPosition: Vector3Type,
		localOffset: Vector3Type
	): Vector3Type {
		// only approx, small distances http://www.movable-type.co.uk/scripts/latlong.html

		const dLat = localOffset.x / GeoMath.EARTHRADIUS;
		const dLon = localOffset.z / Math.cos(this.degToRad(gpsPosition.x)) / GeoMath.EARTHRADIUS;
		const dAlt = gpsPosition.y + localOffset.y;

		return {
			x: gpsPosition.x + this.radToDeg(dLat),
			y: dAlt,
			z: gpsPosition.z + this.radToDeg(dLon)
		};
	}

	public static interpolate(
		point1: { time: number; pos: Vector3Type },
		point2: { time: number; pos: Vector3Type },
		lastPoint: number,
		now: number
	) {
		const p1 = point1.pos;
		const p2 = point2.pos;
		const progress = GeoMath.limit((now - lastPoint) / (point2.time - point1.time), 0, 1);

		const p0 = new Vector3();
		p0.x = p1.x + (p2.x - p1.x) * progress;
		p0.y = p1.y + (p2.y - p1.y) * progress;
		p0.z = p1.z + (p2.z - p1.z) * progress;
		return p0;
	}
}
