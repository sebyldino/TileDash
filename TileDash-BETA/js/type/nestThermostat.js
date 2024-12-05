////=====================    Type NEST_THERMOSTAT   ======================
/*
          //!===========================================
          {
            position: [0, 0],
            name: "Thermostat Atelier",
            type: "NEST_THERMOSTAT", //!\\
            width: 2,
            height: 2,
            step: 0.5,//!\\
            id: "12345-abcd-5678-efgh",
            capabilityID: "target_temperature", //!\\  target temperature capability
            icon: "mdi-thermometer",
            iconHeatingOn: "mdi-fire",//!\\
            iconHeatingOff: "mdi-fire-off",//!\\
            unit: '°C',//!\\
          },//
          //!===========================================
          */



function createNestThermostat(device, item, $device, smallDevice, devices, ratio, extraID, smooth) {
    if (smallDevice) {
        console.error('type NEST_THERMOSTAT need to have width and height at least 2x2');
        return;
    }

    const TARGET = 'target_temperature';
    const HUMIDITY = 'measure_humidity';
    const TEMPERATURE = 'measure_temperature';
    const ECO = 'nest_thermostat_eco'; //bool
    const MODE = 'nest_thermostat_mode'; //enum
    const HVAC = 'nest_thermostat_hvac'; //enum


    const targetTemp = device.capabilitiesObj[TARGET].value;
    const actualTemp = device.capabilitiesObj[TEMPERATURE].value;
    const actualHum = device.capabilitiesObj[HUMIDITY].value;
    const ecoStatus = device.capabilitiesObj[ECO].value;





    //?-----  Create icon
    let $targetTempValue;
    let $actualTempValue;
    let $actualHumValue;
    let fontSize = 1.5;

    if (item.icon) {
        //!----- Mobile view (get ratio)
        if (ratio) fontSize = fontSize / ratio;
        //!-----
        const $iconContainer = document.createElement('div');
        $iconContainer.style.textAlign = 'center';
        $iconContainer.style.alignItems = 'center';
        $iconContainer.style.justifyContent = 'center';
        $iconContainer.style.display = 'flex';
        $iconContainer.style.flexDirection = 'column';
        $iconContainer.classList.add('icon');
        const $icon = document.createElement('i');
        $icon.classList.add('mdi', item.icon);
        var iconSize = window.dashboard.settings.iconSize || '24';
        //!----- Mobile view (get ratio)
        if (ratio) iconSize = iconSize / ratio;
        //!-----
        $icon.style.fontSize = `${iconSize}px`;

        if (smooth) $icon.classList.add('smooth-icon-on');

        //?----- Create text value
        $targetTempValue = document.createElement('div');
        $targetTempValue.classList.add('targetValue');
        $targetTempValue.style.fontSize = `${fontSize}rem`;
        $targetTempValue.textContent = `${targetTemp}${item.unit || ''}`;

        const $actualContainer = document.createElement('div');
        $actualContainer.classList.add('actualTempThermostat');
        $actualContainer.style.fontSize = `${fontSize / 2}rem`;
        const $actualTempIcon = document.createElement('i');
        $actualTempIcon.classList.add('mdi', 'mdi-home-thermometer-outline');
        $actualTempIcon.style.marginRight = `${fontSize / 4}rem`;;
        $actualTempValue = document.createElement('p');
        $actualTempValue.classList.add('actualValue');
        $actualTempValue.textContent = `${actualTemp}${item.unit || ''}`;
        $actualContainer.appendChild($actualTempIcon);
        $actualContainer.appendChild($actualTempValue);


        $iconContainer.appendChild($icon);
        $iconContainer.appendChild($targetTempValue);
        $iconContainer.appendChild($actualContainer);
        $device.appendChild($iconContainer);
    }
    else {
        //?----- Create text value
        //!----- Mobile view (get ratio)
        if (ratio) fontSize = fontSize / ratio;
        //!-----
        var $actualContainer;

        const $valueContainer = document.createElement('div');
        $valueContainer.style.textAlign = 'center';
        $valueContainer.style.alignItems = 'center';
        $valueContainer.style.justifyContent = 'center';
        $valueContainer.style.display = 'flex';
        $valueContainer.style.flexDirection = 'column';

        $targetTempValue = document.createElement('div');
        $targetTempValue.classList.add('targetValue');
        $targetTempValue.style.fontSize = `${fontSize}rem`;
        $targetTempValue.textContent = `${targetTemp}${item.unit || ''}`;

        if (actualTemp) {
            $actualContainer = document.createElement('div');
            $actualContainer.classList.add('actualTempThermostat');
            $actualContainer.style.fontSize = `${fontSize / 2}rem`;
            const $actualTempIcon = document.createElement('i');
            $actualTempIcon.classList.add('mdi', 'mdi-home-thermometer-outline');
            $actualTempIcon.style.marginRight = `${fontSize / 4}rem`;

            $actualTempValue = document.createElement('p');
            $actualTempValue.classList.add('actualValue');
            $actualTempValue.textContent = `${actualTemp}${item.unit || ''}`;
            $actualContainer.appendChild($actualTempIcon);
            $actualContainer.appendChild($actualTempValue);
        }

        $valueContainer.appendChild($targetTempValue);
        if ($actualContainer) $valueContainer.appendChild($actualContainer);
        $device.appendChild($valueContainer);
    }




    /*
        //*****  create humidity report
        if (actualHum) {
            const $humidityContainer = document.createElement('div');
            $humidityContainer.classList.add('nestHumContainer');
            $humidityContainer.style.fontSize = `${fontSize / 2}rem`;
            const $humidityIcon = document.createElement('i');
            $humidityIcon.classList.add('mdi', 'mdi-water-percent', 'nestHumIcon');
    
            $actualHumValue = document.createElement('p');
            $actualHumValue.classList.add('nestHumValue');
            $actualHumValue.textContent = `${actualHum}${'%'}`;
            $humidityContainer.appendChild($humidityIcon);
            $humidityContainer.appendChild($actualHumValue);
            $device.appendChild($humidityContainer);
        }
    */









    //?-----    Create button on/off
    let buttonSize = 2;
    let buttonIconSize = 1.6;
    let stateIconSize = 1.3;
    //!----- Mobile view (get ratio)
    if (ratio) {
        buttonSize = buttonSize / ratio;
        buttonIconSize = buttonIconSize / ratio;
        stateIconSize = stateIconSize / ratio;
    }
    //!-----

    const $buttonOnOff = document.createElement('div');
    $buttonOnOff.classList.add('buttonOnOffThermostat');
    $buttonOnOff.style.width = `${buttonSize}rem`;
    $buttonOnOff.style.height = `${buttonSize}rem`;
    $buttonOnOff.style.fontSize = `${buttonIconSize}rem`;
    const $iconOnOff = document.createElement('i');
    $buttonOnOff.id = 'buttonOnOff-' + item.id;
    $iconOnOff.classList.add('mdi', 'mdi-power');
    if (smooth) {
        if (device.capabilitiesObj[MODE].value != 'off') $buttonOnOff.classList.add('smooth-on-thermostat');
        else $buttonOnOff.classList.add('smooth-off-thermostat')
    }

    $buttonOnOff.appendChild($iconOnOff);
    $device.appendChild($buttonOnOff);








    //?-----    Create button + / -
    let marginBottom = 0.3;
    //!----- Mobile view (get ratio)
    if (ratio) marginBottom = marginBottom / ratio;
    //!-----
    const $buttonContainer = document.createElement('div');
    $buttonContainer.classList.add("buttonContainerThermostat");

    const $buttonUp = document.createElement('div');
    $buttonUp.classList.add('buttonThermostat');
    $buttonUp.id = 'buttonUp-' + item.id;
    $buttonUp.style.width = `${buttonSize}rem`;
    $buttonUp.style.height = `${buttonSize}rem`;
    $buttonUp.style.fontSize = `${buttonIconSize}rem`;
    $buttonUp.style.marginBottom = `${marginBottom}rem`;
    const $iconButtonUp = document.createElement('i');
    $iconButtonUp.classList.add('mdi', 'mdi-plus');
    $buttonUp.appendChild($iconButtonUp);

    const $buttonDown = document.createElement('div');
    $buttonDown.classList.add('buttonThermostat');
    $buttonDown.id = 'buttonDown-' + item.id;
    $buttonDown.style.width = `${buttonSize}rem`;
    $buttonDown.style.height = `${buttonSize}rem`;
    $buttonDown.style.fontSize = `${buttonIconSize}rem`;
    $buttonDown.style.marginBottom = `${marginBottom}rem`;
    const $iconButtonDown = document.createElement('i');
    $iconButtonDown.classList.add('mdi', 'mdi-minus');
    $buttonDown.appendChild($iconButtonDown);

    $buttonContainer.appendChild($buttonUp);
    $buttonContainer.appendChild($buttonDown);
    $device.appendChild($buttonContainer);




    //?-----    Create state icon
    const $stateIcon = document.createElement('i');
    $stateIcon.classList.add('stateIconThermostat');
    $stateIcon.classList.add('mdi');
    $stateIcon.style.fontSize = `${stateIconSize}rem`;
    $device.appendChild($stateIcon);


    //*****  create eco icon
    if (ecoStatus) {
        const $ecoButton = document.createElement('div');
        $ecoButton.classList.add('nestEcoButton');
        $ecoButton.style.fontSize = `${stateIconSize}rem`;

        const $ecoIcon = document.createElement('i');
        $ecoIcon.classList.add('mdi', 'mdi-leaf', 'nestEcoIcon');

        $ecoButton.appendChild($ecoIcon);
        $device.appendChild($ecoButton);
    }


    if (item.capabilityID) {
        if (device.capabilitiesObj[MODE].value != 'off' && !smooth) $device.classList.toggle('on');
        if (device.capabilitiesObj[HVAC].value != 'off') {

            $stateIcon.classList.add('heating');
            $stateIcon.classList.add(item.iconHeatingOn);
        }
        else {
            $stateIcon.classList.remove('heating');
            $stateIcon.classList.remove(item.iconHeatingOn);
            $stateIcon.classList.add(item.iconHeatingOff);
        }








        //?-----    Instance    ------
        // target temp
        device.makeCapabilityInstance(TARGET, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device) {
                $targetTempValue.textContent = `${value}${item.unit || ''}`;
            }
        });

        // actual temp
        device.makeCapabilityInstance(TEMPERATURE, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device) {
                $actualTempValue.textContent = `${value}${item.unit || ''}`;
            }
        });

        // actual hulmidity
        device.makeCapabilityInstance(HUMIDITY, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device) {
                $actualHumValue.textContent = `${value}${'%'}`;
            }
        });

        // heating
        device.makeCapabilityInstance(HVAC, function (value) {
            var val;
            if (value === 'heating') val = true;
            else val = false;
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device) {
                if (val) {
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

        // on/off
        device.makeCapabilityInstance(MODE, function (value) {
            var val;
            if (value === 'heat') val = true;
            else val = false;
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device && !smooth) {
                $device.classList.toggle('on', !!val);
            }
            if ($device && smooth) {
                const onOffButton = document.getElementById('buttonOnOff-' + item.id);
                if (val) {
                    onOffButton.classList.remove('smooth-off-thermostat');
                    onOffButton.classList.add('smooth-on-thermostat');
                }
                else {
                    onOffButton.classList.remove('smooth-on-thermostat');
                    onOffButton.classList.add('smooth-off-thermostat');
                }
            }
        });


        // eco
        device.makeCapabilityInstance(ECO, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device) {
                $ecoButton.classList.toggle('off', value);
            }
        });










        //?----- Button Up
        $buttonUp.addEventListener('click', function () {
            $buttonUp.classList.add('smooth-button-pressed');
            setTimeout(function () {
                $buttonUp.classList.remove('smooth-button-pressed');
            }, 300);
            var value = device.capabilitiesObj[item.capabilityID].value + item.step;
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
            $targetTempValue.textContent = `${value}${item.unit || ''}`;
        });










        //?----- Button Down
        $buttonDown.addEventListener('click', function () {
            $buttonDown.classList.add('smooth-button-pressed');
            setTimeout(function () {
                $buttonDown.classList.remove('smooth-button-pressed');
            }, 300);
            var value = device.capabilitiesObj[item.capabilityID].value - item.step;
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: item.capabilityID,
                value: value,
            }).catch(console.error);
            $targetTempValue.textContent = `${value}${item.unit || ''}`;
        });








        //?-----  On/Off
        $buttonOnOff.addEventListener('click', function () {
            $buttonOnOff.classList.add('smooth-button-pressed');
            setTimeout(function () {
                $buttonOnOff.classList.remove('smooth-button-pressed');
            }, 300);
            var value;

            if (!smooth) {
                $device.classList.toggle('on', value);
                value = !$device.classList.contains('on');
            }
            if (smooth) {
                const onOffButton = document.getElementById('buttonOnOff-' + item.id);
                value = !onOffButton.classList.contains('smooth-on-thermostat');
            }
            var val;
            if (value) val = 'heat';
            else val = 'off';
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: MODE,
                value: val,
            }).catch(console.error);
        });



        //?-----  eco
        $ecoButton.addEventListener('click', function () {
            var value;
            value = !$ecoButton.classList.contains('off');
            homey.devices.setCapabilityValue({
                deviceId: device.id,
                capabilityId: ECO,
                value: value,
            }).catch(console.error);
        });

    }//END item.capabilityID










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
}//END type NEST_THERMOSTAT