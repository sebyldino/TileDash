////=====================    Type SHUTTER   ======================
function createShutter(device, item, $device, smallDevice, devices, ratio, extraID) {
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
    $buttonUp.style.fontSize = `${buttonFontSize}rem`;
    $iconButtonUp.classList.add('mdi', item.icons.up);
    $iconButtonUp.classList.add('shutterIcon');
    $buttonUp.appendChild($iconButtonUp);

    //?-----    IDLE
    const $buttonIdle = document.createElement('button');
    const $iconButtonIdle = document.createElement('i');
    $buttonIdle.id = 'buttonIdle-' + item.id;
    $buttonIdle.classList.add('shutterButton');
    $buttonIdle.style.width = `${buttonSize}rem`;
    $buttonIdle.style.height = `${buttonSize}rem`;
    $buttonIdle.style.fontSize = `${buttonFontSize}rem`;
    $iconButtonIdle.classList.add('mdi', item.icons.idle);
    $iconButtonIdle.classList.add('shutterIcon');
    $buttonIdle.appendChild($iconButtonIdle);

    //?-----    DOWN
    const $buttonDown = document.createElement('button');
    const $iconButtonDown = document.createElement('i');
    $buttonDown.id = 'buttonDown-' + item.id;
    $buttonDown.classList.add('shutterButton');
    $buttonDown.style.width = `${buttonSize}rem`;
    $buttonDown.style.height = `${buttonSize}rem`;
    $buttonDown.style.fontSize = `${buttonFontSize}rem`;
    $iconButtonDown.classList.add('mdi', item.icons.down);
    $iconButtonDown.classList.add('shutterIcon');
    $buttonDown.appendChild($iconButtonDown);

    $buttonContainer.appendChild($buttonUp);
    $buttonContainer.appendChild($buttonIdle);
    $buttonContainer.appendChild($buttonDown);
    $device.appendChild($buttonContainer);

    if (item.capabilityID) {
        if (device.capabilitiesObj[item.capabilityID].value != false) $device.classList.toggle('on');

        //?----- Button Up
        $buttonUp.addEventListener('click', function () {
            $iconButtonUp.classList.add('pressed');
            setTimeout(function () {
                $iconButtonUp.classList.remove('pressed');
            }, 1000);
            var value = "up";
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
        });

        //?----- Button Idle
        $buttonIdle.addEventListener('click', function () {
            $iconButtonIdle.classList.add('pressed');
            setTimeout(function () {
                $iconButtonIdle.classList.remove('pressed');
            }, 1000);
            var value = "idle";
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
        });

        //?----- Button Down
        $buttonDown.addEventListener('click', function () {
            $iconButtonDown.classList.add('pressed');
            setTimeout(function () {
                $iconButtonDown.classList.remove('pressed');
            }, 1000);
            var value = "down";
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
        });
    }


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

}//END create sutter