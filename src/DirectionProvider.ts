/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 * @author 0x4d / https://github.com/0b01001101
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

import { GeoMath } from "./GeoMath";

import { Vector3, Euler, Quaternion } from "three";

export class DirectionProvider {
	// this.object.rotation.reorder("YXZ");

	private alphaOffset = GeoMath.degToRad(-90); // radians

	private enabled = true;
	private debug = { alpha: 0, beta: 0, gamma: 0, absolute: false };

	private quaternion = new Quaternion();
	private targetQuanternion = new Quaternion();

	private screenOrientation = 0;

	private zee = new Vector3(0, 0, 1);
	private euler = new Euler();
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

	public updateDeviceOrientation(device: DeviceOrientationEvent) {
		if (!this.enabled) {
			return;
		}

		if (device) {
			const absolute = device.absolute;
			const alpha = device.alpha ? GeoMath.degToRad(device.alpha) : 0; // Z
			const beta = device.beta ? GeoMath.degToRad(device.beta) : 0; // X'
			const gamma = device.gamma ? GeoMath.degToRad(device.gamma) : 0; // Y''

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
		this.euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

		this.targetQuanternion.setFromEuler(this.euler); // orient the device
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
		window.addEventListener(
			"deviceorientationabsolute",
			this.onDeviceOrientationChangeEvent,
			false
		);
		// TODO Support other absolute deviceorientationevents [only supported in chrome?]
		// TODO AbsoluteOrientationSensor, compass.js, ...

		this.enabled = true;
	}

	private disconnect() {
		window.removeEventListener("orientationchange", this.onScreenOrientationChangeEvent, false);
		window.removeEventListener(
			"deviceorientationabsolute",
			this.onDeviceOrientationChangeEvent,
			false
		);

		this.enabled = false;
	}
}
