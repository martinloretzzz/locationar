import { Vector3Type } from "./GeoMath";
export declare class LocationProvider {
    private localPosition;
    private cameraHeight;
    private gpsZero;
    private lastLocalPositions;
    private lastPositionTimestamp;
    private gpsPosition;
    private useGpsAltitude;
    private callback;
    private watchID;
    private gpsOptions;
    constructor(gpsZero: Vector3Type, cameraHeight?: number, callback?: (locationProvider: LocationProvider) => void, useGpsAltitude?: boolean);
    getLocation(): Vector3Type;
    getDebug(): Position | undefined;
    setCameraHeight(height: number): void;
    setGpsZero(gpsZero: Vector3Type): void;
    dispose(): void;
    private updatePosition;
    private interpolate;
    private onLocationError;
}
