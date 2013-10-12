var connectionId = -1;
var readBuffer = new Array();
var debug = false;
var img = document.createElement("img");
img.src = "gamepad.png";

img.onload = function () {
  var canvas = document.getElementById("drawRegion");
  var ctx=canvas.getContext("2d");
  ctx.drawImage(img,0,0);  
};


function trigger() {
  var buffer = new ArrayBuffer(1);
  var uint8View = new Uint8Array(buffer);
  uint8View[0] = document.getElementById('position-input').checked ? 1 : 0;
  chrome.serial.write(connectionId, buffer, function() {});
};

function onRead(readInfo) {
  var uint8View = new Uint8Array(readInfo.data);
  var value = String.fromCharCode(uint8View[0]);
  

  if (value == "x") // Light on and off
  {
     if(debug) 
        console.log("CMD[a]: " + readBuffer);

      var canvas = document.getElementById("drawRegion");
      var ctx=canvas.getContext("2d");

      ctx.clearRect(0, 0, 300, 300);
      ctx.drawImage(img,0,0);  

      ctx.beginPath();
      if(readBuffer[0] == 1) {
        ctx.arc(40, 120, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
      ctx.closePath();
      
      ctx.beginPath();
      if(readBuffer[1] == 1) {
        ctx.arc(85, 120, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
      ctx.closePath();


      readBuffer = new Array();
      trigger();
  }
  else
  {
    if(value == "0" || value == "1") {
      readBuffer.push(value);
    }
  }

    // Keep on reading.
    chrome.serial.read(connectionId, 1, onRead);
  
};

function onOpen(openInfo) {
  connectionId = openInfo.connectionId;
  console.log("connectionId: " + connectionId);
  if (connectionId == -1) {
    setStatus('Could not open');
    return;
  }
  setStatus('Connected');

  trigger();
  chrome.serial.read(connectionId, 1, onRead);


};

function setStatus(status) {
  document.getElementById('status').innerText = status;
}

function buildPortPicker(ports) {
  var eligiblePorts = ports.filter(function(port) {
    return !port.match(/[Bb]luetooth/) && port.match(/\/dev\/tty/);
  });

  var portPicker = document.getElementById('port-picker');
  eligiblePorts.forEach(function(port) {
    var portOption = document.createElement('option');
    portOption.value = portOption.innerText = port;
    portPicker.appendChild(portOption);
  });

  portPicker.onchange = function() {
    if (connectionId != -1) {
      chrome.serial.close(connectionId, openSelectedPort);
      return;
    }
    openSelectedPort();
  };

  var startButton = document.getElementById('btnIniciar');
  startButton.onclick = function() {
    console.log('starting');
      trigger();
  };
}



function openSelectedPort() {
  var portPicker = document.getElementById('port-picker');
  var selectedPort = portPicker.options[portPicker.selectedIndex].value;
  chrome.serial.open(selectedPort, onOpen);
}

onload = function() {
  chrome.serial.getPorts(function(ports) {
    buildPortPicker(ports)
    openSelectedPort();
  });
  
  
};
