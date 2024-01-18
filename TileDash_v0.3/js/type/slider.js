////=====================    Type SLIDER   ======================
function createSlider(device, item, $device, smallDevice, devices, ratio, extraID) {
  var multiplier = 1;
  if (item.capabilityID === 'dim') multiplier = 100;
  if (item.icon) {
    const $iconContainer = document.createElement('div');
    $iconContainer.style.textAlign = 'center';
    $iconContainer.style.position = 'absolute';
    $iconContainer.style.top = '0';
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
    $device.appendChild($iconContainer);
  }





  if (item.capabilityID) {
    $device.classList.add('sliderTile');
    if (item.orientation === 'horizontal') $device.classList.add('horizontal');
    else if (item.orientation === 'vertical') {
      $device.classList.add('vertical');
      $device.style.flexDirection = 'column';
    }


    if (smallDevice) $device.classList.add('small');

    const $sliderContainer = document.createElement('div');
    $sliderContainer.classList.add('sliderContainer');
    $sliderContainer.style.display = 'flex';
    $sliderContainer.style.justifyContent = 'center';
    $sliderContainer.style.alignItems = 'center';

    const $slider = document.createElement('input');
    $slider.classList.add("sliderTrack");
    $slider.style.width = "100%";
    $slider.type = 'range';
    $slider.min = item.minValue;
    $slider.max = item.maxValue;
    $slider.step = item.step;
    $slider.value = device.capabilitiesObj[item.capabilityID].value || '0';
    if (parseFloat($slider.value) > 0) {
      $device.classList.add('on');
    }
    $sliderContainer.appendChild($slider);




    //1.5rem pour les grande et 1 pour les petites

    if (item.showValue === true) {
      let fontSize = 1.5;
      if (smallDevice) fontSize = 1;

      const $sliderValue = document.createElement('div');
      $sliderValue.classList.add('sliderValue');
      $sliderValue.style.position = 'absolute';

      if (item.orientation === 'vertical' && smallDevice) {
        if (iconSize) $sliderValue.style.top = `${iconSize + (iconSize * 0.05)}px`; // add 5% margin (0.05) //!----- Mobile view (get ratio)
        else $sliderValue.style.top = '0.2rem';
        $sliderValue.style.alignSelf = 'center';
      }
      else {
        $sliderValue.style.top = '0.2rem';
        $sliderValue.style.right = '0.2rem';
      }
      //!----- Mobile view (get ratio)
      if (ratio) fontSize = fontSize / ratio;
      //!
      $sliderValue.style.fontSize = `${fontSize}rem`;

      if (item.capabilityID === 'dim') $sliderValue.textContent = Math.round(parseFloat($slider.value * multiplier)) + item.unit;
      else $sliderValue.textContent = parseFloat($slider.value * multiplier) + item.unit;
      $sliderContainer.appendChild($sliderValue);
    }
    $device.appendChild($sliderContainer);

    device.makeCapabilityInstance(item.capabilityID, function (value) {
      var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID);
      if ($device) {
        const $sliderValue = $device.querySelector('.sliderTile input');
        const $sliderValueText = $device.querySelector('.sliderValue');
        if ($sliderValue) {
          if (item.showValue === true) {
            if (item.capabilityID === 'dim') $sliderValueText.textContent = `${Math.round(parseFloat(value) * multiplier) + item.unit}`;
            else $sliderValueText.textContent = `${parseFloat(value) * multiplier + item.unit}`;
          }
          $sliderValue.value = `${value}`;
        }

        if (parseFloat(value) > 0) {
          $device.classList.add('on');
        } else {
          $device.classList.remove('on');
        }
      }
    });
    $device.addEventListener('change', function () {
      var value = document.getElementById($device.id).querySelector('input').value;
      homey.devices.setCapabilityValue({
        deviceId: device.id,
        capabilityId: item.capabilityID,
        value: parseFloat(value),
      }).catch(console.error);
      if (parseFloat(value) > 0) {
        $device.classList.add('on');
      } else {
        $device.classList.remove('on');
      }
    });
    $device.addEventListener('input', function () {
      var value = $slider.value;
      var $sliderValue = $device.querySelector('.sliderValue');
      if ($sliderValue) {
        if (item.capabilityID === 'dim') $sliderValue.textContent = Math.round(parseFloat(value) * multiplier) + item.unit;
        else $sliderValue.textContent = parseFloat(value) * multiplier + item.unit;
      }
    });
  }//

  if (item.name) {
    let nameSize = 0.8;
    let lineHeight = 1.5;
    //!----- Mobile view (get ratio)
    if (ratio) {
      nameSize = nameSize / ratio;
      lineHeight = lineHeight / ratio;
    }
    //!
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
}//END type SLIDER