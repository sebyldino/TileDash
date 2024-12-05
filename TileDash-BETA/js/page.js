dashboard.forEach(function (page, pageIndex) {
    const $pageContainer = document.createElement('div');
    $pageContainer.classList.add('page');
    $pageContainer.id = `page-${pageIndex}`;
    if (pageIndex !== 0) $pageContainer.style.display = 'none'; // Masquer les autres pages au départ
  
    page.forEach(function (group, groupIndex) {
      var itemPos;
      var extraID;
      var groupWidth = tileWidth * group.width + (group.width + 1) * tileMargin;
      var groupHeight = tileHeight * group.height + (group.height + 1) * tileMargin;
  
      const $group = document.createElement('div');
      $group.classList.add('group');
      $group.style.width = `${groupWidth}px`;
      $group.style.height = `${groupHeight}px`;
      $group.style.gap = `${tileMargin}px`;
      $group.style.padding = `${tileMargin}px`;
  
      if (orientation != "portrait") {
        if (groupIndex !== 0) {
          $group.style.marginLeft = `${groupMargin}px`;
        }
        $group.style.marginLeft = groupIndex === 0 ? `${sideMargin + groupMargin}px` : `${groupMargin}px`;
        $group.style.marginRight = groupIndex === page.length - 1 ? `${sideMargin + groupMargin}px` : `${groupMargin}px`;
      }
  
      if (group.title) {
        const $groupName = document.createElement('div');
        $groupName.classList.add('groupName');
        $groupName.textContent = group.title;
        $group.appendChild($groupName);
      }
  
      group.items.forEach(function (item) {
        if (item.position) itemPos = `${item.position[0]}-${item.position[1]}`;
        if (itemPos) extraID = `-${pageIndex}-${groupIndex}-${itemPos}`;
        else extraID = `-${pageIndex}-${groupIndex}`;
  
        const $device = document.createElement('div');
        $device.id = `device-${extraID}`;
        $device.classList.add('tile');
        $device.style.gridRow = `${item.position[1] + 1} / span ${item.height}`;
        $device.style.gridColumn = `${item.position[0] + 1} / span ${item.width}`;
  
        $group.appendChild($device);
      });
  
      $pageContainer.appendChild($group);
    });
  
    $dashboardContainer.appendChild($pageContainer);
  });
  