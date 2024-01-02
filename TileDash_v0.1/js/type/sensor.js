 ////=====================    Type SENSOR   ======================
 function createSensor(device, item, $device, smallDevice, devices) {
    var smallDevice = false;
    if (item.width <= 1) smallDevice = true;
    if (item.icon) {
      const $iconContainer = document.createElement('div');
      $iconContainer.style.textAlign = 'center';
      $iconContainer.style.alignItems = 'center';
      $iconContainer.classList.add('icon');
      const $icon = document.createElement('i');
      $icon.classList.add('mdi', item.icon);
      if (smallDevice) {
        var iconSize = window.dashboard.settings.iconSize / 1.5 || '12px';
      }
      else {
        var iconSize = window.dashboard.settings.iconSize || '24px';
      }
      $icon.style.fontSize = `${iconSize}px`;
      $iconContainer.appendChild($icon);
      $device.appendChild($iconContainer);
    }
    $device.classList.add('on');
    $device.classList.add('sensor');
    $device.style.display = 'flex';
    $device.style.justifyContent = 'center';
    $device.style.alignItems = 'center';
    const val = device.capabilitiesObj[item.capabilityID].value;
    const $sensorValue = document.createElement('div');
    $sensorValue.classList.add('sensorValue');
    if (smallDevice) $sensorValue.style.fontSize = '80%';
    else $sensorValue.style.fontSize = '150%';
    $sensorValue.textContent = `${val}${item.unit || ''}`;
    $device.appendChild($sensorValue);
    if (item.capabilityID) {
      device.makeCapabilityInstance(item.capabilityID, function (value) {
        var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID);
        if ($device) {
          const $sensorValue = $device.querySelector('.sensorValue');
          if ($sensorValue) $sensorValue.textContent = `${value} ${item.unit || ''}`;
        }
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
  }//END type SENSOR