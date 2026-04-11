let lastZonecronDebugSignature = "";
let lastGalicanDebugSignature = "";
let lastGalicanObservedPayload = null;

function getChangedGalicanKeys(previousPayload, nextPayload) {
	const changedKeys = [];
	const allKeys = new Set([
		...Object.keys(previousPayload || {}),
		...Object.keys(nextPayload || {}),
	]);

	for (const key of allKeys) {
		if ((previousPayload || {})[key] !== (nextPayload || {})[key]) {
			changedKeys.push(key);
		}
	}

	return changedKeys;
}
function shouldCaptureGalicanPayload(parsedData) {
	if (!lastGalicanObservedPayload) {
		lastGalicanObservedPayload = { ...parsedData };
		return true;
	}

	const changedKeys = getChangedGalicanKeys(lastGalicanObservedPayload, parsedData);
	lastGalicanObservedPayload = { ...parsedData };

	if (!changedKeys.length) return false;
	if (changedKeys.every(key => key === "uptime")) return false;
	if (parsedData.running === true && changedKeys.every(key => key === "time" || key === "uptime")) return false;

	return true;
}

function annotateFlowPlayset(playset, runData) {
	playset.trialName = runData.trial_name || "----- -- -----";
	playset.gradeSize = runData.name || "-- / -";
	playset.roundType = runData.type || "--";
	return playset;
}
function triggerNextTeamDisplay() {
	clearTimeout(fadingTimer);
	FASI.runtime.debugLog("flow", "Queued next team display", {
		start_order: appState.nextTeam?.start_order,
		delay: appState.ui.fadingDelay,
	});
	fadingTimer = setTimeout(() => {
		if (fadingSelector.selectedIndex) {
			for (let item of animable) {
				item.classList.add("active");
			}
		} else {
			appState.currentTeam = appState.nextTeam;
			FASI.runtime.updateInfo();
		}
	}, appState.ui.fadingDelay);
}
function applyFlowRunData(runData) {
	if (runData.playset) {

		lengthInput.value = parseInt(runData.length) || lengthInput.value;

		appState.currentTeam = annotateFlowPlayset(runData.playset, runData);
		FASI.runtime.debugLog("flow", "Applied run data", {
			start_order: appState.currentTeam.start_order,
			status: appState.currentTeam.status_string,
			length: runData.length,
		});
		FASI.runtime.updateInfo();

	} else {
		appState.currentTeam = null;
		FASI.runtime.debugLog("flow", "Run data cleared current team");
		FASI.runtime.updateInfo();
	}

	if (runData.results_best) appState.clasifTeams = runData.results_best;
	if (runData.results_combined) appState.generalTeams = runData.results_combined;
	FASI.runtime.updateClassif();
}
function applyFlowRunReadyData(runReadyData) {
	if (runReadyData.playset) {
		appState.nextTeam = annotateFlowPlayset(runReadyData.playset, runReadyData);
		FASI.runtime.debugLog("flow", "Received run_ready", {
			start_order: appState.nextTeam.start_order,
		});
		triggerNextTeamDisplay();
	} else {
		appState.nextTeam = null;
		FASI.runtime.debugLog("flow", "run_ready cleared next team");
	}
}
function updateOfflineScoreDisplay(faultValue, refusalValue, eliminationValue) {
	FASI.runtime.setFormattedText(faults, faultValue);
	FASI.runtime.setFormattedText(refusals, refusalValue);
	faults.style.visibility = eliminationValue === 0 || eliminationValue === "0" ? "visible" : "hidden";
	refusals.style.visibility = eliminationValue === 0 || eliminationValue === "0" ? "visible" : "hidden";
	eliminated.style.visibility = eliminationValue === 0 || eliminationValue === "0" ? "hidden" : "visible";
}
function applyZonecronTimerMessage(messageData) {
	const data = messageData.trim();

	if (messageData == '__ping__') {
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
			updateOfflineScoreDisplay(data[1], data[2], data[3]);
		}
		const signature = `${data[0]}:${tiem}:${data[1]}:${data[2]}:${data[3]}`;
		if (signature !== lastZonecronDebugSignature) {
			lastZonecronDebugSignature = signature;
			FASI.runtime.debugLog("timer", "Processed ZonEcron telegram", {
				mode: data[0],
				time: tiem,
				faults: data[1],
				refusals: data[2],
				elimination: data[3],
			});
		}
	}
}
function mergeGalicanTimerStatus(parsedData) {
	for (let property in galicanTimerStatus) {
		if (parsedData.hasOwnProperty(property)) {
			galicanTimerStatus[property] = parsedData[property];
		}
	}
}
function applyGalicanTimerMessage(messageData) {
	const parsedData = checkJSON(messageData);

	if (parsedData) {
		const shouldCaptureMessage = shouldCaptureGalicanPayload(parsedData);

		mergeGalicanTimerStatus(parsedData);

		if (galicanTimerStatus.countdown === 0 || galicanTimerStatus.countdown === false) {

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
			updateOfflineScoreDisplay(galicanTimerStatus.faults, galicanTimerStatus.refusals, galicanTimerStatus.elimination);
		}
		const signature = `${galicanTimerStatus.running}:${galicanTimerStatus.time}:${galicanTimerStatus.countdown}:${galicanTimerStatus.faults}:${galicanTimerStatus.refusals}:${galicanTimerStatus.elimination}`;
		if (shouldCaptureMessage && signature !== lastGalicanDebugSignature) {
			lastGalicanDebugSignature = signature;
			FASI.runtime.recordIncomingFixtureMessage("galican", parsedData);
			FASI.runtime.debugLog("timer", "Processed Galican status", {
				running: galicanTimerStatus.running,
				time: galicanTimerStatus.time,
				countdown: galicanTimerStatus.countdown,
				faults: galicanTimerStatus.faults,
				refusals: galicanTimerStatus.refusals,
				elimination: galicanTimerStatus.elimination,
			});
		}
	}
}
function scheduleFlowReconnect() {
	clearInterval(flowReconnCountD);

	FASI.runtime.setConnectionUi(connFlowStatus, connFlowButton, "Retrying in 5s.", "orange", "Cancel");
	FASI.runtime.debugLog("flow", "Scheduled reconnect", { seconds: 5 });

	flowReconnCountD = setInterval(reconnFlow, 1000);
	flowReconnTimeout = setTimeout(websocFlow, 5000);

	flowReconnTimeLeft = 5;
	flowReconnTimeoutActive = true;
}
function scheduleTimerReconnect() {
	clearInterval(timerReconnCountD);

	FASI.runtime.setConnectionUi(connTimerStatus, connTimerButton, "Retrying in 5s.", "orange", "Cancel");
	FASI.runtime.debugLog("timer", "Scheduled reconnect", { seconds: 5 });

	timerReconnCountD = setInterval(reconnTimer, 1000);
	timerReconnTimeout = setTimeout(websocTimer, 5000);

	timerReconnTimeLeft = 5;
	timerReconnTimeoutActive = true;
}
function resetFlowReconnectState() {
	clearInterval(flowReconnCountD);
	clearTimeout(flowReconnTimeout);
	flowReconnTimeoutActive = false;
	flowConnToggleFromUser = false;
}
function resetTimerReconnectState() {
	clearInterval(timerReconnCountD);
	clearTimeout(timerReconnTimeout);
	timerReconnTimeoutActive = false;
	timerConnToggleFromUser = false;
}
function getFlowSocketUrl() {
	return 'wss://' + urlWebsocket.value;
}
function getTimerSocketUrl() {
	if (timerSelector.selectedIndex === 0) {
		return 'ws://' + timerWebsocket.value;
	}
	return 'ws://' + timerWebsocket.value + "/timerws";
}
function handleFlowSocketMessage(messageData) {
	if (messageData === 'pong') {

		clearTimeout(noPongTimeout);
		noPongTimeout = setTimeout(noPong, noPongDelay);

		clearTimeout(flowPingTimeout);
		flowPingTimeout = setTimeout(() => {
			connectionF.send("ping");
		}, flowPingDelay);
		return;
	}

	const parsedData = checkJSON(messageData);
	if (parsedData) {
		FASI.runtime.recordIncomingFixtureMessage("flow", parsedData);
	}

	if (parsedData && parsedData.run && typeof parsedData.run === "object") {
		applyFlowRunData(parsedData.run);
	}
	else if (parsedData && parsedData.run) {
		FASI.runtime.debugLog("flow", "Ignored invalid run payload", parsedData.run);
	}

	if (parsedData && parsedData.run_ready && typeof parsedData.run_ready === "object") {
		applyFlowRunReadyData(parsedData.run_ready);
	}
	else if (parsedData && parsedData.run_ready) {
		FASI.runtime.debugLog("flow", "Ignored invalid run_ready payload", parsedData.run_ready);
	}
}
function handleTimerSocketMessage(messageData) {
	if (timerSelector.selectedIndex === 0) {
		if (messageData !== "__ping__") {
			FASI.runtime.recordIncomingFixtureMessage("zonecron", messageData);
		}
		applyZonecronTimerMessage(messageData);
	} else if (timerSelector.selectedIndex === 1) {
		applyGalicanTimerMessage(messageData);
	}
}
function configureFlowSocketHandlers() {
	connectionF.onopen = () => {

		connectionF.send("ping");
		connectionF.send("streaming_data");

		clearInterval(flowReconnCountD);

		FASI.runtime.setConnectionUi(connFlowStatus, connFlowButton, "Connected", "green", "Disconnect");
		FASI.runtime.debugLog("flow", "Socket opened", getFlowSocketUrl());
	};

	connectionF.onmessage = (message) => {
		handleFlowSocketMessage(message.data);
	};

	connectionF.onerror = () => {
		FASI.runtime.debugLog("flow", "Socket error");

		if (!flowConnToggleFromUser) {
			scheduleFlowReconnect();
		}
	}

	connectionF.onclose = () => {
		clearTimeout(noPongTimeout);
		FASI.runtime.debugLog("flow", "Socket closed", {
			byUser: flowConnToggleFromUser,
			retrying: !flowReconnTimeoutActive && !flowConnToggleFromUser,
		});
		if (!flowReconnTimeoutActive && !flowConnToggleFromUser) {
			scheduleFlowReconnect();
		}
	}
}
function configureTimerSocketHandlers() {
	connectionT.onopen = () => {

		clearInterval(timerReconnCountD);

		FASI.runtime.setConnectionUi(connTimerStatus, connTimerButton, "Connected", "green", "Disconnect");
		FASI.runtime.debugLog("timer", "Socket opened", getTimerSocketUrl());

		if (timerSelector.selectedIndex === 0) connectionT.send("d0");

	};

	connectionT.onmessage = (message) => {
		handleTimerSocketMessage(message.data);
	}

	connectionT.onerror = () => {
		FASI.runtime.debugLog("timer", "Socket error");

		if (!timerConnToggleFromUser) {
			scheduleTimerReconnect();
		}
	}

	connectionT.onclose = () => {
		clearInterval(timeRefreshInterval);
		modo = 'd';
		FASI.runtime.debugLog("timer", "Socket closed", {
			byUser: timerConnToggleFromUser,
			retrying: !timerReconnTimeoutActive && !timerConnToggleFromUser,
		});
		if (!timerReconnTimeoutActive && !timerConnToggleFromUser) {
			scheduleTimerReconnect();
		}
	}
}
function websocFlow() {
	const validation = FASI.runtime.validateFlowSocketInput(urlWebsocket.value);

	urlWebsocket.value = validation.value;
	if (!validation.ok) {
		FASI.runtime.setConnectionUi(connFlowStatus, connFlowButton, validation.message, "red", "Connect");
		FASI.runtime.debugLog("flow", "Rejected connection input", validation.message);
		return;
	}

	if (connectionF instanceof WebSocket) connectionF.close();
	connectionF = new WebSocket(getFlowSocketUrl());
	FASI.runtime.debugLog("flow", "Opening socket", getFlowSocketUrl());

	urlWebsocket.disabled = true;

	resetFlowReconnectState();

	FASI.runtime.setConnectionUi(connFlowStatus, connFlowButton, "Trying", "orange", "Cancel");
	configureFlowSocketHandlers();
}
function connFlow(fromUser = false) {

	flowConnToggleFromUser = fromUser;

	if (connectionF.readyState !== WebSocket.CLOSED || flowReconnTimeoutActive) {

		connectionF.close();

		urlWebsocket.disabled = false;

		clearTimeout(flowReconnTimeout);
		clearInterval(flowReconnCountD);

		flowReconnTimeoutActive = false;

		FASI.runtime.setConnectionUi(connFlowStatus, connFlowButton, "Disconnected", "red", "Connect");
		FASI.runtime.debugLog("flow", "Manual disconnect");

	} else {
		websocFlow();
	}
}
function reconnFlow() {
	flowReconnTimeLeft--;
	FASI.runtime.setConnectionUi(connFlowStatus, connFlowButton, `Retrying in ${flowReconnTimeLeft}s.`, "orange", "Cancel");
}
function noPong() {
	location.reload();
}
function websocTimer() {
	const validation = FASI.runtime.validateTimerSocketInput(timerWebsocket.value);

	timerWebsocket.value = validation.value;
	if (!validation.ok) {
		FASI.runtime.setConnectionUi(connTimerStatus, connTimerButton, validation.message, "red", "Connect");
		FASI.runtime.debugLog("timer", "Rejected connection input", validation.message);
		return;
	}

	if (connectionT instanceof WebSocket) connectionT.close();
	connectionT = new WebSocket(getTimerSocketUrl());
	FASI.runtime.debugLog("timer", "Opening socket", getTimerSocketUrl());

	timerSelector.disabled = true;
	timerWebsocket.disabled = true;

	resetTimerReconnectState();

	FASI.runtime.setConnectionUi(connTimerStatus, connTimerButton, "Trying", "orange", "Cancel");
	configureTimerSocketHandlers();
}
function connTimer(fromUser = false) {

	timerConnToggleFromUser = fromUser;

	if (connectionT.readyState !== WebSocket.CLOSED || timerReconnTimeoutActive) {

		connectionT.close();

		timerSelector.disabled = false;
		timerWebsocket.disabled = false;

		clearTimeout(timerReconnTimeout);
		clearInterval(timerReconnCountD);

		timerReconnTimeoutActive = false;

		FASI.runtime.setConnectionUi(connTimerStatus, connTimerButton, "Disconnected", "red", "Connect");
		FASI.runtime.debugLog("timer", "Manual disconnect");

	} else {
		websocTimer();
	}
}
function reconnTimer() {
	timerReconnTimeLeft--;
	FASI.runtime.setConnectionUi(connTimerStatus, connTimerButton, `Retrying in ${timerReconnTimeLeft}s.`, "orange", "Cancel");
}
function noTimerPing() {
	location.reload();
}
FASI.connections = {
	websocFlow,
	connFlow,
	websocTimer,
	connTimer,
	getFlowSocketUrl,
	getTimerSocketUrl,
	handleFlowSocketMessage,
	handleTimerSocketMessage,
};
FASI.contracts.connections = {
	publicApi: [
		"websocFlow",
		"connFlow",
		"websocTimer",
		"connTimer",
		"getFlowSocketUrl",
		"getTimerSocketUrl",
	],
	shouldNotTouch: ["modal/general window state", "undo stack manipulation"],
};
