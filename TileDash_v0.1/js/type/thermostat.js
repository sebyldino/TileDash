////=====================    Type THERMOSTAT   ======================
function createThermostat(device, item, $device, smallDevice, devices) {
    let $thermostatValue;
    if(smallDevice) {
        console.error('type THERMOSTAT need to have width and height at least 2x2');
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
        //?----- Create text value
        const val = device.capabilitiesObj[item.capabilityID].value;
        $thermostatValue = document.createElement('div');
        $thermostatValue.classList.add('thermostatValue');
        $thermostatValue.style.fontSize = '150%';
        $thermostatValue.textContent = `${val}${item.unit || ''}`;
        $iconContainer.appendChild($icon);
        $iconContainer.appendChild($thermostatValue);
        $device.appendChild($iconContainer);
    }
    else {
        //?----- Create text value
        const val = device.capabilitiesObj[item.capabilityID].value;
        const $thermostatValue = document.createElement('div');
        $thermostatValue.classList.add('thermostatValue');
        $thermostatValue.style.fontSize = '150%';
        $thermostatValue.textContent = `${val}${item.unit || ''}`;
        $device.appendChild($thermostatValue);
    }

    //?-----    Create button on/off
    const $buttonOnOff = document.createElement('div');
    $buttonOnOff.classList.add('buttonOnOffThermostat');
    const $iconOnOff = document.createElement('i');
    $iconOnOff.id = 'buttonOnOff-' + item.id;
    $iconOnOff.classList.add('mdi', 'mdi-power');
    $buttonOnOff.appendChild($iconOnOff);
    $device.appendChild($buttonOnOff);

    //?-----    Create button + / -
    const $buttonContainer = document.createElement('div');
    $buttonContainer.classList.add("buttonContainerThermostat");
    const $buttonUp = document.createElement('button');
    $buttonUp.classList.add('buttonThermostat');
    $buttonUp.textContent = "+";
    $buttonUp.id = 'buttonUp-' + item.id;
    const $buttonDown = document.createElement('button');
    $buttonDown.classList.add('buttonThermostat');
    $buttonDown.textContent = "-";
    $buttonDown.id = 'buttonDown-' + item.id;
    $buttonContainer.appendChild($buttonUp);
    $buttonContainer.appendChild($buttonDown);
    $device.appendChild($buttonContainer);

    //?-----    Create state icon
    const $stateIcon = document.createElement('i');
    $stateIcon.classList.add('stateIconThermostat');
    $stateIcon.classList.add('mdi');
    $device.appendChild($stateIcon);

    if (item.capabilityID) {
        if (device.capabilitiesObj[item.onOffCapabilityID].value != false) $device.classList.toggle('on');
        if (device.capabilitiesObj[item.heatingCapabilityID].value != false) {
            $stateIcon.classList.add('heating');
            $stateIcon.classList.add(item.iconHeatingOn);
        }
        else {
            $stateIcon.classList.remove('heating');
            $stateIcon.classList.remove(item.iconHeatingOn);
            $stateIcon.classList.add(item.iconHeatingOff);
        }

        //?-----    Instance    ------
        device.makeCapabilityInstance(item.capabilityID, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID);
            if ($device) {
                $thermostatValue.textContent = `${value}${item.unit || ''}`;
            }
        });
        device.makeCapabilityInstance(item.heatingCapabilityID, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID);
            if ($device) {
                if (value) {
                    $stateIcon.classList.remove(item.iconHeatingOff);
                    $stateIcon.classList.add(item.iconHeatingOn);
                    $stateIcon.classList.add('heating');
                }
                else {
                    $stateIcon.classList.remove(item.iconHeatingOn);
                    $stateIcon.classList.add(item.iconHeatingOff);
                    $stateIcon.classList.remove('heating');
                }
            }
        });
        device.makeCapabilityInstance(item.onOffCapabilityID, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID);
            if ($device) {
                $device.classList.toggle('on', !!value);
            }
        });

        //?----- Button Up
        $buttonUp.addEventListener('click', function () {
            var value = device.capabilitiesObj[item.capabilityID].value + item.step;
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
            $thermostatValue.textContent = `${value}${item.unit || ''}`;
        });

        //?----- Button Down
        $buttonDown.addEventListener('click', function () {
            var value = device.capabilitiesObj[item.capabilityID].value - item.step;
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
            $thermostatValue.textContent = `${value}${item.unit || ''}`;
        });

        //?-----  On/Off
        $buttonOnOff.addEventListener('click', function () {
            var value = !$device.classList.contains('on');
            $device.classList.toggle('on', value);
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.onOffCapabilityID,
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
}//END type THEMOSTAT