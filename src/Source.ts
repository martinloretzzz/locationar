/**
 * @author JamesMilner / https://github.com/JamesMilnerUK
 * @author 0x4d
 */

export interface SourceParameters {
	parent: HTMLElement;
	canvas: HTMLElement | null; // 0x4d
	onResize: ((source: Source, rendererDom: HTMLElement | null) => void) | null;
	camera: { aspect: number; updateProjectionMatrix: () => void } | null;
	facingMode: "user" | "environment";
	deviceId: any;
	sourceWidth: number;
	sourceHeight: number;
	// displayWidth: number;
	// displayHeight: number;
}

export class Source {
	public domElement: HTMLVideoElement | undefined;
	private parameters: SourceParameters;
	private stream: MediaStream | undefined;

	constructor(parameters: Partial<SourceParameters>) {
		// handle default parameters

		const largeScreenSize =
			Math.max(window.innerWidth, window.innerHeight) * window.devicePixelRatio;

		const smallScreenSize = (largeScreenSize / 4) * 3;

		this.parameters = {
			parent: document.body,
			canvas: null, // 0x4d
			onResize: null,
			camera: null,

			// Device id of the camera to use (optional)
			deviceId: null,
			facingMode: "environment",

			// resolution of at which we initialize in the source image
			sourceWidth: largeScreenSize, // 640
			sourceHeight: smallScreenSize // 480,
			// resolution displayed for the source
			// displayWidth: 640,
			// displayHeight: 480
		};

		this.setParameters(parameters);

		if (this.parameters.canvas === undefined) {
			console.info("canvas have to be provided, otherwise resize won't work");
		}

		if (!this.parameters.onResize) {
			this.parameters.onResize = (source: Source, rendererDom: HTMLElement | null) => {
				source.onResizeElement();
				if (rendererDom && rendererDom !== null) {
					source.copyElementSizeTo(rendererDom);
				}
			};
		}

		const that = this;
		this.initialize().then(() => {
			const params = that.parameters;
			if (params.camera !== null && this.stream && this.domElement) {
				// this.stream.getVideoTracks()[0].getSettings().aspectRatio;
				// doesn't really work, for now we only have a video resolution of 4/4
				params.camera.aspect = 4 / 3;
				params.camera.updateProjectionMatrix();
			}

			window.addEventListener("resize", () => {
				if (params.canvas && params.onResize) {
					params.onResize(that, params.canvas);
				}
			});
			if (params.canvas && params.onResize) {
				params.onResize(that, params.canvas);
			}
		});
	}

	public initialize() {
		return new Promise((resolve, reject) => {
			const onReady = () => {
				if (!this.domElement) {
					reject("domElement not defined");
					return;
				}

				this.onResizeElement();
				this.parameters.parent.appendChild(this.domElement);
				resolve();
			};

			const onError = (message: Error | string) => {
				reject(message);
			};

			const webcam = this._initSourceWebcam(onReady, onError);
			if (!webcam) {
				reject("Webcam source could not be established");
				return;
			}
			this.domElement = webcam;

			this.positionSourceDomElement();

			return this;
		});
	}

	public dispose() {
		if (this.parameters.parent && this.domElement) {
			this.parameters.parent.removeChild(this.domElement);
		}
	}

	public onResizeElement() {
		if (!this.domElement) {
			console.warn("Can't resize as domElement is not defined on source");
			return;
		}

		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;
		let sourceHeight = 0;
		let sourceWidth = 0;

		// compute sourceWidth, sourceHeight
		if (this.domElement) {
			sourceWidth = this.domElement.videoWidth;
			sourceHeight = this.domElement.videoHeight;
		}

		// compute sourceAspect
		const sourceAspect = sourceWidth / sourceHeight;
		// compute screenAspect
		const screenAspect = screenWidth / screenHeight;

		// if screenAspect < sourceAspect, then change the width, else change the height
		if (screenAspect < sourceAspect) {
			// compute newWidth and set .width/.marginLeft
			const newWidth = sourceAspect * screenHeight;
			this.domElement.style.width = newWidth + "px";
			this.domElement.style.marginLeft = -(newWidth - screenWidth) / 2 + "px";

			// init style.height/.marginTop to normal value
			this.domElement.style.height = screenHeight + "px";
			this.domElement.style.marginTop = "0px";
		} else {
			// compute newHeight and set .height/.marginTop
			const newHeight = 1 / (sourceAspect / screenWidth);
			this.domElement.style.height = newHeight + "px";
			this.domElement.style.marginTop = -(newHeight - screenHeight) / 2 + "px";

			// init style.width/.marginLeft to normal value
			this.domElement.style.width = screenWidth + "px";
			this.domElement.style.marginLeft = "0px";
		}
	}

	/**
	 * Copy the dimensions of the domElement of the source to another given domElement
	 * @param otherElement the target element to copy the size to, from the Source dom element
	 */
	public copyElementSizeTo(otherElement: HTMLElement) {
		if (!this.domElement) {
			console.warn("Cant set size to match domElement as it is not defined");
			return;
		}

		if (window.innerWidth > window.innerHeight) {
			// landscape
			otherElement.style.width = this.domElement.style.width;
			otherElement.style.height = this.domElement.style.height;
			otherElement.style.marginLeft = this.domElement.style.marginLeft;
			otherElement.style.marginTop = this.domElement.style.marginTop;
		} else {
			// portrait
			otherElement.style.height = this.domElement.style.height;
			otherElement.style.width = (parseInt(otherElement.style.height as string, 10) * 4) / 3 + "px"; // ! as string
			otherElement.style.marginLeft =
				(window.innerWidth - parseInt(otherElement.style.width, 10)) / 2 + "px";
			otherElement.style.marginTop = "0";
		}
	}

	private _initSourceWebcam(onReady: () => any, onError: (message: string) => any) {
		const domElement = document.createElement("video");
		domElement.setAttribute("autoplay", "");
		domElement.setAttribute("muted", "");
		domElement.setAttribute("playsinline", "");
		// domElement.style.width = this.parameters.displayWidth + "px";
		// domElement.style.height = this.parameters.displayHeight + "px";

		// check API is available
		if (
			navigator.mediaDevices === undefined ||
			navigator.mediaDevices.enumerateDevices === undefined ||
			navigator.mediaDevices.getUserMedia === undefined
		) {
			let fctName = "";
			if (navigator.mediaDevices === undefined) {
				fctName = "navigator.mediaDevices";
			} else if (navigator.mediaDevices.enumerateDevices === undefined) {
				fctName = "navigator.mediaDevices.enumerateDevices";
			} else if (navigator.mediaDevices.getUserMedia === undefined) {
				fctName = "navigator.mediaDevices.getUserMedia";
			}
			onError("WebRTC issue-! " + fctName + " not present in your browser");
			return;
		}

		const that = this;

		// get available devices
		navigator.mediaDevices
			.enumerateDevices()
			.then(devices => {
				const userMediaConstraints = {
					audio: false,
					video: {
						facingMode: this.parameters.facingMode,
						width: {
							ideal: this.parameters.sourceWidth
						},
						height: {
							ideal: this.parameters.sourceHeight
						},
						resizeMode: "none",
						aspectRatio: { ideal: 4 / 3 }
					}
				};

				if (null !== this.parameters.deviceId) {
					(userMediaConstraints as any).video.deviceId = {
						exact: this.parameters.deviceId
					};
				}

				// get a device which satisfy the constraints
				navigator.mediaDevices
					.getUserMedia(userMediaConstraints)
					.then(function success(stream) {
						// set the .src of the domElement
						that.stream = stream;
						domElement.srcObject = stream;
						// to start the video, when it is possible to start it only on userevent. like in android
						document.body.addEventListener("click", () => {
							domElement.play();
						});

						domElement.addEventListener("loadedmetadata", event => {
							onReady();
						});
					})
					.catch(error => {
						onError(error);
					});
			})
			.catch(error => {
				onError(error);
			});

		return domElement;
	}

	private positionSourceDomElement() {
		if (this.domElement) {
			this.domElement.style.position = "absolute";
			this.domElement.style.top = "0px";
			this.domElement.style.left = "0px";
			this.domElement.style.zIndex = "-1";
		}
	}

	private setParameters(parameters: any) {
		if (!parameters) {
			return;
		}

		for (const key in parameters) {
			if (key) {
				const newValue = parameters[key];

				if (newValue === undefined) {
					console.warn(key + "' parameter is undefined.");
					continue;
				}

				const currentValue = (this.parameters as any)[key];

				if (currentValue === undefined) {
					console.warn(key + "' is not a property of this Source.");
					continue;
				}

				(this.parameters as any)[key] = newValue;
			}
		}
	}
}

export default Source;
