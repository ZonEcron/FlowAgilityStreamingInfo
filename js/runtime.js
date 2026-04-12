function readVisualSettingsSnapshot() {
	return {
		fadingEnabled: fadingSelector.selectedIndex,
		fadingDelay: fadingDelayInput.value * 1,
		timerDelay: timerDelayInput.value * 1,
		bgColor: cromaBGcolorInput.value,
		length: lengthInput.value,
		maxSpeed: maxSpeedInput.value,
		urlWebsocket: urlWebsocket.value,
		timerType: timerSelector.selectedIndex,
		timerWebsocket: timerWebsocket.value,
		imgName: imageName.value,
		imgData: getBase64Image(overlay),
	};
}
function safeDebugStringify(data) {
	if (data === undefined) return "";
	if (typeof data === "string") return data;
	try {
		return JSON.stringify(data);
	} catch (error) {
		return String(data);
	}
}
function normalizeDebugData(data) {
	if (data === undefined) return "";
	if (data === null) return null;
	if (typeof data === "object") {
		try {
			return JSON.parse(JSON.stringify(data));
		} catch (error) {
			return safeDebugStringify(data);
		}
	}
	return data;
}
function isPlainObject(value) {
	return !!value && typeof value === "object" && !Array.isArray(value);
}
function sanitizeSocketInput(value) {
	return String(value || "").trim();
}
function validateFlowSocketInput(value) {
	const sanitizedValue = sanitizeSocketInput(value);

	if (!sanitizedValue) return { ok: false, value: "", message: "Flow URL required" };
	if (/^\w+:\/\//i.test(sanitizedValue)) return { ok: false, value: sanitizedValue, message: "Flow URL must not include protocol" };
	if (/\s/.test(sanitizedValue)) return { ok: false, value: sanitizedValue, message: "Flow URL must not contain spaces" };

	return { ok: true, value: sanitizedValue };
}
function validateTimerSocketInput(value) {
	const sanitizedValue = sanitizeSocketInput(value);

	if (!sanitizedValue) return { ok: false, value: "", message: "Timer host:port required" };
	if (/^\w+:\/\//i.test(sanitizedValue)) return { ok: false, value: sanitizedValue, message: "Timer address must not include protocol" };
	if (/\s/.test(sanitizedValue)) return { ok: false, value: sanitizedValue, message: "Timer address must not contain spaces" };
	if (!/:\d+$/.test(sanitizedValue)) return { ok: false, value: sanitizedValue, message: "Timer address must include port" };

	return { ok: true, value: sanitizedValue };
}
function validateImportedSettings(parsedData) {
	if (!isPlainObject(parsedData)) {
		return { ok: false, message: "Imported file must contain a JSON object" };
	}
	if (!isPlainObject(parsedData.visual)) {
		return { ok: false, message: "Imported settings missing visual section" };
	}
	return { ok: true };
}
function isGalicanReplayPayload(value) {
	return isPlainObject(value) && (
		Object.prototype.hasOwnProperty.call(value, "running") ||
		Object.prototype.hasOwnProperty.call(value, "time") ||
		Object.prototype.hasOwnProperty.call(value, "faults") ||
		Object.prototype.hasOwnProperty.call(value, "refusals") ||
		Object.prototype.hasOwnProperty.call(value, "elimination") ||
		Object.prototype.hasOwnProperty.call(value, "countdown")
	);
}
function isFlowReplayPayload(value) {
	return isPlainObject(value) && (
		Object.prototype.hasOwnProperty.call(value, "error") ||
		Object.prototype.hasOwnProperty.call(value, "run") ||
		Object.prototype.hasOwnProperty.call(value, "run_ready") ||
		Object.prototype.hasOwnProperty.call(value, "event_name") ||
		Object.prototype.hasOwnProperty.call(value, "ring_name")
	);
}
function isZonecronReplayLine(line) {
	return line === "__ping__" || /^[A-Za-z]\d{10}$/.test(line);
}
function detectReplaySource(trimmedText) {
	if (!trimmedText) return "";

	const lines = trimmedText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
	if (lines.length && lines.every(isZonecronReplayLine)) {
		return "zonecron";
	}

	const parsedJson = checkJSON(trimmedText);
	if (parsedJson) {
		if (Array.isArray(parsedJson)) {
			const filteredItems = parsedJson.filter(item => item !== undefined && item !== null);
			if (filteredItems.length && filteredItems.every(isFlowReplayPayload)) return "flow";
			if (filteredItems.length && filteredItems.every(isGalicanReplayPayload)) return "galican";
		}
		if (isFlowReplayPayload(parsedJson)) return "flow";
		if (isGalicanReplayPayload(parsedJson)) return "galican";
	}

	const jsonChunks = trimmedText.split(/\r?\n(?=\s*\{)/).map(chunk => chunk.trim()).filter(Boolean);
	if (jsonChunks.length > 1) {
		const parsedChunks = jsonChunks.map(chunk => checkJSON(chunk));
		if (parsedChunks.every(item => item && isFlowReplayPayload(item))) return "flow";
		if (parsedChunks.every(item => item && isGalicanReplayPayload(item))) return "galican";
	}

	return "";
}
function normalizeReplayMessages(fileText, sourceType) {
	const trimmedText = String(fileText || "").trim();
	if (!trimmedText) return [];

	if (sourceType === "zonecron") {
		return trimmedText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
	}

	const parsedJson = checkJSON(trimmedText);
	if (Array.isArray(parsedJson)) {
		return parsedJson.filter(item => item !== undefined && item !== null).map(item => {
			if (typeof item === "string") return item;
			return JSON.stringify(item);
		});
	}
	if (parsedJson) {
		return [JSON.stringify(parsedJson)];
	}

	return trimmedText.split(/\r?\n(?=\s*\{)/).map(chunk => chunk.trim()).filter(Boolean);
}
function formatRecordingTimestamp(date) {
	const YYYY = date.getFullYear();
	const MM = ('0' + (date.getMonth() + 1)).slice(-2);
	const DD = ('0' + date.getDate()).slice(-2);
	const hh = ('0' + date.getHours()).slice(-2);
	const mm = ('0' + date.getMinutes()).slice(-2);
	const ss = ('0' + date.getSeconds()).slice(-2);
	return `${YYYY}-${MM}-${DD}-${hh}-${mm}-${ss}`;
}
function formatRecordingStartedAt(date) {
	if (!date) return "-";
	const YYYY = date.getFullYear();
	const MM = ('0' + (date.getMonth() + 1)).slice(-2);
	const DD = ('0' + date.getDate()).slice(-2);
	const hh = ('0' + date.getHours()).slice(-2);
	const mm = ('0' + date.getMinutes()).slice(-2);
	const ss = ('0' + date.getSeconds()).slice(-2);
	return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}
function formatRecordingDuration(startDate) {
	if (!startDate) return "00:00:00";
	const elapsedMs = Date.now() - startDate.getTime();
	const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
	const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
	const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
	const seconds = String(totalSeconds % 60).padStart(2, "0");
	return `${hours}:${minutes}:${seconds}`;
}
function resetRecordingBuckets() {
	appState.replay.recording.flowMessages = [];
	appState.replay.recording.zonecronMessages = [];
	appState.replay.recording.galicanMessages = [];
}
function updateRecordingStatus() {
	if (!appState.replay.enabled || !appState.replay.recordStatusNode) return;

	if (!appState.replay.recording.active) {
		appState.replay.recordStatusNode.innerHTML = `
			<div class="replayStartedAt">Started: -</div>
			<div>Recording: stopped</div>
		`;
		return;
	}

	appState.replay.recordStatusNode.innerHTML = `
		<div class="replayStartedAt">Started: ${formatRecordingStartedAt(appState.replay.recording.startedAtDate)}</div>
		<div>${[
			`Recording: ${formatRecordingDuration(appState.replay.recording.startedAtDate)}`,
			`Flow ${appState.replay.recording.flowMessages.length}`,
			`Timer ${appState.replay.recording.zonecronMessages.length + appState.replay.recording.galicanMessages.length}`,
		].join(" | ")}</div>
	`;
}
function updateReplayControlsState() {
	if (!appState.replay.enabled || !appState.replay.panel) return;

	const isRecording = appState.replay.recording.active;
	const hasFixtureLoaded = appState.replay.messages.length > 0;
	if (appState.replay.fileNode) appState.replay.fileNode.disabled = isRecording;
	const browseButton = appState.replay.panel.querySelector("#replayBrowseButton");
	const nextButton = appState.replay.panel.querySelector("#replayNextButton");
	const prevButton = appState.replay.panel.querySelector("#replayPrevButton");
	if (browseButton) browseButton.disabled = isRecording;
	if (nextButton) nextButton.disabled = isRecording || !hasFixtureLoaded;
	if (prevButton) prevButton.disabled = isRecording || !hasFixtureLoaded;
	if (appState.replay.recordButtonNode) {
		appState.replay.recordButtonNode.textContent = isRecording ? "Stop Recording" : "Record";
	}
}
function exportRecordedFixtures() {
	const startedAtLabel = appState.replay.recording.startedAtLabel;
	if (!startedAtLabel) return;

	if (appState.replay.recording.flowMessages.length) {
		downloadTextFile(
			`FlowAgility-${startedAtLabel}.json`,
			JSON.stringify(appState.replay.recording.flowMessages, null, 2),
			"application/json;charset=utf-8;"
		);
	}
	if (appState.replay.recording.zonecronMessages.length) {
		downloadTextFile(
			`ZonEcron-${startedAtLabel}.txt`,
			appState.replay.recording.zonecronMessages.join("\n"),
			"text/plain;charset=utf-8;"
		);
	}
	if (appState.replay.recording.galicanMessages.length) {
		downloadTextFile(
			`Galican-${startedAtLabel}.json`,
			JSON.stringify(appState.replay.recording.galicanMessages, null, 2),
			"application/json;charset=utf-8;"
		);
	}
}
function startRecording() {
	if (!appState.replay.enabled || appState.replay.recording.active) return;

	resetRecordingBuckets();
	appState.replay.recording.active = true;
	appState.replay.recording.startedAtDate = new Date();
	appState.replay.recording.startedAtLabel = formatRecordingTimestamp(appState.replay.recording.startedAtDate);
	clearInterval(appState.replay.recordStatusTimer);
	appState.replay.recordStatusTimer = setInterval(updateRecordingStatus, 1000);
	updateReplayControlsState();
	updateReplayStatus();
	updateRecordingStatus();
	debugLog("replay", "Started fixture recording", appState.replay.recording.startedAtLabel);
}
function stopRecording() {
	if (!appState.replay.recording.active) return;

	appState.replay.recording.active = false;
	clearInterval(appState.replay.recordStatusTimer);
	appState.replay.recordStatusTimer = null;
	exportRecordedFixtures();
	debugLog("replay", "Stopped fixture recording", {
		startedAt: appState.replay.recording.startedAtLabel,
		flow: appState.replay.recording.flowMessages.length,
		timer: appState.replay.recording.zonecronMessages.length + appState.replay.recording.galicanMessages.length,
	});
	updateReplayControlsState();
	updateReplayStatus();
	updateRecordingStatus();
}
function toggleRecording() {
	if (appState.replay.recording.active) {
		stopRecording();
	} else {
		startRecording();
	}
}
function recordIncomingFixtureMessage(source, message) {
	if (!appState.replay.recording.active) return;

	if (source === "flow") {
		appState.replay.recording.flowMessages.push(message);
	}
	if (source === "zonecron") {
		appState.replay.recording.zonecronMessages.push(message);
	}
	if (source === "galican") {
		appState.replay.recording.galicanMessages.push(message);
	}
	updateRecordingStatus();
}
function downloadTextFile(filename, content, mimeType) {
	const downloadLink = document.createElement("a");
	const fileBlob = new Blob([content], { type: mimeType });

	downloadLink.href = URL.createObjectURL(fileBlob);
	downloadLink.download = filename;
	downloadLink.click();

	URL.revokeObjectURL(downloadLink.href);
}
function saveDebugLogsToStorage() {
	if (!appState.debug.enabled || !appState.debug.persistLogs) return;
	localStorage.setItem(STORAGE_KEYS.debugLogs, JSON.stringify(appState.debug.logs));
}
function loadDebugLogsFromStorage() {
	if (!appState.debug.enabled || !appState.debug.persistLogs) return [];

	try {
		const storedLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.debugLogs) || "[]");
		return Array.isArray(storedLogs) ? storedLogs.slice(-appState.debug.maxEntries) : [];
	} catch (error) {
		return [];
	}
}
function clearDebugLogsStorage() {
	localStorage.removeItem(STORAGE_KEYS.debugLogs);
}
function exportDebugLogs() {
	if (!appState.debug.enabled || !appState.debug.logs.length) return;

	const actualDate = new Date();
	const YYYY = actualDate.getFullYear();
	const MM = ('0' + (actualDate.getMonth() + 1)).slice(-2);
	const DD = ('0' + actualDate.getDate()).slice(-2);
	const hh = ('0' + actualDate.getHours()).slice(-2);
	const mm = ('0' + actualDate.getMinutes()).slice(-2);
	const ss = ('0' + actualDate.getSeconds()).slice(-2);
	const baseName = `${YYYY}${MM}${DD}-${hh}${mm}${ss}-FASI-debug-log`;

	const jsonContent = JSON.stringify(appState.debug.logs, null, 2);
	downloadTextFile(`${baseName}.json`, jsonContent, "application/json;charset=utf-8;");
}
function getReplayConflictReason(sourceType) {
	if (sourceType === "flow" && connectionF.readyState === WebSocket.OPEN) {
		return "Flow replay blocked while Flow is connected";
	}
	if ((sourceType === "zonecron" || sourceType === "galican") && connectionT.readyState === WebSocket.OPEN) {
		return "Timer replay blocked while timer is connected";
	}
	return "";
}
function updateReplayStatus() {
	if (!appState.replay.enabled || !appState.replay.statusNode) return;

	const total = appState.replay.messages.length;
	const current = total ? Math.min(appState.replay.pointer + 1, total) : 0;
	const typeLabel = appState.replay.sourceType ? ` ${appState.replay.sourceType}` : "";
	appState.replay.statusNode.textContent = `Replay:${typeLabel} stopped | ${current}/${total}`;
}
function updateReplayFileStatus(filename = "") {
	if (!appState.replay.enabled || !appState.replay.fileNameNode) return;
	appState.replay.fileNameNode.textContent = filename ? `File: ${filename}` : "File: -";
}
function dispatchReplayMessage(message) {
	if (!message) return;
	const conflictReason = getReplayConflictReason(appState.replay.sourceType);
	if (conflictReason) {
		appState.replay.statusNode.textContent = conflictReason;
		debugLog("replay", "Blocked replay injection", conflictReason);
		return;
	}

	const previousTimerType = timerSelector.selectedIndex;
	if (appState.replay.sourceType === "zonecron") {
		timerSelector.selectedIndex = 0;
		updateDebugPanel();
		FASI.connections.handleTimerSocketMessage(message, { bypassDelay: true });
		debugLog("replay", "Injected ZonEcron fixture message", message);
	} else if (appState.replay.sourceType === "galican") {
		timerSelector.selectedIndex = 1;
		updateDebugPanel();
		FASI.connections.handleTimerSocketMessage(message, { bypassDelay: true });
		debugLog("replay", "Injected Galican fixture message", message);
	} else {
		FASI.connections.handleFlowSocketMessage(message);
		debugLog("replay", "Injected Flow fixture message");
	}
	if (appState.replay.sourceType === "zonecron" || appState.replay.sourceType === "galican") {
		timerSelector.selectedIndex = previousTimerType;
		updateDebugPanel();
	}
}
function stepReplay(dir) {
	if (!appState.replay.messages.length) return false;

	if (dir === "Fwd" && appState.replay.pointer >= appState.replay.messages.length - 1) {
		updateReplayStatus();
		return false;
	}

	if (dir === "Rev" && appState.replay.pointer <= 0) {
		updateReplayStatus();
		return false;
	}

	if (dir === "Fwd") appState.replay.pointer++;
	if (dir === "Rev") appState.replay.pointer--;

	dispatchReplayMessage(appState.replay.messages[appState.replay.pointer]);
	updateReplayStatus();
	return true;
}
function loadReplayFixture(file) {
	if (!file || !appState.replay.enabled) return;

	const reader = new FileReader();
	reader.onload = event => {
		const sourceType = detectReplaySource(event.target.result);
		appState.replay.sourceType = sourceType;
		appState.replay.messages = sourceType ? normalizeReplayMessages(event.target.result, sourceType) : [];
		appState.replay.pointer = -1;
		updateReplayControlsState();
		updateReplayStatus();
		if (!sourceType) {
			debugLog("replay", "Rejected fixture with unknown format", file.name);
			return;
		}
		const conflictReason = getReplayConflictReason(sourceType);
		if (conflictReason) {
			appState.replay.messages = [];
			appState.replay.pointer = -1;
			updateReplayControlsState();
			appState.replay.statusNode.textContent = conflictReason;
			debugLog("replay", "Rejected fixture because live connection is active", {
				file: file.name,
				sourceType,
			});
			return;
		}
		debugLog("replay", "Loaded fixture", {
			file: file.name,
			sourceType,
			messages: appState.replay.messages.length,
		});
	};
	reader.readAsText(file);
}
function ensureReplayPanel() {
	if (!appState.replay.enabled || appState.replay.panel) return;

	const panel = document.getElementById("replayPanel");
	if (!panel) return;
	panel.hidden = false;
	appState.replay.panel = panel;
	appState.replay.fileNode = panel.querySelector("#replayFile");
	appState.replay.fileNameNode = panel.querySelector("#replayFileStatus");
	appState.replay.statusNode = panel.querySelector("#replayStatus");
	appState.replay.recordStatusNode = panel.querySelector("#replayRecordStatus");
	appState.replay.recordButtonNode = panel.querySelector("#replayRecordButton");

	panel.querySelector("#replayBrowseButton").addEventListener("click", () => {
		appState.replay.fileNode?.click();
	});
	panel.querySelector("#replayFile").addEventListener("change", event => {
		updateReplayFileStatus(event.target.files?.[0]?.name || "");
		loadReplayFixture(event.target.files?.[0]);
	});
	panel.querySelector("#replayNextButton").addEventListener("click", () => {
		stepReplay("Fwd");
	});
	panel.querySelector("#replayPrevButton").addEventListener("click", () => {
		stepReplay("Rev");
	});
	panel.querySelector("#replayRecordButton").addEventListener("click", () => {
		toggleRecording();
	});
	updateReplayControlsState();
	updateReplayFileStatus();
	updateReplayStatus();
	updateRecordingStatus();
}
function initializeDebugLogs() {
	if (!appState.debug.enabled) return;

	appState.debug.logs = loadDebugLogsFromStorage();
}
function getSocketStateLabel(connection) {
	const socketStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
	return socketStates[connection.readyState] || "UNKNOWN";
}
function summarizeTeam(team) {
	if (!team || !team.start_order) return "none";
	const parts = [team.start_order];
	if (team.dog_family_name) parts.push(team.dog_family_name);
	if (team.handler) parts.push(team.handler);
	return parts.join(" | ");
}
function ensureDebugPanel() {
	if (!appState.debug.enabled || appState.debug.panel) return;

	const panel = document.getElementById("debugPanel");
	if (!panel) return;
	panel.hidden = false;
	appState.debug.panel = panel;
	appState.debug.statusNode = panel.querySelector("#debugStatus");
	appState.debug.logNode = panel.querySelector("#debugLog");

	panel.querySelector("#debugClearButton").addEventListener("click", () => {
		appState.debug.logs = [];
		clearDebugLogsStorage();
		updateDebugPanel();
	});
	panel.querySelector("#debugExportButton").addEventListener("click", () => {
		exportDebugLogs();
	});
}
function updateDebugPanel() {
	if (!appState.debug.enabled) return;

	ensureDebugPanel();

	const flowUrl = urlWebsocket.value || "(empty)";
	const timerUrl = timerWebsocket.value || "(empty)";
	const timerType = timerSelector.selectedOptions[0]?.text || "unknown";
	const clasifCount = Object.keys(appState.clasifTeams || {}).length;
	const generalCount = Object.keys(appState.generalTeams || {}).length;

	appState.debug.statusNode.textContent = [
		`Flow: ${getSocketStateLabel(connectionF)} | ${flowUrl}`,
		`Timer: ${getSocketStateLabel(connectionT)} | ${timerType} | ${timerUrl}`,
		`Editing: ${appState.ui.editing ? "yes" : "no"} | Modal: ${appState.ui.showingModal ? "open" : "closed"} | General: ${appState.ui.showingGeneral ? "open" : "closed"}`,
		`Current: ${summarizeTeam(appState.currentTeam)}`,
		`Next: ${summarizeTeam(appState.nextTeam)}`,
		`Tables: best=${clasifCount} combined=${generalCount}`,
	].join("\n");

	appState.debug.logNode.innerHTML = appState.debug.logs.map(entry => {
		const renderedData = entry.data === "" ? "" : safeDebugStringify(entry.data);
		const dataSuffix = renderedData ? `<span class="debugLogData"> ${renderedData}</span>` : "";
		return `<div class="debugLogEntry"><span class="debugLogTime">${entry.time}</span><span class="debugLogArea">${entry.area}</span><span class="debugLogMessage">${entry.message}</span>${dataSuffix}</div>`;
	}).join("");
	appState.debug.logNode.scrollTop = appState.debug.logNode.scrollHeight;
}
function debugLog(area, message, data) {
	if (!appState.debug.enabled) return;

	appState.debug.logs.push({
		time: new Date().toLocaleTimeString("es-ES", { hour12: false }),
		area,
		message,
		data: normalizeDebugData(data),
	});

	while (appState.debug.logs.length > appState.debug.maxEntries) {
		appState.debug.logs.shift();
	}

	saveDebugLogsToStorage();
	updateDebugPanel();
}
function applyVisualSettingsSnapshot(visualSettings = {}) {
	const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
	const readValue = (obj, key, fallback) => (obj && hasOwn(obj, key)) ? obj[key] : fallback;
	const imgData = readValue(visualSettings, "imgData", "");
	const imgName = readValue(visualSettings, "imgName", "");

	urlWebsocket.value = readValue(visualSettings, "urlWebsocket", "");
	timerSelector.selectedIndex = readValue(visualSettings, "timerType", timerSelector.selectedIndex);
	timerWebsocket.value = readValue(visualSettings, "timerWebsocket", "");
	timerDelayInput.value = readValue(visualSettings, "timerDelay", 0);

	fadingSelector.selectedIndex = readValue(visualSettings, "fadingEnabled", 1);
	fadingDelayInput.value = readValue(visualSettings, "fadingDelay", 5000);
	croma.style.backgroundColor = readValue(visualSettings, "bgColor", "#000000");

	lengthInput.value = readValue(visualSettings, "length", 220);
	maxSpeedInput.value = readValue(visualSettings, "maxSpeed", 9.9);

	if (isValidBase64(imgData)) {
		overlay.src = "data:image/png;base64," + imgData;
		imageName.value = imgName;
		appState.ui.imageLoaded = true;
		imageStatus.innerHTML = "Loaded";
		imageStatus.style.color = "green";
		loadImgButton.innerHTML = "Delete";
	} else {
		overlay.src = "";
		imageName.value = "";
		appState.ui.imageLoaded = false;
		imageStatus.innerHTML = "No File";
		imageStatus.style.color = "red";
		loadImgButton.innerHTML = "Load";
	}
}
function captureSettingsSnapshot() {
	let mySettings = {
		visual: readVisualSettingsSnapshot()
	};

	for (let item of dragable) {
		mySettings[item.id] = readElementSettings(item);
	}
	return mySettings;
}
function saveStoredSettings(mySettings) {
	storeLocal(STORAGE_KEYS.settings, mySettings);
}
function loadStoredSettings() {
	return readLocal(STORAGE_KEYS.settings);
}
function applySettings(mySettings) {

	if (mySettings) {
		hideMe.style.display = "none";
		toggleImpExp();

		applyVisualSettingsSnapshot(mySettings.visual);

		for (let item of dragable) {
			applyElementSettings(item, mySettings[item.id]);
		}

		changeSmoothing();
		debugLog("settings", "Applied local settings snapshot");

	}
}
function applyConnections(mySettings) {

	if (!mySettings || !mySettings.visual) return;

	const savedFlowUrl = sanitizeSocketInput(mySettings.visual.urlWebsocket);
	const savedTimerUrl = sanitizeSocketInput(mySettings.visual.timerWebsocket);

	if (savedFlowUrl) FASI.connections.websocFlow();
	if (savedTimerUrl) FASI.connections.websocTimer();
	debugLog("settings", "Applied persisted connections");
}
function applyPersistedSettings(mySettings) {
	applySettings(mySettings);
	applyConnections(mySettings);
}
function storeLocal(keyName, mySettings) {
	const jsonString = JSON.stringify(mySettings);
	localStorage.setItem(keyName, jsonString);
	debugLog("storage", "Saved settings to localStorage", keyName);
}
function readLocal(keyName) {
	try {
		const jsonString = localStorage.getItem(keyName);
		const mySettings = JSON.parse(jsonString);
		debugLog("storage", "Loaded settings from localStorage", keyName);
		return mySettings;
	} catch (error) {
		debugLog("storage", "Failed to read localStorage settings", keyName);
		return null;
	}
}
function clearStoredSettings() {
	localStorage.removeItem(STORAGE_KEYS.settings);
	debugLog("storage", "Cleared stored settings", STORAGE_KEYS.settings);
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
function getElementMeta(element) {
	if (!elementMeta.has(element)) {
		elementMeta.set(element, {
			text1: "",
			text2: "",
			text1old: "",
			text2old: "",
			hiddenCheck: false,
		});
	}
	return elementMeta.get(element);
}
function getElementLayout(element) {
	if (!elementLayout.has(element)) {
		elementLayout.set(element, {
			fontFamily: "",
			fontSize: 0,
			color: "",
			bgColor: "",
			height: 0,
			width: 0,
			posX: 0,
			posY: 0,
			posZ: 0,
		});
	}
	return elementLayout.get(element);
}
function applyElementSettings(item, itemSettings = {}) {
	const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
	const readValue = (obj, key, fallback) => (obj && hasOwn(obj, key)) ? obj[key] : fallback;
	const meta = getElementMeta(item);
	const layout = getElementLayout(item);

	item.style.fontFamily = readValue(itemSettings, "fontFamily", item.style.fontFamily);
	item.style.fontSize = readValue(itemSettings, "fontSize", layout.fontSize) * 1 + 'px';
	item.style.color = readValue(itemSettings, "color", item.style.color);
	item.style.backgroundColor = readValue(itemSettings, "bgColor", item.style.backgroundColor);
	item.hidden = readValue(itemSettings, "hidden", item.hidden);

	item.style.height = readValue(itemSettings, "height", layout.height) * 1 + 'px';
	item.style.width = readValue(itemSettings, "width", layout.width) * 1 + 'px';
	item.style.left = readValue(itemSettings, "posX", layout.posX) * 1 + 'px';
	item.style.top = readValue(itemSettings, "posY", layout.posY) * 1 + 'px';
	item.style.zIndex = readValue(itemSettings, "posZ", layout.posZ) * 1;

	layout.fontFamily = readValue(itemSettings, "fontFamily", layout.fontFamily);
	layout.fontSize = readValue(itemSettings, "fontSize", layout.fontSize);
	layout.color = readValue(itemSettings, "color", layout.color);
	layout.bgColor = readValue(itemSettings, "bgColor", layout.bgColor);
	meta.hiddenCheck = readValue(itemSettings, "hidden", meta.hiddenCheck);

	layout.height = readValue(itemSettings, "height", layout.height);
	layout.width = readValue(itemSettings, "width", layout.width);
	layout.posX = readValue(itemSettings, "posX", layout.posX);
	layout.posY = readValue(itemSettings, "posY", layout.posY);
	layout.posZ = readValue(itemSettings, "posZ", layout.posZ);

	meta.text1 = readValue(itemSettings, "text1", meta.text1);
	meta.text2 = readValue(itemSettings, "text2", meta.text2);
}
function readElementSettings(item) {
	dragProperties(item);
	const meta = getElementMeta(item);
	const layout = getElementLayout(item);

	return {
		fontFamily: layout.fontFamily,
		fontSize: layout.fontSize,
		color: layout.color,
		bgColor: layout.bgColor,
		hidden: item.hidden,
		height: layout.height,
		width: layout.width,
		posX: layout.posX,
		posY: layout.posY,
		posZ: layout.posZ,
		text1: meta.text1,
		text2: meta.text2,
	};
}
function setFormattedText(element, value) {
	const meta = getElementMeta(element);
	element.innerHTML = `${meta.text1}${value ?? ""}${meta.text2}`;
}
function renderTeamField(element, value) {
	setFormattedText(element, value);
}
function hasClassificationData(teamData) {
	if (!teamData) return false;
	return [
		teamData.classification,
		teamData.dog_family_name,
		teamData.handler,
		teamData.total_penalization,
		teamData.time,
		teamData.speed,
	].some(value => value !== undefined && value !== null && value !== "");
}
function setConnectionUi(statusElement, buttonElement, statusText, statusColor, buttonText) {
	statusElement.innerHTML = statusText;
	statusElement.style.color = statusColor;
	buttonElement.innerHTML = buttonText;
	updateDebugPanel();
}
function getDragRuntime(element) {
	if (!dragRuntime.has(element)) {
		dragRuntime.set(element, {
			enabled: false,
			isDragging: false,
			mouseX: 0,
			mouseY: 0,
			dx: 0,
			dy: 0,
			dxOld: 0,
			dyOld: 0,
		});
	}
	return dragRuntime.get(element);
}
function renderTableRow(prefix, rowIndex, teamData) {
	const refs = tableRefs[prefix];
	const tableDog = refs.dogCells[rowIndex];
	const tableHandler = refs.handlerCells[rowIndex];
	const tablePenalty = refs.penaltyCells[rowIndex];
	const tableTime = refs.timeCells[rowIndex];
	const tableSpeed = prefix === "tab" ? refs.speedCells[rowIndex] : null;

	if (hasClassificationData(teamData)) {
		setFormattedText(tableDog, teamData.dog_family_name);
		setFormattedText(tableHandler, teamData.handler);
		setFormattedText(tablePenalty, teamData.total_penalization);
		setFormattedText(tableTime, teamData.time);
		if (tableSpeed) setFormattedText(tableSpeed, teamData.speed);
		return;
	}

	setFormattedText(tableDog, "-----");
	setFormattedText(tableHandler, "-----");
	setFormattedText(tablePenalty, "- -.- -");
	setFormattedText(tableTime, "- -.- -");
	if (tableSpeed) setFormattedText(tableSpeed, "-.-- m/s");
}
function updateInfo() {
	const eliminatedMeta = getElementMeta(eliminated);
	const scoreTableMeta = getElementMeta(scoreTable);
	const scoreGeneralMeta = getElementMeta(scoreGeneral);

	eliminated.innerHTML = eliminatedMeta.text1;
	scoreTableTitle.innerText = scoreTableMeta.text1;
	scoreGeneralTitle.innerText = scoreGeneralMeta.text1;

	if (!appState.ui.editing) {
		eliminated.style.visibility = "hidden";
	}

	if (appState.currentTeam) {

		renderTeamField(order, appState.currentTeam.start_order);
		renderTeamField(handler, appState.currentTeam.handler);
		renderTeamField(dog, appState.currentTeam.dog_family_name);
		renderTeamField(club, appState.currentTeam.club);
		renderTeamField(faults, appState.currentTeam.faults);
		renderTeamField(refusals, appState.currentTeam.refusals);
		renderTeamField(trialName, appState.currentTeam.trialName);
		renderTeamField(gradeSize, appState.currentTeam.gradeSize);
		renderTeamField(roundType, appState.currentTeam.roundType);

		if (appState.currentTeam.time === "") appState.currentTeam.time = "--.--"
		if (appState.currentTeam.speed === "") appState.currentTeam.speed = "-.-- m/s"

		if (connectionT.readyState !== WebSocket.OPEN || appState.currentTeam.status_string === "ready") {
			renderTeamField(time, appState.currentTeam.time);
			renderTeamField(speed, appState.currentTeam.speed);
		}

		if (!appState.ui.editing) {

			if (appState.currentTeam.disqualification === "elim") {
				faults.style.visibility = "hidden";
				refusals.style.visibility = "hidden";
				eliminated.style.visibility = "visible";
			} else {
				faults.style.visibility = "visible";
				refusals.style.visibility = "visible";
				eliminated.style.visibility = "hidden";
			}
		}
	} else {
		renderTeamField(order, "");
		renderTeamField(handler, "");
		renderTeamField(dog, "");
		renderTeamField(club, "");
		renderTeamField(faults, "0");
		renderTeamField(refusals, "0");
		renderTeamField(trialName, "");
		renderTeamField(gradeSize, "");
		renderTeamField(roundType, "");
		if (connectionT.readyState !== WebSocket.OPEN) {
			renderTeamField(time, "--.--");
			renderTeamField(speed, "-.-- m/s");
		}
		if (!appState.ui.editing) {
			faults.style.visibility = "visible";
			refusals.style.visibility = "visible";
			eliminated.style.visibility = "hidden";
		}
	}
	updateDebugPanel();
}
function updateClassif() {
	for (let i = 0; i < 11; i++) {
		tableRefs.tab.positionLabels[i].innerText = getElementMeta(tableRefs.tab.rowContainers[i]).text1;
		tableRefs.gen.positionLabels[i].innerText = getElementMeta(tableRefs.gen.rowContainers[i]).text1;
	}

	const pre = ["tab", "gen"];
	const mid = ["Dog", "Handler", "Penalty", "Time", "Speed"];

	for (let preIndex = 0; preIndex < pre.length; preIndex++) {
		const refs = tableRefs[pre[preIndex]];
		for (let midIndex = 0; midIndex < mid.length; midIndex++) {
			if (preIndex !== 1 || midIndex !== 4) {
				const domElement = refs.headerCells[mid[midIndex]];
				domElement.innerText = getElementMeta(domElement).text1;
			}
		}
	}

	for (let preIndex = 0; preIndex < pre.length; preIndex++) {
		const dataTeams = pre[preIndex] === "tab" ? appState.clasifTeams : appState.generalTeams;

		for (let i = 0; i < 10; i++) {
			renderTableRow(pre[preIndex], i, dataTeams[i]);
		}
	}
	updateDebugPanel();
}
FASI.runtime = {
	readVisualSettingsSnapshot,
	applyVisualSettingsSnapshot,
	captureSettingsSnapshot,
	saveStoredSettings,
	loadStoredSettings,
	applySettings,
	applyConnections,
	applyPersistedSettings,
	clearStoredSettings,
	getElementMeta,
	getElementLayout,
	applyElementSettings,
	readElementSettings,
	validateFlowSocketInput,
	validateTimerSocketInput,
	validateImportedSettings,
	setFormattedText,
	renderTeamField,
	renderTableRow,
	updateInfo,
	updateClassif,
	setConnectionUi,
	getDragRuntime,
	ensureDebugPanel,
	ensureReplayPanel,
	updateDebugPanel,
	debugLog,
	initializeDebugLogs,
	clearDebugLogsStorage,
	exportDebugLogs,
	loadReplayFixture,
	stepReplay,
	startRecording,
	stopRecording,
	toggleRecording,
	recordIncomingFixtureMessage,
};
FASI.contracts.runtime = {
	publicApi: [
		"readVisualSettingsSnapshot",
		"applyVisualSettingsSnapshot",
		"captureSettingsSnapshot",
		"saveStoredSettings",
		"loadStoredSettings",
		"applySettings",
		"applyConnections",
		"applyPersistedSettings",
		"clearStoredSettings",
		"validateFlowSocketInput",
		"validateTimerSocketInput",
		"validateImportedSettings",
		"updateInfo",
		"updateClassif",
		"setConnectionUi",
		"debugLog",
		"updateDebugPanel",
		"ensureReplayPanel",
		"initializeDebugLogs",
		"exportDebugLogs",
		"loadReplayFixture",
		"stepReplay",
		"toggleRecording",
		"recordIncomingFixtureMessage",
	],
	shouldNotTouch: ["websocket transport events", "window event registration"],
};

function checkJSON(JSONstring) {
	try {
		const parsedData = JSON.parse(JSONstring);
		return parsedData;
	} catch (error) {
		if (appState.debug.enabled) {
			debugLog("parse", "Ignored invalid JSON payload");
		}
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
	setFormattedText(time, valor);
}
function setSpeed(miTiempo) {

	let calculatedSpeed = "-.--";

	if (miTiempo > 5000) {
		calculatedSpeed = (lengthInput.value / (miTiempo / 1000)).toFixed(1);
		if (calculatedSpeed > (maxSpeedInput.value * 1)) calculatedSpeed = "-.--";
	}

	setFormattedText(speed, `${calculatedSpeed} m/s`);

}
