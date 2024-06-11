![Banner](https://github.com/sebyldino/TileDash/assets/17813720/7387b17e-1fa4-4c16-9e52-b927cd1425d5)

Create your own Homey dashboard.
Copy all files in your server, nas, RPi, ...

Follow steps [here](https://community.homey.app/t/homeydash-com-a-homey-dashboard/13509) to get your token and go to:
http://YOUR_ACCESS_TO_index.html/?token=YOUR_TOKEN

To customize your dashboard, edit the dashboard.js file like below.

Icons can be found [here](https://pictogrammers.com/library/mdi/)

[Forum topic](https://community.homey.app/t/tiledash-an-homey-dashboard/98802)


![preview](https://github.com/sebyldino/TileDash/assets/17813720/970c8263-4726-4f8c-9e8f-960b087f46d1)


#### RELEASE NOTES FOR v0.4
- Flows and Advanced flows can be add on header (set them at end of dashboard.js)
- Add possibility to disable screenSaver on mobile
- Refresh the page when it comes back to the foreground on mobile


## TODO/IDEAS LIST

- Add some information on screensaver
- Adapt combinaison of HEIMDALL with code and SCREENSAVER
- Add transition on IMAGE type
- Add theme
- I would like to have possibility to create half tile (like width: 2.5,)
- Add languages variables
- Add RGB light tile
- Add CAMERA tile
- Add WEATHER tile
- Add possibility to create differents pages

#### DONE
- Try if it can works on ESP32 (I think it's ambitious, but it crossed my mind!) ->  Impossible, memory size is to small on ESP32 (it works but can not upload all files needed)
- I know display value of a SLIDER type is not very good when tile i small (widht or height <= 1). Need to fix it
- Need to adapt it for smartphone
- Add actual temperature in THERMOSTAT type
- Create file/site to generate user dashboard's file for easy configuration. (searching a solution...) FLOWS ARE NOT INCLUDE IN TILEDASH-TOOL
- Get and use flows to create something with them.




--------------

## STRUCTURE OF YOUR dashboard.js file:

```
const settings = {
    //differents options. See GENERAL SETTINGS
};

const dashboard = [
    { // Group 1
     title: "Title group 1",
     width: 5, // Group 1 width
     height: 9, // Group 1 height
     items: [
        {
            // Tile 1, group 1
        },
        {
            // Tile 2, group 1
        },
        ...
     ]
    },

    { // Group 2
     title: "Title group 2",
     width: 3, // Group 2 width
     height: 6, // Group 2 height
     items: [
        {
            // Tile 1, group 2
        },
        {
            // Tile 2, group 2
        },
        ...
     ]
    },
    ...
];

const flows = [ // Works for flows and advanced flows
    {
      id: "flow_id_1",
      name: "flow_name_1",
    },
    {
      id: "flow_id_2",
      name: "flow_name_2",
    },
    {
      id: "flow_id_3",
      name: "flow_name_3",
    },
    {
      id: "flow_id_4",
      name: "flow_name_4",
    },
  ];
window.dashboard = { settings, dashboard, flows };
```





## GENERAL SETTINGS:
```
const settings = {
  tileWidth: 80, //in pixels, define same width and height size
  tileHeight: 80, //in pixels, define same width and height size
  tileMargin: 5, //in pixels, space between tiles
  groupMargin: 10,//in pixels, space between groups
  orientation: "landscape", //Display in portrait or landscape, can be force in url by add "...?orientation=portrait&token=..." 
  customText: "Nantes",// Custom text show on top right of the header
  dateLocal: "fr-FR", //date local eg: en-EN, en-US, nl-NL, fr-FR...
  iconSize: 40,//in pixel, icon size on tile. 
  numOfLandImg: 4, //number of image in Landscape folder, path NEED to be ./img/Landscape. Format need to be .jpg
  numOfPortImg: 5, //number of image in Portrait folder, path NEED to be ./img/Portrait. Format need to be .jpg
  backgroundImage: "./img/background-3.png", //Optionnal
  headerSensor: { //Optionnal. You can show a value on top right of the header (like outside temperature)
    name: "", //Optionnal. If you want show the device name on top right
    id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
    capabilityID: "measure_temperature", // Capablity to listen. See Homey developper tool
    unit: "°C", //Need to be define, but can be empty (unit: "",)
  },
  screenSaver: { // Optionnal. Add a screensaver
    image: "./img/background-2.jpg",
    timeout: 5, //In seconds before show screensaver
    exitMode: "slide_up", //can be "mouse_move, key_press, slide_up". if empty or undefined, mouse_move and key_press are active. If exitMode is defined to "slide_up", you need to define a slideDistance
    slideDistance: 300, //distance in pixel need to be slide to exit screensaver
    enableOnMobile: false, //Mandatory param if screensaver is enable, if you want disable/enable screensaver on mobile, you can set it here
  },
};
```
## POSITIONING
Each group will create a grid like this, and you can see here position of each item.
Each item need to have a position in his group.
```
position: [X, Y],

Y
↑
╔═══════╦═══════╦═══════╗
║ [0,0] ║ [1,0] ║ [2,0] ║
╠═══════╬═══════╬═══════╣
║ [0,1] ║ [1,1] ║ [2,1] ║
╠═══════╬═══════╬═══════╣
║ [0,2] ║ [1,2] ║ [2,2] ║
╚═══════╩═══════╩═══════╝→  X

```
If an item have a ```width: 2,``` and ```height: 1,``` at ```position: [0,0],```  you will have:
```
Y
↑
╔═══════════════╦═══════╗
║     [0,0]     ║ [2,0] ║
╠═══════╦═══════╬═══════╣
║ [0,1] ║ [1,1] ║ [2,1] ║
╠═══════╬═══════╬═══════╣
║ [0,2] ║ [1,2] ║ [2,2] ║
╚═══════╩═══════╩═══════╝→  X

```
An item with ```with: 2,``` and ```height: 3,``` at ```position: [1, 0],```:
```
Y
↑
╔═══════╦═══════════════╗
║ [0,0] ║               ║
╠═══════╣               ║
║ [0,1] ║     [1, 0]    ║
╠═══════╣               ║
║ [0,2] ║               ║
╚═══════╩═══════════════╝→  X

```


## DEFINE YOUR TILES: 
All tile need to be define like this:

```
{
 position: [0, 0], // Position on the grid (for the group where it's defined). [Pos X, Pos Y]
 type: "SWITCH", // The device type. See below for differents devices and options
 name: "Kitchen", // Optional. Name of your device
 width: 1, // Width of the tile for this device.  Size is define in settings
 height: 1, // Height of the tile for this device.  Size is define in settings
}
```
Generally, icon is optionnal, but there is no real point in not defining it.

Some type need to have a minimal size. See it in different type

You can not define an id with same capabilityID more than once.





-----------------------


### Type BINARY_SENSOR
Only to show device state. No control. Value of capabilityID can only be true/false
![Alt Binary Sensor Tile](https://i.goopics.net/d07hmh.png)
```
{
 position: [0, 0], 
 name: "DAAF",
 type: "BINARY_SENSOR",
 width: 2,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "alarm_smoke", //Need to be a true/false capability. See Homey developper tool
 icon: "mdi-fire-off", // See https://pictogrammers.com/library/mdi/
},
```
- OPTION:
```
icons: { 
 on: "mdi-fire-alert", // Define an icon when device is on (true)
 off: "mdi-fire-off", // Define an icon when device is off (false)
},
effectOn: "mdi-spin", // Optionnal. Add effect when device is on. See end of this page: https://pictogrammers.github.io/@mdi/font/2.0.46/
effectOff: "mdi-rotate-45", // Optionnal. Add effect when device is off.
```

-----------------------



### Type BUTTON
A simple button. With some option to get state from another device.
![Alt Button Tile](https://i.goopics.net/k7yagt.gif)

```
{
 position: [4, 2],
 name: "Portail",
 type: "BUTTON",
 width: 1,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "button", // See Homey developper tool
 icon: "mdi-gate", //Need to be define even you will use icons option. See https://pictogrammers.com/library/mdi/
},
```
- OPTION:
```
icons: {
 on: "mdi-gate-open", // Define an icon when device is on (true)
 off: "mdi-gate", // Define an icon when device is off (false)
 sensorID: "a1234b56-1234-5678-9101-ef123d456", // If a different sensor than the parent device is used. NEED TO RETURN A VALUE true/false. If not defined, id of parent device will be used.
 capabilityID: "alarm_contact", // capabilityID to listen of device define in sensorID. If not defined, capabilityID of device will be used. See Homey developper tool
},
```

// For example, i use this type for my gate. I have a virtual button to open/close my gate, and i get a door sensor on it. So i can control my gate and see door sensor state on this button.



-----------------------


### Type VIRTUAL
If you want to reserve a place for future device, or fill a hole you can use it.
```
{
    position: [0, 1],
    type: 'VIRTUAL',
    icon: "mdi-lightbulb", // See https://pictogrammers.com/library/mdi/
    name: "Garden",
},
```

-----------------------


### Type HEIMDALL
This can not be place in POPUP type. On click of tile, it will show a popup.

![Alt Heimdall Tile](https://i.goopics.net/lfyhfz.png)

```
{
 position: [0, 0],
 name: "Alarme",
 type: "HEIMDALL",
 width: 1,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "homealarm_state", // Need to be this to control Heimdall
 icon: "mdi-shield-home",//Need to be define even you will use icons option. See https://pictogrammers.com/library/mdi/
},
```

- OPTION:
```
 code: '1234', // If define, a keypad will ask you a code before control Heimdall (code will be show only when state is different than "disarmed")
 icons: { // Set differents icons for the differents states
  armed: "mdi-shield-lock",
  partiallyArmed: "mdi-shield-moon",
  disarmed: "mdi-shield-off",
 },
```

-----------------------


### Type IMAGE
Image need to be .jpg file.

![Alt Image Tile](https://i.goopics.net/ncb2du.jpg)

```
{
 position: [0, 0],
 type: "IMAGE",
 width: 4,
 height: 3,
 folder: "./img/Landscape", // If you want to scroll different image. The path need to be this or ./img/Portrait
 timeScroll: 5, // Time in seconds for scrolling images
 id: "tile-image-1", // Define which id you want but use a different id for each IMAGE type in your dashboard
},
```
- OPTION:
```
 staticImage: "./img/nature.jpeg", //If you want a static image. Need to replace "folder: './img/...'"
```

-----------------------


### Type POPUP
Onclick on the device, it will show a popup with other devices defined in this popup.

For smartphone display, it is recommended to set the popup width to 5 or 6. It will adapt automatically but if it is too large, it will be very small on the smartphone screen.

![Alt Image Tile](https://i.goopics.net/uuhtsl.jpg)

```
{
position: [0, 0],
 name: "Capteurs",
 type: "POPUP",
 width: 1,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "alarm_contact",// you can listen the device, but his action is only open popup
 icon: "mdi-door", //Need to be define even you will use icons option. See https://pictogrammers.com/library/mdi/
 popupWidth: 5, // Popup width
 popupHeight: 5, //Popup Height
 items: [
    {
        //Tile 1
    },
    {
        //Tile 2
    },
    ...
 ]
},
```
- OPTION:
```
icons: {
 on: "mdi-...",
 off: "mdi-...",
 effectOn: "mdi-spin", // Optionnal. Add effect when device is on. See end of this page: https://pictogrammers.github.io/@mdi/font/2.0.46/
 effectOff: "mdi-rotate-45", // Optionnal. Add effect when device is off.
},
```

Type HEIMDALL can not be in POPUP because it is already a popup type.
YOU CAN NOT USE AN ID WITH SAME CAPABILITY ID IS ALREADY EXIST IN YOUR DASHBOARD. BUT YOU CAN USE SAME ID WITH OTHER CAPABILITY ID.

Eg: You have define this one anywhere:
```
{
    position: ...,
    type: ...,
    name: ...,
    id: "1234567890",
    capabilityID: "onoff",
    ...
},

//You can not use it in a type POPUP. But you can use this:
{
    position: ...,
    type: ...,
    name: ...,
    id: "1234567890",  //<===== Same id
    capabilityID: "measure_temperature", //<====== Different capabilityID
    ...
},
```

-----------------------


### Type VIRTUAL_POPUP
Same functionnality of POPUP except main device who is virtual. Icon does not change.
```
{
position: [0, 0],
 name: "Capteurs",
 type: "VIRTUAL_POPUP",
 width: 1,
 height: 1,
 icon: "mdi-door", // See https://pictogrammers.com/library/mdi/
 popupWidth: 5, // Popup width
 popupHeight: 5, //Popup Height
 items: [
    {
        //Tile 1
    },
    {
        //Tile 2
    },
    ...
 ]
},
```


-----------------------


### Type SENSOR
See sensor value.

![Alt Sensor Tile](https://i.goopics.net/tgojqd.jpg)

```
{
 position: [2, 1],
 name: "RDC", //Optionnal
 type: "SENSOR",
 width: 2,
 height: 2,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "measure_temperature", // See Homey developper tool
 icon: "mdi-thermometer", //See https://pictogrammers.com/library/mdi/
 unit: "°C", //Need to be defined but can be empty (unit: "",)
},
```
- OPTION:
```
secondValue:{
    capabilityID: 'measure_humidity',
    icon: 'mdi-water-percent',
    unit: '%',
}
```



-----------------------


### Type SHUTTER
Control shutter.

![Alt Shutter Tile](https://i.goopics.net/sz9dku.jpg)
```
{
 position: [0, 0],
 name: "Volet Salon",
 type: "SHUTTER",
 width: 2, // Width need to be at least 2
 height: 2, // Height need to be at least 2
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "windowcoverings_state", 
 icon: "mdi-window-shutter", //See https://pictogrammers.com/library/mdi/
 icons: {
  up: 'mdi-arrow-up-bold-circle-outline', //icon button up
  idle: 'mdi-stop-circle-outline', // icon button idle
  down: 'mdi-arrow-down-bold-circle-outline', // icon button down
 },
},
```


-----------------------


### Type SLIDER
Controle dimmable light, thermostat temp, volume...

![Slider3](https://github.com/sebyldino/TileDash/assets/17813720/18bd8066-c2ba-4d37-9bd9-b14fb062299c)



```
{
 position: [0, 3],
 name: "Cellier",
 type: "SLIDER",
 orientation: 'horizontal', // Can also be 'vertical'
 width: 4,
 height: 2,
 minValue: 0, // Min value of the slider. For 'dim' min value is 0 for light off
 maxValue: 1, // Max value of the slider. For 'dim' max value is 1 for light 100%
 step: 0.01, // Step for each slider moves.
 id: "a1234b56-1234-5678-9101-ef123d456", //See https://pictogrammers.com/library/mdi/
 capabilityID: "dim",
 icon: "mdi-lightbulb",
},
```
- OPTION:
```
 showValue: true, // Show the value in tile. If 'showValue: true', you need to define "unit"
 unit: "%", //Can also be empty (unit: "",)
```

-----------------------


### Type SWITCH
Control on/off device.

![Alt Switch Tile](https://i.goopics.net/03qenh.png)


```
{
 position: [1, 6], 
 name: "ECL Rang",
 type: "SWITCH",
 width: 1,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "onoff", // Need to accept only true/false value
 icon: "mdi-lightbulb", // Need to be define even you will use icons option. See https://pictogrammers.com/library/mdi/
},
```
- OPTION:
```
icons:{
 on: "mdi-lightbulb",
 off: "mdi-lightbul-off,
},
clickable: false, // If false, it will disable action when click on it. 
effectOn: "mdi-spin", // Optionnal. Add effect when device is on. See end of this page: https://pictogrammers.github.io/@mdi/font/2.0.46/
effectOff: "mdi-rotate-45", // Optionnal. Add effect when device is off.
```

-----------------------



### Type THERMOSTAT
Control your thermostat

![Thermostat2](https://github.com/sebyldino/TileDash/assets/17813720/c41ce6b8-90b3-45c4-bde4-cebb7a18309b)


Top left icon: state of thermostat, if heating is on or off.

Top right icon: Turn on/off the thermostat. Tile change on this state.

Button +/-: Control target temperature.

Orange value: Target temp.

Black value: Actual temp.

```
{
 position: [3, 0],
 name: "Thermostat Atelier",
 type: "THERMOSTAT", 
 width: 2,
 height: 2,
 step: 0.5, // Will increment/decrement temperature by 0.5
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "target_temperature", // Target temperature capability See Homey developper tool
 onOffCapabilityID: "onoff", // On off capability id. For Vthermo onoff is to turn on or of thermostat
 heatingCapabilityID: "vt_onoff", // heating on off capabilityID. For Vthermo vt_onoff is the state of thermostat (if is heating on or heating off)
 icon: "mdi-thermometer", // See https://pictogrammers.com/library/mdi/
 iconHeatingOn: "mdi-fire", // Icon show on top left of tile
 iconHeatingOff: "mdi-fire-off",//
 unit: "°C",//Need to be defined. Can be empty (unit: "",)
},
```

### Type DOORBIRD_POPUP

This is not a visible device, it will be triggered when the value of "capabilityID" (define below) is set to true (when someone ring your doorbell, or motion detected) and open a popup with live stream of doorbird and a button.
It does not take the place of another device. You can set it in which group you want as another type, it has no impact.
At the moment, it does not support audio. May be in future if solution is found.

![Alt Doorbird popup](https://i.goopics.net/cqaww6.jpg)

```
{
 type: "DOORBIRD_POPUP",
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your doorbird device. See Homey developper tool
 capabilityID: 'alarm_generic',//capability id to listen to open popup when triggered
 doorbirdIP: "http://xxx.xxx.xxx.xxx", // ip address of your doorbird http://192.168.X.X or can also be https://domain.com
 user: "abcdefgh", // doorbird user. See you doorbird settings
 password: "12345678", // doorbird user password. See you doorbird settings
 icon: "mdi-gate", //icon for door button in popup
 width: 8, // Popup width. Recommanded to set 4:3 format
 height: 6,//Popup height. Recommanded to set 4:3 format
 autoClose: 60, // Timeout in second before auto close popup
},

```
- OPTION:

```
doorDevice:{ //Optionnal. Set it to use a different device than the generic relay of Doorbird
  id:"a1234b56-1234-5678-9101-ef123d456", // Id of your device control door. See Homey developper tool
  capabilityID: "", // Capability id of door device to trigger. Need to be a true/false value (like onoff, button...) value send when door button is press is only 'true', you need to have/create flow to set it to false after door button pressed
 },
 secondDoorDevice:{ // For example if you have a door control and a gate you can set it here
  id:"780ed6ba-6ab1-4f5a-8410-13cd4387cbd5", //Optionnal. Set it to use one more device than generic relay of Doorbird (or even doorDevice)
  capabilityID: "onoff", // Capability id of door device to trigger. Need to be a true/false value (like onoff, button...) value send when door button is press is only 'true', you need to have/create flow to set it to false after door button pressed
  icon: "mdi-lightbulb",//define an icon for this button
 },
 testPopup: true,// Set it to test your DoorBird popup. Doorbird popup will be open few second after refresh page. COMMENT OR SET FALSE WHEN ALL IS GOOD!
```



### Type MEDIA
Control media device.

![Alt Media popup](https://i.goopics.net/o5u12j.gif)

```
{
 position: [3, 6],
 type: "MEDIA",
 width: 2, // Must be at least 2
 height: 2, // Must be at least 2
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 homeyIP: "192-168-1-11", // Define you Homey IP like this xxx-xxx-xxx-xxx and not xxx.xxx.xxx.xxx
 minVol: 0, // Min volume
 maxVol: 1, // Max volume
 volStep: 0.05, // Volume step
 capabilityID: "speaker_playing", // Capability of play control
 standbyIcon: "mdi-speaker", // See https://pictogrammers.com/library/mdi/
},
```

OPTION:
```
 standbyImage: "./img/music.jpeg",//Replace 'standbyIcon' by this to show custom image when device is off/not playing 
 accountID: "123456789abcdef", // If an external access is used, you need to use account ID and not homeyIP to get cover of song. See Homey developper tool -> My Account 
```



## FLOWS:

![headerFlows](https://github.com/sebyldino/TileDash/assets/17813720/c854a7d3-d8a6-4915-a1d5-e23ba96b5c94)

![Gif flow mobile](https://github.com/sebyldino/TileDash/assets/17813720/1964e9ba-d333-402b-a6fd-8d0b444a4a4b)


You need to define yours flows in the 'flows' section of dashboard.js file like this:

```
const flows = [ // Works for flows and advanced flows
    {
      id: "flow_id_1",
      name: "flow_name_1",
    },
    {
      id: "flow_id_2",
      name: "flow_name_2",
    },
    {
      id: "flow_id_3",
      name: "flow_name_3",
    },
    {
      id: "flow_id_4",
      name: "flow_name_4",
    },
  ];
  ```

The flow id can be found in the url on https://my.homey.app/ when you select a flow:

![flowID](https://github.com/sebyldino/TileDash/assets/17813720/7696f4c7-a088-49b2-876f-683376a91a55)

