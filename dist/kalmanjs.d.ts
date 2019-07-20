/**
 * KalmanFilter
 * @class
 * @author Wouter Bulten
 * @see {@link http://github.com/wouterbulten/kalmanjs}
 * @version Version: 1.0.0-beta
 * @copyright Copyright 2015-2018 Wouter Bulten
 * @license MIT License
 * @preserve
 */
export default class KalmanFilter {
    /**
     * Create 1-dimensional kalman filter
     * @param  {Number} options.R Process noise
     * @param  {Number} options.Q Measurement noise
     * @param  {Number} options.A State vector
     * @param  {Number} options.B Control vector
     * @param  {Number} options.C Measurement vector
     * @return {KalmanFilter}
     */
    private R;
    private Q;
    private A;
    private C;
    private B;
    private cov;
    private x;
    constructor({ R, Q, A, B, C }?: {
        R?: number | undefined;
        Q?: number | undefined;
        A?: number | undefined;
        B?: number | undefined;
        C?: number | undefined;
    });
    /**
     * Filter a new value
     * @param  {Number} z Measurement
     * @param  {Number} u Control
     * @return {Number}
     */
    filter(z: number, u?: number): number;
    /**
     * Predict next value
     * @param  {Number} [u] Control
     * @return {Number}
     */
    predict(u?: number): number;
    /**
     * Return uncertainty of filter
     * @return {Number}
     */
    uncertainty(): number;
    /**
     * Return the last filtered measurement
     * @return {Number}
     */
    lastMeasurement(): number;
    /**
     * Set measurement noise Q
     * @param {Number} noise
     */
    setMeasurementNoise(noise: number): void;
    /**
     * Set the process noise R
     * @param {Number} noise
     */
    setProcessNoise(noise: number): void;
}
