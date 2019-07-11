import { Source, SourceParameters } from "./Source";
import { LocationProvider } from "./LocationProvider";
import { DirectionProvider } from "./DirectionProvider";
import { Vec3 } from "./GeoMath";
export declare class Controller {
	private source;
	private locProvider;
	private dirProvider;
	constructor(
		gpsTarget: Vec3,
		camera: {
			aspect: number;
			updateProjectionMatrix: () => void;
			position: Vec3;
			quaternion: {
				x: number;
				y: number;
				z: number;
				w: number;
			};
			cameraHeight: number;
		},
		cameraHeight: number,
		canvas: HTMLElement,
		sourceParams?: Partial<SourceParameters>
	);
	dispose(): void;
	getSource(): Source;
	getLocProvider(): LocationProvider;
	getDirProvider(): DirectionProvider;
}
