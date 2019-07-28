import { GeoMath } from "./GeoMath";

export class BrightnessProvider {
	private illuminance: number = 0;
	private avalible: boolean = false;

	constructor(callback: (luxProvider: BrightnessProvider) => void = luxProvider => undefined) {
		if ("AmbientLightSensor" in window && "permissions" in (navigator as any)) {
			(navigator as any).permissions
				.query({ name: "ambient-light-sensor" })
				.then((result: { state: string }) => {
					if (result.state === "denied") {
						console.info("Permission to use ambient light sensor is denied.");
						return;
					}

					// @ts-ignore
					const sensor = new AmbientLightSensor();
					sensor.onerror = this.onSensorError;

					sensor.onreading = () => {
						this.illuminance = sensor.illuminance;
						this.avalible = true;
						callback(this);
					};

					sensor.start();
				});
		} else {
			this.avalible = false;
			console.info("Sensor is not supported by the User Agent.");
		}
	}

	public isAvalible() {
		return this.avalible;
	}

	public getIlluminance() {
		return this.illuminance;
	}

	public getBrightness() {
		return GeoMath.limit(Math.log(this.illuminance + 1) / Math.LN10 / 5.0, 0, 1);
	}

	public getLightPower(multiply: number = 1) {
		return 4 * GeoMath.PI * this.getBrightness() * multiply;
	}

	private onSensorError(event: any) {
		// Add SecurityError/feature policy error https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
		if (event.error.name === "NotAllowedError") {
			console.info("You need to request permission for the ambientlightsensor first");
		} else if (event.error.name === "NotReadableError") {
			console.info("Cannot connect to the ambientlightsensor sensor");
		}
		console.info(event.error.name, event.error.message);
	}
}
