////=====================    Type IMAGE   ======================
function createImage(device, item, $device, smallDevice, devices) {

    $device.classList.toggle('on');
    const $image = document.createElement('img');
    $image.classList.add('image');
    if (item.staticImage) $image.src = item.staticImage;
    else if (item.folder) {
        let imageIndex;
        if (item.folder === "./img/Landscape") imageIndex = Math.floor(Math.random() * window.dashboard.settings.numOfLandImg) + 1;
        if (item.folder === "./img/Portrait") imageIndex = Math.floor(Math.random() * window.dashboard.settings.numOfPortImg) + 1;
        $image.src = `${item.folder}/${imageIndex}.jpg`;

        const imageInterval = setInterval(() => {
            var numberOfImage;
            if (item.folder === "./img/Landscape") numberOfImage = window.dashboard.settings.numOfLandImg;
            else numberOfImage = window.dashboard.settings.numOfPortImg;
            imageIndex = (imageIndex % numberOfImage) + 1;
            $image.src = `${item.folder}/${imageIndex}.jpg`;
        }, item.timeScroll * 1000);
    }
    $image.style.width = '100%';
    $image.style.height = '100%';
    $image.style.objectFit = 'cover';
    $device.appendChild($image);
}// END type IMAGE