import { Source, SourceParameters } from "./Source";
import { LocationProvider } from "./LocationProvider";
import { DirectionProvider } from "./DirectionProvider";
import { Vector3Type, QuaternionType } from "./GeoMath";
export declare class Controller {
    private source;
    private locProvider;
    private dirProvider;
    constructor(gpsTarget: Vector3Type, camera: {
        aspect: number;
        updateProjectionMatrix: () => void;
        position: Vector3Type;
        quaternion: QuaternionType;
        cameraHeight: number;
    }, cameraHeight: number, canvas: HTMLElement, sourceParams?: Partial<SourceParameters>);
    dispose(): void;
    getSource(): Source;
    getLocProvider(): LocationProvider;
    getDirProvider(): DirectionProvider;
}
