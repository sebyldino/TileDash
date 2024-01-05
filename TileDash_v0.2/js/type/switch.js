////=====================    Type SWITCH   ======================
function createSwitch(device, item, $device, smallDevice, devices, ratio, extraID) {

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

        //?-----    Instance    ------
        device.makeCapabilityInstance(item.capabilityID, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); 

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

        if (item.clickable != false) {
            $device.addEventListener('click', function () {
                var value = !$device.classList.contains('on');
                $device.classList.toggle('on', value);
                homey.devices.setCapabilityValue({
                    deviceId: device.id,
                    capabilityId: item.capabilityID,
                    value: value,
                }).catch(console.error);
            });
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

}//END type SWITCH