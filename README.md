# TileDash
Create your own Homey dashboard.
Copy all files in your server, nas, RPi, ...

Follow steps [here](https://community.homey.app/t/homeydash-com-a-homey-dashboard/13509) to get your token and go to:
http://YOUR_IP_ADDRESS/?token=YOUR_TOKEN

To customize your dashboard, edit the dashboard.js file like below.

Icons can be found [here](https://pictogrammers.com/library/mdi/)



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
window.dashboard = { settings, dashboard };
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
  numOfLandImg: 4, //number of image in Landscape folder, path NEED to be ./img/Landscape
  numOfPortImg: 5, //number of image in Portrait folder, path NEED to be ./img/Portrait
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
```
{
 position: [0, 0], 
 name: "Capteurs d'ouvertures",
 type: "BINARY_SENSOR",
 width: 2,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "alarm_contact", //Need to be a true/false capability. See Homey developper tool
 icon: "mdi-door", // See https://pictogrammers.com/library/mdi/
},
```
- OPTION:
```
icons: { 
 on: "mdi-door-open", // Define an icon when device is on (true)
 off: "mdi-door", // Define an icon when device is off (false)
},
```

-----------------------



### Type BUTTON
A simple button. With some option to get state from another device.
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


### Type EMPTY
If you want to reserve a place for future device, or fill a hole you can use it.
```
{
    position: [0, 1],
    type: 'EMPTY',
    icon: "mdi-lightbulb", // See https://pictogrammers.com/library/mdi/
    name: "Garden",
},
```

-----------------------


### Type HEIMDALL
This can not be place in POPUP type.
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
```
{
position: [0, 0],
 name: "Capteurs",
 type: "POPUP",
 width: 1,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "BINARY_SENSOR",// you can listen the device, but his action is only open popup
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


### Type SENSOR
See sensor value
```
{
 position: [2, 1],
 name: "Sonde Salon", //Optionnal
 type: "SENSOR",
 width: 2,
 height: 2,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "measure_temperature.DS18B20-2", // See Homey developper tool
 icon: "mdi-thermometer", //See https://pictogrammers.com/library/mdi/
 unit: "°C", //Need to be defined but can be empty (unit: "",)
},
```


-----------------------


### Type SHUTTER
Control shutter
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
```
{
 position: [1, 6], 
 name: "Batteries",
 type: "SWITCH",
 width: 1,
 height: 1,
 id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
 capabilityID: "onoff", // Need to accept only true/false value
 icon: "mdi-battery-alert-variant", //See https://pictogrammers.com/library/mdi/
},
```
- OPTION:
```
clickable: false, // If false, it will disable action when click on it. 
```

-----------------------



### Type THERMOSTAT
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
 iconHeatingOn: "mdi-fire",
 iconHeatingOff: "mdi-fire-off",//
 unit: "°C",//Need to be defined. Can be empty (unit: "",)
},
```
