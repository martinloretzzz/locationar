/**
 * @author JamesMilner / https://github.com/JamesMilnerUK
 * @author 0x4d
 */
export interface SourceParameters {
    parent: HTMLElement;
    canvas: HTMLElement | null;
    onResize: ((source: Source, rendererDom: HTMLElement | null) => void) | null;
    camera: {
        aspect: number;
        updateProjectionMatrix: () => void;
    } | null;
    facingMode: "user" | "environment";
    deviceId: any;
    sourceWidth: number;
    sourceHeight: number;
}
export declare class Source {
    domElement: HTMLVideoElement | undefined;
    private parameters;
    private stream;
    constructor(parameters: Partial<SourceParameters>);
    initialize(): Promise<unknown>;
    dispose(): void;
    onResizeElement(): void;
    /**
     * Copy the dimensions of the domElement of the source to another given domElement
     * @param otherElement the target element to copy the size to, from the Source dom element
     */
    copyElementSizeTo(otherElement: HTMLElement): void;
    private _initSourceWebcam;
    private positionSourceDomElement;
    private setParameters;
}
export default Source;
