////=====================    Type POPUP   ======================
function createPopup(device, item, $device, smallDevice, devices, ratio, extraID, smooth) {

    var tileWidth = window.dashboard.settings.tileSize;
    var tileHeight = window.dashboard.settings.tileSize;
    var tileMargin = window.dashboard.settings.tileMargin;
    const $overlay = document.getElementById('overlay');

    let orientation = window.dashboard.settings.orientation;
    if (getQueryVariable('orientation')) {
        const orient = getQueryVariable('orientation');
        if (orient === 'portrait') orientation = orient;
        if (orient === 'landscape') orientation = orient;
    }
    //!----- Mobile view (get variable "mobile" in url)
    let mobile = false;
    if (getQueryVariable('mobile')) {
        if (getQueryVariable('mobile') === 'true');
        mobile = true;
        orientation = 'portrait';
    }
    //!-----
    ////======  Create main device who have popup function   =======
    $device.classList.add('click');
    if (item.icon) {
        const $iconContainer = document.createElement('div');
        $iconContainer.style.textAlign = 'center';
        $iconContainer.style.alignItems = 'center';
        $iconContainer.classList.add('icon');
        const $icon = document.createElement('i');
        $icon.classList.add('mdi', item.icon);
        if (smallDevice) {
            var iconSize = window.dashboard.settings.iconSize / 1.5 || '12';
        }
        else {
            var iconSize = window.dashboard.settings.iconSize || '24';
        }
        //!----- Mobile view (get ratio)
        if (ratio) iconSize = iconSize / ratio;
        //!-----
        $icon.style.fontSize = `${iconSize}px`;
        $iconContainer.appendChild($icon);
        $device.appendChild($iconContainer);
    }

    if (item.capabilityID) {
        if (device.capabilitiesObj[item.capabilityID].value != false) $device.classList.toggle('on');
        //?-------  Differents icon on / off    ------
        if (item.icons) {
            if (item.icons.on && item.icons.off) {
                const val = device.capabilitiesObj[item.capabilityID].value;
                const $iconContainer = $device.querySelector('.icon');
                const $iconElement = $device.querySelector('.icon i');
                if ($iconContainer && $iconElement) {
                    if (val) {
                        $iconElement.classList.remove('mdi', item.icons.off);
                        $iconElement.classList.add('mdi', item.icons.on);
                    } else {
                        $iconElement.classList.remove('mdi', item.icons.on);
                        $iconElement.classList.add('mdi', item.icons.off);
                    }
                }
            }
        }
        //?-----  Extra class for icons   ------
        if (item.effectOn || item.effectOff) {
            const val = device.capabilitiesObj[item.capabilityID].value;
            const $iconElement = $device.querySelector('.icon i');
            if ($iconElement) {
                if (val) { //device ON
                    if (item.effectOff) $iconElement.classList.remove(item.effectOff);
                    if (item.effectOn) $iconElement.classList.add(item.effectOn);
                }
                else { //device OFF
                    if (item.effectOn) $iconElement.classList.remove(item.effectOn);
                    if (item.effectOff) $iconElement.classList.add(item.effectOff);
                }
            }
        }

        device.makeCapabilityInstance(item.capabilityID, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device) {
                $device.classList.toggle('on', !!value);
                if (item.icons && item.icons.on && item.icons.off) {
                    const $iconContainer = $device.querySelector('.icon');
                    const $iconElement = $device.querySelector('.icon i');

                    if ($iconContainer && $iconElement) {
                        $iconContainer.classList.toggle('off', !value);

                        if (value) { //device ON
                            $iconElement.classList.remove('mdi', item.icons.off);
                            $iconElement.classList.add('mdi', item.icons.on);

                        } else { //device OFF
                            $iconElement.classList.remove('mdi', item.icons.on);
                            $iconElement.classList.add('mdi', item.icons.off);

                        }
                    }
                }
                if (item.effectOn || item.effectOff) {
                    const $iconElement = $device.querySelector('.icon i');
                    if ($iconElement) {
                        if (value) { //device ON
                            if (item.effectOff) $iconElement.classList.remove(item.effectOff);
                            if (item.effectOn) $iconElement.classList.add(item.effectOn);
                        }
                        else { //device OFF
                            if (item.effectOn) $iconElement.classList.remove(item.effectOn);
                            if (item.effectOff) $iconElement.classList.add(item.effectOff);
                        }
                    }
                }
            }
        });
    }

    if (!item.capabilityID && item.type === 'VIRTUAL_POPUP' && !smooth) {
        $device.classList.toggle('on');
        if (item.icon) {
            const $iconContainer = $device.querySelector('.icon');
            $iconContainer.classList.add('off');
        }
    }

    if (item.name) {
        const tileSize = window.dashboard.settings.tileSize;
        let nameSize = tileSize / 100;
        let lineHeight = 1.5;
        //!----- Mobile view (get ratio)
        if (ratio) {
            nameSize = nameSize / ratio;
            lineHeight = lineHeight / ratio;
        }
        //!
        var $name = document.createElement('div');
        $name.classList.add('name');
        $name.innerHTML = item.name;
        $name.style.lineHeight = `${lineHeight}rem`;
        $name.style.fontSize = `${nameSize}rem`;
        $name.style.position = 'absolute';
        $name.style.bottom = '0';
        $name.style.left = '0';
        $device.appendChild($name);
    }//// END main device



    ////========    Create Popup      =========
    var popupWidth = tileWidth * item.popupWidth + (item.popupWidth + 1) * tileMargin;
    var popupHeight = tileHeight * item.popupHeight + (item.popupHeight + 1) * tileMargin;
    const $popupContainer = document.createElement('div');
    //!----- Mobile view (orientation === "portrait")
    if (orientation === "portrait" && mobile) {
        var deviceWidth = window.innerWidth;
        if (popupWidth > deviceWidth) {//if popup width is bigger than device width
            var ratio = popupWidth / deviceWidth;
            popupWidth = popupWidth / ratio;
            popupHeight = popupHeight / ratio;
            tileMargin = tileMargin / ratio;
            tileWidth = tileWidth / ratio;
            tileHeight = tileHeight / ratio;
        }
        else if (ratio) ratio = 1;
    }//!
    $popupContainer.classList.add('popup-container');
    $popupContainer.style.width = `${popupWidth}px`;
    $popupContainer.style.height = `${popupHeight}px`;
    $popupContainer.style.gap = `${tileMargin}px`;
    $popupContainer.style.padding = `${tileMargin}px`;

    $popupContainer.style.display = 'none';

    for (let row = 0; row < item.popupHeight; row++) {
        for (let col = 0; col < item.popupWidth; col++) {
            const $popupGridCell = document.createElement('div');
            $popupGridCell.classList.add('popup-grid-cell');
            $popupGridCell.style.width = `${tileWidth}px`;
            $popupGridCell.style.height = `${tileHeight}px`;
            $popupGridCell.style.gridRow = `${row + 1} / span 1`;
            $popupGridCell.style.gridColumn = `${col + 1} / span 1`;
            $popupContainer.appendChild($popupGridCell);
        }
    }

    ////=======     Create each device      =======
    let popupItemPos;//!<===========================================================
    let popupExtraID;
    item.items.forEach(popupItem => {
        const popupDevice = devices.find(device => device.id === popupItem.id);
        const popupItemType = popupItem.type;
        var smallDevice = false;
        if ((popupItem.height <= 1 && popupItem.orientation === 'horizontal') || (popupItem.width <= 1 && popupItem.orientation === 'vertical')) {
            smallDevice = true;
        }

        if (popupItem.position) popupItemPos = `${popupItem.position[0]}-${popupItem.position[1]}`;
        if (popupItemPos) popupExtraID = extraID + '-' + popupItemPos;

        if (popupDevice || popupItemType === 'IMAGE' || popupItemType === 'VIRTUAL') {
            const popupDeviceWidth = tileWidth * popupItem.width + (popupItem.width - 1) * tileMargin;
            const popupDeviceHeight = tileHeight * popupItem.height + (popupItem.height - 1) * tileMargin;
            const $popupDevice = document.createElement('div');
            if (popupItem.capabilityID) $popupDevice.id = 'device-' + popupItem.id + '-' + popupItem.capabilityID + popupExtraID; //+ extraID
            else $popupDevice.id = 'device-' + popupExtraID; //+ extraID il ne serai peut être même plus nécessaire de définir une id pour les type IMAGE ou VIRTUAL par exemple
            $popupDevice.classList.add('tile');
            $popupDevice.style.width = `${popupDeviceWidth}px`;
            $popupDevice.style.height = `${popupDeviceHeight}px`;
            $popupDevice.style.gridRow = `${popupItem.position[1] + 1} / span ${popupItem.height}`;
            $popupDevice.style.gridColumn = `${popupItem.position[0] + 1} / span ${popupItem.width}`;

            //?-----   type 
            if (popupItemType === 'SWITCH') createSwitch(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'BUTTON') createButton(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'IMAGE') createImage(popupDevice, popupItem, $popupDevice, smallDevice, devices, popupExtraID, smooth);
            else if (popupItemType === 'SENSOR') createSensor(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'BINARY_SENSOR') createBinarySensor(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'SLIDER') createSlider(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'THERMOSTAT') createThermostat(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'SHUTTER') createShutter(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'VIRTUAL') createVirtual(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'MEDIA') createMedia(popupDevice, popupItem, $popupDevice, smallDevice, devices, ratio, popupExtraID, smooth);
            else if (popupItemType === 'HEIMDALL') {
                console.error('type HEIMDALL can not be in a type POPUP');
                return;
            }
            else {
                console.error('Invalid device type in POPUP type! You entered:', popupItemType, 'in dashboard.js');
                return;
            }
            $popupContainer.appendChild($popupDevice);
        }
    });


    document.addEventListener('click', (event) => {
        if (!$popupContainer.contains(event.target)) {
            closePopup();
        }
    });

    $device.addEventListener('click', (event) => {
        event.stopPropagation();
        openPopup();
    });
    function openPopup() {
        $popupContainer.style.display = 'grid';
        $overlay.style.display = 'block';
    }

    function closePopup() {
        $popupContainer.style.display = 'none';
        $overlay.style.display = 'none';
    }

    $popupContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    document.body.appendChild($popupContainer);


    ////=======     Auto close popup      =======
    let popupTimeout;
    document.addEventListener('mousemove', function () {
        resetTimeout();
    });

    document.addEventListener('keypress', function () {
        resetTimeout();
    });

    document.addEventListener('touchmove', function () {
        resetTimeout();
    });


    function resetTimeout() {
        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(closePopup, 20000);
    }
    resetTimeout();






}//END type POPUP


