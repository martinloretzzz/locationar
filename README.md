# LOCATIONAR

## Introduction

Readme under construction...

Simple Location based Argumented Reality library, based on the [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API), [Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API), [DeviceOrientation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation) and [AmbientLightSensor](https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor)

But you can do a lot of other things to, like:
-building a [compass](https://0b01001101.github.io/locationar/examples/compass.html) with DeviceOrientation
-light your three.js scenes depending on the ambient light[only works on chrome if flag #enable-generic-sensor-extra-classes is enabled]
-others

The lib is small, only 20KB

## Usage

LOCATIONAR is provided as an npm module:

```
npm i @0x4d/locationar
```

You can also download this repository and import the dist/LOCATIONAR.js file

## Demo

Open https://0b01001101.github.io/locationar/ and set a target position

## Browser compability

✔️Chrome
❌Samsung Internet[Scaling doesn't work]
❌Firefox [no absolute compass]
❌UC[Source doesn't work]
❌Opera
❔Safari[can't test on apple devices]

## Documentation and Examples

- [Docs](https://0b01001101.github.io/locationar/docs)
- [Examples (Source)](https://github.com/0b01001101/locationar)
- [Examples (Live)](https://0b01001101.github.io/locationar/)

## Development and Contribution

Please see the [development guide](./DEVELOPMENT.md). If you are interested in contributing, it may be a good starting point to see the list of open issues on our [GitHub issues page](https://github.com/JamesMilnerUK/THREEAR/issues).

## Acknowledgements

- [three.js](https://github.com/mrdoob/three.js/) awesome 3d rendering library
- [THREEAR](https://github.com/JamesMilnerUK/THREEAR) marker based AR libary, with was used as a template for this project
