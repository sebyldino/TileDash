

const settings = {
  tileWidth: 80, //in pixels, define same width and height size
  tileHeight: 80, //in pixels, define same width and height size
  tileMargin: 5, //in pixels, space between tiles
  groupMargin: 10,//in pixels, space between groups
  orientation: "landscape", //Display in portrait or landscape, can be force in url by add "...?orientation=portrait&token=..." 
  customText: "Nantes",// Custom text show on top right of the header
  dateLocal: "fr-FR", //date local eg: en-EN, en-US, nl-NL, fr-FR...
  iconSize: 40,//in pixel, icon size on tile. 
  numOfLandImg: 5, //number of image in Landscape folder, path NEED to be ./img/Landscape. Format need to be .jpg
  numOfPortImg: 5, //number of image in Portrait folder, path NEED to be ./img/Portrait. Format need to be .jpg
  backgroundImage: "./img/background-3.png", //Optionnal
  headerSensor: { //Optionnal. You can show a value on top right of the header (like outside temperature)
    name: "", //Optionnal. If you want show the device name on top right
    id: "a1234b56-1234-5678-9101-ef123d456", // Id of your device. See Homey developper tool
    capabilityID: "measure_temperature", // Capablity to listen. See Homey developper tool
    unit: "°C", //Need to be define, but can be empty (unit: "",)
  },
 /* screenSaver: { // Optionnal. Add a screensaver
    image: "./img/background-2.png",
    timeout: 5, //In seconds before show screensaver
    exitMode: "slide_up", //can be "mouse_move, key_press, slide_up". if empty or undefined, mouse_move and key_press are active. If exitMode is defined to "slide_up", you need to define a slideDistance
    slideDistance: 300, //distance in pixel need to be slide to exit screensaver
  },*/
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
      //...
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
      //...
   ]
  },
  //...
];
window.dashboard = { settings, dashboard };