/*
To try TilDash, you can rename this file to "dashboard.js" and replace original "dahboard.js" file.
*/

const settings = {
    //tileWidth: 80, //in pixels
    //tileHeight: 80, //in pixels
    tileSize: 80, //in pixels
    tileMargin: 5, //in pixels
    groupMargin: 10,//in pixels
    orientation: "landscape", //portrait or landscape, can be force in url by add "...?orientation=portrait&token=..." 
    customText: "Custom Text",
    dateLocal: "en-EN", //date local eg: en-EN, en-US, nl-NL, fr-FR...
    iconSize: 40,//in pixel
    numOfLandImg: 4, //number of image in Landscape folder, path NEED to be ./img/Landscape
    numOfPortImg: 5, //number of image in Portrait folder, path NEED to be ./img/Portrait
    backgroundImage: "./img/background-3.png",
   /* headerSensor: {
      name: "", //
      id: "a1234b56-1234-5678-9101-ef123d456",
      capabilityID: "measure_temperature",
      unit: "°C",
    },*/
    screenSaver: {
      image: "./img/background-2.jpg",
      timeout: 5, //in seconds
      //exitMode: "slide_up", //can be "mouse_move, key_press, slide_up". if empty or undefined, mouse_move and key_press are active. If exitMode is defined to "slide_up", you need to define a slideDistance
      //slideDistance: 300, //distance in pixel need to be slide to exit screensaver
    },
  };
  
  const dashboard = [
    ////===========================================================================////
    ////                                  GROUPE 1
    ////===========================================================================////
    {
      //Group 1
      title: "Group 1",
      width: 4,
      height: 6,
      items: [
        {
          position: [0, 0],
          name: "Virtual Popup",
          type: "VIRTUAL_POPUP",
          width: 2,
          height: 2,
          icon: "mdi-home-circle",
          popupWidth: 6,
          popupHeight: 4,
          items: [
            {
              position: [0, 0],
              width: 3,
              height: 2,
              type: "VIRTUAL",
              icon: "mdi-robot-mower",
              name: "Mower",
            },
            {
              position: [3, 0],
              type: "VIRTUAL",
              width: 3,
              height: 2,
              icon: "mdi-gate",
              name: "Gate",
            },
            {
              position: [0, 2],
              type: "VIRTUAL",
              width: 2,
              height: 2,
              icon: "mdi-car",
              name: "Car",
            },
            {
              position: [2, 2],
              type: "VIRTUAL",
              width: 4,
              height: 2,
              icon: "mdi-garage-variant",
              name: "Garage",
            },
          ],
        },//------
        {
          position: [2, 0],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-lightbulb",
          name: "Kitchen",
        },
        {
          position: [0, 2],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-lightbulb-night",
          name: "Bedroom",
        },
        {
          position: [2, 2],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-lightbulb-group",
          name: "All light",
        },
        {
          position: [0, 4],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-outdoor-lamp",
          name: "Outdoor",
        },
        {
          position: [2, 4],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-floor-lamp-torchiere",
          name: "Floor lamp",
        },
  
  
      ],
    },//END Group 1
  
    ////===========================================================================////
    ////                                  GROUPE 2
    ////===========================================================================////
  
    {
      //Group 2
      title: "Group 2",
      width: 4,
      height: 6,
      items: [
        {
          position: [0, 0],
          type: "IMAGE",
          width: 4,
          height: 3,
          folder: "./img/Landscape", //if you want to scroll different image. DO NOT ADD "/" AT THE END
          //staticImage: "./img/nature.jpeg", //if you want a static image
          timeScroll: 5, //time in second
        },//
        {
          position: [0, 3],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-thermometer",
          name: "Temperature",
        },
        {
          position: [2, 3],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-water-percent",
          name: "Humidity",
        },
        {
          position: [0, 5],
          type: "VIRTUAL",
          width: 4,
          height: 1,
          icon: "mdi-fire-alert",
          name: "Smoke sensor",
        },
      ],
    },//END Group 2
  
    ////===========================================================================////
    ////                                  GROUPE 3
    ////===========================================================================////
    {
      //Group 3
      title: "Group 3",
      width: 4,
      height: 6,
      items: [
        {
          position: [0, 0],
          type: "VIRTUAL",
          width: 4,
          height: 2,
          icon: "mdi-window-shutter",
          name: "Shutter",
        },
        {
          position: [1, 2],
          type: "IMAGE",
          width: 3,
          height: 4,
          folder: "./img/Portrait", //if you want to scroll different image. DO NOT ADD "/" AT THE END
          //staticImage: "./img/nature.jpeg", //if you want a static image
          timeScroll: 5, //time in second
        },//
        {
          position: [0, 2],
          type: "VIRTUAL",
          width: 1,
          height: 4,
          icon: "mdi-door",
          name: "Door",
        },
      ],
    },//END Group 3 
  
  
    ////===========================================================================////
    ////                                  GROUPE 4
    ////===========================================================================////
    {
      //Group 4
      title: "Group 4",
      width: 4,
      height: 6,
      items: [
        {
          position: [0, 0],
          type: "VIRTUAL",
          width: 2,
          height: 4,
          icon: "mdi-account",
          name: "Presence",
        },
        {
          position: [0, 4],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-battery-alert",
          name: "Battery",
        },
        {
          position: [2, 0],
          type: "VIRTUAL",
          width: 2,
          height: 2,
          icon: "mdi-radiator",
          name: "Heater",
        },
        {
          position: [2, 2],
          type: "VIRTUAL",
          width: 2,
          height: 4,
          icon: "mdi-weather-partly-snowy-rainy",
          name: "Weather",
        },
  
      ],
    },//END Group 4
  
  
  ];//END dashboard
  
  window.dashboard = { settings, dashboard };
  
