import { GpsLocation } from "./GpsLocation";
import { GeoMath, GeoUtil, Vector3Type } from "./GeoMath";
import { Vector3 } from "./math/Vector3";

export class LocationProvider {
	private localPosition: Vector3Type = new Vector3();
	private callback: (locationProvider: LocationProvider) => void;

	private cameraHeight: number;
	private gpsZero: Vector3Type = new Vector3();
	private useGpsAltitude: boolean = false;

	private lastPositionArrived: number = Date.now();
	private position1: { time: number; pos: Vector3Type } | undefined;
	private position2: { time: number; pos: Vector3Type } | undefined;

	private lastPositionTimestamp: number = 0;
	private gpsPosition: Position | undefined;

	private watchID: number | undefined;
	private gpsOptions = {
		// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
		enableHighAccuracy: true,
		maximumAge: 0,
		timeout: Infinity
	};

	constructor(params: {
		callback: (locationProvider: LocationProvider) => void;
		gpsZero: Vector3Type;
		cameraHeight?: number;
		useGpsAltitude?: boolean;
	}) {
		this.gpsZero = params.gpsZero;
		this.cameraHeight = GeoUtil.setDefault<number>(params.cameraHeight, 1.6);
		this.useGpsAltitude = GeoUtil.setDefault<boolean>(params.useGpsAltitude, false);
		this.callback = GeoUtil.setDefault<(locationProvider: LocationProvider) => void>(
			params.callback,
			locationProvider => undefined
		);

		if (!this.gpsZero) {
			console.info("gpsZero is required");
			this.gpsZero = new Vector3();
		}

		// TODO Permission Api

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

	public updatePosition() {
		if (this.gpsPosition) {
			if (this.gpsPosition.timestamp !== this.lastPositionTimestamp) {
				const coords = this.gpsPosition.coords;
				if (coords.latitude && coords.longitude) {
					const altitude = coords.altitude ? coords.altitude : 0; // TODO not all positions contain altitude
					const height = this.useGpsAltitude && coords.altitude ? altitude : this.cameraHeight;
					const gps = new Vector3(coords.latitude, height, coords.longitude);
					const positionRaw = new GpsLocation(gps, this.gpsZero);
					const position0 = new Vector3(-positionRaw.x, positionRaw.y, positionRaw.z);

					this.lastPositionTimestamp = this.gpsPosition.timestamp;
					this.lastPositionArrived = Date.now();

					this.position1 = this.position2;
					this.position2 = { pos: position0, time: this.gpsPosition.timestamp };
				}
			}
		}

		if (this.position1 !== undefined && this.position2 !== undefined) {
			this.localPosition = GeoMath.interpolate(
				this.position1,
				this.position2,
				this.lastPositionArrived,
				Date.now()
			);
		}

		this.callback(this);
		return this.localPosition;
	}

	public dispose() {
		if (this.watchID) {
			navigator.geolocation.clearWatch(this.watchID);
		}
	}

	public setCameraHeight(height: number) {
		this.cameraHeight = height;
	}

	public setGpsZero(gpsZero: Vector3Type) {
		this.gpsZero = gpsZero;
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
