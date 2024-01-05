var homey;

var CLIENT_ID = '5cbb504da1fc782009f52e46';
var CLIENT_SECRET = 'gvhs0gebgir8vz8yo2l0jfb49u9xzzhrkuo1uvs8';

window.addEventListener('load', function () {

  var groupNumber = 1;

  ////===========================================================================////
  ////                               LOAD SCRIPT TYPE
  ////===========================================================================////
  const typeFolderPath = './js/type/';
  const files = ['binarySensor.js', 'button.js', 'doorbirdPopup.js', 'heimdall.js', 'image.js', 'media.js', 'popup.js',
    'sensor.js', 'shutter.js', 'slider.js', 'switch.js', 'thermostat.js', 'virtual.js'];

  async function loadScripts() {
    for (const file of files) {
      const scriptTag = document.createElement('script');
      scriptTag.src = typeFolderPath + file;
      scriptTag.type = 'text/javascript';
      scriptTag.async = false;

      await new Promise((resolve, reject) => {
        scriptTag.onload = resolve;
        scriptTag.onerror = reject;
        document.head.appendChild(scriptTag);
      });
    }
  }

  // Appeler la fonction pour charger les scripts
  loadScripts();


  ////===========================================================================////
  ////                               DIVERSE
  ////===========================================================================////

  var $dashboardContainer = document.getElementById('dashboardContainer');
  var $currentTime = document.getElementById('currentTime');
  var $currentDate = document.getElementById('currentDate');
  var $customText = document.getElementById('customText');

  let orientation = window.dashboard.settings.orientation;
  if (getQueryVariable('orientation')) {
    const orient = getQueryVariable('orientation');
    if (orient === 'portrait') orientation = orient;
    if (orient === 'landscape') orientation = orient;
  }

  let mobile = false;
  if (getQueryVariable('mobile')) {
    if (getQueryVariable('mobile') === 'true');
    mobile = true;
    orientation = 'portrait';
  }
  console.log("Mobile = ", mobile);
  console.log("Orientation = ", orientation);



  ////===========================================================================////
  ////                               ATHOM CONNEXION
  ////===========================================================================////
  var api = new AthomCloudAPI({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });

  var theme = getQueryVariable('theme');
  if (!theme) theme = 'tiledash';
  var $css = document.createElement('link');
  $css.rel = 'stylesheet';
  $css.type = 'text/css';
  $css.href = './css/' + theme + '.css';
  document.head.appendChild($css);



  ////===========================================================================////
  ////                                    TOKEN
  ////===========================================================================////
  var token = getQueryVariable('token');
  token = atob(token);
  token = JSON.parse(token);
  api.setToken(token);



  ////===========================================================================////
  ////                                    LOGIN
  ////===========================================================================////
  api.isLoggedIn().then(function (loggedIn) {
    if (!loggedIn)
      throw new Error('Token Expired. Please log-in again.');
  }).then(function () {
    return api.getAuthenticatedUser();
  }).then(function (user) {
    return user.getFirstHomey();
  }).then(function (homey) {
    return homey.authenticate();
  }).then(function (homey_) {
    homey = homey_;
    getAllDevices();
    later.setInterval(function () {
      getAllDevices();
    }, later.parse.text('every 1 hour'));
  }).catch(console.error);




  ////===========================================================================////
  ////                               GET ALL DEVICES
  ////===========================================================================////
  function getAllDevices() {
    homey.devices.getDevices().then(function (devices) {
      var allDevices = Object.keys(devices)
        .map(function (deviceId) {
          return devices[deviceId];
        });
      return displayDevices(allDevices, dashboard);
    }).catch(console.error);
  } //END getAllDevices()






  ////===========================================================================////
  ////                                DISPLAY DEVICE
  ////===========================================================================////
  function displayDevices(devices, dashboard) {
    ////==========    Header    ==========
    if (window.dashboard.settings.headerSensor) {
      var $headerValue = document.getElementById('headerValue');
      const headerSensorName = window.dashboard.settings.headerSensor.name;
      const headerSensorID = window.dashboard.settings.headerSensor.id;
      const headerSensorCapabilityID = window.dashboard.settings.headerSensor.capabilityID;
      const headerSensorUnit = window.dashboard.settings.headerSensor.unit
      const headerSensor = devices.find(device => device.id === headerSensorID);
      if (headerSensor) {
        const updateHeaderSensor = () => {
          var value = headerSensor.capabilitiesObj[headerSensorCapabilityID].value;
          var textHeaderSensor;
          if (headerSensorName && headerSensorUnit) textHeaderSensor = `${headerSensorName} ${value} ${headerSensorUnit}`;
          else if (headerSensorName && !headerSensorUnit) textHeaderSensor = `${headerSensorName} ${value}`;
          else if (!headerSensorName && headerSensorUnit) textHeaderSensor = `${value} ${headerSensorUnit}`;
          else textHeaderSensor = `${value}`;
          $headerValue.textContent = textHeaderSensor;
        };
        headerSensor.makeCapabilityInstance(headerSensorCapabilityID, updateHeaderSensor);
        updateHeaderSensor();
      }
    }


    if (window.dashboard.settings.backgroundImage) {
      const bg = window.dashboard.settings.backgroundImage;
      var body = document.body;
      body.style.background = 'url("' + bg + '")';
      body.style.backgroundSize = 'cover'; 
    }

    $dashboardContainer.innerHTML = '';
    if (orientation === 'portrait' && !mobile) {
      $dashboardContainer.style.justifyContent = 'center';
    }

    ////==========     Get param in dashboard.js    ==========
    var tileWidth = window.dashboard.settings.tileSize;
    var tileHeight = window.dashboard.settings.tileSize;
    var tileMargin = window.dashboard.settings.tileMargin;
    var groupMargin = window.dashboard.settings.groupMargin;

    ////==========    Calculate total width of groups   ==========
    const totalGroupsWidth = dashboard.reduce((total, group) => total + tileWidth * group.width, 0);

    ////==========     Calculate available space between groups   ==========
    const availableMarginSpace = $dashboardContainer.clientWidth - totalGroupsWidth;

    ////==========   Calculate left and right margin    ==========
    const sideMargin = availableMarginSpace / (dashboard.length + 1);

    ////==========    Create each group (group in dashboard.js)   ==========
    dashboard.forEach(function (group, index) {
      var itemPos;  
      var extraID; 

      var groupWidth = tileWidth * group.width + (group.width + 1) * tileMargin;
      var groupHeight = tileHeight * group.height + (group.height + 1) * tileMargin;
      //!----- Smartphone view (if mobile)
      if (orientation === "portrait" && mobile) {
        //save initial values (reset at the end of create group)
        var initialGroupWidth = groupWidth;
        var initialGroupHeight = groupHeight;
        var initialGroupMargin = groupMargin;
        var initialTileWidth = tileWidth;
        var initialTileHeight = tileHeight;
        var initialTileMargin = tileMargin;
        var deviceWidth = window.innerWidth;
        //if (deviceWidth <= 1000) {
        var ratio = groupWidth / deviceWidth;
        groupWidth = groupWidth / ratio;
        groupHeight = groupHeight / ratio;
        groupMargin = groupMargin / ratio;
        tileMargin = tileMargin / ratio;
        tileWidth = tileWidth / ratio;
        tileHeight = tileHeight / ratio;
        //}
      }//!

      const $group = document.createElement('div');
      $group.classList.add('group');
      $group.style.width = `${groupWidth}px`;
      $group.style.height = `${groupHeight}px`;
      $group.style.gap = `${tileMargin}px`;
      $group.style.padding = `${tileMargin}px`;
      ////========= Apply margin between groups if not in protrait
      if (orientation != "portrait") {
        if (index !== 0) {
          $group.style.marginLeft = `${groupMargin}px`;
        }
        //==========    Apply left and right margin to center groups    ==========
        $group.style.marginLeft = index === 0 ? `${sideMargin + groupMargin}px` : `${groupMargin}px`;
        $group.style.marginRight = index === dashboard.length - 1 ? `${sideMargin + groupMargin}px` : `${groupMargin}px`;
      }
      //!----- Orientation
      // Add top margin in portrait
      if (orientation === "portrait") {
        if (index !== 0) {
          $group.style.marginTop = "10rem";
        }
      }//!

      ////==========    Create the grid for the group   ==========
      for (let row = 0; row < group.height; row++) {
        for (let col = 0; col < group.width; col++) {
          const $gridCell = document.createElement('div');
          $gridCell.classList.add('grid-cell');
          $gridCell.style.width = `${tileWidth}px`;
          $gridCell.style.height = `${tileHeight}px`;
          $gridCell.style.gridRow = `${row + 1} / span 1`;
          $gridCell.style.gridColumn = `${col + 1} / span 1`;
          $group.appendChild($gridCell);
        }
      }

      ////==========   Add group name    =============
      const $groupName = document.createElement('div');
      $groupName.classList.add('groupName');
      $groupName.textContent = group.title; // Ajoutez le nom du groupe
      $group.appendChild($groupName);
      $dashboardContainer.appendChild($group);


      ////===========   Create each device (item in dashboard.js)    ===========
      group.items.forEach(function (item) {
        if (item.position) itemPos = `${item.position[0]}-${item.position[1]}`;
        //console.log('Item Pos = ', itemPos);
        if (itemPos) extraID = '-' + groupNumber + '-' + itemPos
        else extraID = '-' + groupNumber;

        const type = item.type;
        const device = devices.find(device => device.id === item.id);
        var smallDevice = false;
        if ((item.height <= 1 && item.orientation === 'horizontal') || (item.width <= 1 && item.orientation === 'vertical')) {
          smallDevice = true;
        }

        if ((device || type === 'IMAGE' || type === 'VIRTUAL' || type === 'VIRTUAL_POPUP') && type != 'DOORBIRD_POPUP') {
          const deviceWidth = tileWidth * item.width + (item.width - 1) * tileMargin;
          const deviceHeight = tileHeight * item.height + (item.height - 1) * tileMargin;
          const $device = document.createElement('div');
          if (item.capabilityID) $device.id = 'device-' + item.id + '-' + item.capabilityID + extraID; 
          else $device.id = 'device-' + extraID;
          //if (type === 'POPUP') $device.id = $device.id + '-popup';
          $device.classList.add('tile');
          $device.style.width = `${deviceWidth}px`;
          $device.style.height = `${deviceHeight}px`;
          $device.style.gridRow = `${item.position[1] + 1} / span ${item.height}`;
          $device.style.gridColumn = `${item.position[0] + 1} / span ${item.width}`;


          if (type === 'SWITCH') createSwitch(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'BUTTON') createButton(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'IMAGE') createImage(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'SENSOR') createSensor(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'BINARY_SENSOR') createBinarySensor(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'SLIDER') createSlider(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'THERMOSTAT') createThermostat(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'POPUP' || type === 'VIRTUAL_POPUP') createPopup(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'SHUTTER') createShutter(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'HEIMDALL') createHeimdall(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'VIRTUAL') createVirtual(device, item, $device, smallDevice, devices, ratio, extraID);
          else if (type === 'MEDIA') createMedia(device, item, $device, smallDevice, devices, ratio, extraID);
          else {
            console.error('Invalid device type! You entered:', item.type, 'in dashboard.js');
            return;
          }


          ////==========    ADD DEVICE TO GROUP   ==========
          $group.appendChild($device);
        }
        if (type === 'DOORBIRD_POPUP') createDoorbirdPopup(device, item, extraID);

      });//END create device (item)
      ////==========    ADD GROUP TO DASHBOARD   ==========
      $dashboardContainer.appendChild($group);

      ////==========    RESET VALUE   ==========
      //!----- Smartphone view (if mobile)
      if (orientation === 'portrait' && mobile) {
        groupWidth = initialGroupWidth;
        groupHeight = initialGroupHeight;
        groupMargin = initialGroupMargin;
        tileWidth = initialTileWidth;
        tileHeight = initialTileHeight;
        tileMargin = initialTileMargin;
      }
      //!-----
      groupNumber++;
    });//END create group


    //!----- Orientation
    if (orientation === "portrait") {
      $dashboardContainer.style.gridAutoFlow = 'row';
    } else {
      $dashboardContainer.style.gridAutoFlow = 'column';
      $dashboardContainer.style.justifyContent = 'center';
      $dashboardContainer.style.alignItems = 'center';
      $dashboardContainer.style.gridAutoRows = 'max-content';
    }//!

    displayHeader();
  }//END displayDevices



  ////===========================================================================////
  ////                                FORMAT DATE
  ////===========================================================================////
 function formatDate() {
    const dateLocal = window.dashboard.settings.dateLocal;
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const date = new Date();
    return new Intl.DateTimeFormat(dateLocal, options).format(date);
  }





  ////===========================================================================////
  ////                                DISPLAY HEADER
  ////===========================================================================////
  function displayHeader() {
    ////==========  Update time   ==========
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var timeString = hours + ':' + minutes;
    $currentTime.textContent = timeString;
    $currentDate.textContent = formatDate();

    ////==========    Update custom text in dashboard.js  ==========
    $customText.textContent = window.dashboard.settings.customText || '';

    ////========== Update value of device defined in dashboard.js   ==========
    //$headerValue.textContent = value;
  }

  ////==========    Update header values every X time   ==========
  setInterval(displayHeader, 60000);



  ////===========================================================================////
  ////                               SCREENSAVER
  ////===========================================================================////
  if (window.dashboard.settings.screenSaver) {
    const screenSaver = document.getElementById('screenSaver');
    const screenSaverImage = document.getElementById('screenSaverImage');
    let idleTimeout;
    let touchStartY;
    let screenSaverActive = false;
    const minSlideDistance = window.dashboard.settings.screenSaver.slideDistance;

    if (window.dashboard.settings.screenSaver.image && window.dashboard.settings.screenSaver.timeout) {
      let timeout = window.dashboard.settings.screenSaver.timeout * 1000;
      let imgSrc = window.dashboard.settings.screenSaver.image;

      function resetIdleTimer() {
        clearTimeout(idleTimeout);
        startIdleTimer();
      }

      function startIdleTimer() {
        idleTimeout = setTimeout(() => {
          showScreenSaver();
        }, timeout);
      }

      function showScreenSaver() {
        screenSaverActive = true;
        screenSaverImage.src = imgSrc;
        screenSaver.style.display = 'flex';
      }

      function hideScreenSaver() {
        screenSaver.style.display = 'none';
        resetIdleTimer();
      }

      function exitScreenSaver() {
        screenSaverActive = false;
        hideScreenSaver();
      }

      if (window.dashboard.settings.screenSaver.exitMode === 'slide_up') {
        document.addEventListener('mousemove', handleMouseOrTouch);
        document.addEventListener('touchstart', handleMouseOrTouch);
        document.addEventListener('touchmove', handleMouseOrTouch);
        document.addEventListener('touchend', handleMouseOrTouch);
        document.addEventListener('mousedown', handleMouseOrTouch);
        document.addEventListener('mouseup', handleMouseOrTouch);

        function handleMouseOrTouch(event) {
          if (screenSaverActive) {
            const isTouchEvent = event.type.startsWith('touch');
            const clientY = isTouchEvent ? event.touches[0].clientY : event.clientY;

            if (event.type === 'touchstart' || event.type === 'mousedown') {
              touchStartY = clientY;
            } else if (event.type === 'touchmove' || event.type === 'mousemove') {
              const deltaY = clientY - touchStartY;

              if (deltaY < -minSlideDistance) {
                touchStartY = undefined;
                exitScreenSaver();
              }
            } else if (event.type === 'touchend' || event.type === 'mouseup') {
              touchStartY = undefined;
            }
          }
        }
      }
      else if (window.dashboard.settings.screenSaver.exitMode === 'mouse_move') document.addEventListener('mousemove', hideScreenSaver);
      else if (window.dashboard.settings.screenSaver.exitMode === 'key_press') document.addEventListener('keypress', hideScreenSaver);
      else {
        document.addEventListener('mousemove', hideScreenSaver);
        document.addEventListener('keypress', hideScreenSaver);
      }

      startIdleTimer();
    }
  }//END screenSaver
  
}); //END window.addEventListener()
