////=====================    Type GAUGE   ======================
function createGauge(device, item, $device, smallDevice, devices, ratio, extraID, smooth) {
    /*
        {
            position: [0, 5],
            name: "Ch Lou",
            type: "SENSOR",
            width: 2,
            height: 2,
            maxValue: 50,
            id: "31f6ad71-64d5-4489-9b7f-31207da734c4",
            capabilityID: "measure_temperature",
            icon: "mdi-thermometer",
            unit: "°C",
            stepColor: {
          prim: {
            color: 'cyan', // or #0000ff color, or rgb(120,120,120)
            step: 18, // 0 to 18
          } ,
          sec: {
            color: 'lime',
            step: 23, // 18 to 23
          },
          third: {
            color: 'red', // higher than sec step  
          },
        },
        maxValue: 30,
      },
            secondValue: {
              capabilityID: 'measure_humidity',
              icon: 'mdi-water-percent',
              unit: '%',
            },
          },
    
          */



    if (item.width < 2 || item.height < 2) {
        console.error("Type 'GAUGE' must have a size of at least 2x2");
        return;
    }
    else if (item.width !== item.height) {
        console.error("Type 'GAUGE' need to be in square format (height and widht need to have same size)");
        return;
    }

    //+ Calculate gauge size
    const tileSize = parseInt($device.style.width);
    var gaugeSize;
    var gaugeCenterSize;
    var valueFontSize;
    if (item.secondValue) {
        gaugeSize = tileSize / 1.5;
        gaugeCenterSize = tileSize / 1.8;
        valueFontSize = 1;
    }
    else {
        gaugeSize = tileSize / 1.14;
        gaugeCenterSize = tileSize / 1.33;
        valueFontSize = 1.4;
    }
    if (ratio) {
        gaugeSize = gaugeSize / ratio;
        gaugeCenterSize = gaugeCenterSize / ratio;
    }


    const $gauge = document.createElement('div');
    $gauge.classList.add('gauge');
    $gauge.style.height = `${gaugeSize}px`;
    $gauge.style.width = `${gaugeSize}px`;
    const $gaugeCenter = document.createElement('div');
    $gaugeCenter.classList.add('gaugeCenter');
    $gaugeCenter.style.width = `${gaugeCenterSize}px`;
    $gaugeCenter.style.height = `${gaugeCenterSize}px`;
    $gauge.appendChild($gaugeCenter);
    $device.appendChild($gauge);


    const $gaugeValueContainer = document.createElement('div');
    $gaugeValueContainer.classList.add('gaugeValueContainer');
    $gaugeCenter.appendChild($gaugeValueContainer);



    if (item.icon) {
        const $iconContainer = document.createElement('div');
        $iconContainer.style.textAlign = 'center';
        $iconContainer.style.alignItems = 'center';
        $iconContainer.classList.add('icon');
        const $icon = document.createElement('i');
        $icon.classList.add('mdi', item.icon);
        var iconSize = (window.dashboard.settings.iconSize || '24') / ((1.5 - valueFontSize) + 1);

        //!----- Mobile view (get ratio)
        if (ratio) iconSize = iconSize / ratio;
        //!-----
        $icon.style.fontSize = `${iconSize}px`;
        $iconContainer.appendChild($icon);
        $gaugeValueContainer.appendChild($iconContainer);
        if (smooth) $icon.classList.add('smooth-icon-on');
    }




    if (!smooth) $device.classList.add('on');
    $device.style.display = 'flex';
    $device.style.justifyContent = 'center';
    $device.style.alignItems = 'center';
    const val = device.capabilitiesObj[item.capabilityID].value;
    const $gaugeValue = document.createElement('div');
    $gaugeValue.classList.add('gaugeValue');
    //!----- Mobile view (get ratio)
    if (ratio) valueFontSize = valueFontSize / ratio;
    //!-----
    $gaugeValue.style.fontSize = `${valueFontSize}rem`;
    updateGauge($gauge, $gaugeValue, val, (item.unit || ''), item.maxValue);
    // $gaugeValue.textContent = `${val}${item.unit || ''}`;
    $gaugeValueContainer.appendChild($gaugeValue);
    if (item.capabilityID) {
        device.makeCapabilityInstance(item.capabilityID, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
            if ($device) {
                updateGauge($gauge, $gaugeValue, value, (item.unit || ''), item.maxValue);
                // const $gaugeValue = $device.querySelector('.gaugeValue');
                //if ($gaugeValue) $gaugeValue.textContent = `${value} ${item.unit || ''}`;
            }
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



    //+++++     second value    +++++
    if (item.secondValue) {
        const $secondValueContainer = document.createElement('div');
        $secondValueContainer.classList.add('gaugeSecondValueContainer');
        $device.appendChild($secondValueContainer);

        if (item.secondValue.icon) {
            const $secondIcon = document.createElement('i');
            $secondIcon.classList.add('icon');
            $secondIcon.classList.add('mdi', item.secondValue.icon);
            $secondIcon.style.fontSize = `${iconSize / 1.6}px`;
            $secondValueContainer.appendChild($secondIcon);
            if (smooth) $secondIcon.classList.add('smooth-icon-off');
        }


        const $secondSensorValue = document.createElement('div');
        $secondSensorValue.classList.add('secondSensorValue');
        const secondVal = device.capabilitiesObj[item.secondValue.capabilityID].value;
        $secondSensorValue.style.fontSize = `${valueFontSize / 1.6}rem`;
        $secondSensorValue.textContent = `${secondVal}${item.secondValue.unit || ''}`;
        $secondValueContainer.appendChild($secondSensorValue);
        if (item.secondValue.capabilityID) {
            device.makeCapabilityInstance(item.secondValue.capabilityID, function (value) {
                var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
                if ($device) {
                    const $secondVal = $device.querySelector('.secondSensorValue');
                    if ($secondVal) $secondVal.textContent = `${value} ${item.secondSensor.unit || ''}`;
                }
            });
        }

    }


    ////=====   function updateGauge()  =====
    function updateGauge(gauge, gaugeValue, value, unit, maxVal) {
        gaugeValue.textContent = `${value} ${unit}`;
        const rotation = (value / maxVal) * 360;
        gauge.style.setProperty('--rotation', `${rotation}deg`);
        const root = document.documentElement;
        const gaugePrimColor = getComputedStyle(root).getPropertyValue('--gaugePrimColor').trim();
        const gaugeSecColor = getComputedStyle(root).getPropertyValue('--gaugeSecColor').trim();


        if (item.stepColor) {
            if (!item.stepColor.prim.color || !item.stepColor.sec.color || !item.stepColor.prim.step || !item.stepColor.sec.step) {
                console.error("Error of 'stepColor' for device name'" + item.name + "', type GAUGE: Wrong parameters!");
                const root = document.documentElement;
                const gaugeColor = getComputedStyle(root).getPropertyValue('--gaugeColor').trim();
                gauge.style.background = `conic-gradient(${gaugeColor} ${rotation}deg, ${gaugeSecColor} ${rotation}deg)`;
            }
            else {

                const primColor = item.stepColor.prim.color;
                const primStep = parseFloat(item.stepColor.prim.step);
                const secColor = item.stepColor.sec.color;
                const secStep = parseFloat(item.stepColor.sec.step);


                var thirdColor;
                if (item.stepColor.third.color) {
                    thirdColor = item.stepColor.third.color;
                }

                if (value <= primStep) gaugeColor = primColor;
                else if (value > primStep && value <= secStep) gaugeColor = secColor;
                else if (value > secStep && (thirdColor)) gaugeColor = thirdColor;
                else if (value > secStep && (!thirdColor)) gaugeColor = secColor;
                gauge.style.background = `conic-gradient(${gaugeColor} ${rotation}deg, ${gaugeSecColor} ${rotation}deg)`;

            }

        }
        else {
            gauge.style.background = `conic-gradient(${gaugePrimColor} ${rotation}deg, ${gaugeSecColor} ${rotation}deg)`;
        }

    }

}//END type GAUGE




