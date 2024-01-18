////=====================    Type HEIMDALL   ======================
var $codeEntered = "";
var $codePrint = "";
var $codeText;
const $keyPadContainer = document.createElement('div');
const $heimdallButtonContainer = document.createElement('div');


function createHeimdall(device, item, $device, smallDevice, devices, ratio, extraID) {
    var tileWidth = window.dashboard.settings.tileSize;
    var tileHeight = window.dashboard.settings.tileSize;
    var tileMargin = window.dashboard.settings.tileMargin;
    const heimdallPopupWidth = 3;
    const heimdallPopupHeight = 5;
    const $overlay = document.getElementById('overlay');

    let orientation = window.dashboard.settings.orientation;
    if (getQueryVariable('orientation')) {
        const orient = getQueryVariable('orientation');
        if (orient === 'portrait') orientation = orient;
        if (orient === 'landscape') orientation = orient;
    }




    ////=======     Create main device
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
    }//

    if (item.capabilityID) {
        if (device.capabilitiesObj[item.capabilityID].value != false) $device.classList.toggle('on');

        //?-----    Differents icons states
        if (item.icons) {
            if (item.icons.armed && item.icons.partiallyArmed && item.icons.disarmed) {
                const val = device.capabilitiesObj[item.capabilityID].value;
                const $iconContainer = $device.querySelector('.icon');
                const $iconElement = $device.querySelector('.icon i');
                if ($iconContainer && $iconElement) {
                    if (val === 'armed') {
                        $iconElement.classList.remove('mdi', item.icons.disarmed);
                        $iconElement.classList.remove('mdi', item.icons.partiallArmed);
                        $iconElement.classList.add('mdi', item.icons.armed);
                        $iconElement.classList.add('iconArmed');
                    }
                    else if (val === 'partially_armed') {
                        $iconElement.classList.remove('mdi', item.icons.armed);
                        $iconElement.classList.remove('mdi', item.icons.disarmed);
                        $iconElement.classList.add('mdi', item.icons.partiallArmed);
                        $iconElement.classList.add('iconPartiallyArmed');
                    }
                    else {
                        $iconElement.classList.remove('mdi', item.icons.armed);
                        $iconElement.classList.remove('mdi', item.icons.partiallArmed);
                        $iconElement.classList.add('mdi', item.icons.disarmed);
                        $iconElement.classList.add('iconDisarmed');
                    }
                }
            }
        }//?


        //?-----       Make instance
        device.makeCapabilityInstance(item.capabilityID, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); 
            if ($device) {
                if (item.icons && item.icons.armed && item.icons.disarmed && item.icons.partiallyArmed) {
                    const $iconContainer = $device.querySelector('.icon');
                    const $iconElement = $device.querySelector('.icon i');

                    if ($iconContainer && $iconElement) {

                        if (value === 'armed') { //alarm ARMED
                            $iconElement.classList.remove('mdi', item.icons.partiallArmed);
                            $iconElement.classList.remove('mdi', item.icons.disarmed);
                            $iconElement.classList.remove('iconPartiallyArmed');
                            $iconElement.classList.remove('iconDisarmed');
                            $iconElement.classList.add('mdi', item.icons.armed);
                            $iconElement.classList.add('iconArmed');

                        } else if (value === 'partially_armed') { //alarm PARTIALLY ARMED
                            $iconElement.classList.remove('mdi', item.icons.armed);
                            $iconElement.classList.remove('mdi', item.icons.disarmed);
                            $iconElement.classList.remove('iconArmed');
                            $iconElement.classList.remove('iconDisarmed');
                            $iconElement.classList.add('mdi', item.icons.partiallArmed);
                            $iconElement.classList.add('iconPartiallyArmed');
                        }
                        else { //alarm DISARMED
                            $iconElement.classList.remove('mdi', item.icons.armed);
                            $iconElement.classList.remove('mdi', item.icons.partiallArmed);
                            $iconElement.classList.remove('iconArmed');
                            $iconElement.classList.remove('iconPartiallyArmed');
                            $iconElement.classList.add('mdi', item.icons.disarmed);
                            $iconElement.classList.add('iconDisarmed');
                        }
                    }
                }
            }
        });//?
    }//? END if capabilityID

    //?-----    Name
    if (item.name) {
        let nameSize = 0.8;
        let lineHeight = 1.5;
        //!----- Mobile view (get ratio)
        if (ratio) {
            nameSize = nameSize / ratio;
            lineHeight = lineHeight / ratio;
        }
        //!-----
        var $name = document.createElement('div');
        $name.classList.add('name');
        $name.innerHTML = item.name;
        $name.style.lineHeight = `${lineHeight}rem`;
        $name.style.fontSize = `${nameSize}rem`;
        $name.style.position = 'absolute';
        $name.style.bottom = '0';
        $name.style.left = '0';
        $device.appendChild($name);
    }
    //// END main device




    ////========    Create Heimdall popup      =========
    var popupWidth = tileWidth * heimdallPopupWidth + (heimdallPopupWidth + 1) * tileMargin;
    var popupHeight = tileHeight * heimdallPopupHeight + (heimdallPopupHeight + 1) * tileMargin;
    const $popupContainer = document.createElement('div');
    //!----- Mobile view (orientation === "portrait")
    if (orientation === "portrait") {
        var deviceWidth = window.innerWidth;
        if (popupWidth > deviceWidth) { //if popup width is bigger than device width
            var ratio = popupWidth / deviceWidth;
            popupWidth = popupWidth / ratio;
            popupHeight = popupHeight / ratio;
            tileMargin = tileMargin / ratio;
            tileWidth = tileWidth / ratio;
            tileHeight = tileHeight / ratio;
        }
    }//!
    $popupContainer.classList.add('popup-container');
    $popupContainer.id = 'heimdall-' + item.capabilityID;
    $popupContainer.style.width = `${popupWidth}px`;
    $popupContainer.style.height = `${popupHeight}px`;
    $popupContainer.style.gap = `${tileMargin}px`;
    $popupContainer.style.padding = `${tileMargin}px`;
    $popupContainer.style.display = 'none';
    createKeyPad();
    createHeimdallButton();

    for (let row = 0; row < heimdallPopupHeight; row++) {
        for (let col = 0; col < heimdallPopupWidth; col++) {
            const $popupGridCell = document.createElement('div');
            $popupGridCell.classList.add('popup-grid-cell');
            $popupGridCell.style.width = `${tileWidth}px`;
            $popupGridCell.style.height = `${tileHeight}px`;
            $popupGridCell.style.gridRow = `${row + 1} / span 1`;
            $popupGridCell.style.gridColumn = `${col + 1} / span 1`;
            $popupContainer.appendChild($popupGridCell);
        }
    }


    let val = device.capabilitiesObj[item.capabilityID].value;
    //?-----    If there is a code defined
    if (item.code && val != 'disarmed') {
        $keyPadContainer.style.display = 'contents';
    }
    //?-----    If no code defined
    if (!item.code || (item.code && val === 'disarmed')) {
        $heimdallButtonContainer.style.display = 'flex';
    }


    function createKeyPad() {
        $keyPadContainer.style.display = 'none';
        $codeText = document.createElement('p');
        $codeText.classList.add('codeTextHeimdall');
        $codeText.textContent = 'Enter your code';
        $keyPadContainer.appendChild($codeText);
        for (let key = 1; key <= 11; key++) {
            var line = 1;
            if (key > 3 && key <= 6) line = 2;
            if (key > 6 && key <= 9) line = 3;
            if (key >= 10) line = 4;
            const touchWidth = tileWidth * 1 + (1 - 1) * tileMargin;
            const touchHeight = tileHeight * 1 + (1 - 1) * tileMargin;
            const $touchKey = document.createElement('div');
            $touchKey.id = 'touchKey-' + key;
            $touchKey.classList.add('tile');
            $touchKey.classList.add('on');
            $touchKey.textContent = key;
            $touchKey.style.fontSize = '2rem';
            if (key === 10) $touchKey.textContent = 0;
            if (key === 11) {
                $touchKey.textContent = 'X'
                $touchKey.style.backgroundColor = 'rgb(145, 42, 11)';
            }
            $touchKey.style.width = `${touchWidth}px`;
            if (key === 10) $touchKey.style.width = `${touchWidth * 2 + tileMargin}px`;
            $touchKey.style.height = `${touchHeight}px`;
            $touchKey.style.gridRow = `${line + 1} / span ${1}`;
            if (line === 1) $touchKey.style.gridColumn = `${key} / span ${1}`;
            if (line === 2) $touchKey.style.gridColumn = `${key - 3} / span ${1}`;
            if (line === 3) $touchKey.style.gridColumn = `${key - 6} / span ${1}`;
            if (line === 4 && key === 10) $touchKey.style.gridColumn = `${key - 9} / span ${2}`;
            if (line === 4 && key === 11) $touchKey.style.gridColumn = `${key - 8} / span ${1}`;

            $touchKey.addEventListener('click', function (event) {
                if ($touchKey.id != 'touchKey-11') {
                    $codeEntered = $codeEntered + $touchKey.textContent;
                    $codePrint = $codePrint + "•";
                    $codeText.textContent = $codePrint;
                    console.log($codeEntered);
                    checkCode(item.code, $codeEntered);
                    //console.log('Touche cliquée: ', $touchKey.textContent);
                }
                else {
                    $codeEntered = "";
                    $codePrint = "";
                    $codeText.textContent = "Enter your code";
                }
            });
            $keyPadContainer.appendChild($touchKey);
            $popupContainer.appendChild($keyPadContainer);
        }
    }




    function createHeimdallButton() {
        $heimdallButtonContainer.classList.add('heimdallButtonContainer');
        $heimdallButtonContainer.style.display = 'none';

        //?-----     Armed button
        const $buttonArmed = document.createElement('button');
        $buttonArmed.classList.add('heimdallButton', 'armed');
        $buttonArmed.id = 'heimdallButton-armed';
        const $iconArmed = document.createElement('i');
        $iconArmed.classList.add('mdi', item.icons.armed);
        const $textArmed = document.createElement('p');
        $textArmed.classList.add('heimdallText');
        $textArmed.textContent = "Armed";
        $buttonArmed.appendChild($iconArmed);
        $buttonArmed.appendChild($textArmed);
        $heimdallButtonContainer.appendChild($buttonArmed);

        //?-----    Partially Armed button
        const $buttonPartiallyArmed = document.createElement('button');
        $buttonPartiallyArmed.classList.add('heimdallButton', 'partiallyArmed');
        $buttonPartiallyArmed.id = 'heimdallButton-partiallyArmed';
        const $iconPartiallyArmed = document.createElement('i');
        $iconPartiallyArmed.classList.add('mdi', item.icons.partiallyArmed);
        const $textPartiallyArmed = document.createElement('p');
        $textPartiallyArmed.classList.add('heimdallText');
        $textPartiallyArmed.textContent = 'Partially Armed';
        $buttonPartiallyArmed.appendChild($iconPartiallyArmed);
        $buttonPartiallyArmed.appendChild($textPartiallyArmed);
        $heimdallButtonContainer.appendChild($buttonPartiallyArmed);

        //?-----    Disarmed button
        const $buttonDisarmed = document.createElement('button');
        $buttonDisarmed.classList.add('heimdallButton', 'disarmed');
        $buttonDisarmed.id = 'heimdallButton-disarmed';
        const $iconDisarmed = document.createElement('i');
        $iconDisarmed.classList.add('mdi', item.icons.disarmed);
        const $textDisarmed = document.createElement('p');
        $textDisarmed.classList.add('heimdallText');
        $textDisarmed.textContent = "Disarmed";
        $buttonDisarmed.appendChild($iconDisarmed);
        $buttonDisarmed.appendChild($textDisarmed);
        $heimdallButtonContainer.appendChild($buttonDisarmed);

        $popupContainer.appendChild($heimdallButtonContainer);

        //?-----    Onclick
        $buttonArmed.addEventListener('click', function () {
            var value = 'armed';
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,

            }).catch(console.error);
            $buttonArmed.classList.add('pressed');
            setTimeout(function () {
                $buttonArmed.classList.remove('pressed');
            }, 1000);
        });

        $buttonPartiallyArmed.addEventListener('click', function () {
            var value = 'partially_armed';
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
            $buttonPartiallyArmed.classList.add('pressed');
            setTimeout(function () {
                $buttonPartiallyArmed.classList.remove('pressed');
            }, 1000);
        });

        $buttonDisarmed.addEventListener('click', function () {
            var value = 'disarmed';
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
            $buttonDisarmed.classList.add('pressed');
            setTimeout(function () {
                $buttonDisarmed.classList.remove('pressed');
            }, 1000);
        });



    }//? END createHeimdallButton()





    //?-----    Onclick Event Popup
    $device.addEventListener('click', (event) => {//Open popup
        event.stopPropagation();
        openHeimdallPopup();
    });

    document.addEventListener('click', (event) => { //Close popup
        if (!$popupContainer.contains(event.target)) {
            closeHeimdallPopup();
        }
    });
    $popupContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    document.body.appendChild($popupContainer);


    ////================  Function  ==========

    function openHeimdallPopup() {
        val = device.capabilitiesObj[item.capabilityID].value;
        $popupContainer.style.display = 'grid';
        $overlay.style.display = 'block';
        if (item.code && val != 'disarmed') $keyPadContainer.style.display = 'contents';
        else $heimdallButtonContainer.style.display = 'flex';
    }

    function closeHeimdallPopup() {
        $popupContainer.style.display = 'none';
        $overlay.style.display = 'none';
        $heimdallButtonContainer.style.display = 'none';
        $keyPadContainer.style.display = 'none';
    }


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
            popupTimeout = setTimeout(closeHeimdallPopup, 20000);
        }
        resetTimeout();


}//END type Heimdall


//=====     Check Code function
function checkCode(code, codeEntered) {
    if (code.length === codeEntered.length) {
        if (codeEntered === code) {
            $codeEntered = "";
            $codePrint = "";
            $codeText.textContent = "Enter your code";
            $keyPadContainer.style.display = 'none';
            $heimdallButtonContainer.style.display = 'flex';
        } else {
            $codeEntered = "";
            $codePrint = "";
            $codeText.textContent = "Wrong code!";
            setTimeout(function () {
                $codeText.textContent = "Enter your code";
            }, 1000);
        }
    }
}
