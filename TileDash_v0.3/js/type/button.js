////=====================    Type BUTTON   ======================
function createButton(device, item, $device, smallDevice, devices, ratio, extraID) {
    var BUTTON_CAPABILITY = true;

    $device.classList.toggle('on');
    $device.addEventListener('click', function () {
        $device.classList.remove('on');

        //?----- After 1 second, remove the 'on' class    -----
        setTimeout(function () {
            $device.classList.toggle('on');
        }, 1000);
        //?-----    Use deviceID and capabilityID to set action   -----
        homey.devices.setCapabilityValue({
            deviceId: device.id,
            capabilityId: item.capabilityID,
            value: BUTTON_CAPABILITY,
        }).catch(console.error);
    });

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

    if (item.icons) {
        const sensorDeviceID = item.icons.sensorID;
        const sensorCapabilityID = item.icons.capabilityID;

        if (sensorDeviceID && sensorCapabilityID) {
            const sensorDevice = devices.find(device => device.id === sensorDeviceID);

            if (sensorDevice) {
                const updateIcon = () => {
                    const sensorValue = sensorDevice.capabilitiesObj[sensorCapabilityID].value;
                    const iconContainer = $device.querySelector('.icon');
                    const iconElement = $device.querySelector('.icon i');

                    if (iconContainer && iconElement) {
                        iconContainer.classList.toggle('off', !sensorValue);

                        if (sensorValue) {
                            iconElement.classList.remove('mdi', item.icons.off);
                            iconElement.classList.add('mdi', item.icons.on);
                        } else {
                            iconElement.classList.remove('mdi', item.icons.on);
                            iconElement.classList.add('mdi', item.icons.off);
                        }
                    }
                };
                sensorDevice.makeCapabilityInstance(sensorCapabilityID, updateIcon);
                updateIcon();
            }
        }
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
}//END type BUTTON