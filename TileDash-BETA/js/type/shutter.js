////=====================    Type SHUTTER   ======================
function createShutter(device, item, $device, smallDevice, devices, ratio, extraID, smooth) {
    if (smallDevice) {
        console.error('type SHUTTER need to have width and height at least 2x2');
        return;
    }

    //?-----  Create icon
    if (item.icon) {
        const $iconContainer = document.createElement('div');
        $iconContainer.style.textAlign = 'center';
        $iconContainer.style.alignItems = 'center';
        $iconContainer.classList.add('icon');
        const $icon = document.createElement('i');
        $icon.classList.add('mdi', item.icon);
        var iconSize = window.dashboard.settings.iconSize || '24';
        //!----- Mobile view (get ratio)
        if (ratio) iconSize = iconSize / ratio;
        //!-----
        $icon.style.fontSize = `${iconSize}px`;
        $iconContainer.appendChild($icon);
        $device.appendChild($iconContainer);
        if (smooth) $icon.classList.add('smooth-icon-on');
    }

    //?-----    Create UP, DOWN, IDLE buttons
    let marginLeft = 1.5;
    //!----- Mobile view (get ratio)
    if (ratio) marginLeft = marginLeft / ratio;
    const $buttonContainer = document.createElement('div');
    $buttonContainer.classList.add('shutterButtonContainer');
    $buttonContainer.style.marginLeft = `${marginLeft}rem`;

    //?------   UP
    let buttonSize = 2;
    let buttonFontSize = 2;
    //!----- Mobile view (get ratio)
    if (ratio) {
        buttonSize = buttonSize / ratio;
        buttonFontSize = buttonFontSize / ratio;
    }
    //!-----
    const $buttonUp = document.createElement('button');
    const $iconButtonUp = document.createElement('i');
    $buttonUp.id = 'buttonUp-' + item.id;
    $buttonUp.classList.add('shutterButton');
    $buttonUp.style.width = `${buttonSize}rem`;
    $buttonUp.style.height = `${buttonSize}rem`;
    if (!smooth) {
        $iconButtonUp.classList.add('mdi', item.icons.up);
        $buttonUp.style.fontSize = `${buttonFontSize}rem`;
    }
    else {
        $iconButtonUp.classList.add('mdi', 'mdi-triangle');
        $buttonUp.style.fontSize = `${buttonFontSize / 1.6}rem`;
    }
    $iconButtonUp.classList.add('shutterIcon');
    $buttonUp.appendChild($iconButtonUp);

    //?-----    IDLE
    const $buttonIdle = document.createElement('button');
    const $iconButtonIdle = document.createElement('i');
    $buttonIdle.id = 'buttonIdle-' + item.id;
    $buttonIdle.classList.add('shutterButton');
    $buttonIdle.style.width = `${buttonSize}rem`;
    $buttonIdle.style.height = `${buttonSize}rem`;
    if (!smooth) {
        $iconButtonIdle.classList.add('mdi', item.icons.idle);
        $buttonIdle.style.fontSize = `${buttonFontSize}rem`;
    }
    else {
        $iconButtonIdle.classList.add('mdi', 'mdi-square', 'shutterIconIdle');
        $buttonIdle.style.fontSize = `${buttonFontSize / 1.6}rem`;
    }
    $iconButtonIdle.classList.add('shutterIcon');
    $buttonIdle.appendChild($iconButtonIdle);

    //?-----    DOWN
    const $buttonDown = document.createElement('button');
    const $iconButtonDown = document.createElement('i');
    $buttonDown.id = 'buttonDown-' + item.id;
    $buttonDown.classList.add('shutterButton');
    $buttonDown.style.width = `${buttonSize}rem`;
    $buttonDown.style.height = `${buttonSize}rem`;
    if (!smooth) {
        $iconButtonDown.classList.add('mdi', item.icons.down);
        $buttonDown.style.fontSize = `${buttonFontSize}rem`;
    }
    else {
        $iconButtonDown.classList.add('mdi', 'mdi-triangle-down', 'shutterIconDown');
        $buttonDown.style.fontSize = `${buttonFontSize / 1.6}rem`;
    }
    $iconButtonDown.classList.add('shutterIcon');
    $buttonDown.appendChild($iconButtonDown);

    $buttonContainer.appendChild($buttonUp);
    $buttonContainer.appendChild($buttonIdle);
    $buttonContainer.appendChild($buttonDown);
    $device.appendChild($buttonContainer);

    if (item.capabilityID) {
        if (device.capabilitiesObj[item.capabilityID].value != false && !smooth) $device.classList.toggle('on');

        //?----- Button Up
        $buttonUp.addEventListener('click', function () {
            $buttonUp.classList.add('smooth-button-pressed');
            $iconButtonUp.classList.add('pressed');
            setTimeout(function () {
                $buttonUp.classList.remove('smooth-button-pressed');
                $iconButtonUp.classList.remove('pressed');
            }, 300);
            var value = "up";
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
        });

        //?----- Button Idle
        $buttonIdle.addEventListener('click', function () {
            $buttonIdle.classList.add('smooth-button-pressed');
            $iconButtonIdle.classList.add('pressed');
            setTimeout(function () {
                $buttonIdle.classList.remove('smooth-button-pressed');
                $iconButtonIdle.classList.remove('pressed');
            }, 300);
            var value = "idle";
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
        });

        //?----- Button Down
        $buttonDown.addEventListener('click', function () {
            $buttonDown.classList.add('smooth-button-pressed');
            $iconButtonDown.classList.add('pressed');
            setTimeout(function () {
                $buttonDown.classList.remove('smooth-button-pressed');
                $iconButtonDown.classList.remove('pressed');
            }, 300);
            var value = "down";
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
        });
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

}//END create sutter