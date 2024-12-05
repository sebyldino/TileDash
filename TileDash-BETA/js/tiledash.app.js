/*




Insight temperature sonde Atelier 1
https://5d7b73ef37c8220c594e8325.connect.athom.com/api/manager/insights/log/homey:device:63bf9081-e816-4dd8-a7da-f1e83ca86778/measure_temperature/entry?resolution=last7Days





RELEASE NOTE:
- type GAUGE
- ajustage slider
- theme smooth
- ajustage vue mobile
- ajustage des click (cursor pointer)
- ajout token dans le dashboard.js
- ajout des pages



*/


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
    'sensor.js', 'shutter.js', 'slider.js', 'switch.js', 'thermostat.js', 'virtual.js', 'flows.js', 'gauge.js', 'nestThermostat.js'];

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

  loadScripts();


  ////===========================================================================////
  ////                               DIVERSE
  ////===========================================================================////

  var $dashboardContainer = document.getElementById('dashboardContainer');
  var $dashboardHeader = document.getElementById('dashboardHeader');
  var $headerLeft = document.getElementById('headerLeft');
  var $headerRight = document.getElementById('headerRight');
  var $headerValue = document.getElementById('headerValue');
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
    if (getQueryVariable('mobile') === 'true') {
      mobile = true;
      orientation = 'portrait';
    }
  }
  console.log("Mobile = ", mobile);
  console.log("Orientation = ", orientation);

  if (window.dashboard.settings.softMobileHeader) {
    if (!mobile) {
      $headerLeft.style.display = 'flex';
      $customText.style.display = 'flex';
    }
    else {
      if (window.dashboard.settings.headerSensor) {
        $headerValue.classList.add('mobile');
        $headerRight.classList.add('mobile');
        $dashboardHeader.classList.add('mobile');
      }
    }

  }



  ////===========================================================================////
  ////                               ATHOM CONNEXION
  ////===========================================================================////
  var api = new AthomCloudAPI({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
  });


  ////===========================================================================////
  ////                               VARIABLE
  ////===========================================================================////
  var theme = getQueryVariable('theme');
  var smooth;
  if (!theme) {
    theme = 'tiledash';
  }
  else if (theme === "smooth-light" || theme === "smooth-dark") {
    smooth = true;
    console.log("Smooth= ", smooth);
  }
  var $css = document.createElement('link');
  $css.rel = 'stylesheet';
  $css.type = 'text/css';
  $css.href = './css/' + theme + '.css';
  document.head.appendChild($css);


  ////===========================================================================////
  ////                                    TOKEN
  ////===========================================================================////
  var token;
  if (window.dashboard.settings.token) {
    token = window.dashboard.settings.token;
  }
  else if (getQueryVariable('token')) {
    token = getQueryVariable('token');
    //console.log(token);
  }
  else {
    const tokenErrorContainer = this.document.createElement('div');
    $dashboardContainer.appendChild(tokenErrorContainer);
    $dashboardContainer.style.justifyContent = 'center';
    $dashboardContainer.style.fontSize = '2rem';
    $dashboardContainer.style.color = '#b10000';
    tokenErrorContainer.textContent = 'No token found! You need to define it in url or in dashboard.js file!';
    return;

  }

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
    getFlows();
    later.setInterval(function () {
      getAllDevices();
    }, later.parse.text('every 1 hour'));
  }).catch(console.error);





  ////===========================================================================////
  ////                               GET FLOWS
  ////===========================================================================////
  function getFlows() {
    if (window.dashboard.flows) {
      const flows = window.dashboard.flows;
      if (flows.length > 0) {
        if (!mobile) {
          createFlows(flows);
        }
        else createFlowsMobiles(flows);
      }
    }

  }











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
      $headerValue.style.display = 'flex';
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


    if (window.dashboard.settings.backgroundImage && !smooth) {
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




    ////==========    Create each page (page in dashboard.js)   ==========
    dashboard.forEach(function (page, pageIndex) {


      //+++++ Calculate total width of groups
      const totalGroupsWidth = page.group.reduce((total, group) => total + tileWidth * group.width, 0);
      //+++++  Calculate available space between groups
      const availableMarginSpace = $dashboardContainer.clientWidth - totalGroupsWidth;
      //+++++ Calculate left and right margin
      const sideMargin = availableMarginSpace / (page.group.length + 1);


      const $pageContainer = document.createElement('div');
      $pageContainer.classList.add('page');
      if (orientation === 'portrait') {
        $pageContainer.style.flexDirection = 'column';
      }
      $pageContainer.id = `page-${pageIndex}`;
      if (pageIndex !== 0) $pageContainer.style.display = 'none'; // Masquer les autres pages au départ



      //+ Create icon page if defined
      if (page.icon) {
        // create navigation container
        if (!document.getElementById("navPage")) {
          const $newNavPage = document.createElement('div');
          $newNavPage.id = 'navPage';
          if (orientation === 'portrait') {
            $newNavPage.classList.add('portrait');
          }
          $dashboardContainer.appendChild($newNavPage);
        }
        // create page button container
        if (!document.getElementById('pageButtonContainer')) {
          const $newPageButtonContainer = document.createElement('div');
          $newPageButtonContainer.id = 'pageButtonContainer';
          if (orientation === 'portrait') $newPageButtonContainer.classList.add('portrait');
          const $navPage = document.getElementById('navPage');
          $navPage.appendChild($newPageButtonContainer);
        }

        // create each page button
        const $navPage = document.getElementById('navPage');
        const $pageButtonContainer = document.getElementById('pageButtonContainer');

        const $pageButton = document.createElement('div');
        $pageButton.id = 'pageButton-' + pageIndex;
        $pageButton.dataset.targetPage = pageIndex;
        $pageButton.classList.add('pageButton');
        if (pageIndex === 0) $pageButton.classList.add('active');
        $pageButton.addEventListener('click', function () {
          pageNavigation($pageButton)
        });

        const $pageIcon = document.createElement('div');
        $pageIcon.classList.add('pageIcon', 'mdi', page.icon);

        $pageButton.appendChild($pageIcon);
        $pageButtonContainer.appendChild($pageButton);
        $navPage.appendChild($pageButtonContainer);

      }




      ////=====   Create each group of each page  =====
      page.group.forEach(function (group, groupIndex) {

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
          if (groupIndex !== 0) {
            $group.style.marginLeft = `${groupMargin}px`;
          }
          //==========    Apply left and right margin to center groups    ==========
          //$group.style.marginLeft = groupIndex === 0 ? `${sideMargin + groupMargin}px` : `${groupMargin}px`;
          //$group.style.marginRight = groupIndex === page.group.length - 1 ? `${sideMargin + groupMargin}px` : `${groupMargin}px`;
          $group.style.marginLeft = groupIndex === 0 ? 'auto' : `${groupMargin}px`;
          $group.style.marginRight = groupIndex === page.group.length - 1 ? 'auto' : `${groupMargin}px`;
        }
        //!----- Orientation
        // Add top margin in portrait
        if (orientation === "portrait") {
          if (groupIndex !== 0) {
            $group.style.marginTop = "5rem";
          }
          if ((groupIndex + 1) === page.group.length) {
            $group.style.marginBottom = '5rem';
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
        if (group.title) {
          const $groupName = document.createElement('div');
          $groupName.classList.add('groupName');
          $groupName.textContent = group.title;
          $group.appendChild($groupName);
          $dashboardContainer.appendChild($group);
        }



        ////===========   Create each device (item in dashboard.js)    ===========
        group.items.forEach(function (item) {
          if (item.position) itemPos = `${item.position[0]}-${item.position[1]}`;
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
            $device.classList.add('tile');
            if (type === 'IMAGE') $device.classList.add('imageContainer');
            $device.style.width = `${deviceWidth}px`;
            $device.style.height = `${deviceHeight}px`;
            $device.style.gridRow = `${item.position[1] + 1} / span ${item.height}`;
            $device.style.gridColumn = `${item.position[0] + 1} / span ${item.width}`;


            if (type === 'SWITCH') createSwitch(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'BUTTON') createButton(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'IMAGE') createImage(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'SENSOR') createSensor(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'BINARY_SENSOR') createBinarySensor(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'SLIDER') createSlider(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'THERMOSTAT') createThermostat(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'POPUP' || type === 'VIRTUAL_POPUP') createPopup(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'SHUTTER') createShutter(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'HEIMDALL') createHeimdall(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'VIRTUAL') createVirtual(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'MEDIA') createMedia(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'GAUGE') createGauge(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
            else if (type === 'NEST_THERMOSTAT') createNestThermostat(device, item, $device, smallDevice, devices, ratio, extraID, smooth);
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
        $pageContainer.appendChild($group);

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

      $dashboardContainer.appendChild($pageContainer);
    });//END create page


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
    var enableOnMobile = false;
    if (window.dashboard.settings.screenSaver.enableOnMobile) {
      enableOnMobile = true;
    }

    if ((mobile && enableOnMobile) || (!mobile)) {
      const screenSaver = document.getElementById('screenSaver');
      const screenSaverImage = document.getElementById('screenSaverImage');
      const screenSaverType = window.dashboard.settings.screenSaver.type; //!==========
      //!========
      let idleTimeout;
      let touchStartY;
      let screenSaverActive = false;
      var minSlideDistance;

      //+++++++++ Variable for screensaver type icon
      var $screenSaverIcon;
      var activeIcon;
      var inactiveIcon;
      const screenSaverTransparent = './img/screensaverTransparent.png';

      if (screenSaverType === 'icon') {
        screenSaverImage.src = screenSaverTransparent;
        const $screenSaverIconContainer = document.createElement('div');
        $screenSaverIconContainer.classList.add('screensaverIconContainer');
        $screenSaverIcon = document.createElement('i');
        activeIcon = window.dashboard.settings.screenSaver.icons.active;
        inactiveIcon = window.dashboard.settings.screenSaver.icons.inactive;
        $screenSaverIcon.classList.add('mdi', inactiveIcon, 'screensaverIcon', 'inactive');
        $screenSaverIconContainer.appendChild($screenSaverIcon);
        $headerLeft.appendChild($screenSaverIconContainer);
      }

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

        function exitScreenSaver() {
          screenSaverActive = false;
          hideScreenSaver();
        }

        function showScreenSaver() {
          screenSaverActive = true;
          if (screenSaverType === 'image') {
            screenSaverImage.src = imgSrc;
            screenSaver.style.display = 'flex';
          }
          else if (screenSaverType === 'icon') {
            $screenSaverIcon.classList.remove(inactiveIcon, 'inactive');
            $screenSaverIcon.classList.add(activeIcon, 'active');
            screenSaver.style.display = 'flex';

          }

        }

        function hideScreenSaver() {
          if (screenSaverType === 'image') {
            screenSaver.style.display = 'none';
          }
          else if (screenSaverType === 'icon') {
            $screenSaverIcon.classList.remove(activeIcon, 'active');
            $screenSaverIcon.classList.add(inactiveIcon, 'inactive');
            screenSaver.style.display = 'none';

          }

          resetIdleTimer();
        }

        if (window.dashboard.settings.screenSaver.exitMode === 'slide_up') {
          minSlideDistance = window.dashboard.settings.screenSaver.slideDistance;
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
    }
  }//END screenSaver



  // Refresh page on 'visibilitychange' get visible
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && mobile) {
      location.reload(); // Recharger la page
    }
  });


  // Nagition between differents pages
  function pageNavigation(activeButton) {
    const allPageButton = document.querySelectorAll('.pageButton');
    allPageButton.forEach(button => {
      if (button.id !== activeButton.id) {
        button.classList.remove('active');
      }
      else button.classList.add('active');
    });
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
      if (page.id !== 'page-' + activeButton.dataset.targetPage) {
        page.style.display = 'none';
      }
      else page.style.display = 'flex';
    });
  }

  //!===============================
}); //END window.addEventListener()

