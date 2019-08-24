import { Vector3 } from "./Vector3";

/**
 * Implementation of a quaternion. This is used for rotating things without incurring in the dreaded gimbal lock issue, amongst other advantages.
 *
 * @example
 * var quaternion = new THREE.Quaternion();
 * quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
 * var vector = new THREE.Vector3( 1, 0, 0 );
 * vector.applyQuaternion( quaternion );
 */

export class Quaternion {

	/**
	 * Adapted from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/.
	 */
	public static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;

	public static slerpFlat(
		dst: number[],
		dstOffset: number,
		src0: number[],
		srcOffset: number,
		src1: number[],
		stcOffset1: number,
		t: number
	): Quaternion;

	public x: number;
	public y: number;
	public z: number;
	public w: number;
	public _onChangeCallback: Function;
	/**
	 * @param x x coordinate
	 * @param y y coordinate
	 * @param z z coordinate
	 * @param w w coordinate
	 */
	constructor(x?: number, y?: number, z?: number, w?: number);

	/**
	 * Sets values of this quaternion.
	 */
	public set(x: number, y: number, z: number, w: number): Quaternion;

	/**
	 * Clones this quaternion.
	 */
	public clone(): this;

	/**
	 * Copies values of q to this quaternion.
	 */
	public copy(q: Quaternion): this;

	/**
	 * Sets this quaternion from rotation specified by Euler angles.
	 */
	public setFromEuler(
		// 0x4d
		euler: { x: number; y: number; z: number },
		order: "XYZ" | "YZX" | "ZXY" | "XZY" | "YXZ" | "ZYX"
	): Quaternion;

	/**
	 * Sets this quaternion from rotation specified by axis and angle.
	 * Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm.
	 * Axis have to be normalized, angle is in radians.
	 */
	public setFromAxisAngle(axis: Vector3, angle: number): Quaternion;

	/**
	 * Sets this quaternion from rotation component of m. Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm.
	 */
	// setFromRotationMatrix(m: Matrix4): Quaternion; 0x4d
	public setFromUnitVectors(vFrom: Vector3, vTo: Vector3): Quaternion;
	public angleTo(q: Quaternion): number;
	public rotateTowards(q: Quaternion, step: number): Quaternion;

	/**
	 * Inverts this quaternion.
	 */
	public inverse(): Quaternion;

	public conjugate(): Quaternion;
	public dot(v: Quaternion): number;
	public lengthSq(): number;

	/**
	 * Computes length of this quaternion.
	 */
	public length(): number;

	/**
	 * Normalizes this quaternion.
	 */
	public normalize(): Quaternion;

	/**
	 * Multiplies this quaternion by b.
	 */
	public multiply(q: Quaternion): Quaternion;
	public premultiply(q: Quaternion): Quaternion;

	/**
	 * Sets this quaternion to a x b
	 * Adapted from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm.
	 */
	public multiplyQuaternions(a: Quaternion, b: Quaternion): Quaternion;

	public slerp(qb: Quaternion, t: number): Quaternion;
	public equals(v: Quaternion): boolean;
	public fromArray(n: number[]): Quaternion;
	public toArray(): number[];

	public fromArray(xyzw: number[], offset?: number): Quaternion;
	public toArray(xyzw?: number[], offset?: number): number[];

	public _onChange(callback: Function): Quaternion;

	/**
	 * @deprecated Use {@link Vector#applyQuaternion vector.applyQuaternion( quaternion )} instead.
	 */
	public multiplyVector3(v: any): any;
}
