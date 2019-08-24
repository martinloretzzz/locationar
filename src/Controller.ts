import { Source, SourceParameters } from "./Source";
import { LocationProvider } from "./LocationProvider";
import { DirectionProvider } from "./DirectionProvider";
import { Vector3Type, QuaternionType } from "./GeoMath";

export class Controller {
	private source: Source;
	private locProvider: LocationProvider;
	private dirProvider: DirectionProvider;

	constructor(
		gpsTarget: Vector3Type,
		camera: {
			aspect: number;
			updateProjectionMatrix: () => void;
			position: Vector3Type;
			quaternion: QuaternionType;
			cameraHeight: number;
		},
		cameraHeight: number,
		canvas: HTMLElement,
		sourceParams: Partial<SourceParameters> = {} // hey
	) {
		sourceParams.camera = camera;
		sourceParams.canvas = canvas;

		this.source = new Source(sourceParams);

		this.locProvider = new LocationProvider(gpsTarget, cameraHeight, (loc: LocationProvider) => {
			const pos = loc.getLocation();
			camera.position.x = pos.x;
			camera.position.y = pos.y;
			camera.position.z = pos.z;
		});
		this.dirProvider = new DirectionProvider((dir: DirectionProvider) => {
			const qat = dir.getDirection();
			camera.quaternion.x = qat.x;
			camera.quaternion.y = qat.y;
			camera.quaternion.z = qat.z;
			camera.quaternion.w = qat.w;
		});
	}

	public dispose() {
		this.source.dispose();
		this.locProvider.dispose();
		this.dirProvider.dispose();
	}

	public getSource() {
		return this.source;
	}

	public getLocProvider() {
		return this.locProvider;
	}

	public getDirProvider() {
		return this.dirProvider;
	}
}
