# MMM-TPLink [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)]

TPLink Smarthome Module for MagicMirror<sup>2</sup>.
This modules inspired and using some codes from [MMM-Hue](https://github.com/MitchSS/MMM-Hue).

## Supported Devices

| Model                                    | Type |
|------------------------------------------|------|
| HS100, HS105, HS110, HS200               | Plug |
| LB100, LB110, LB120, LB130, LB200, LB230 | Bulb |

## Example

![](.github/example.jpg)   ![](.github/example2.jpg)

## Dependencies

* An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
* [tplink-smarthome-api](https://github.com/plasticrake/tplink-smarthome-api) module of nodejs

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
2. Go to `~/MagicMirror/modules/MMM-TPLink` directory and do `npm install`
3. Configure your `~/MagicMirror/config/config.js`:

    ```
    {
        module: 'MMM-TPLink',
        position: 'top_right',
        config: {
        }
    }
    ```

## Config Options

| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `colour` | `false` | displaying power status in colour or not |
| `updateInterval` | `600000 ms` (10 minutes) | how often should the devices states refreshed |
| `showOnlyOn` | `false` | if set to true the module shows only the lights which are on |
| `showLabel` | `true` | show header label? |
| `timeout` | `3000` | how  |
| `animationSpeed` | `2500 ms` (2.5 s) | Speed of the update animation. |
