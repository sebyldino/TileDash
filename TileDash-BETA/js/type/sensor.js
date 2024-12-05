////=====================    Type SENSOR   ======================
function createSensor(device, item, $device, smallDevice, devices, ratio, extraID, smooth) {
  var smallDevice = false;
  const $valueContainer = document.createElement('div');
  $valueContainer.classList.add('sensorValueContainer');
  $device.appendChild($valueContainer);
  const $firstValueContainer = document.createElement('div');
  $firstValueContainer.classList.add('firstValueContainer');
  $valueContainer.appendChild($firstValueContainer);


  if (item.width <= 1) smallDevice = true;
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
    $firstValueContainer.appendChild($iconContainer);
    if (smooth) $icon.classList.add('smooth-icon-on');
  }
  let valueFontSize = 1.5;

  if (!smooth) $device.classList.add('on');
  $device.classList.add('sensor');
  $device.style.display = 'flex';
  $device.style.justifyContent = 'center';
  $device.style.alignItems = 'center';
  const val = device.capabilitiesObj[item.capabilityID].value;
  const $sensorValue = document.createElement('div');
  $sensorValue.classList.add('sensorValue');
  if (smallDevice) valueFontSize = 0.8;
  else valueFontSize = 1.5;
  //!----- Mobile view (get ratio)
  if (ratio) valueFontSize = valueFontSize / ratio;
  //!-----
  $sensorValue.style.fontSize = `${valueFontSize}rem`;
  $sensorValue.textContent = `${val}${item.unit || ''}`;
  $firstValueContainer.appendChild($sensorValue);
  if (item.capabilityID) {
    device.makeCapabilityInstance(item.capabilityID, function (value) {
      var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); //+ extraID
      if ($device) {
        const $sensorValue = $device.querySelector('.sensorValue');
        if ($sensorValue) $sensorValue.textContent = `${value} ${item.unit || ''}`;
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

  ///////////////////////////////////////////////////////////////
  if (item.secondValue) {
    if (smallDevice) $valueContainer.style.marginTop = '-1rem';
    const $secondValueContainer = document.createElement('div');
    $secondValueContainer.classList.add('firstValueContainer');
    $valueContainer.appendChild($secondValueContainer);

    if (item.secondValue.icon) {
      const $secondIcon = document.createElement('i');
      $secondIcon.classList.add('icon');
      $secondIcon.classList.add('mdi', item.secondValue.icon);
      $secondIcon.style.fontSize = `${iconSize}px`;
      $secondValueContainer.appendChild($secondIcon);
      if (smooth) $secondIcon.classList.add('smooth-icon-on');
    }


    const $secondSensorValue = document.createElement('div');
    $secondSensorValue.classList.add('secondSensorValue');
    const secondVal = device.capabilitiesObj[item.secondValue.capabilityID].value;
    $secondSensorValue.style.fontSize = `${valueFontSize}rem`;
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


  ///////////////////////////////////////////////////////////////


}//END type SENSOR