var connectionId = -1;
var readBuffer = new Array();
var debug = false;


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

    
      if(readBuffer[0] == 1) {
        galinha.move(-1);
      }
      
            
      if(readBuffer[1] == 1) {
        galinha.move(1);
      }      

      readBuffer = new Array();
      setTimeout(trigger, 200);
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



/* Fonte abaixo foi retirado de http://www.itexto.net/canvas/freeway.html 
 * Adaptações foram feiras para funcionar com chrome.serial */

      var canvas = document.getElementById("canvas");
      var contexto = canvas.getContext("2d");
      var score = 0;
      var game_over = false;
      

      function desenharFundo() {

        contexto.fillStyle = "#797979";
        contexto.fillRect(0,0,canvas.width,canvas.height);
        var altura_faixa = canvas.height / 20;
        var num_faixas = 20;
        contexto.fillStyle = "white";

        for (i = 0; i < num_faixas; i = i + 1) {
          for (j = 0; j < 20; j = j + 1) {
            contexto.fillRect(j * (canvas.width / 20), i * canvas.height / 22, canvas.width / 20 - 8, 0.2);
          }
        }
        
        contexto.fillStyle = "#e1e2e1";
        contexto.fillRect(0,0,canvas.width, altura_faixa);
        contexto.fillStyle = "black";
        contexto.fillRect(0,altura_faixa, canvas.width, 0.8);
        contexto.fillStyle = "e1e2e1";
        contexto.fillRect(0,altura_faixa , canvas.width, altura_faixa);
        contexto.fillStyle = "black";
        contexto.fillRect(0,altura_faixa * 2, canvas.width, 0.2);
        contexto.fillStyle = "e1e2e1";
        contexto.fillRect(0,canvas.height - altura_faixa, canvas.width, altura_faixa);

      }

      

      var carro = [[0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0],

             [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2],

             [2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2],

             [2,2,2,2,2,0,0,0,2,2,2,2,0,0,2,2],

             [2,2,2,2,2,0,0,0,2,2,2,2,0,0,2,2],

             [2,2,2,2,2,0,0,0,2,2,2,2,0,0,2,2],

             [2,2,2,2,2,2,2,2,0,0,0,0,2,2,2,2],

             [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2],

             [0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0]]

             

      var b_galinha1 = [[0,0,3,0,0,0,0,0,0,0],

                 [3,3,3,0,0,0,0,0,0,0],

                 [0,0,3,0,0,0,0,0,0,0],

                 [0,0,3,3,3,3,0,0,0,0],

                 [0,0,3,3,3,3,3,3,3,3],

                 [0,0,3,3,3,3,3,3,0,0],

                 [0,0,0,3,0,0,3,0,0,0],

                 [0,0,0,3,0,0,3,0,0,0],

                 [0,0,3,3,0,3,3,0,0,0]];

      var b_galinha2 =[[0,0,3,0,0,3,0,3,0,0],

                 [3,3,3,0,0,0,3,0,0,0],

                 [0,0,3,0,0,0,0,3,0,0],

                 [0,0,3,3,3,3,0,0,0,0],

                 [0,0,3,3,3,3,3,3,3,3],

                 [0,0,3,3,3,3,3,3,0,0],

                 [0,0,3,0,0,3,0,0,0,0],

                 [0,0,3,0,0,3,0,0,0,0],

                 [0,3,3,0,3,3,0,0,0,0]];

               

      

      function criarGalinha() {

        var galinha = new Object();
        galinha.x = canvas.width / 2;
        galinha.bitmap1 = b_galinha1;
        galinha.bitmap2 = b_galinha2;
        galinha.bitmap = b_galinha1;
        galinha.y = canvas.height - 1 - galinha.bitmap.length;
        galinha.width = galinha.bitmap[0].length;
        galinha.height = galinha.bitmap.length - 1;
        galinha.contador = 0;

        galinha.move = function(direcao) {
          this.y = this.y + direcao;

          this.contador = this.contador + 1;

          if (this.contador % 2 == 0) {
            this.bitmap = this.bitmap1;
          } else {
            this.bitmap = this.bitmap2;
          }

          if (this.y <= 0) {
            score = score + 1;
            this.y = canvas.height - 1 - this.bitmap.length;

          } else if (this.y > (canvas.height - 1 - this.bitmap.length)) {
            this.y = canvas.height - 1 - this.bitmap.length;
          }
        }
        return galinha;
      }      

      function inverter_vertical(bitmap) {

        var resultado = new Array();

        for (var linha in bitmap) {
          var linha_corrente = bitmap[linha];
          var nova_linha = new Array();
          var num_itens = linha_corrente.length;

          for (x = num_itens - 1; x >= 0; x = x - 1) {
            nova_linha.push(linha_corrente[x]);
          }
          resultado.push(nova_linha);
        }
        return resultado;
      }

      

      function substituir(valor_original, valor_substituto, bitmap) {

        var resultado = new Array();

        for (var linha in bitmap) {

          var nova_linha = new Array()
          var linha_corrente = bitmap[linha]
          for (var x = 0; x < linha_corrente.length; x = x + 1) {
            nova_linha.push(linha_corrente[x] == valor_original ? valor_substituto : linha_corrente[x]);
          }
          resultado.push(nova_linha);
        }
        return resultado;
      }


      var carro_invertido = inverter_vertical(carro);
      

      function criarCarro(x, y, bitmap, direcao) {
        var result = new Object();
        result.x = x;
        result.y = y + 20;
        result.bitmap = bitmap;
        result.width = bitmap[0].length;
        result.height = bitmap.length;
        result.direcao = direcao;

        result.move = function() {
          this.x = this.x + direcao;
          if (this.x < 0 && this.direcao < 0) {
            this.x = canvas.width + 10;
          } else if (this.x > canvas.width && this.direcao > 0) {
            this.x = -20;
          }
        }

        result.pegouGalinha = function(galinha) {
            if ( (galinha.x >= this.x && galinha.x <= (this.x + this.width)) ||
               (galinha.x + galinha.width  >= this.x && galinha.x + galinha.width <= (this.x + this.width)) ) {
              return (galinha.y >= this.y && galinha.y <= (this.y + this.height)) ||
                   ((galinha.y + galinha.height) < (this.y && this.height) && (galinha.y + galinha.height) > (this.y));
            }
            return false;
        };
        return result;
      }

      

      function desenharBitmap(bitmap,pos_x,pos_y,tamanho) {

        for (var y in bitmap) {

          for (var x in bitmap[y]) {

            var valor = bitmap[y][x];

            if (valor != 0) {

              switch (valor) {

                case 1: contexto.fillStyle = "black"; break;

                case 2: contexto.fillStyle = "#aa0000"; break;

                case 3: contexto.fillStyle = "#FCF926"; break;

              }
              contexto.fillRect(pos_x + (tamanho * x), pos_y + (tamanho * y), tamanho, tamanho);
            }
          }
        }
      }

      var galinha = criarGalinha();
      var lista_carros = new Array();

      for (i = 0; i < 8; i = i + 1) {
        if (Math.random() * 10 > 5) {
          lista_carros.push(criarCarro(Math.random() * canvas.width, canvas.height / 10 * i, carro, -4));
        } else {
          lista_carros.push(criarCarro(Math.random() * canvas.width, canvas.height / 10 * i, carro_invertido, 4));
        }
        
      }

      

      function draw() {

        desenharFundo();

        if (game_over) {
          contexto.fillStyle = "red"
          contexto.fillText("Matou a galinha :(!!!", canvas.width / 4, canvas.height / 2)
          return;
        }

        for (var i in lista_carros) {
          var carrinho = lista_carros[i]
          desenharBitmap(carrinho.bitmap, carrinho.x, carrinho.y, 1)
        }

        desenharBitmap(galinha.bitmap, galinha.x, galinha.y, 1)
        contexto.fillStyle = "black"
        contexto.fillText(score, canvas.width / 2, 8)
      }

      document.onkeydown = function(event) {

        console.log(event.which);
        switch(event.which) {
          case 38: galinha.move(-1); break;
          case 40: galinha.move(1); break;
          case 82 : chrome.runtime.reload(); break;
        }
      };

      function testeFim() {
        if (game_over == true) {
          return true;
        }

        for (var i in lista_carros) {
          if (lista_carros[i].pegouGalinha(galinha)) {
            game_over = true;
            return true;
          }
        }
        return false;
      };

      setInterval(
        function() {
          for (var i in lista_carros) {
            lista_carros[i].move();
          }
          game_over = testeFim();
          draw();
        }
      ,50);
      draw();

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-40917664-6', 'google.com');
  ga('send', 'pageview');

      

