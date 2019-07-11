export declare class BrightnessProvider {
	private illuminance;
	private avalible;
	constructor(callback?: (luxProvider: BrightnessProvider) => void);
	isAvalible(): boolean;
	getIlluminance(): number;
	getBrightness(): number;
	getLightPower(multiply?: number): number;
	private onSensorError;
}
