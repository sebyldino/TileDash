////=====================    Type DOORBIRD POPUP   ======================
function createDoorbirdPopup(device, item, extraID) {
    const tileWidth = window.dashboard.settings.tileSize;
    const tileHeight = window.dashboard.settings.tileSize;
    const tileMargin = window.dashboard.settings.tileMargin;
    const doorbirdPopupWidth = item.width;
    const doorbirdPopupHeight = item.height;
    const $overlay = document.getElementById('overlay');
    const autoClose = item.autoClose * 1000;
    const testPopup = item.testPopup;

    var doorDeviceID = item.id;
    var doorDeviceCapabilityID = "open_action";
    var doorDeviceValue = 1;

    if (item.doorDevice) {
        if (item.doorDevice.id && item.doorDevice.capabilityID) {
            doorDeviceID = item.doorDevice.id;
            doorDeviceCapabilityID = item.doorDevice.capabilityID;
            doorDeviceValue = true;
        }
        else console.error("You need to define 'id' and 'capabilityID' to use another door device for DOORBIRD_POPUP !");
    }


    if (item.capabilityID) {
        device.makeCapabilityInstance(item.capabilityID, function (value) {
            if (value) openDoorbirdPopup();
        });
    }//?




    ////=======     Create POPUP    =======
    const popupWidth = tileWidth * doorbirdPopupWidth + (doorbirdPopupWidth + 1) * tileMargin;
    const popupHeight = tileHeight * doorbirdPopupHeight + (doorbirdPopupHeight + 1) * tileMargin;
    const $popupContainer = document.createElement('div');
    $popupContainer.classList.add('popup-container');
    $popupContainer.id = 'doorbirdPopup-' + item.capabilityID + extraID; //+ extraID
    $popupContainer.style.width = `${popupWidth}px`;
    $popupContainer.style.height = `${popupHeight}px`;
    $popupContainer.style.gap = `${tileMargin}px`;
    $popupContainer.style.padding = `${tileMargin}px`;
    $popupContainer.style.display = 'none';
    $popupContainer.style.alignItems = 'center';
    $popupContainer.style.justifyContent = 'center';



    ////======       Create Image    ======
    const url = item.doorbirdIP + '/bha-api/video.cgi?http-user=' + item.user + '&http-password=' + item.password;
    const $doorbirdContainer = document.createElement('div');
    $doorbirdContainer.id = 'doorbirdContainer';
    const $doorbirdImage = document.createElement('img');
    $doorbirdImage.classList.add('doorbirdImage');
    $doorbirdImage.style.width = '100%';
    $doorbirdImage.style.height = 'auto';
    $doorbirdContainer.appendChild($doorbirdImage);
    $popupContainer.appendChild($doorbirdContainer);

    ////=====       Create Button
    const $doorbirdButtonContainer = document.createElement('div');
    $doorbirdButtonContainer.classList.add('doorbirdButtonContainer');

    //?---- Door button
    const $doorbirdDoorButton = document.createElement('button');
    $doorbirdDoorButton.classList.add('doorbirdButton');
    const $doorbirdIconDoor = document.createElement('i');
    $doorbirdIconDoor.classList.add('mdi', item.icon);
    $doorbirdDoorButton.appendChild($doorbirdIconDoor);
    $doorbirdButtonContainer.appendChild($doorbirdDoorButton);

    //?---- Secondary button
    if (item.secondDoorDevice) {
        if (item.secondDoorDevice.id && item.secondDoorDevice.capabilityID && item.secondDoorDevice.icon) {
            const $doorbirdSecondButton = document.createElement('button');
            $doorbirdSecondButton.classList.add('doorbirdButton');
            const $doorbirdIconSecond = document.createElement('i');
            $doorbirdIconSecond.classList.add('mdi', item.secondDoorDevice.icon);
            $doorbirdSecondButton.appendChild($doorbirdIconSecond);
            $doorbirdButtonContainer.appendChild($doorbirdSecondButton);
            
            ////---- Event secondary button
            $doorbirdSecondButton.addEventListener('click', (event) => {
                $doorbirdSecondButton.classList.add('pressed');
                var value = true;
                homey.devices.setCapabilityValue({
                    deviceId: item.secondDoorDevice.id,
                    capabilityId: item.secondDoorDevice.capabilityID,
                    value: value,
                }).catch(console.error);
                setTimeout(function () {
                    $doorbirdSecondButton.classList.remove('pressed');
                }, 300);
            });
        }
        else console.error("You need to define 'id',  'capabilityID' ans 'icon' to use a second door device for DOORBIRD_POPUP !");

    }
    $doorbirdContainer.appendChild($doorbirdButtonContainer);



    ////========    Event button    ========
    //?---- Door Button
    $doorbirdDoorButton.addEventListener('click', (event) => {
        $doorbirdDoorButton.classList.add('pressed');
        var value = doorDeviceValue;
        homey.devices.setCapabilityValue({
            deviceId: doorDeviceID,
            capabilityId: doorDeviceCapabilityID,
            value: value,
        }).catch(console.error);
        setTimeout(function () {
            $doorbirdDoorButton.classList.remove('pressed');
        }, 1000);
    });




    ////======= Event DoorBird Popup  ========
    document.addEventListener('click', (event) => {
        if (!$popupContainer.contains(event.target)) {
            closeDoorbirdPopup();
        }
    });

    function openDoorbirdPopup() {
        $doorbirdImage.src = url;
        $popupContainer.style.display = 'flex';
        $overlay.style.display = 'block';
        setTimeout(function () {
            closeDoorbirdPopup();
        }, autoClose);
    }

    function closeDoorbirdPopup() {
        $popupContainer.style.display = 'none';
        $overlay.style.display = 'none';
        $doorbirdImage.src = '';
    }

    $popupContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    document.body.appendChild($popupContainer);


    ////======  Test Doorbird Popup
    if (testPopup) {
        setTimeout(function () {
            openDoorbirdPopup();
        }, 7000);
    }




}//END type DOORBIRD_POPUP
