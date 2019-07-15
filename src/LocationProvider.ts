import { GpsLocation } from "./GpsLocation";
import { GeoMath, Vector3Type } from "./GeoMath";
import { Vector3 } from "./math/Vector3";

export class LocationProvider {
	private localPosition: Vector3Type = new Vector3();
	private cameraHeight: number;
	private gpsZero: Vector3Type = new Vector3();

	private lastLocalPositions: Array<{ time: number; pos: Vector3Type }> = [];
	private lastPositionTimestamp: number = 0;

	private gpsPosition: Position | undefined;
	private useGpsAltitude: boolean = false;

	private callback: (locationProvider: LocationProvider) => void;

	private watchID: number | undefined;
	private gpsOptions = {
		// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
		enableHighAccuracy: true,
		maximumAge: 0,
		timeout: Infinity
	};

	constructor(
		gpsZero: Vector3Type,
		cameraHeight: number = 2.0,
		callback: (locationProvider: LocationProvider) => void = locationProvider => undefined,
		useGpsAltitude: boolean = false
	) {
		this.gpsZero = gpsZero;
		this.cameraHeight = cameraHeight;
		this.useGpsAltitude = useGpsAltitude;
		this.callback = callback;

		if (!gpsZero) {
			console.info("gpsZero is required");
			this.gpsZero = new Vector3();
		}

		// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
		if (!navigator.geolocation) {
			console.info("Geolocation is not supported by your browser");
		} else {
			const success = (position: Position) => {
				this.gpsPosition = position;
				this.updatePosition();
			};
			this.watchID = navigator.geolocation.watchPosition(
				success,
				error => this.onLocationError(error, console.info),
				this.gpsOptions
			);
		}
	}

	public getLocation() {
		return this.localPosition;
	}

	public getDebug() {
		return this.gpsPosition;
	}

	public setCameraHeight(height: number) {
		this.cameraHeight = height;
	}

	public setGpsZero(gpsZero: Vector3Type) {
		this.gpsZero = gpsZero;
	}

	public dispose() {
		if (this.watchID) {
			navigator.geolocation.clearWatch(this.watchID);
		}
	}

	private updatePosition() {
		if (this.gpsPosition) {
			if (this.gpsPosition.timestamp !== this.lastPositionTimestamp) {
				const coords = this.gpsPosition.coords;
				if (coords.longitude && coords.latitude) {
					const altitude = coords.altitude ? coords.altitude : 0; // TODO not all positions contain altitude
					const height = this.useGpsAltitude && coords.altitude ? altitude : this.cameraHeight;
					const gps = new Vector3(coords.latitude, height, coords.longitude);
					const positionRaw = new GpsLocation(gps, this.gpsZero);
					this.localPosition = new Vector3(-positionRaw.x, positionRaw.y, positionRaw.z);

					this.lastPositionTimestamp = this.gpsPosition.timestamp;

					this.lastLocalPositions.push({
						time: this.gpsPosition.timestamp,
						pos: this.localPosition
					});
					if (this.lastLocalPositions.length > 2) {
						this.lastLocalPositions.shift();
					}
				}
			}
		}

		if (this.lastLocalPositions.length >= 2) {
			this.localPosition = this.interpolate(
				this.lastLocalPositions[this.lastLocalPositions.length - 2],
				this.lastLocalPositions[this.lastLocalPositions.length - 1]
			);
		}
		this.callback(this);
		return this.localPosition;
	}

	private interpolate(
		point1: { time: number; pos: Vector3Type },
		point2: { time: number; pos: Vector3Type }
	) {
		const p1 = point1.pos;
		const p2 = point2.pos;
		const progress = GeoMath.limit((Date.now() - point2.time) / (point2.time - point1.time), 0, 1);
		// console.info(progress);
		p1.x += (p2.x - p1.x) * progress;
		p1.y += (p2.y - p1.y) * progress;
		p1.z += (p2.z - p1.z) * progress;
		return p1;
	}

	private onLocationError(error: PositionError, onError: (error: string) => void) {
		switch (error.code) {
			case error.PERMISSION_DENIED: // Error message when user denied permission to use Geolocation
				onError("User denied permission for Geolocation");
				break;
			case error.POSITION_UNAVAILABLE: // Error message for when the position is unavailable
				onError("Location information is unavailable");
				break;
			case error.TIMEOUT: // Error message when there occurs a time out
				onError("The request to get user location timedout");
				break;
			default:
				throw error; // Error message when the error is unknown
		}
	}
}
