/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author 0x4d / https://github.com/0b01001101
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */
import { Quaternion } from "three";
export declare class DirectionProvider {
	private alphaOffset;
	private enabled;
	private debug;
	private quaternion;
	private targetQuanternion;
	private screenOrientation;
	private zee;
	private euler;
	private q0;
	private q1;
	private onDeviceOrientationChangeEvent;
	private onScreenOrientationChangeEvent;
	constructor(callback?: (directionProvider: DirectionProvider) => void);
	getDirection(): Quaternion;
	getDebug(): {
		alpha: number;
		beta: number;
		gamma: number;
		absolute: boolean;
	};
	updateDeviceOrientation(device: DeviceOrientationEvent): void;
	dispose(): void;
	private setObjectQuaternion;
	private connect;
	private disconnect;
}
