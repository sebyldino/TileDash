////=====================    Type MEDIA   ======================
function createMedia(device, item, $device, smallDevice, devices, ratio, extraID) {
    //Capability ID used in this script
    var VOLUME_CAPABILITY = 'volume_set';
    //var MUTE_CAPABILITY = 'volume_mute';
    var TRACK_CAPABILITY = 'speaker_track';
    var ARTIST_CAPABILITY = 'speaker_artist';
    var ALBUM_CAPABILITY = 'speaker_album';
    var PLAY_CAPABILITY = 'speaker_playing';
    var PREV_CAPABILITY = 'speaker_prev';
    var NEXT_CAPABILITY = 'speaker_next';


    var actualUpdate = null;
    var lastUpdated = device.images[0].imageObj.lastUpdated;
    var actualTrack;
    var playState = device.capabilitiesObj[item.capabilityID].value;


    if (item.width < 2 || item.height < 2) {
        console.error("Type 'MEDIA' must have a size of at least 2x2");
        return;
    }
    if (item.standbyIcon && item.standbyImage) {
        console.error("You need to define 'standbyImage' or 'standbyIcon' for 'MEDIA' type, not both!");
        return;
    }

    let coverImage;
    if (item.standbyImage) coverImage = item.standbyImage;

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


    if (item.standbyIcon) {
        var $iconContainer = document.createElement('div');
        $iconContainer.style.textAlign = 'center';
        $iconContainer.style.alignItems = 'center';
        $iconContainer.classList.add('icon');
        $iconContainer.style.display = 'none'; //block
        const $icon = document.createElement('i');
        $icon.classList.add('mdi', item.standbyIcon);
        var iconSize = window.dashboard.settings.iconSize || '24';
        //!----- Mobile view (get ratio)
        if (ratio) iconSize = iconSize / ratio;
        //!-----
        $icon.style.fontSize = `${iconSize}px`;
        $iconContainer.appendChild($icon);
        $device.appendChild($iconContainer);
    }

    ////=====   Create Button   ======
    const $mediaControlContainer = document.createElement('div');
    $mediaControlContainer.classList.add('mediaControlContainer');

    const $buttonContainer = document.createElement('div');
    $buttonContainer.classList.add('mediaButtonContainer');
    $mediaControlContainer.style.display = 'none'; //flex

    //----- Prev button
    const $prevButton = document.createElement('button');
    $prevButton.classList.add('mediaButton');
    const $prevIcon = document.createElement('i');
    $prevIcon.classList.add('mdi', 'mdi-skip-previous');
    $prevButton.appendChild($prevIcon);
    $buttonContainer.appendChild($prevButton);
    //?----- Click Event
    $prevButton.addEventListener('click', function () {
        var value = true;
        homey.devices.setCapabilityValue({
            deviceId: device.id,
            capabilityId: PREV_CAPABILITY,
            value: value,
        }).catch(console.error);
    });

    //----- Play button
    const isPlaying = device.capabilitiesObj[item.capabilityID].value;
    const $playButton = document.createElement('button');
    $playButton.classList.add('mediaButton');
    const $playIcon = document.createElement('i');
    if (isPlaying) $playIcon.classList.add('mdi', 'mdi-pause');
    else $playIcon.classList.add('mdi', 'mdi-play');
    $playButton.appendChild($playIcon);
    $buttonContainer.appendChild($playButton);
    //?----- Click Event
    $playButton.addEventListener('click', function () {
        var value = !playState;
        homey.devices.setCapabilityValue({
            deviceId: device.id,
            capabilityId: PLAY_CAPABILITY,
            value: value,
        }).catch(console.error);
        playState = device.capabilitiesObj[item.capabilityID].value;
    });


    //----- Next button
    const $nextButton = document.createElement('button');
    $nextButton.classList.add('mediaButton');
    const $nextIcon = document.createElement('i');
    $nextIcon.classList.add('mdi', 'mdi-skip-next');
    $nextButton.appendChild($nextIcon);
    $buttonContainer.appendChild($nextButton);
    //?----- Click Event
    $nextButton.addEventListener('click', function () {
        var value = true;
        homey.devices.setCapabilityValue({
            deviceId: device.id,
            capabilityId: NEXT_CAPABILITY,
            value: value,
        }).catch(console.error);
    });

    //-----  Volume slider
    const $volumeContainer = document.createElement('div');
    $volumeContainer.classList.add('volumeContainer');
    const $volumeSlider = document.createElement('input');
    $volumeSlider.type = 'range';
    $volumeSlider.min = item.minVol;
    $volumeSlider.max = item.maxVol;
    $volumeSlider.step = item.volStep;
    $volumeSlider.value = device.capabilitiesObj[VOLUME_CAPABILITY].value || '0';
    $volumeSlider.classList.add('mediaVolumeSlider');
    const $volumeIcon = document.createElement('i');
    $volumeIcon.classList.add('mdi', 'mdi-volume-medium');
    $volumeContainer.appendChild($volumeIcon);
    $volumeContainer.appendChild($volumeSlider);

    //?------ Change Event
    $volumeSlider.addEventListener('change', function () {
        var value = document.getElementById($device.id).querySelector('input').value;
        homey.devices.setCapabilityValue({
            deviceId: device.id,
            capabilityId: VOLUME_CAPABILITY,
            value: parseFloat(value),
        }).catch(console.error);
    });

    $mediaControlContainer.appendChild($volumeContainer);
    $mediaControlContainer.appendChild($buttonContainer);
    $device.appendChild($mediaControlContainer);

    if (item.homeyIP || item.accountID) {
        var urlPath;
        var userPath;
        if (item.homeyIP) {
            userPath = item.homeyIP;
            urlPath = '.homey.homeylocal.com';
        }
        if (item.accountID) {
            userPath = item.accountID;
            urlPath = '.connect.athom.com';
        }
        var imagePath = device.images[0].imageObj.url;
        var imageUrl;
    }
    else console.error("You need to define 'homeyIP' or 'accountID' for type 'MEDIA' ");


    if (item.capabilityID) {
        var $mediaContainer = document.createElement('div');
        $mediaContainer.style.display = 'none'; //flex
        $mediaContainer.classList.add('mediaContainer');
        var $image = document.createElement('img');
        $image.classList.add("mediaCover");

        /*var $mediaInfoContainer = document.createElement('div');
        $mediaInfoContainer.classList.add('mediaInfoContainer');*/
        var $textInfo = document.createElement('p');
        $textInfo.classList.add("mediaInfo");
        var $artistInfo;
        var $trackInfo;

        $mediaContainer.appendChild($image);
        $mediaContainer.appendChild($textInfo);
        $device.appendChild($mediaContainer);


        if (device.capabilitiesObj[TRACK_CAPABILITY].value === 'Idle') mediaStandby();
        else mediaPlay();

        ////---- Track info instance
        device.makeCapabilityInstance(TRACK_CAPABILITY, function (value) {
            if (actualTrack != value && value != 'Idle') {
                mediaPlay();
            }
            else {
                mediaStandby();
            }
            actualTrack = value;
        });//

        ////----- Play info instance
        device.makeCapabilityInstance(PLAY_CAPABILITY, function (value) {
            setTimeout(function () {
                value = device.capabilitiesObj[PLAY_CAPABILITY].value;

                if (value) {
                    $playIcon.classList.remove('mdi-play');
                    $playIcon.classList.add('mdi-pause');
                }
                else {
                    $playIcon.classList.remove('mdi-pause');
                    $playIcon.classList.add('mdi-play');

                }
                playState = value;
            }, 500);
        });//

        ////----- Volume instance
        device.makeCapabilityInstance(VOLUME_CAPABILITY, function (value) {
            var $device = document.getElementById('device-' + device.id + '-' + item.capabilityID + extraID); 
            if ($device) {

                const $sliderValue = $device.querySelector('input');
                if ($sliderValue) {
                    $sliderValue.value = `${value}`;
                }
            }
        });//

    }// END item.capabilityID






    ////-----   Function mediaStandby()
    function mediaStandby() {
        $mediaControlContainer.style.display = 'none';
        if (item.standbyImage) {
            $image.src = coverImage;
            $device.classList.add('on');
            $mediaContainer.style.display = 'flex';
            $textInfo.style.display = 'none';
        }
        if (item.standbyIcon) {
            $mediaContainer.style.display = 'none';
            $iconContainer.style.display = 'block';
            $device.classList.remove('on');
        }
        if ($name) $name.style.display = 'block';
    }//

    ////-----   Function mediaPlay()
    function mediaPlay() {
        $device.classList.add('on');
        $mediaContainer.style.display = 'flex';
        $mediaControlContainer.style.display = 'flex';
        $textInfo.style.display = 'block';
        if ($name) $name.style.display = 'none';
        getCover();
        getInfo();
    }//


    ////----- Get cover
    function getCover() {
        if (checkCoverUpdate()) {
            imagePath = device.images[0].imageObj.url;
            console.log(imagePath);
            imageUrl = 'https://' + userPath + urlPath + imagePath + '?timestamp=' + Date.now();
            $image.src
            $image.src = imageUrl;
        }
        else setTimeout(function () {
            getCover();
        }, 1000);
    }//

    ////----- Check updated cover
    function checkCoverUpdate() {
        lastUpdated = device.images[0].imageObj.lastUpdated;
        if (lastUpdated != actualUpdate) {
            actualUpdate = lastUpdated;
            return true;
        }
        else return false;
    }

    ////----- Get infos
    function getInfo() {
        setTimeout(function () {
            $artistInfo = device.capabilitiesObj[ARTIST_CAPABILITY].value;
            $trackInfo = device.capabilitiesObj[TRACK_CAPABILITY].value;
            $textInfo.textContent = $trackInfo + ' - ' + $artistInfo;
        }, 1000);
    }//

}//END type MEDIA
