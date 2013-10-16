onload = setTimeout(init, 1);

function init() {
	var buscar = document.getElementById('buscar');
	buscar.onclick = function () {
		console.log("buscando");
		buscaCEP();
	};

	var endereco = document.getElementById('endereco');
	endereco.onkeyup = function (e) {
		if (e.which == 13) {
        	buscaCEP();    	
    	}
	}
}


function buscaCEP() {
	var endereco = document.getElementById('endereco').value;
	var encodedAddress = encodeURIComponent(endereco);
	var URL = "http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address="+encodedAddress;	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function() {
  		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
  			console.log("obtendo respostas");
    		receiveResults(xmlhttp.responseText);
    	}
  	}
	xmlhttp.open("GET",URL,true);
	xmlhttp.send();

}

function receiveResults(responseText) {
	console.log("receiving responses");
	var json = JSON.parse(responseText);
	var resultados = document.getElementById("resultados");
	resultados.style.display = "block";

	var tableBody = document.getElementById("tableBody");
	tableBody.innerHTML = "";	
	for(var idx in json.results) {
		var tr = document.createElement("tr");
		var td = document.createElement("td");

		for(var x in json.results[idx].address_components) {
			if(json.results[idx].address_components[x].types[0] == "postal_code") {
				td.innerHTML = json.results[idx].address_components[x].long_name;
			}
		}
		tr.appendChild(td);

		var td = document.createElement("td");
		td.innerHTML = json.results[idx].formatted_address;					
		tr.appendChild(td);

		tableBody.appendChild(tr);
		console.log("fetched");
	}
}