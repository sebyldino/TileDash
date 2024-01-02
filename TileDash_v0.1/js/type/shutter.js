////=====================    Type SHUTTER   ======================
function createShutter(device, item, $device, smallDevice, devices) {
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
        const iconSize = window.dashboard.settings.iconSize || '24px';
        $icon.style.fontSize = `${iconSize}px`;
        $iconContainer.appendChild($icon);
        $device.appendChild($iconContainer);
    }

    //?-----    Create UP, DOWN, IDLE buttons
    const $buttonContainer = document.createElement('div');
    $buttonContainer.classList.add('shutterButtonContainer');

    //?------   UP
    const $buttonUp = document.createElement('button');
    const $iconButtonUp = document.createElement('i');
    $buttonUp.id = 'buttonUp-' + item.id;
    $buttonUp.classList.add('shutterButton');
    $iconButtonUp.classList.add('mdi', item.icons.up);
    $iconButtonUp.classList.add('shutterIcon');
    $buttonUp.appendChild($iconButtonUp);

    //?-----    IDLE
    const $buttonIdle = document.createElement('button');
    const $iconButtonIdle = document.createElement('i');
    $buttonIdle.id = 'buttonIdle-' + item.id;
    $buttonIdle.classList.add('shutterButton');
    $iconButtonIdle.classList.add('mdi', item.icons.idle);
    $iconButtonIdle.classList.add('shutterIcon');
    $buttonIdle.appendChild($iconButtonIdle);

    //?-----    DOWN
    const $buttonDown = document.createElement('button');
    const $iconButtonDown = document.createElement('i');
    $buttonDown.id = 'buttonDown-' + item.id;
    $buttonDown.classList.add('shutterButton');
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
        var $name = document.createElement('div');
        $name.classList.add('name');
        $name.innerHTML = item.name;
        $name.style.position = 'absolute';
        $name.style.bottom = '0';
        $name.style.left = '0';
        $device.appendChild($name);
    }

}//END create sutter