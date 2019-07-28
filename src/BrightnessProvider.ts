import { GeoMath, GeoUtil } from "./GeoMath";

export class BrightnessProvider {
	private callback: (luxProvider: BrightnessProvider) => void;

	private illuminance: number = 0;
	private avalible: boolean = false;

	constructor(params: { callback: (luxProvider: BrightnessProvider) => void }) {
		this.callback = GeoUtil.setDefault<(luxProvider: BrightnessProvider) => void>(
			params.callback,
			luxProvider => undefined
		);

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
					sensor.onerror = (error: any) => this.onSensorError(error, console.info);

					sensor.onreading = () => {
						this.illuminance = sensor.illuminance;
						this.avalible = true;
						this.callback(this);
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

	private onSensorError(event: any, onError: (error: string | Error) => void) {
		// Add SecurityError/feature policy error https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs
		switch (event.error.name) {
			case "NotAllowedError":
				onError("You need to request permission for the ambientlightsensor first");
				break;
			case "NotReadableError":
				onError("Cannot connect to the ambientlightsensor sensor");
				break;
			default:
				throw event.error; // Error message when the error is unknown
		}
	}
}
