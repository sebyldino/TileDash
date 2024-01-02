 ////=====================    Type SLIDER   ======================
function createSlider(device, item, $device, smallDevice, devices) {
    var multiplier = 1;
    if (item.capabilityID === 'dim') multiplier = 100;
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
    if (item.capabilityID) {
      $device.classList.add('sliderTile');
      if (item.orientation === 'horizontal') $device.classList.add('horizontal');
      else if (item.orientation === 'vertical') {
        $device.classList.add('vertical');
        $device.style.flexDirection = 'column';
      }
      if (smallDevice) $device.classList.add('small');
      const $sliderContainer = document.createElement('div');
      $sliderContainer.style.display = 'flex';
      $sliderContainer.style.justifyContent = 'center';
      $sliderContainer.style.width = "100%";
      $sliderContainer.style.height = "60%";
      if (smallDevice && item.orientation === 'vertical' && currentBrowser != "Firefox") {
        $sliderContainer.style.marginBottom = '60%';
      }
      if (smallDevice && item.orientation === 'vertical' && currentBrowser === "Firefox") {
        $sliderContainer.style.marginBottom = '40%';
      }
      const $slider = document.createElement('input');
      $slider.type = 'range';
      $slider.min = item.minValue;
      $slider.max = item.maxValue;
      $slider.step = item.step;
      $slider.value = device.capabilitiesObj[item.capabilityID].value || '0';
      if (parseFloat($slider.value) > 0) {
        $device.classList.add('on');
      }
      if (smallDevice && item.orientation === 'vertical' && currentBrowser === "Firefox") {
        $slider.style.width = '100px';
      }
      $sliderContainer.appendChild($slider);

      if (item.showValue === true) {
        const $sliderValue = document.createElement('div');
        $sliderValue.classList.add('sliderValue');
        $sliderValue.style.position = 'absolute';
        if (item.orientation === 'horizontal') $sliderValue.style.bottom = '65%';
        else $sliderValue.style.bottom = '5%';
        if (!smallDevice) $sliderValue.style.fontSize = '150%';

        $sliderValue.style.left = '50%';
        $sliderValue.style.transform = 'translateX(-50%)';
        if (item.capabilityID === 'dim') $sliderValue.textContent = Math.round(parseFloat($slider.value * multiplier)) + item.unit;
        else $sliderValue.textContent = parseFloat($slider.value * multiplier) + item.unit;
        $sliderContainer.appendChild($sliderValue);
      }
      $device.appendChild($sliderContainer);

      device.makeCapabilityInstance(item.capabilityID, function (value) {
        var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID);
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
      var $name = document.createElement('div');
      $name.classList.add('name');
      $name.innerHTML = item.name;
      $name.style.position = 'absolute';
      $name.style.bottom = '0';
      $name.style.left = '0';
      $device.appendChild($name);
    }
  }//END type SLIDER