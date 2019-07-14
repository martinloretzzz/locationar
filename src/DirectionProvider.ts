/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author 0x4d / https://github.com/0b01001101
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

import { GeoMath } from "./GeoMath";

import { Quaternion } from "./math/Quaternion";
import { Vector3 } from "./math/Vector3";

export class DirectionProvider {
	// this.object.rotation.reorder("YXZ");

	private alphaOffset = GeoMath.degToRad(-90); // radians

	private enabled = true;
	private debug = { alpha: 0, beta: 0, gamma: 0, absolute: false };

	private quaternion = new Quaternion();
	private targetQuanternion = new Quaternion();

	private screenOrientation = 0;

	private zee = new Vector3(0, 0, 1);
	private q0 = new Quaternion();
	private q1 = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

	private onDeviceOrientationChangeEvent: (event: any) => void;
	private onScreenOrientationChangeEvent: () => void;

	constructor(
		callback: (directionProvider: DirectionProvider) => void = directionProvider => undefined
	) {
		const scope = this;

		this.onDeviceOrientationChangeEvent = event => {
			scope.updateDeviceOrientation(event);
			callback(scope);
		};

		this.onScreenOrientationChangeEvent = () => {
			scope.screenOrientation = (window.orientation as number) || 0; // deprecated soon https://developer.mozilla.org/en-US/docs/Web/API/Window/orientation
		};

		this.connect();
	}

	public getDirection() {
		return this.quaternion;
	}

	public getDebug() {
		return this.debug;
	}

	public updateDeviceOrientation(
		device: DeviceOrientationEvent & {
			webkitCompassHeading?: number;
			webkitCompassAccuracy?: number;
		}
	) {
		if (!this.enabled) {
			return;
		}

		if (device) {
			let absolute = device.absolute;
			let alpha = device.alpha ? GeoMath.degToRad(device.alpha) : 0; // Z
			const beta = device.beta ? GeoMath.degToRad(device.beta) : 0; // X'
			const gamma = device.gamma ? GeoMath.degToRad(device.gamma) : 0; // Y''

			// Safari
			// https://developer.apple.com/documentation/webkitjs/deviceorientationevent/1804777-webkitcompassheading
			if (absolute === false && device.webkitCompassHeading && device.webkitCompassAccuracy) {
				if (device.webkitCompassAccuracy > 0 && device.webkitCompassAccuracy < 50) {
					if (device.webkitCompassHeading > 0) {
						alpha = device.webkitCompassHeading;
						absolute = true;
					}
				}
			}

			alpha = (alpha + 360) % 360; // if alpha < 0 or > 360

			this.debug = { alpha, beta, gamma, absolute };

			const orient = this.screenOrientation ? GeoMath.degToRad(this.screenOrientation) : 0; // O

			this.setObjectQuaternion(alpha + this.alphaOffset, beta, gamma, orient);
		}
	}

	public dispose() {
		this.disconnect();
	}

	// The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''
	private setObjectQuaternion(alpha: number, beta: number, gamma: number, orient: number) {
		this.targetQuanternion.setFromEuler(new Vector3(beta, alpha, -gamma), "YXZ"); // orient the device
		this.targetQuanternion.multiply(this.q1); // camera looks out the back of the device, not the top
		this.targetQuanternion.multiply(this.q0.setFromAxisAngle(this.zee, -orient)); // adjust for screen orientation

		this.quaternion.slerp(
			this.targetQuanternion,
			Math.min(10 * (this.quaternion as any).angleTo(this.targetQuanternion), 0.8)
		); // Interpolate between angles
	}

	private connect() {
		this.onScreenOrientationChangeEvent();

		window.addEventListener("orientationchange", this.onScreenOrientationChangeEvent, false);

		// TODO Support other absolute deviceorientationevents [only supported in chrome?]
		// TODO AbsoluteOrientationSensor, compass.js, ...
		// https://gist.github.com/DroopyTersen/65c9fccd08830ab61e08

		if ("ondeviceorientationabsolute" in window) {
			// Chrome
			(window as any).addEventListener(
				"deviceorientationabsolute",
				this.onDeviceOrientationChangeEvent,
				false
			);
		} else if ("ondeviceorientation" in window) {
			// Non Chrome
			(window as any).addEventListener(
				"deviceorientation",
				this.onDeviceOrientationChangeEvent,
				false
			);
		}

		this.enabled = true;
	}

	private disconnect() {
		window.removeEventListener("orientationchange", this.onScreenOrientationChangeEvent, false);

		if ("ondeviceorientationabsolute" in window) {
			// Chrome
			(window as any).removeEventListener(
				"deviceorientationabsolute",
				this.onDeviceOrientationChangeEvent,
				false
			);
		} else if ("ondeviceorientation" in window) {
			// Non Chrome
			(window as any).removeEventListener(
				"deviceorientation",
				this.onDeviceOrientationChangeEvent,
				false
			);
		}

		this.enabled = false;
	}
}
