# LOCATIONAR

Simple Location based Argumented Reality library, based on the [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API), [Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API), [DeviceOrientation](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation) and [AmbientLightSensor](https://developer.mozilla.org/en-US/docs/Web/API/AmbientLightSensor)

## Online Samples:

1. Use Chrome
2. goto the [Compass](https://0b01001101.github.io/locationar/examples/compass.html) example and see if it's working [camera is working, north in the right direction]
3. goto the [Location](https://0b01001101.github.io/locationar/examples/location.html) example and you should see a red cube 10 m in the direction of North
4. If you don't see the cube or want to change the position click "InfoPanel" and then you can press the button GetPosition to set the position of the cube to your current position and offset it with the +10N, +10W,... buttons
   Here you can also see the raw sensor data

## Problems/Limentations

- **missing compass accurcy**[can't find exact numbers, but up to +/- 10° on good devices, on some devices completely unuseable]
- camera fov[different phones have different fov's and if the difference between the camera fov and the set fov is to big, the mapping for non-centered, far away objects will be distorted]
- gps accurcy[can be a problem if the object is nearer than 20 meters]
- to use the light ambient light sensor, you need to set the chrome flag #enable-generic-sensor-extra-classes to enabled

## Documentation and Examples

- [Docs](https://0b01001101.github.io/locationar/docs)
- [Examples (Source)](https://github.com/0b01001101/locationar)
- [Examples (Live)](https://0b01001101.github.io/locationar/)

## Browser compability

✔️Chrome
❌Samsung Internet[Scaling doesn't work]
❌Firefox [no absolute compass]
❌UC[Source doesn't work]
❌Opera
❔Safari[can't test on apple devices]

## Usage

The lib is small, only 20KB

LOCATIONAR is provided as an npm module:

```
npm i @0x4d/locationar
```

You can also download this repository and import the dist/LOCATIONAR.js file

## Development and Contribution

Please see the [development guide](./DEVELOPMENT.md). If you are interested in contributing, it may be a good starting point to see the list of open issues on our [GitHub issues page](https://github.com/JamesMilnerUK/THREEAR/issues).

## Acknowledgements

- [three.js](https://github.com/mrdoob/three.js/) awesome 3d rendering library
- [THREEAR](https://github.com/JamesMilnerUK/THREEAR) marker based AR libary, with was used as a template for this project
