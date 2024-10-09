/*----- HIDE CURSOR -----*/
const hideCursorDly = 5000;
let hideCursorTimer = setTimeout(hideCursor, hideCursorDly);

/* ----- COMPETITION INFO STORING ----- */
let currentTeam = {};
let nextTeam = null;
let clasifTeams = {};
let generalTeams = {};

/* ----- FLOW AGILITY WEBSOCKET AND HEARTBEAT ----- */
let connectionF = { readyState: WebSocket.CLOSED };
let flowPingTimeout;
const flowPingDelay = 25000;
let noPongTimeout;
const noPongDelay = 55000;
let flowReconnTimeout;
let flowReconnTimeoutActive = false;
let flowReconnCountD;
let flowReconnTimeLeft = 5;

/* ----- TIMER WEBSOCKET AND HEARTBEAT ----- */
let connectionT = { readyState: WebSocket.CLOSED };
let timerPingTimeout;
const timerPingDelay = 55000;
let galicanTimerStatus = {
	time: 0,
	faults: 0,
	refusals: 0,
	elimination: 0,
	running: false,
	precission: 1,
	countdown: 0,
};
let inicio = new Date().getTime();
let tiem = 0;
let modo = "p";
let timeRefreshInterval;
let timerReconnTimeout;
let timerReconnTimeoutActive = false;
let timerReconnCountD;
let timerReconnTimeLeft = 5;

/* ----- GENERAL WINDOW ----- */
let defSettings = true;
let fadingDelay = 1000;
let fadingTimer;
let imageLoaded = false;

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
const hiddenCheck = document.getElementById("hiddenCheck");
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
const timerSelector = document.getElementById("timerSelector");
const timerWebsocket = document.getElementById("timerWebsocket");
const connTimerStatus = document.getElementById("connTimerStatus");
const connTimerButton = document.getElementById("connTimerButton");
const fadingSelector = document.getElementById("fadingSelector");
const fadingDelayInput = document.getElementById("fadingDelayInput");
const croma = document.getElementById("croma");
const cromaBGcolorInput = document.getElementById("cromaBGcolorInput");
const editButton = document.getElementById("editButton");
const impExButton = document.getElementById("impExButton");
const overlay = document.getElementById('overlay');
const imageFile = document.getElementById('imageFile');
const imageName = document.getElementById('imageName');
const imageStatus = document.getElementById('imageStatus');
const loadImgButton = document.getElementById('loadImgButton');
const maxSpeedInput = document.getElementById("maxSpeedInput");
const lengthInput = document.getElementById("lengthInput");

/* ----- TABLES -----*/
const scoreTable = document.getElementById("scoreTable");
const scoreTableTitle = document.getElementById("scoreTableTitle");
const scoreGeneral = document.getElementById("scoreGeneral");
const scoreGeneralTitle = document.getElementById("scoreGeneralTitle");

/* ----- POPUP HELP WINDOW -----*/
let closeWarningTimeout;
let infoTimeout;
const infoDelay = 1000;
const vInfo = document.getElementById("vInfo");

/* ----- UNDO QUEUE -----*/
let undoArray = [];
let undoPointer = 0;

/* ----- INITIALIZATION FUNCTIONS ----- */
(function () {
	//timerWebsocket.value = location.host;
	setTimeout(() => { hideMe.style.display = "none"; }, 5000);
	defaultTextsAndFlags();
	importSettings(readLocal("FASIsettings"));
	animablesAndDragables();
	eventTriggers();
	updateDisplay();
	populateUndoArray(readAllSettings());
	// websocTimer();
})();
function defaultTextsAndFlags() {

	/* ----- DEFAULT BEFORE AND AFTER TEXTS OF SOME ELEMENTS -----*/
	faults.text1 = "F";
	refusals.text1 = "R";
	eliminated.text1 = eliminated.innerText;
	roundType.text2 = " /";

	/* ----- DEFAULT TITLES FOR TABLES AND ROWS -----*/
	scoreTable.text1 = scoreTableTitle.innerText;
	scoreGeneral.text1 = scoreGeneralTitle.innerText;

	//Table row titles
	for (let i = 0; i < 11; i++) {
		document.getElementById("tabRow" + i).text1 = document.getElementById("tabPos" + i + "o").innerText;
		document.getElementById("genRow" + i).text1 = document.getElementById("genPos" + i + "o").innerText;
	}

	// Table column titles
	const mid = ["Dog", "Handler", "Penalty", "Time", "Speed"];
	for (let midIndex = 0; midIndex < mid.length; midIndex++) {
		document.getElementById("tab" + mid[midIndex] + "0o").text1 = document.getElementById("tab" + mid[midIndex] + "0o").innerText;
		if (midIndex !== 4) document.getElementById("gen" + mid[midIndex] + "0o").text1 = document.getElementById("gen" + mid[midIndex] + "0o").innerText;
	}

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
	for (let i = 0; i < 10; i++) {
		const j = i + 1;
		const k = i + 1 > 9 ? 0 : i + 1;
		clasifTeams[i] = {
			classification: j,
			dog_family_name: "Dog " + j,
			handler: "Handler " + j,
			total_penalization: "00." + ("0" + j).slice(-2),
			speed: "0.00 m/s",
			time: `${k}${k}.${k}${k}`
		};
		generalTeams[i] = {
			classification: j,
			dog_family_name: "Dog " + j,
			handler: "Handler " + j,
			total_penalization: "00." + ("0" + j).slice(-2),
			time: `${k}${k}.${k}${k}`
		};
	}

	/* ----- FLAGS -----*/
	general.editing = false;
	general.showing = false;
	modal.showing = false;

}
function animablesAndDragables() {
	/* ----- CONFIG ANIMATION TO ANIMABLE (FADING) ELEMENTS  ----- */
	for (const [index, item] of Array.from(animable).entries()) {

		item.addEventListener("animationstart", () => {
			//console.log('animation started');
		});

		item.addEventListener("animationiteration", () => {

			item.style["-webkit-animation-direction"] = "reverse";

			currentTeam = nextTeam;
			if (index === 0) updateInfo();
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
		item.addEventListener("dblclick", () => {

			if (general.editing && !general.showing && !modal.showing) {

				modalTitle.innerHTML = "Properties " + item.id;

				textsTitle.innerHTML = "Before and After Texts";
				labelText1.innerHTML = "Before";
				labelText2.innerHTML = "After";

				labelText2.style.visibility = "visible";
				text2.style.visibility = "visible";

				if (item.id === "eliminated") {
					textsTitle.innerHTML = "Text for";
					labelText1.innerHTML = "Eliminated";
					text2.style.visibility = "hidden"
					labelText2.style.visibility = "hidden";
				}

				// Tabla, fila o titulos de columna
				if (item.classList.contains('tableCont') || item.classList.contains('tableRow') || item.classList.contains('tableCoTi')) {
					textsTitle.innerHTML = "Text for";
					labelText1.innerHTML = "Table title";
					text2.style.visibility = "hidden"
					labelText2.style.visibility = "hidden";
				}

				dragProperties(item);
				modal.elemento = item;

				fontInput.value = item.fontFamily;
				sizeInput.value = item.fontSize;
				textColorInput.value = item.color;
				itemBGcolorInput.value = item.bgColor;
				hiddenCheck.checked = item.hiddenCheck;

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
		makeDragable(item);
	}
	for (let item of windowTitle) {
		makeDragable(item);
		item.isDragable = false;
	}
}
function eventTriggers() {
	/* ----- CURSOR HIDE/SHOW ----- */
	window.addEventListener('mousemove', showCursor);
	window.addEventListener('keydown', showCursor);
	/* ----- BROWSERS SYNC -----*/
	window.addEventListener('storage', () => {
		const storedSettings = readLocal("FASIsettings");
		if (storedSettings) {
			importSettings(storedSettings);
		} else {
			location.reload();
		}
	});
	/* ----- GENERAL AND MODAL WINDOWS -----*/
	window.onclick = function (event) {
		if (modal.showing && event.target != modal && !modal.contains(event.target)) {
			vInfo.style.display = "block";
			vInfo.innerHTML = "Close properties window to drag & drop items";
			clearTimeout(closeWarningTimeout);
			closeWarningTimeout = setTimeout(oInfo, 1500);
		}
		if (general.showing && event.target != general && !general.contains(event.target)) {
			vInfo.style.display = "block";
			vInfo.innerHTML = "Close properties window to drag & drop items";
			clearTimeout(closeWarningTimeout);
			closeWarningTimeout = setTimeout(oInfo, 1500);
		}
	}
	window.ondblclick = event => {
		hideMe.style.display = "none";
		window.getSelection()?.removeAllRanges();
		if ((event.target == croma || event.target == overlay) && !modal.showing) {
			const compStyle = window.getComputedStyle(croma);
			cromaBGcolorInput.value = rgbaToHex(compStyle.getPropertyValue("background-color"))
			general.urlWebsocket = urlWebsocket.value;
			general.fadingEnabled = fadingSelector.selectedIndex;
			general.fadingDelay = fadingDelayInput.value;
			general.bgColor = cromaBGcolorInput.value;
			general.imageName = imageName.value;
			general.style.display = "block";
			general.showing = true;
		}
	}
	/* ----- POPUP INFO -----*/
	document.addEventListener("mousemove", event => {
		vInfo.style.left = (event.pageX + 50) + "px";
		vInfo.style.top = event.pageY + "px";
		clearTimeout(infoTimeout);
		oInfo();
		const element = document.elementFromPoint(event.pageX, event.pageY);
		if (element) { infoTimeout = setTimeout(() => { mInfo(element.id) }, infoDelay); }
	});
	document.addEventListener("mousedown", () => {
		clearTimeout(infoTimeout);
		oInfo();
	});
	/* ----- UNDO / REDO -----*/
	document.addEventListener('keydown', event => {
		if (general.editing) {
			if (event.ctrlKey && event.key === 'z') {
				undoEdit();
			}
			if (event.shiftKey && event.ctrlKey && event.key === 'z') {
				redoEdit();
			}
			if (event.ctrlKey && event.key === 'y') {
				redoEdit();
			}
		}
	});
	/* ----- IMAGE FILE SELECT -----*/
	imageFile.addEventListener('change', event => {
		if (event.target.files[0]) {
			const reader = new FileReader();
			reader.onload = e => overlay.src = e.target.result;
			reader.readAsDataURL(event.target.files[0]);
		}
	});
}

/* ----- LOCAL STORAGE FUNCTIONS ----- */
function importSettings(mySettings) {

	if (mySettings) {

		hideMe.style.display = "none";
		toggleImpExp();

		urlWebsocket.value = mySettings.visual.urlWebsocket || "";
		if (urlWebsocket.value) websocFlow();

		timerWebsocket.value = mySettings.visual.timerWebsocket || "";
		if (timerWebsocket.value) websocTimer();

		fadingSelector.selectedIndex = mySettings.visual.fadingEnabled || 1;
		fadingDelayInput.value = mySettings.visual.fadingDelay || 5000;
		croma.style.backgroundColor = mySettings.visual.bgColor || "#000000";

		lengthInput.value = mySettings.visual.length || 220;
		maxSpeedInput.value = mySettings.visual.maxSpeed || 9.9;

		if (isValidBase64(mySettings.visual.imgData)) {
			overlay.src = "data:image/png;base64," + mySettings.visual.imgData;
			imageName.value = mySettings.visual.imgName || "";
			imageLoaded = true;
			imageStatus.innerHTML = "Loaded";
			imageStatus.style.color = "green";
			loadImgButton.innerHTML = "Delete";
		}

		for (let item of dragable) {

			item.style.fontFamily = mySettings[item.id] && mySettings[item.id].fontFamily || item.style.fontFamily;
			item.style.fontSize = mySettings[item.id] && mySettings[item.id].fontSize * 1 + 'px' || item.style.fontSize;
			item.style.color = mySettings[item.id] && mySettings[item.id].color || item.style.color;
			item.style.backgroundColor = mySettings[item.id] && mySettings[item.id].bgColor || item.style.backgroundColor;
			item.hidden = mySettings[item.id] && mySettings[item.id].hidden || item.hidden;

			item.style.height = mySettings[item.id] && mySettings[item.id].height * 1 + 'px' || item.style.height;
			item.style.width = mySettings[item.id] && mySettings[item.id].width * 1 + 'px' || item.style.width;
			item.style.left = mySettings[item.id] && mySettings[item.id].posX * 1 + 'px' || item.style.left;
			item.style.top = mySettings[item.id] && mySettings[item.id].posY * 1 + 'px' || item.style.top;
			item.style.zIndex = mySettings[item.id] && mySettings[item.id].posZ * 1 || item.style.zIndex;

			item.fontFamily = mySettings[item.id] && mySettings[item.id].fontFamily || item.fontFamily;
			item.fontSize = mySettings[item.id] && mySettings[item.id].fontSize || item.fontSize;
			item.color = mySettings[item.id] && mySettings[item.id].color || item.color;
			item.bgColor = mySettings[item.id] && mySettings[item.id].bgColor || item.bgColor;
			item.hiddenCheck = mySettings[item.id] && mySettings[item.id].hidden || item.hiddenCheck;

			item.height = mySettings[item.id] && mySettings[item.id].height || item.height;
			item.width = mySettings[item.id] && mySettings[item.id].width || item.width;
			item.posX = mySettings[item.id] && mySettings[item.id].posX || item.posX;
			item.posY = mySettings[item.id] && mySettings[item.id].posY || item.posY;
			item.posZ = mySettings[item.id] && mySettings[item.id].posZ || item.posZ;

			item.text1 = mySettings[item.id] && mySettings[item.id].text1 || "";
			item.text2 = mySettings[item.id] && mySettings[item.id].text2 || "";

		}

		changeSmoothing();

	}
}
function storeLocal(keyName, mySettings) {
	const jsonString = JSON.stringify(mySettings);
	localStorage.setItem(keyName, jsonString);
}
function readLocal(keyName) {
	try {
		const jsonString = localStorage.getItem(keyName);
		const mySettings = JSON.parse(jsonString);
		return mySettings;
	} catch (error) {
		return null;
	}
}
function getBase64Image(img) {
	let canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;

	let ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	let dataURL = canvas.toDataURL("image/png");
	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
function isValidBase64(str) {
	try {
		return btoa(atob(str)) === str;
	} catch (e) {
		return false;
	}
}

/* ----- WEBSOCKET FLOW AGILITY FUNCTIONS ----- */
function websocFlow() {

	if (connectionF instanceof WebSocket) connectionF.close();
	connectionF = new WebSocket('wss://' + urlWebsocket.value);

	urlWebsocket.disabled = true;

	clearInterval(flowReconnCountD);
	clearTimeout(flowReconnTimeout);

	connFlowStatus.innerHTML = "Trying";
	connFlowStatus.style.color = "orange";
	connFlowButton.innerHTML = "Cancel";

	connectionF.onopen = () => {

		connectionF.send("ping");
		connectionF.send("streaming_data");

		clearInterval(flowReconnCountD);

		connFlowStatus.innerHTML = "Connected";
		connFlowStatus.style.color = "green";
		connFlowButton.innerHTML = "Disconnect";
	};

	connectionF.onmessage = (message) => {

		if (message.data === 'pong') {

			clearTimeout(noPongTimeout);
			noPongTimeout = setTimeout(noPong, noPongDelay);

			clearTimeout(flowPingTimeout);
			flowPingTimeout = setTimeout(() => {
				connectionF.send("ping");
			}, flowPingDelay);

		} else {

			const parsedData = checkJSON(message.data);

			if (parsedData && parsedData.run) {

				if (parsedData.run.playset) {

					lengthInput.value = parseInt(parsedData.run.length) || lengthInput.value;

					currentTeam = parsedData.run.playset;
					currentTeam.trialName = parsedData.run.trial_name || "----- -- -----";
					currentTeam.gradeSize = parsedData.run.name || "-- / -";
					currentTeam.roundType = parsedData.run.type || "--";

					updateInfo();

				} else {
					currentTeam = null;
				}

				if (parsedData.run.results_best) clasifTeams = parsedData.run.results_best;
				if (parsedData.run.results_combined) generalTeams = parsedData.run.results_combined;
				updateClassif();
			}

			if (parsedData && parsedData.run_ready) {
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
							updateInfo();
						}
					}, fadingDelay);
				} else {
					nextTeam = null;
				}
			}
		}
	};

	connectionF.onerror = () => {

		clearInterval(flowReconnCountD);

		connFlowStatus.innerHTML = "Retrying in 5s.";
		connFlowStatus.style.color = "orange";
		connFlowButton.innerHTML = "Cancel";

		flowReconnCountD = setInterval(reconnFlow, 1000);
		flowReconnTimeout = setTimeout(websocFlow, 5000);

		flowReconnTimeLeft = 5;
		flowReconnTimeoutActive = true;

	}

	connectionF.onclose = () => {
		clearTimeout(noPongTimeout);
	}
}
function connFlow() {
	if (connectionF.readyState !== WebSocket.CLOSED || flowReconnTimeoutActive) {

		connectionF.close();

		urlWebsocket.disabled = false;

		clearTimeout(flowReconnTimeout);
		clearInterval(flowReconnCountD);

		flowReconnTimeoutActive = false;

		connFlowStatus.innerHTML = "Disconnected";
		connFlowStatus.style.color = "red";
		connFlowButton.innerHTML = "Connect";

	} else {
		websocFlow();
	}
}
function reconnFlow() {
	flowReconnTimeLeft--;
	connFlowStatus.innerHTML = `Retrying in ${flowReconnTimeLeft}s.`;
	connFlowStatus.style.color = "orange";
	connFlowButton.innerHTML = "Cancel";
}
function noPing() {
	location.reload();
}
function noPong() {
	location.reload();
}
function updateInfo() {

	eliminated.innerHTML = eliminated.text1;
	scoreTableTitle.innerText = scoreTable.text1;
	scoreGeneralTitle.innerText = scoreGeneral.text1;

	if (!general.editing) {
		eliminated.style.visibility = "hidden";
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

		if (currentTeam.time === "") currentTeam.time = "--.--"
		if (currentTeam.speed === "") currentTeam.speed = "-.-- m/s"

		if (connectionT.readyState !== WebSocket.OPEN || currentTeam.status_string === "ready") {
			time.innerHTML = `${time.text1}${currentTeam.time}${time.text2}`;
			speed.innerHTML = `${speed.text1}${currentTeam.speed}${speed.text2}`;
		}

		if (!general.editing) {

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
function updateClassif() {

	//Table row titles
	for (let i = 0; i < 11; i++) {
		document.getElementById("tabPos" + i + "o").innerText = document.getElementById("tabRow" + i).text1;
		document.getElementById("genPos" + i + "o").innerText = document.getElementById("genRow" + i).text1;
	}

	const pre = ["tab", "gen"];
	const mid = ["Dog", "Handler", "Penalty", "Time", "Speed"];

	// Table column titles
	for (let preIndex = 0; preIndex < pre.length; preIndex++) {
		for (let midIndex = 0; midIndex < mid.length; midIndex++) {
			if (preIndex !== 1 || midIndex !== 4) {
				const domElement = document.getElementById(pre[preIndex] + mid[midIndex] + "0o");
				domElement.innerText = document.getElementById(pre[preIndex] + mid[midIndex] + "0o").text1;
			}
		}
	}

	// Dinamically updated table elements
	for (let preIndex = 0; preIndex < pre.length; preIndex++) {

		for (let i = 0; i < 10; i++) {

			const tableDog = document.getElementById(pre[preIndex] + "Dog" + (i + 1) + "o");
			const tableHandler = document.getElementById(pre[preIndex] + "Handler" + (i + 1) + "o");
			const tablePenalty = document.getElementById(pre[preIndex] + "Penalty" + (i + 1) + "o");
			const tableTime = document.getElementById(pre[preIndex] + "Time" + (i + 1) + "o");
			const tableSpeed = (preIndex === 0) ? document.getElementById(pre[preIndex] + "Speed" + (i + 1) + "o") : null;

			const hayInfo = clasifTeams[i]
				? clasifTeams[i].classification
					? true
					: false
				: false;

			if (hayInfo) {
				tableDog.innerHTML = `${tableDog.text1}${clasifTeams[i].dog_family_name}${tableDog.text2}`;
				tableHandler.innerHTML = `${tableHandler.text1}${clasifTeams[i].handler}${tableHandler.text2}`;
				tablePenalty.innerHTML = `${tablePenalty.text1}${clasifTeams[i].total_penalization}${tablePenalty.text2}`;
				tableTime.innerHTML = `${tableTime.text1}${clasifTeams[i].time}${tableTime.text2}`;
				if (preIndex === 0) tableSpeed.innerHTML = `${tableSpeed.text1}${clasifTeams[i].speed}${tableSpeed.text2}`;
			} else {
				tableDog.innerHTML = `${tableDog.text1}-----${tableDog.text2}`;
				tableHandler.innerHTML = `${tableHandler.text1}-----${tableHandler.text2}`;
				tablePenalty.innerHTML = `${tablePenalty.text1}- -.- -${tablePenalty.text2}`;
				tableTime.innerHTML = `${tableTime.text1}- -.- -${tableTime.text2}`;
				if (preIndex === 0) tableSpeed.innerHTML = `${tableSpeed.text1}-.-- m/s${tableSpeed.text2}`;

			}
		}
	}
}

/* ----- WEBSOCKET TIMER FUNCTIONS ----- */
function websocTimer() {

	if (connectionT instanceof WebSocket) connectionT.close();
	if (timerSelector.selectedIndex === 0) {
		connectionT = new WebSocket('ws://' + timerWebsocket.value);
	} else if (timerSelector.selectedIndex === 1) {
		connectionT = new WebSocket('ws://' + timerWebsocket.value + "/timerws");
	}

	timerSelector.disabled = true;
	timerWebsocket.disabled = true;

	clearInterval(timerReconnCountD);
	clearTimeout(timerReconnTimeout);

	connTimerStatus.innerHTML = "Trying";
	connTimerStatus.style.color = "orange";
	connTimerButton.innerHTML = "Cancel";

	connectionT.onopen = () => {

		clearInterval(timerReconnCountD);

		connTimerStatus.innerHTML = "Connected";
		connTimerStatus.style.color = "green";
		connTimerButton.innerHTML = "Disconnect";

		if (timerSelector.selectedIndex === 0) connectionT.send("d0");

	};

	connectionT.onmessage = (message) => {

		if (timerSelector.selectedIndex === 0) {

			const data = message.data;

			if (message.data == '__ping__') {
				clearTimeout(timerPingTimeout);
				timerPingTimeout = setTimeout(noTimerPing, timerPingDelay);
				return;
			}

			const format = /^[A-Za-z]\d{10}$/;

			if (format.test(data)) {

				tiem = parseInt(data.slice(-7), 10);
				inicio = new Date().getTime() - tiem;
				clearInterval(timeRefreshInterval);

				if (data[0] === 'i') {
					modo = 'i';
					clock(tiem, 0);
					setSpeed(tiem);
					timeRefreshInterval = setInterval(() => { crono() }, 100);
				} else if (data[0] === 'p') {
					modo = 'p';
					clock(tiem, 1);
					setSpeed(tiem);
				} else {
					modo = 'p';
					setSpeed(0);
					clock(0, 0);
				}

				if (connectionF.readyState === WebSocket.CLOSED) {
					faults.innerHTML = `${faults.text1}${data[1]}${faults.text2}`;
					refusals.innerHTML = `${refusals.text1}${data[2]}${refusals.text2}`;
					faults.style.visibility = data[3] === "0" ? "visible" : "hidden";
					refusals.style.visibility = data[3] === "0" ? "visible" : "hidden";
					eliminated.style.visibility = data[3] !== "0" ? "visible" : "hidden";
				}
			}


		} else if (timerSelector.selectedIndex === 1) {

			// {"time":42764, "faults":0, "refusals":1, "elimination":0, "running":false, "precission":1, "countdown":0,"uptime":9653501}
			const parsedData = checkJSON(message.data);

			if (parsedData) {

				for (let property in galicanTimerStatus) {
					if (parsedData.hasOwnProperty(property)) {
						galicanTimerStatus[property] = parsedData[property];
					}
				}

				if (galicanTimerStatus.countdown === 0) {

					if (galicanTimerStatus.running === true) {

						inicio = new Date().getTime() - galicanTimerStatus.time;

						if (modo !== 'i') {
							tiem = galicanTimerStatus.time;
							modo = 'i';
							clearInterval(timeRefreshInterval);
							setSpeed(tiem);
							clock(tiem, 0);
							timeRefreshInterval = setInterval(() => { crono() }, 100);
						}
					}

					if (galicanTimerStatus.running === false && modo !== 'p') {
						modo = 'p';
						tiem = Math.round(galicanTimerStatus.time / 10) * 10;
						inicio = new Date().getTime() - tiem;
						clearInterval(timeRefreshInterval);
						setSpeed(tiem);
						clock(tiem, 1);
					}

				} else {
					clearInterval(timeRefreshInterval);
					setSpeed(0);
					clock(0, 0);
				}

				if (connectionF.readyState === WebSocket.CLOSED) {
					faults.innerHTML = `${faults.text1}${galicanTimerStatus.faults}${faults.text2}`;
					refusals.innerHTML = `${refusals.text1}${galicanTimerStatus.refusals}${refusals.text2}`;
					faults.style.visibility = galicanTimerStatus.elimination === 0 ? "visible" : "hidden";
					refusals.style.visibility = galicanTimerStatus.elimination === 0 ? "visible" : "hidden";
					eliminated.style.visibility = galicanTimerStatus.elimination !== 0 ? "visible" : "hidden";
				}
			}
		}
	}

	connectionT.onerror = () => {

		clearInterval(timerReconnCountD);

		connTimerStatus.innerHTML = "Retrying in 5s.";
		connTimerStatus.style.color = "orange";
		connTimerButton.innerHTML = "Cancel";

		timerReconnCountD = setInterval(reconnTimer, 1000);
		timerReconnTimeout = setTimeout(websocTimer, 5000);

		timerReconnTimeLeft = 5;
		timerReconnTimeoutActive = true;

	}

	connectionT.onclose = () => {
		clearInterval(timeRefreshInterval);
	}
}
function connTimer() {
	if (connectionT.readyState !== WebSocket.CLOSED || timerReconnTimeoutActive) {

		connectionT.close();

		timerSelector.disabled = false;
		timerWebsocket.disabled = false;

		clearTimeout(timerReconnTimeout);
		clearInterval(timerReconnCountD);

		timerReconnTimeoutActive = false;

		connTimerStatus.innerHTML = "Disconnected";
		connTimerStatus.style.color = "red";
		connTimerButton.innerHTML = "Connect";

	} else {
		websocTimer();
	}
}
function reconnTimer() {
	timerReconnTimeLeft--;
	connTimerStatus.innerHTML = `Retrying in ${timerReconnTimeLeft}s.`;
	connTimerStatus.style.color = "orange";
	connTimerButton.innerHTML = "Cancel";
}
function noTimerPing() {
	location.reload();
}
function checkJSON(JSONstring) {
	try {
		const parsedData = JSON.parse(JSONstring);
		return parsedData;
	} catch (error) {
		return null;
	}
}
function crono() {
	let tiempoActual = new Date().getTime() - inicio;
	clock(tiempoActual, 0);
	setSpeed(tiempoActual);
}
function clock(muestraTiempo, muestraCentesimas) {
	let valor = "0.00";
	if (muestraTiempo > 0) {
		let enteros = Math.floor(muestraTiempo / 1000);
		let decimal = ("000" + muestraTiempo % 1000).slice(-3);

		if (muestraCentesimas) {
			decimal = decimal.substring(0, 2);
		} else {
			decimal = decimal.substring(0, 1) + "0";
		}

		valor = enteros + "." + decimal
	}
	time.innerHTML = `${time.text1}${valor}${time.text2}`;
}
function setSpeed(miTiempo) {

	let calculatedSpeed = "-.--";

	if (miTiempo > 5000) {
		calculatedSpeed = (lengthInput.value / (miTiempo / 1000)).toFixed(1);
		if (calculatedSpeed > (maxSpeedInput.value * 1)) calculatedSpeed = "-.--";
	}

	speed.innerHTML = `${speed.text1}${calculatedSpeed} m/s${speed.text2}`;

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

	if (target.isDragable && general.editing) {
		if ((!general.showing || target.id === "general") && (!modal.showing || target.id === "modal")) {
			target.mouseX = e.clientX;
			target.mouseY = e.clientY;
			target.isDragging = true;
			target.style.outline = "1px solid #FF0000FF";
			target.style.zIndex = 1000;
			target.dxOld = target.dx || 0;
			target.dyOld = target.dy || 0;
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
		if (target.dx != target.dxOld || target.dy != target.dyOld) {
			populateUndoArray(readAllSettings());
		}
	}
}
function dragProperties(e) {

	const compStyle = window.getComputedStyle(e);

	e.fontFamily = compStyle.getPropertyValue("font-family");
	e.fontSize = parseInt(compStyle.getPropertyValue("font-size"), 10);
	e.color = rgbaToHex(compStyle.getPropertyValue("color"));
	e.bgColor = rgbaToHex(compStyle.getPropertyValue("background-color"));
	e.hiddenCheck = e.hiddenCheck || false;

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
	modal.elemento.hiddenCheck = hiddenCheck.checked;

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

	if (modal.elemento.id.startsWith("tab") || modal.elemento.id.startsWith("gen")) {
		updateClassif();
	} else {
		updateInfo();
	}

}
function modalAccept() {
	modalApply();
	modal.elemento.text1old = text1.value;
	modal.elemento.text2old = text2.value;
	modal.style.display = "none";
	modal.showing = false;
	populateUndoArray(readAllSettings());
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

		updateInfo();

	}

}

/* ----- GENERAL WINDOW FUNCTIONS ----- */
function generalApply() {
	toggleImpExp();
	croma.style.backgroundColor = cromaBGcolorInput.value;
	changeSmoothing();
}
function generalAccept() {
	generalApply();
	general.style.display = "none";
	general.showing = false;
	populateUndoArray(readAllSettings());
}
function generalCancel() {

	let generalEstado = getComputedStyle(general);

	if (generalEstado.getPropertyValue("display") != "none") {

		general.style.display = "none";
		general.showing = false;
		urlWebsocket.value = general.urlWebsocket;
		fadingSelector.selectedIndex = general.fadingEnabled;
		fadingDelayInput.value = general.fadingDelay;
		croma.style.backgroundColor = general.bgColor;
		imageName.value = general.imageName;

	}

	updateInfo();

}
function generalReset() {
	if (rUsure()) {
		localStorage.removeItem("FASIsettings");
		location.reload();
	}
}
function generalEdit() {

	toggleImpExp();

	general.editing = !general.editing;

	// change cursor over dragable elements
	for (let item of dragable) {
		item.classList.toggle("move");
	}

	if (general.editing) {

		editButton.innerHTML = "Exit Edit";

		for (let item of dragable) {
			item.style.visibility = "visible";
			item.hidden = false;
		}

		general.style.display = "none";
		general.showing = false;

	} else {
		editButton.innerHTML = "Enter Edit";
		for (let item of dragable) item.hidden = item.hiddenCheck;
		updateDisplay();
	}
}
function generalSave() {
	generalAccept();
	storeLocal("FASIsettings", readAllSettings());
}
function readAllSettings() {

	imgData = getBase64Image(overlay);

	let mySettings = {
		visual: {

			"fadingEnabled": fadingSelector.selectedIndex,
			"fadingDelay": fadingDelayInput.value * 1,

			"bgColor": cromaBGcolorInput.value,
			"length": lengthInput.value,
			"maxSpeed": maxSpeedInput.value,

			"urlWebsocket": urlWebsocket.value,
			"timerWebsocket": timerWebsocket.value,

			"imgName": imageName.value,
			imgData
		}
	}

	for (let item of dragable) {

		dragProperties(item);

		mySettings[item.id] = {};

		mySettings[item.id].fontFamily = item.fontFamily;
		mySettings[item.id].fontSize = item.fontSize;
		mySettings[item.id].color = item.color;
		mySettings[item.id].bgColor = item.bgColor;
		mySettings[item.id].hidden = item.hidden;
		mySettings[item.id].height = item.height;
		mySettings[item.id].width = item.width;
		mySettings[item.id].posX = item.posX;
		mySettings[item.id].posY = item.posY;
		mySettings[item.id].posZ = item.posZ;
		mySettings[item.id].text1 = item.text1;
		mySettings[item.id].text2 = item.text2;

	}
	return mySettings;
}
function generalImpExp() {
	if (defSettings) {
		JSONfile.click();
	} else {
		exportFile();
	}
}
function toggleImpExp() {
	defSettings = false;
	impExButton.innerHTML = "Export";
}
function changeSmoothing() {
	fadingDelay = fadingDelayInput.value * 1 || 5000;
	if (!fadingSelector.selectedIndex) {
		clearTimeout(fadingTimer);
	}
}
function loadImg() {
	if (imageLoaded) {
		if (rUsure()) {
			overlay.src = "";
			imageFile.value = "";
			imageName.value = "";
			imageLoaded = false;
			imageStatus.innerHTML = "No File";
			imageStatus.style.color = "red";
			loadImgButton.innerHTML = "Load";
		}
	} else {
		imageFile.click();
	}
}
function displayFileName(input) {
	if (input.files.length > 0) {
		imageName.value = input.files[0].name;
		imageLoaded = true;
		imageStatus.innerHTML = "Loaded";
		imageStatus.style.color = "green";
		loadImgButton.innerHTML = "Delete";
	}
}

/* ----- POPUP HELP WINDOW FUNCTIONS -----*/
function mInfo(id) {
	vInfo.style.display = "block";
	if (id === "visualInfoMod" || id === "visualInfoGen") {
		vInfo.innerHTML = "Temporarily apply the modifications";

	} else if (id === "acceptInfoMod" || id === "acceptInfoGen") {
		vInfo.innerHTML = "Apply the modifications and close this window";

	} else if (id === "cancelInfoMod" || id === "cancelInfoModX" || id === "cancelInfoGenX") {
		vInfo.innerHTML = "Discard the modifications and close this window";

	} else if (id === "editButton") {
		vInfo.innerHTML = "Toggle between running mode and editing mode to show hidden elements and enable editing";

	} else if (id === "saveInfo") {
		vInfo.innerHTML = "Apply the modifications and save <b>all settings</b>";

	} else if (id === "resetInfoGen") {
		vInfo.innerHTML = "Return to <b>factory settings</b> and delete saved settings";

	} else if (id === "impExButton") {
		vInfo.innerHTML = "Export current config or import previous exported. Import only available with reseted settings.";

	} else if (id === "fading") {
		vInfo.innerHTML = "When dog finishes the course, after the time indicated in the delay, info will change to next dog with a smooth fade.";

	} else if (id === "fadingDly") {
		vInfo.innerHTML = "Delay in milliseconds to change displayed info when a dog final score is entered in Flow Agility platform.";

	} else if (id === "bgColor") {
		vInfo.innerHTML = "Background color in HEX code. Last two digits 00 will make it transparent. i.e. #FFFFFF00";

	} else if (id === "length") {
		vInfo.innerHTML = "Course length to calculate speed in real time as time increases when local timer is connected.";

	} else if (id === "maxSpeed") {
		vInfo.innerHTML = "Maximun speed to be displayed in real time as time increases when local timer is connected.";

	} else if (id === "streamigURL") {
		vInfo.innerHTML = "URL provided by FlowAgility platform";

	} else if (id === "timerSelector") {
		vInfo.innerHTML = "Timer brand";

	} else {
		vInfo.style.display = "none";
	}
}
function oInfo() {
	clearTimeout(infoTimeout);
	vInfo.style.display = "none";
}
function rUsure() {
	return (confirm("This can't be undone.\n\n¿Are you sure?\n"));
}

/* ----- SETTINGS EXPORT AND IMPORT FUNCTIONS -----*/
function exportFile() {

	const actualDate = new Date();

	const YYYY = actualDate.getFullYear();
	const MM = ('0' + (actualDate.getMonth() + 1)).slice(-2);
	const DD = ('0' + actualDate.getDate()).slice(-2);
	const hh = ('0' + actualDate.getHours()).slice(-2);
	const mm = ('0' + actualDate.getMinutes()).slice(-2);
	const ss = ('0' + actualDate.getSeconds()).slice(-2);

	const contenido = JSON.stringify(readAllSettings());

	const nombreArchivo = `${YYYY}${MM}${DD}-${hh}${mm}${ss}-FASI.json`;
	const tipoArchivo = "text/json;charset=utf-8;";

	const enlaceDescarga = document.createElement("a");
	const archivoBlob = new Blob([contenido], { type: tipoArchivo });

	enlaceDescarga.href = URL.createObjectURL(archivoBlob);
	enlaceDescarga.download = nombreArchivo;
	enlaceDescarga.click();

	URL.revokeObjectURL(enlaceDescarga.href);
}
function importFile(archivo) {

	const reader = new FileReader();

	reader.onload = function (event) {
		importSettings(JSON.parse(event.target.result));
		updateDisplay();
		general.style.display = "none";
		general.showing = false;
	};

	reader.readAsText(archivo);
}
function updateDisplay() {
	updateInfo();
	updateClassif();
	changeSmoothing();
}

/* ----- UNDO FUNCTIONS ----- */
function populateUndoArray(element) {

	if (undoPointer < undoArray.length - 1) {
		undoArray.splice(undoPointer + 1);
	}

	while (undoArray.length >= 100) {
		undoArray.shift();
	}

	undoArray.push(element);
	undoPointer = undoArray.length - 1;

}
function undoEdit() {
	if (undoArray.length > 0 && undoPointer > 0) {
		undoPointer--;
		importSettings(undoArray[undoPointer]);
		updateDisplay();
	}
}
function redoEdit() {
	if (undoArray.length > 0 && undoPointer < undoArray.length - 1) {
		undoPointer++;
		importSettings(undoArray[undoPointer]);
		updateDisplay();
	}
}

/* ----- CURSOR HIDE/SHOW ----- */
function hideCursor() {
	document.body.classList.add('hide-cursor');
}
function showCursor() {
	document.body.classList.remove('hide-cursor');
	clearTimeout(hideCursorTimer);
	hideCursorTimer = setTimeout(hideCursor, hideCursorDly);
}