export declare class BrightnessProvider {
    private callback;
    private illuminance;
    private avalible;
    constructor(params: {
        callback: (luxProvider: BrightnessProvider) => void;
    });
    isAvalible(): boolean;
    getIlluminance(): number;
    getBrightness(): number;
    getLightPower(multiply?: number): number;
    private onSensorError;
}
