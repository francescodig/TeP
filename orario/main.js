const filename = "orario.xml";
const headerTabella = ["Ora", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

loadXML();

function loadXML() {
	let xHttp = new XMLHttpRequest();
	xHttp.onload = onResponseReady;
	xHttp.open("GET", filename, true);
	xHttp.send();
}

function strToMin(timeStr) {
	let split = timeStr.split(":");
	return parseInt(split[0]) * 60 + parseInt(split[1]);
}

function minToStr(min) {
	let minComp = min % 60;
	let hourComp = Math.floor(min / 60) % 24;
	return hourComp + ":" + minComp.toString().padStart(2, "0");
}

function nOraToOrario(nOra, inizioLezione, durataLezione, pausaTraLezioni, inizioIntervallo, durataIntervallo) {
	let timeMin = inizioLezione + (durataLezione + pausaTraLezioni) * (nOra - 1);
	if(timeMin > inizioIntervallo) timeMin += durataIntervallo;

	return minToStr(timeMin);
}

function onResponseReady() {
	let xml = this.responseXML;
	let orario = xml.getElementsByTagName("orario")[0];

	let inizioLezione = strToMin(orario.getElementsByTagName("inizioLezione")[0].textContent);
	let durataLezione = parseInt(orario.getElementsByTagName("durataLezione")[0].textContent);
	let pausaTraLezioni = parseInt(orario.getElementsByTagName("pausaTraLezioni")[0].textContent);
	let inizioIntervallo = strToMin(orario.getElementsByTagName("inizioIntervallo")[0].textContent);
	let durataIntervallo = parseInt(orario.getElementsByTagName("durataIntervallo")[0].textContent);


	let giorni = orario.getElementsByTagName("giorno");

	let maxOre = giorni[0].getElementsByTagName("materia").length;

	for(let i = 1; i < giorni.length; ++i) {
		let ore = giorni[i].getElementsByTagName("materia").length;
		if(ore > maxOre) maxOre = ore;
	}
	
	let table = document.getElementById("orario");
	table.innerHTML = "";

	let trHeader = document.createElement("tr");

	for(let i = 0; i <= giorni.length; ++i) {
		let th = document.createElement("th");
		th.appendChild(document.createTextNode(headerTabella[i]));
		trHeader.appendChild(th);
	}

	table.appendChild(trHeader);

	for(let i = 1; i <= maxOre; ++i) {
		let tr = document.createElement("tr");

		let tdOrario = document.createElement("td");
		tdOrario.appendChild(document.createTextNode(nOraToOrario(i, inizioLezione, durataLezione, pausaTraLezioni, inizioIntervallo, durataIntervallo)));
		
		tr.append(tdOrario);

		for(let j = 1; j <= giorni.length; ++j) {
			let td = document.createElement("td");

			let materia = giorni[j - 1].getElementsByTagName("materia")[i - 1];

			td.append(document.createTextNode(materia ? materia.textContent : ""));

			tr.append(td);
		}
		
		table.append(tr);
	}
}