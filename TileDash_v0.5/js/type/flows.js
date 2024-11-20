////=====================    Create FLOW   ======================
function createFlows(flows) {
  const $flowContainer = document.getElementById('flowContainer');

  flows.forEach(flow => {
    const $flow = document.createElement('div');
    $flow.classList.add('flow');
    $flow.id = 'flow-' + flow.id;
    const $flowIconContainer = document.createElement('div');
    $flowIconContainer.classList.add('flowIconContainer');
    const $flowIcon = document.createElement('i');
    $flowIcon.id = 'flow-icon-' + flow.id;
    $flowIcon.classList.add('mdi', 'mdi-play');
    //$flowIcon.src = './img/flow.png'
    $flowIcon.classList.add('flowIcon');
    $flowIconContainer.appendChild($flowIcon);
    $flow.appendChild($flowIconContainer);

    const $flowName = document.createElement('div');
    $flowName.classList.add('flowName');
    $flowName.textContent = flow.name;
    $flow.appendChild($flowName);

    $flowContainer.appendChild($flow);
    flowTrigger(flow.id, flow);//flow.id = id of flow set by user, flow = flow object found in Homey
  });
}//END createFlows


////=====================    Create FLOW MOBILE   ======================
function createFlowsMobiles(flows) {
  const $flowContainerMobile = document.getElementById('flowContainerMobile');
  const $flowZipper = document.createElement('div');
  $flowZipper.classList.add('flowZipper');
  const $flowZipperIcon = document.createElement('i');
  $flowZipperIcon.classList.add('mdi', 'mdi-chevron-down');
  $flowZipper.appendChild($flowZipperIcon);
  $flowContainerMobile.appendChild($flowZipper);

  const $flowGroup = document.createElement('div');
  $flowGroup.classList.add('flowGroup');
  $flowContainerMobile.appendChild($flowGroup);


  flows.forEach(flow => {
    const $flow = document.createElement('div');
    $flow.classList.add('flow');
    $flow.style.margin = '0.7rem';
    $flow.id = 'flow-' + flow.id;
    const $flowIconContainer = document.createElement('div');
    $flowIconContainer.classList.add('flowIconContainer');
    const $flowIcon = document.createElement('i');
    $flowIcon.id = 'flow-icon-' + flow.id;
    $flowIcon.classList.add('mdi', 'mdi-play');
    //$flowIcon.src = './img/flow.png'
    $flowIcon.classList.add('flowIcon');
    $flowIconContainer.appendChild($flowIcon);
    $flow.appendChild($flowIconContainer);

    const $flowName = document.createElement('div');
    $flowName.classList.add('flowName');
    $flowName.textContent = flow.name;
    $flow.appendChild($flowName);

    $flowGroup.appendChild($flow);
    flowTrigger(flow.id, flow);//flow.id = id of flow set by user, flow = flow object found in Homey
  });

  //+ Add event listener on icon to show 'flowsContainer'
  $flowZipper.addEventListener('click', function () {
    if ($flowGroup.style.display !== 'flex') {
      $flowGroup.style.display = 'flex';
      setTimeout(function () {
        $flowGroup.classList.add('show');
        updateZipperPosition();
      }, 10);

      $flowZipperIcon.classList.remove('mdi-chevron-down');
      $flowZipperIcon.classList.add('mdi-chevron-up');
    }
    else {
      //$flowGroup.style.display = 'none';
      $flowGroup.classList.remove('show');
      setTimeout(function () {
        $flowGroup.style.display = 'none';
        updateZipperPosition();
      }, 500);

      $flowZipperIcon.classList.remove('mdi-chevron-up');
      $flowZipperIcon.classList.add('mdi-chevron-down');
    }

    console.log($flowGroup.offsetHeight);
  });//END $flowZipper listener

  $flowGroup.addEventListener('transitionstart', updateZipperPosition);

  function updateZipperPosition() {
    //const $flowGroup = document.getElementById('flowGroup');
    //const $flowZipper = document.getElementById('flowZipper');
    if ($flowGroup.classList.contains('show')) {
      $flowZipper.style.top = $flowGroup.offsetHeight + 'px';
    } else {
      //$flowZipper.style.top = '0px';
      $flowZipper.style.top = '0px';
    }
  }
  
}//END createFlowsMobiles









////=====================    Add listener    ======================
async function flowTrigger(flowId, userFlow) {
  const $flow = document.getElementById('flow-' + flowId);
  const flowIcon = document.getElementById('flow-icon-' + flowId);

  const flows = await homey.flow.getFlows();
  const flowsArray = Object.values(flows);

  const advancedFlows = await homey.flow.getAdvancedFlows();
  const advancedFlowsArray = Object.values(advancedFlows);

  const matchingAdvancedFlow = advancedFlowsArray.find(advancedFlow => advancedFlow.id === flowId);
  if (matchingAdvancedFlow) {
    $flow.addEventListener('click', function () {
      $flow.classList.add('pressed');
      setTimeout(function () {
        $flow.classList.remove('pressed');
    }, 300);
      flowIcon.classList.remove('mdi-play');
      flowIcon.classList.add('mdi-loading');
      flowIcon.classList.add('mdi-spin');
      homey.flow['triggerAdvancedFlow']({
        id: userFlow.id,
      });
      setTimeout(function () {
        flowIcon.classList.remove('mdi-spin');
        flowIcon.classList.remove('mdi-loading');
        flowIcon.classList.add('mdi-play');
      }, 1000);
    });
    return;
  }

  const matchingFlow = flowsArray.find(flow => flow.id === flowId);
  if (matchingFlow) {
    $flow.addEventListener('click', function () {
      $flow.classList.add('pressed');
      setTimeout(function () {
        $flow.classList.remove('pressed');
    }, 300);
      flowIcon.classList.remove('mdi-play');
      flowIcon.classList.add('mdi-loading');
      flowIcon.classList.add('mdi-spin');
      homey.flow['triggerFlow']({
        id: userFlow.id,
      });
      setTimeout(function () {
        flowIcon.classList.remove('mdi-spin');
        flowIcon.classList.remove('mdi-loading');
        flowIcon.classList.add('mdi-play');
      }, 1000);
    });
    return;
  }

  console.error('Can not find flow or advanced flow with id: ', userFlow.id);
}



