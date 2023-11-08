/* ----- COMPETITION INFO STORING ----- */
var currentTeam = {};
var nextTeam = null;
var clasifTeams = {};

/* ----- WEBSOCKET AND HEARTBEAT ----- */
var connectionF;
var conectadoF = false;
var pingTimer;
const pingDelay = 25000;
var noPongTimer;
const noPongDelay = 55000;

/* ----- GENERAL WINDOW ----- */
var defSettings = true;
var fadingDelay = 5000;
var fadingTimer;

/* ----- INFORMATION DISPLAYED ----- */
const time = document.getElementById("time");
const speed = document.getElementById("speed");
const faults = document.getElementById("faults");
const refusals = document.getElementById("refusals");
const eliminated = document.getElementById("eliminated");

const order = document.getElementById("order");
const handler = document.getElementById("handler");
const dog = document.getElementById("dog");
const club = document.getElementById("club");

const trialName = document.getElementById("trialName");
const gradeSize = document.getElementById("gradeSize");
const roundType = document.getElementById("roundType");


/* ----- SELECTORES POR CLASE ----- */
const dragable = document.getElementsByClassName("dragable");
const animable = document.getElementsByClassName("animable");
const windowBG = document.getElementsByClassName("windowBG");
const windowTitle = document.getElementsByClassName("windowTitle");

/* ----- MODAL WINDOW ----- */
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const fontInput = document.getElementById("fontInput");
const sizeInput = document.getElementById("sizeInput");
const textColorInput = document.getElementById("textColorInput");
const itemBGcolorInput = document.getElementById("itemBGcolorInput");
const itemHeight = document.getElementById("itemHeight");
const itemWidth = document.getElementById("itemWidth");
const posXInput = document.getElementById("posXInput");
const posYInput = document.getElementById("posYInput");
const posZInput = document.getElementById("posZInput");
const text1 = document.getElementById("text1");
const text2 = document.getElementById("text2");
const textsTitle = document.getElementById("textsTitle");
const labelText1 = document.getElementById("labelText1");
const labelText2 = document.getElementById("labelText2");

/* ----- GENERAL WINDOW ----- */
const hideMe = document.getElementById("hideMe");
const general = document.getElementById("general");
const urlWebsocket = document.getElementById("urlWebsocket");
const connFlowStatus = document.getElementById("connFlowStatus");
const connFlowButton = document.getElementById("connFlowButton");
const fadingSelector = document.getElementById("fadingSelector");
const fadingDelayInput = document.getElementById("fadingDelayInput");
const croma = document.getElementById("croma");
const cromaBGcolorInput = document.getElementById("cromaBGcolorInput");
const editButton = document.getElementById("editButton");
const impExButton = document.getElementById("impExButton");

/* ----- POPUP HELP WINDOW -----*/
var closeWarningTimeout;
var infoTimeout;
const vInfo = document.getElementById("vInfo");

main();

function main() {

	/* ----- TIEMOUT TO HIDE DBL CLICK INFO ----- */
	setTimeout (()=>{
		hideMe.style.display = "none";
	},5000);

	/* ----- DEFAULT BEFORE AND AFTER TEXTS OF SOME ELEMENTS -----*/
	faults.text1 = "F";
	refusals.text1 = "R";
	eliminated.text1 = "ELIMINATED";
	roundType.text2 = " /";

	/* ----- DEFAULT INFO DISPLAYED -----*/
	currentTeam.start_order = "00";
	currentTeam.handler = "Handler Handleson";
	currentTeam.dog_family_name = "Puppy";
	currentTeam.club = "Dogs & Handlers agility club";
	currentTeam.time = "00.00";
	currentTeam.speed = "0.00 m/s";
	currentTeam.faults = "0";
	currentTeam.refusals = "0";
	currentTeam.disqualification = "";
	currentTeam.status_string = "calculated"
	currentTeam.trialName = "Trial Name"
	currentTeam.gradeSize = "G2 / M"
	currentTeam.roundType = "AG"

	/* ----- DEFAULT TABLE INFO DISPLAYED -----*/
	for (let i = 0; i < 5; i++) {
		const j = i + 1;
		clasifTeams[i] = {
			classification: j,
			dog_family_name: "Dog " + j,
			handler: "Handler " + j,
			total_penalization: "00.0" + j,
			time: `${j}${j}.${j}${j}`
		};
	}

	/* ----- CHECK FOR LOCAL STORED SETTINGS ----- */
	importSettings(readLocal("FASIsettings"));

	/* ----- FLAGS -----*/
	general.editando = false;
	general.showing = false;
	modal.showing = false;

	/* ----- CONFIG ANIMATION TO ANIMABLE (FADING) ELEMENTS  ----- */
	for (let item of animable) {

		item.addEventListener("animationstart", () => {
			//console.log('animation started');
		});

		item.addEventListener("animationiteration", () => {

			item.style["-webkit-animation-direction"] = "reverse";

			currentTeam = nextTeam;
			ponInfo();

			//console.log('animation iterated');
		});

		item.addEventListener("animationend", () => {
			item.style["-webkit-animation-direction"] = "normal";
			item.classList.remove("active");
			//console.log('animation end');
		});

	}
	/* ----- CONFIG DRAGABLE ITEMS ----- */
	for (let item of dragable) {
		item.text1 = item.text1 || "";
		item.text2 = item.text2 || "";
		item.text1old = item.text1;
		item.text2old = item.text2;
		makeDragable(item);
		item.addEventListener("dblclick", function () {

			if (general.editando && !general.showing && !modal.showing) {

				modalTitle.innerHTML = "Properties " + item.id;

				if (item.id === "eliminated") {
					textsTitle.innerHTML = "Text for";
					labelText1.innerHTML = "Eliminated";
					text2.style.visibility = "hidden"
					labelText2.style.visibility = "hidden";
				} else {
					textsTitle.innerHTML = "Before and After Texts";
					labelText1.innerHTML = "Before";
					labelText2.innerHTML = "After";
					text2.style.visibility = "visible"
					labelText2.style.visibility = "visible";
				}

				if (item.id === "scoreTable") {
					textsTitle.style.visibility = "hidden";
					labelText1.style.visibility = "hidden";
					labelText2.style.visibility = "hidden";
					text1.style.visibility = "hidden"
					text2.style.visibility = "hidden";
				} else {
					textsTitle.style.visibility = "visible";
					labelText1.style.visibility = "visible";
					labelText2.style.visibility = "visible";
					text1.style.visibility = "visible"
					text2.style.visibility = "visible";
				}

				dragProperties(item);
				modal.elemento = item;

				fontInput.value = item.fontFamily;
				sizeInput.value = item.fontSize;
				textColorInput.value = item.color;
				itemBGcolorInput.value = item.bgColor;

				itemHeight.value = item.height;
				itemWidth.value = item.width;

				posXInput.value = item.posX;
				posYInput.value = item.posY;
				posZInput.value = item.posZ;

				text1.value = item.text1;
				text2.value = item.text2;

				modal.style.display = "block";
				modal.showing = true;

			}
		});

	}
	/* ----- CONFIG WINDOWS ----- */
	for (let item of windowBG) {
		makeDragable(item);					//hacemos arrastrables las ventanas y  barra de titulo 
	}
	for (let item of windowTitle) {
		makeDragable(item);
		item.isDragable = false;			// evitamos que la barra de la ventana sea arrastrable para que las funciones drag lo intenten con el padre contenedor
	}

	/* ----- EVENTS -----*/
	window.onclick = function (event) {
		/*	
		// Close window when user clicks out of the window										
		if (event.target != modal && !modal.contains(event.target)) {
			modalCancel();	
		}
		if (event.target != general && !general.contains(event.target)) {
			 generalCancel(); 
		}
		*/
		if (modal.showing && event.target != modal && !modal.contains(event.target)) {
			vInfo.style.display = "block";
			vInfo.innerHTML = "Close properties window to drag & drop items";
			clearTimeout(closeWarningTimeout);
			closeWarningTimeout = setTimeout(oInfo,1500);
		}
		if (general.showing && event.target != general && !general.contains(event.target)) {
			vInfo.style.display = "block";
			vInfo.innerHTML = "Close properties window to drag & drop items";
			clearTimeout(closeWarningTimeout);
			closeWarningTimeout = setTimeout(oInfo,1500);
		}
	}
	window.ondblclick = function (event) {

		hideMe.style.display = "none";
		window.getSelection()?.removeAllRanges();
		if (event.target == croma && !modal.showing) {

			const compStyle = window.getComputedStyle(croma);
			cromaBGcolorInput.value = rgbaToHex(compStyle.getPropertyValue("background-color"))

			general.urlWebsocket = urlWebsocket.value;
			general.fadingEnabled = fadingSelector.selectedIndex;
			general.fadingDelay = fadingDelayInput.value;
			general.bgColor = cromaBGcolorInput.value;

			general.style.display = "block";
			general.showing = true;
		}
	}
	document.addEventListener("mousemove", function (event) {
		var cursorX = event.pageX;
		var cursorY = event.pageY;
		vInfo.style.left = (cursorX + 50) + "px";
		vInfo.style.top = cursorY + "px";
	});

	ponInfo();
	ponClasif();

}

/* ----- LOCAL STORAGE FUNCTIONS ----- */
function importSettings(mySettings) {

	if (mySettings) {

		toggleImpExp();

		urlWebsocket.value = mySettings.visual.urlWebsocket || "";

		if (urlWebsocket.value) websocFlow();

		fadingSelector.selectedIndex = mySettings.visual.fading || 1;
		fadingDelayInput.value = mySettings.visual.fadingDelay || 5000;
		croma.style.backgroundColor = mySettings.visual.bgColor || "#000000";

		for (let item of dragable) {

			item.style.fontFamily = mySettings[item.id].fontFamily;
			item.style.fontSize = mySettings[item.id].fontSize * 1 + 'px';
			item.style.color = mySettings[item.id].color;
			item.style.backgroundColor = mySettings[item.id].bgColor;

			item.style.height = mySettings[item.id].height * 1 + 'px';
			item.style.width = mySettings[item.id].width * 1 + 'px';
			item.style.left = mySettings[item.id].posX * 1 + 'px';
			item.style.top = mySettings[item.id].posY * 1 + 'px';
			item.style.zIndex = mySettings[item.id].posZ * 1;

			item.fontFamily = mySettings[item.id].fontFamily;
			item.fontSize = mySettings[item.id].fontSize;
			item.color = mySettings[item.id].color;
			item.bgColor = mySettings[item.id].bgColor;

			item.height = mySettings[item.id].height;
			item.width = mySettings[item.id].width;
			item.posX = mySettings[item.id].posX;
			item.posY = mySettings[item.id].posY;
			item.posZ = mySettings[item.id].posZ;

			item.text1 = mySettings[item.id].text1;
			item.text2 = mySettings[item.id].text2;

		}

		cambiaSuavizar();
	}

}
function storeLocal(keyName, mySettings) {
	const jsonString = JSON.stringify(mySettings);
	localStorage.setItem(keyName, jsonString);
}
function readLocal(keyName) {
	const jsonString = localStorage.getItem(keyName);
	const mySettings = JSON.parse(jsonString);
	return mySettings;
}

/* ----- WEBSOCKET FUNCTIONS ----- */
function websocFlow() {
	/* ----- COMUNICACION WEBSOCKET FLOW ----- */
	connectionF = new WebSocket('wss://' + urlWebsocket.value);
	connectionF.onopen = () => {
		connectionF.send("ping");
		connectionF.send("streaming_data");
		conectadoF = true;
		connFlowStatus.innerHTML = "Conectado";
		connFlowStatus.style.color = "green";
		connFlowButton.innerHTML = "Desconectar";
	};
	connectionF.onmessage = (mensaje) => {

		if (mensaje.data === 'pong') {

			clearTimeout(noPongTimer);
			noPongTimer = setTimeout(noPong, noPongDelay);

			clearTimeout(pingTimer);
			pingTimer = setTimeout(() => {
				connectionF.send("ping");
			}, pingDelay);

		} else {

			const parsedData = JSON.parse(mensaje.data);

			if (parsedData.run) {

				if (parsedData.run.playset) {
					currentTeam = parsedData.run.playset;
					currentTeam.trialName = parsedData.run.trial_name || "----- -- -----";
					currentTeam.gradeSize = parsedData.run.name || "-- / -";
					currentTeam.roundType = parsedData.run.type || "--";
					ponInfo();
				} else {
					currentTeam = null;
				}

				if (parsedData.run.results_best) {
					clasifTeams = parsedData.run.results_best;
					ponClasif();
				}
			}

			if (parsedData.run_ready) {
				if (parsedData.run_ready.playset) {
					nextTeam = parsedData.run_ready.playset;
					nextTeam.trialName = parsedData.run_ready.trial_name || "----- -- -----";
					nextTeam.gradeSize = parsedData.run_ready.name || "-- / -";
					nextTeam.roundType = parsedData.run_ready.type || "--";
					clearTimeout(fadingTimer);
					fadingTimer = setTimeout(() => {
						if (fadingSelector.selectedIndex) {
							for (let item of animable) {
								item.classList.add("active");
							}
						} else {
							currentTeam = nextTeam;
							ponInfo();
						}
					}, fadingDelay);
				} else {
					nextTeam = null;
				}
			}
		}
	};
	connectionF.onclose = () => {
		clearTimeout(noPongTimer);
		conectadoF = false;
		connFlowStatus.innerHTML = "Desconectado";
		connFlowStatus.style.color = "red";
		connFlowButton.innerHTML = "Conectar";
	}
}
function connFlow() {
	if (conectadoF) {
		connectionF.close();
	} else {
		websocFlow();
	}
}
function noPing() {
	location.reload();
}
function noPong() {
	location.reload();
}
function ponInfo() {

	eliminated.innerHTML = eliminated.text1;

	if (!general.editando) {
		eliminated.style.visibility = "hidden";
		time.style.visibility = "hidden";
		speed.style.visibility = "hidden";
	}

	if (currentTeam) {

		order.innerHTML = `${order.text1}${currentTeam.start_order}${order.text2}`;
		handler.innerHTML = `${handler.text1}${currentTeam.handler}${handler.text2}`;
		dog.innerHTML = `${dog.text1}${currentTeam.dog_family_name}${dog.text2}`;
		club.innerHTML = `${club.text1}${currentTeam.club}${club.text2}`;
		faults.innerHTML = `${faults.text1}${currentTeam.faults}${faults.text2}`;
		refusals.innerHTML = `${refusals.text1}${currentTeam.refusals}${refusals.text2}`;
		trialName.innerHTML = `${trialName.text1}${currentTeam.trialName}${trialName.text2}`;
		gradeSize.innerHTML = `${gradeSize.text1}${currentTeam.gradeSize}${gradeSize.text2}`;
		roundType.innerHTML = `${roundType.text1}${currentTeam.roundType}${roundType.text2}`;

		if (currentTeam.status_string === "calculated") {
			time.innerHTML = `${time.text1}${currentTeam.time}${time.text2}`;
			speed.innerHTML = `${speed.text1}${currentTeam.speed}${speed.text2}`;
		} else {
			time.innerHTML = `${time.text1}00.00${time.text2}`;
			speed.innerHTML = `${speed.text1}0.00 m/s${speed.text2}`;
		}

		if (!general.editando) {

			if (currentTeam.status_string === "calculated") {
				time.style.visibility = "visible";
				speed.style.visibility = "visible";
			} else {
				time.style.visibility = "hidden";
				speed.style.visibility = "hidden";
			}

			if (currentTeam.disqualification === "elim") {
				faults.style.visibility = "hidden";
				refusals.style.visibility = "hidden";
				eliminated.style.visibility = "visible";
			} else {
				faults.style.visibility = "visible";
				refusals.style.visibility = "visible";
				eliminated.style.visibility = "hidden";
			}
		}
	}
}
function ponClasif() {

	for (let i = 0; i < 5; i++) {

		const tabDog = document.getElementById("tabDog" + (i + 1) + "o");
		const tabHandler = document.getElementById("tabHandler" + (i + 1) + "o");
		const tabPenalty = document.getElementById("tabPenalty" + (i + 1) + "o");
		const tabTime = document.getElementById("tabTime" + (i + 1) + "o");

		const hayInfo = clasifTeams[i]
			? clasifTeams[i].classification
				? true
				: false
			: false;

		if (hayInfo) {
			tabDog.innerHTML = `${tabDog.text1}${clasifTeams[i].dog_family_name}${tabDog.text2}`;
			tabHandler.innerHTML = `${tabHandler.text1}${clasifTeams[i].handler}${tabHandler.text2}`;
			tabPenalty.innerHTML = `${tabPenalty.text1}${clasifTeams[i].total_penalization}${tabPenalty.text2}`;
			tabTime.innerHTML = `${tabTime.text1}${clasifTeams[i].time}${tabTime.text2}`;
		} else {
			tabDog.innerHTML = `${tabDog.text1}-----${tabDog.text2}`;
			tabHandler.innerHTML = `${tabHandler.text1}-----${tabHandler.text2}`;
			tabPenalty.innerHTML = `${tabPenalty.text1}- -.- -${tabPenalty.text2}`;
			tabTime.innerHTML = `${tabTime.text1}- -.- -${tabTime.text2}`;
		}
	};
}

/* ----- DRAGABLE ELEMENTS FUNTIONS ----- */
function makeDragable(element) {

	element.addEventListener("mousedown", dragStart);
	element.addEventListener("mouseup", dragEnd);
	element.addEventListener("mouseout", dragEnd);
	element.addEventListener("mousemove", drag);

	element.isDragable = true;
	element.isDragging = false;

	element.mouseX = 0;
	element.mouseY = 0;

	element.dx = 0;
	element.dy = 0;

	dragProperties(element);

}
function dragStart(e) {

	let target = e.target.isDragable
		? e.target
		: e.target.parentNode;

	if (target.isDragable && general.editando) {
		if ((!general.showing || target.id === "general") && (!modal.showing || target.id === "modal")) {
			target.mouseX = e.clientX;
			target.mouseY = e.clientY;
			target.isDragging = true;
			target.style.outline = "1px solid #FF0000FF";
			target.style.zIndex = 1000;
		}

	}
}
function drag(e) {

	let target = e.target.isDragable
		? e.target
		: e.target.parentNode;

	if (target.isDragging) {
		target.dx = e.clientX - target.mouseX;
		target.dy = e.clientY - target.mouseY;
		target.style.left = (target.posX + target.dx) + 'px';
		target.style.top = (target.posY + target.dy) + 'px';
	}
}
function dragEnd(e) {

	let target = e.target.isDragable
		? e.target
		: e.target.parentNode;

	if (target.isDragging) {
		target.isDragging = false;
		target.style.outline = "none";
		target.posX += target.dx;
		target.posY += target.dy;
		target.style.zIndex = target.posZ;
	}
}
function dragProperties(e) {

	const compStyle = window.getComputedStyle(e);

	e.fontFamily = compStyle.getPropertyValue("font-family");
	e.fontSize = parseInt(compStyle.getPropertyValue("font-size"), 10);
	e.color = rgbaToHex(compStyle.getPropertyValue("color"));
	e.bgColor = rgbaToHex(compStyle.getPropertyValue("background-color"));

	e.height = parseInt(compStyle.getPropertyValue("height"), 10);
	e.width = parseInt(compStyle.getPropertyValue("width"), 10);

	e.posX = parseInt(compStyle.getPropertyValue("left"), 10);
	e.posY = parseInt(compStyle.getPropertyValue("top"), 10);
	e.posZ = parseInt(compStyle.getPropertyValue("z-index"), 10);

}
function rgbaToHex(rgba) {
	// convertir color rgba a formato hexadecimal
	const hex = rgba.match(/^(rgba|rgb)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
	const r = parseInt(hex[2], 10).toString(16).padStart(2, '0').toUpperCase();
	const g = parseInt(hex[3], 10).toString(16).padStart(2, '0').toUpperCase();
	const b = parseInt(hex[4], 10).toString(16).padStart(2, '0').toUpperCase();
	const a = (hex[5]
		? Math.round(parseFloat(hex[5]) * 255).toString(16).padStart(2, '0')
		: "FF").toUpperCase();
	return `#${r}${g}${b}${a}`;
}

/* ----- MODAL WINDOW FUNCTIONS ----- */
function modalApply() {

	modal.elemento.style.fontFamily = fontInput.value;
	modal.elemento.style.fontSize = sizeInput.value * 1 + 'px';
	modal.elemento.style.color = textColorInput.value;
	modal.elemento.style.backgroundColor = itemBGcolorInput.value;

	modal.elemento.style.height = itemHeight.value * 1 + 'px';
	modal.elemento.style.width = itemWidth.value * 1 + 'px';

	modal.elemento.style.left = posXInput.value * 1 + 'px';
	modal.elemento.style.top = posYInput.value * 1 + 'px';

	let zMinMax = posZInput.value * 1;
	if (zMinMax > 9) zMinMax = 999;
	if (zMinMax < 1) zMinMax = 1;
	modal.elemento.posZ = zMinMax;
	modal.elemento.style.zIndex = zMinMax;

	modal.elemento.text1 = text1.value;
	modal.elemento.text2 = text2.value;

	if (modal.elemento.id.startsWith("tab")) {
		ponClasif();
	} else {
		ponInfo();
	}
}
function modalAcept() {
	modalApply();
	modal.elemento.text1old = text1.value;
	modal.elemento.text2old = text2.value;
	modal.style.display = "none";
	modal.showing = false;
}
function modalCancel() {

	let modalEstado = getComputedStyle(modal);

	if (modalEstado.getPropertyValue("display") != "none") {

		modal.style.display = "none";
		modal.showing = false;

		modal.elemento.style.fontFamily = modal.elemento.fontFamily;
		modal.elemento.style.fontSize = modal.elemento.fontSize * 1 + 'px';
		modal.elemento.style.color = modal.elemento.color;
		modal.elemento.style.backgroundColor = modal.elemento.bgColor;

		modal.elemento.style.height = modal.elemento.height * 1 + 'px';
		modal.elemento.style.width = modal.elemento.width * 1 + 'px';

		modal.elemento.style.left = modal.elemento.posX * 1 + 'px';
		modal.elemento.style.top = modal.elemento.posY * 1 + 'px';
		modal.elemento.style.zIndex = modal.elemento.posZ * 1;

		modal.elemento.text1 = modal.elemento.text1old;
		modal.elemento.text2 = modal.elemento.text2old;

		ponInfo();

	}

}

/* ----- GENERAL WINDOW FUNCTIONS ----- */
function generalApply() {
	toggleImpExp();
	croma.style.backgroundColor = cromaBGcolorInput.value;
	cambiaSuavizar();
}
function generalAcept() {

	generalApply();
	general.style.display = "none";
	general.showing = false;

}
function generalCancel() {

	let generalEstado = getComputedStyle(general);

	if (generalEstado.getPropertyValue("display") != "none") {

		general.style.display = "none";
		general.showing = false;
		urlWebsocket.value = general.urlWebsocket;
		fadingSelector.selectedIndex = general.fading;
		fadingDelayInput.value = general.fadingDelay;
		croma.style.backgroundColor = general.bgColor;

	}

	ponInfo();

}
function generalReset() {
	if (rUsure()) {
		localStorage.removeItem("FASIsettings");
		location.reload();
	}
}
function generalEdit() {

	toggleImpExp();

	general.editando = !general.editando;

	// change cursor over dragable elements
	for (let item of dragable) {
		item.classList.toggle("move");
	}

	if (general.editando) {

		editButton.innerHTML = "Exit Edit";

		for (let item of dragable) {
			item.style.visibility = "visible";
		}

	} else {
		editButton.innerHTML = "Enter Edit";
		ponInfo();
		ponClasif();
	}

	generalApply();

}
function generalSave() {

	generalApply();
	let mySettings = {
		visual: {
			"urlWebsocket": urlWebsocket.value,
			"fading": fadingSelector.selectedIndex,
			"fadingDelay": fadingDelayInput.value * 1,
			"bgColor": cromaBGcolorInput.value
		}
	}

	for (let item of dragable) {

		dragProperties(item);

		mySettings[item.id] = {};

		mySettings[item.id].fontFamily = item.fontFamily;
		mySettings[item.id].fontSize = item.fontSize;
		mySettings[item.id].color = item.color;
		mySettings[item.id].bgColor = item.bgColor;
		mySettings[item.id].height = item.height;
		mySettings[item.id].width = item.width;
		mySettings[item.id].posX = item.posX;
		mySettings[item.id].posY = item.posY;
		mySettings[item.id].posZ = item.posZ;
		mySettings[item.id].text1 = item.text1;
		mySettings[item.id].text2 = item.text2;

	}

	storeLocal("FASIsettings", mySettings);

	return mySettings;

}
function generalImpExp() {
	if (defSettings) {
		JSONfile.click();
	} else {
		exportar();
	}
}
function toggleImpExp() {
	defSettings = false;
	impExButton.innerHTML = "Exportar";
}
function cambiaSuavizar() {
	fadingDelay = fadingDelayInput.value * 1 || 5000;
	if (!fadingSelector.selectedIndex) {
		clearTimeout(fadingTimer);
	}
}

/* ----- POPUP HELP WINDOW FUNCTIONS -----*/
function mInfo(tipo) {
	infoTimeout = setTimeout(function () {
		vInfo.style.display = "block";
		if (tipo === "visualInfo") {
			vInfo.innerHTML = "Temporarily apply the modifications";
		}
		if (tipo === "aceptInfo") {
			vInfo.innerHTML = "Apply the modifications and close this window";
		}
		if (tipo === "cancelInfo") {
			vInfo.innerHTML = "Discard the modifications and close this window";
		}
		if (tipo === "editInfo") {
			vInfo.innerHTML = "Toggle between running mode and editing mode to show hidden elements and enable editing";
		}
		if (tipo === "saveInfo") {
			vInfo.innerHTML = "Apply the modifications and save <b>all settings</b>";
		}
		if (tipo === "resetInfo") {
			vInfo.innerHTML = "Return to <b>factory settings</b> and delete saved settings";
		}
		if (tipo === "fading") {
			vInfo.innerHTML = "When dog finishes the course, after the time indicated in the delay, info will change to next dog with a smooth fade.";
		}
		if (tipo === "impExInfo") {
			vInfo.innerHTML = "Export current config or import previous exported. Import only available with reseted settings.";
		}
	}, 1500);
}
function oInfo() {
	clearTimeout(infoTimeout);
	vInfo.style.display = "none";
}
function rUsure() {
	return (confirm("This can't be undone.\n\n¿Are you sure?\n"));
}

/* ----- SETTINGS EXPORT AND IMPORT FUNCTIONS -----*/
function exportar() {

	const actualDate = new Date();

	const YYYY = actualDate.getFullYear();
	const MM = ('0' + (actualDate.getMonth() + 1)).slice(-2);
	const DD = ('0' + actualDate.getDate()).slice(-2);
	const hh = ('0' + actualDate.getHours()).slice(-2);
	const mm = ('0' + actualDate.getMinutes()).slice(-2);
	const ss = ('0' + actualDate.getSeconds()).slice(-2);

	const contenido = JSON.stringify(generalSave());

	const nombreArchivo = `${YYYY}${MM}${DD}-${hh}${mm}${ss}-FASI.json`;
	const tipoArchivo = "text/json;charset=utf-8;";

	const enlaceDescarga = document.createElement("a");
	const archivoBlob = new Blob([contenido], { type: tipoArchivo });

	enlaceDescarga.href = URL.createObjectURL(archivoBlob);
	enlaceDescarga.download = nombreArchivo;
	enlaceDescarga.click();

	URL.revokeObjectURL(enlaceDescarga.href);		// clean created URL objet
}
function importFile(archivo) {

	const reader = new FileReader();

	reader.onload = function (event) {
		importSettings(JSON.parse(event.target.result));
		ponInfo();
		ponClasif();
	};

	reader.readAsText(archivo);
}