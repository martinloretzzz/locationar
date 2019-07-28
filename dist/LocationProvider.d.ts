import { Vector3Type } from "./GeoMath";
export declare class LocationProvider {
    private localPosition;
    private callback;
    private cameraHeight;
    private gpsZero;
    private useGpsAltitude;
    private lastPositionArrived;
    private position1;
    private position2;
    private lastPositionTimestamp;
    private gpsPosition;
    private watchID;
    private gpsOptions;
    constructor(params: {
        callback: (locationProvider: LocationProvider) => void;
        gpsZero: Vector3Type;
        cameraHeight?: number;
        useGpsAltitude?: boolean;
    });
    getLocation(): Vector3Type;
    getDebug(): Position | undefined;
    updatePosition(): Vector3Type;
    dispose(): void;
    setCameraHeight(height: number): void;
    setGpsZero(gpsZero: Vector3Type): void;
    private onLocationError;
}
