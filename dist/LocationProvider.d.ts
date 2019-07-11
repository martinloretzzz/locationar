import { Vec3 } from "./GeoMath";
export declare class LocationProvider {
	private localPosition;
	private cameraHeight;
	private gpsZero;
	private gpsPosition;
	private useGpsAltitude;
	private watchID;
	private gpsOptions;
	constructor(
		gpsZero: Vec3,
		cameraHeight?: number,
		callback?: (locationProvider: LocationProvider) => void,
		useGpsAltitude?: boolean
	);
	getLocation(): Vec3;
	getDebug(): Position | undefined;
	setCameraHeight(height: number): void;
	setGpsZero(gpsZero: Vec3): void;
	dispose(): void;
	private updatePosition;
	private onLocationError;
}
