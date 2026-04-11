function makeDragable(element) {
	element.addEventListener("mousedown", dragStart);

	const runtime = getDragRuntime(element);
	runtime.enabled = true;
	runtime.isDragging = false;
	runtime.mouseX = 0;
	runtime.mouseY = 0;
	runtime.dx = 0;
	runtime.dy = 0;
	runtime.dxOld = 0;
	runtime.dyOld = 0;
	dragProperties(element);
}
function getDragTarget(node) {
	while (node && node !== document.body) {
		if (getDragRuntime(node).enabled) return node;
		node = node.parentNode;
	}
	return null;
}
function isInteractiveWindowControl(node) {
	return !!node.closest("input, select, button, textarea, option, label");
}
function canStartWindowDrag(target, originNode) {
	if (target.id !== "general" && target.id !== "modal") return true;
	if (isInteractiveWindowControl(originNode)) return false;
	return !!originNode.closest(".windowTitle");
}
function dragStart(e) {

	let target = getDragTarget(e.target);
	let runtime = target ? getDragRuntime(target) : null;

	if (target && runtime.enabled && appState.ui.editing) {
		if ((!appState.ui.showingGeneral || target.id === "general") && (!appState.ui.showingModal || target.id === "modal") && canStartWindowDrag(target, e.target)) {
			runtime.mouseX = e.clientX;
			runtime.mouseY = e.clientY;
			runtime.dx = 0;
			runtime.dy = 0;
			runtime.isDragging = true;
			target.style.outline = "1px solid #FF0000FF";
			target.style.zIndex = 1000;
			runtime.dxOld = runtime.dx || 0;
			runtime.dyOld = runtime.dy || 0;
			appState.ui.activeDragTarget = target;
			e.preventDefault();
		}
	}
}
function drag(e) {

	let target = appState.ui.activeDragTarget;
	let runtime = target ? getDragRuntime(target) : null;
	let layout = target ? getElementLayout(target) : null;

	if (target && runtime.isDragging) {
		runtime.dx = e.clientX - runtime.mouseX;
		runtime.dy = e.clientY - runtime.mouseY;
		target.style.left = (layout.posX + runtime.dx) + 'px';
		target.style.top = (layout.posY + runtime.dy) + 'px';
	}
}
function dragEnd(e) {

	let target = appState.ui.activeDragTarget || getDragTarget(e.target);
	let runtime = target ? getDragRuntime(target) : null;
	let layout = target ? getElementLayout(target) : null;

	if (target && runtime.isDragging) {
		runtime.isDragging = false;
		target.style.outline = "none";
		layout.posX += runtime.dx;
		layout.posY += runtime.dy;
		target.style.zIndex = layout.posZ;
		if (runtime.dx != runtime.dxOld || runtime.dy != runtime.dyOld) {
			toggleImpExp();
			FASI.ui.pushUndoSnapshot(FASI.ui.readAllSettings());
		}
		runtime.dx = 0;
		runtime.dy = 0;
		appState.ui.activeDragTarget = null;
	}
}
function cancelActiveDrag() {
	if (appState.ui.activeDragTarget) {
		const runtime = getDragRuntime(appState.ui.activeDragTarget);
		const layout = getElementLayout(appState.ui.activeDragTarget);
		if (runtime.isDragging) {
			runtime.isDragging = false;
			appState.ui.activeDragTarget.style.outline = "none";
			appState.ui.activeDragTarget.style.left = layout.posX + 'px';
			appState.ui.activeDragTarget.style.top = layout.posY + 'px';
			appState.ui.activeDragTarget.style.zIndex = layout.posZ;
			runtime.dx = 0;
			runtime.dy = 0;
		}
	}
	appState.ui.activeDragTarget = null;
}
function dragProperties(e) {
	const meta = getElementMeta(e);
	const layout = getElementLayout(e);

	const compStyle = window.getComputedStyle(e);

	layout.fontFamily = compStyle.getPropertyValue("font-family");
	layout.fontSize = parseInt(compStyle.getPropertyValue("font-size"), 10);
	layout.color = rgbaToHex(compStyle.getPropertyValue("color"));
	layout.bgColor = rgbaToHex(compStyle.getPropertyValue("background-color"));
	meta.hiddenCheck = meta.hiddenCheck || false;

	layout.height = parseInt(compStyle.getPropertyValue("height"), 10);
	layout.width = parseInt(compStyle.getPropertyValue("width"), 10);

	layout.posX = parseInt(compStyle.getPropertyValue("left"), 10);
	layout.posY = parseInt(compStyle.getPropertyValue("top"), 10);
	layout.posZ = parseInt(compStyle.getPropertyValue("z-index"), 10);

}
function rgbaToHex(rgba) {
	const hex = rgba.match(/^(rgba|rgb)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
	const r = parseInt(hex[2], 10).toString(16).padStart(2, '0').toUpperCase();
	const g = parseInt(hex[3], 10).toString(16).padStart(2, '0').toUpperCase();
	const b = parseInt(hex[4], 10).toString(16).padStart(2, '0').toUpperCase();
	const a = (hex[5]
		? Math.round(parseFloat(hex[5]) * 255).toString(16).padStart(2, '0')
		: "FF").toUpperCase();
	return `#${r}${g}${b}${a}`;
}
function openModalForElement(item) {
	dragProperties(item);
	appState.ui.modalTarget = item;
	const meta = getElementMeta(item);
	const layout = getElementLayout(item);
	appState.ui.modalDraft = {
		fontFamily: layout.fontFamily,
		fontSize: layout.fontSize,
		color: layout.color,
		bgColor: layout.bgColor,
		hiddenCheck: meta.hiddenCheck,
		height: layout.height,
		width: layout.width,
		posX: layout.posX,
		posY: layout.posY,
		posZ: layout.posZ,
		text1: meta.text1,
		text2: meta.text2,
	};

	fontInput.value = layout.fontFamily;
	sizeInput.value = layout.fontSize;
	textColorInput.value = layout.color;
	itemBGcolorInput.value = layout.bgColor;
	hiddenCheck.checked = meta.hiddenCheck;

	itemHeight.value = layout.height;
	itemWidth.value = layout.width;

	posXInput.value = layout.posX;
	posYInput.value = layout.posY;
	posZInput.value = layout.posZ;

	text1.value = meta.text1;
	text2.value = meta.text2;

	modal.style.display = "block";
	appState.ui.showingModal = true;
	FASI.runtime.debugLog("ui", "Opened element modal", item.id);
}
function closeModal() {
	modal.style.display = "none";
	appState.ui.showingModal = false;
	appState.ui.modalTarget = null;
	appState.ui.modalDraft = null;
	FASI.runtime.debugLog("ui", "Closed element modal");
}
function openGeneralWindow() {
	const compStyle = window.getComputedStyle(croma);

	cromaBGcolorInput.value = rgbaToHex(compStyle.getPropertyValue("background-color"));
	appState.ui.generalDraft = {
		urlWebsocket: urlWebsocket.value,
		timerType: timerSelector.selectedIndex,
		timerWebsocket: timerWebsocket.value,
		fadingEnabled: fadingSelector.selectedIndex,
		fadingDelay: fadingDelayInput.value,
		length: lengthInput.value,
		maxSpeed: maxSpeedInput.value,
		bgColor: cromaBGcolorInput.value,
		imageName: imageName.value,
		overlaySrc: overlay.src,
		imageLoaded: appState.ui.imageLoaded,
		imageStatus: imageStatus.innerHTML,
		imageStatusColor: imageStatus.style.color,
		loadImgButtonText: loadImgButton.innerHTML,
		defSettings: appState.ui.defSettings,
		impExButtonText: impExButton.innerHTML,
	};

	general.style.display = "block";
	appState.ui.showingGeneral = true;
	FASI.runtime.debugLog("ui", "Opened general window");
}
function closeGeneralWindow() {
	general.style.display = "none";
	appState.ui.showingGeneral = false;
	appState.ui.generalDraft = null;
	FASI.runtime.debugLog("ui", "Closed general window");
}

function modalApply() {

	const modalTarget = appState.ui.modalTarget;
	if (!modalTarget) return;
	const meta = getElementMeta(modalTarget);
	const layout = getElementLayout(modalTarget);

	modalTarget.style.fontFamily = fontInput.value;
	modalTarget.style.fontSize = sizeInput.value * 1 + 'px';
	modalTarget.style.color = textColorInput.value;
	modalTarget.style.backgroundColor = itemBGcolorInput.value;
	layout.fontFamily = fontInput.value;
	layout.fontSize = sizeInput.value * 1;
	layout.color = textColorInput.value;
	layout.bgColor = itemBGcolorInput.value;
	meta.hiddenCheck = hiddenCheck.checked;

	modalTarget.style.height = itemHeight.value * 1 + 'px';
	modalTarget.style.width = itemWidth.value * 1 + 'px';
	layout.height = itemHeight.value * 1;
	layout.width = itemWidth.value * 1;

	modalTarget.style.left = posXInput.value * 1 + 'px';
	modalTarget.style.top = posYInput.value * 1 + 'px';
	layout.posX = posXInput.value * 1;
	layout.posY = posYInput.value * 1;

	let zMinMax = posZInput.value * 1;
	if (zMinMax > 9) zMinMax = 999;
	if (zMinMax < 1) zMinMax = 1;
	layout.posZ = zMinMax;
	modalTarget.style.zIndex = zMinMax;

	meta.text1 = text1.value;
	meta.text2 = text2.value;

	if (modalTarget.id.startsWith("tab") || modalTarget.id.startsWith("gen")) {
		updateClassif();
	} else {
		updateInfo();
	}

}
function restoreModalDraft(modalTarget, modalDraft) {
	if (!modalTarget || !modalDraft) return;

	const meta = getElementMeta(modalTarget);
	const layout = getElementLayout(modalTarget);

	modalTarget.style.fontFamily = modalDraft.fontFamily;
	modalTarget.style.fontSize = modalDraft.fontSize + 'px';
	modalTarget.style.color = modalDraft.color;
	modalTarget.style.backgroundColor = modalDraft.bgColor;
	modalTarget.hidden = appState.ui.editing ? false : modalDraft.hiddenCheck;

	modalTarget.style.height = modalDraft.height + 'px';
	modalTarget.style.width = modalDraft.width + 'px';
	modalTarget.style.left = modalDraft.posX + 'px';
	modalTarget.style.top = modalDraft.posY + 'px';
	modalTarget.style.zIndex = modalDraft.posZ;

	layout.fontFamily = modalDraft.fontFamily;
	layout.fontSize = modalDraft.fontSize;
	layout.color = modalDraft.color;
	layout.bgColor = modalDraft.bgColor;
	layout.height = modalDraft.height;
	layout.width = modalDraft.width;
	layout.posX = modalDraft.posX;
	layout.posY = modalDraft.posY;
	layout.posZ = modalDraft.posZ;

	meta.hiddenCheck = modalDraft.hiddenCheck;
	meta.text1 = modalDraft.text1;
	meta.text2 = modalDraft.text2;
}
function modalAccept() {
	const modalTarget = appState.ui.modalTarget;
	if (!modalTarget) return;
	const meta = getElementMeta(modalTarget);
	modalApply();
	toggleImpExp();
	meta.text1old = text1.value;
	meta.text2old = text2.value;
	closeModal();
	FASI.ui.pushUndoSnapshot(FASI.ui.readAllSettings());
}
function modalCancel() {

	const modalTarget = appState.ui.modalTarget;
	const modalDraft = appState.ui.modalDraft;

	if (modalTarget && getComputedStyle(modal).getPropertyValue("display") !== "none") {
		restoreModalDraft(modalTarget, modalDraft);
		if (modalTarget.id.startsWith("tab") || modalTarget.id.startsWith("gen")) {
			FASI.runtime.updateClassif();
		} else {
			FASI.runtime.updateInfo();
		}
		closeModal();
	}

}

function generalApply() {
	toggleImpExp();
	croma.style.backgroundColor = cromaBGcolorInput.value;
	changeSmoothing();
}
function generalAccept() {
	generalApply();
	closeGeneralWindow();
	FASI.ui.pushUndoSnapshot(FASI.ui.readAllSettings());
}
function generalCancel() {

	const generalDraft = appState.ui.generalDraft;

	if (generalDraft && getComputedStyle(general).getPropertyValue("display") !== "none") {

		closeGeneralWindow();
		urlWebsocket.value = generalDraft.urlWebsocket;
		timerSelector.selectedIndex = generalDraft.timerType;
		timerWebsocket.value = generalDraft.timerWebsocket;
		fadingSelector.selectedIndex = generalDraft.fadingEnabled;
		fadingDelayInput.value = generalDraft.fadingDelay;
		lengthInput.value = generalDraft.length;
		maxSpeedInput.value = generalDraft.maxSpeed;
		cromaBGcolorInput.value = generalDraft.bgColor;
		croma.style.backgroundColor = generalDraft.bgColor;
		imageName.value = generalDraft.imageName;
		overlay.src = generalDraft.overlaySrc;
		appState.ui.imageLoaded = generalDraft.imageLoaded;
		imageStatus.innerHTML = generalDraft.imageStatus;
		imageStatus.style.color = generalDraft.imageStatusColor;
		loadImgButton.innerHTML = generalDraft.loadImgButtonText;
		appState.ui.defSettings = generalDraft.defSettings;
		impExButton.innerHTML = generalDraft.impExButtonText;
		changeSmoothing();

	}

	FASI.runtime.updateInfo();

}
function generalReset() {
	if (rUsure()) {
		FASI.runtime.clearStoredSettings();
		location.reload();
	}
}
function generalEdit() {
	appState.ui.editing = !appState.ui.editing;

	for (let item of dragable) {
		item.classList.toggle("move");
	}

	if (appState.ui.editing) {

		editButton.innerHTML = "Exit Edit";

		for (let item of dragable) {
			item.style.visibility = "visible";
			item.hidden = false;
		}

		closeGeneralWindow();

	} else {
		editButton.innerHTML = "Enter Edit";
		for (let item of dragable) item.hidden = getElementMeta(item).hiddenCheck;
		FASI.ui.updateDisplay();
	}
}
function generalSave() {
	generalAccept();
	FASI.runtime.saveStoredSettings(FASI.runtime.captureSettingsSnapshot());
	FASI.runtime.debugLog("storage", "Saved settings from general window");
}
function readAllSettings() {
	return FASI.runtime.captureSettingsSnapshot();
}
function generalImpExp() {
	if (appState.ui.defSettings) {
		JSONfile.click();
	} else {
		exportFile();
	}
}
function toggleImpExp() {
	appState.ui.defSettings = false;
	impExButton.innerHTML = "Export";
}
function changeSmoothing() {
	const parsedDelay = Number(fadingDelayInput.value);
	appState.ui.fadingDelay = Number.isFinite(parsedDelay) && parsedDelay >= 0 ? parsedDelay : 5000;
	if (!fadingSelector.selectedIndex) {
		clearTimeout(fadingTimer);
	}
}
function loadImg() {
	if (appState.ui.imageLoaded) {
		if (rUsure()) {
			overlay.src = "";
			imageFile.value = "";
			imageName.value = "";
			appState.ui.imageLoaded = false;
			imageStatus.innerHTML = "No File";
			imageStatus.style.color = "red";
			loadImgButton.innerHTML = "Load";
			toggleImpExp();
		}
	} else {
		imageFile.click();
	}
}
function displayFileName(input) {
	if (input.files.length > 0) {
		imageName.value = input.files[0].name;
		appState.ui.imageLoaded = true;
		imageStatus.innerHTML = "Loaded";
		imageStatus.style.color = "green";
		loadImgButton.innerHTML = "Delete";
		toggleImpExp();
	}
}

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
function showTransientInfo(message, delay = 2000) {
	vInfo.style.display = "block";
	vInfo.innerHTML = message;
	clearTimeout(closeWarningTimeout);
	closeWarningTimeout = setTimeout(oInfo, delay);
}
function rUsure() {
	return (confirm("This can't be undone.\n\n¿Are you sure?\n"));
}

function exportFile() {

	const actualDate = new Date();

	const YYYY = actualDate.getFullYear();
	const MM = ('0' + (actualDate.getMonth() + 1)).slice(-2);
	const DD = ('0' + actualDate.getDate()).slice(-2);
	const hh = ('0' + actualDate.getHours()).slice(-2);
	const mm = ('0' + actualDate.getMinutes()).slice(-2);
	const ss = ('0' + actualDate.getSeconds()).slice(-2);

	const contenido = JSON.stringify(captureSettingsSnapshot());

	const nombreArchivo = `${YYYY}${MM}${DD}-${hh}${mm}${ss}-FASI.json`;
	const tipoArchivo = "text/json;charset=utf-8;";

	const enlaceDescarga = document.createElement("a");
	const archivoBlob = new Blob([contenido], { type: tipoArchivo });

	enlaceDescarga.href = URL.createObjectURL(archivoBlob);
	enlaceDescarga.download = nombreArchivo;
	enlaceDescarga.click();

	URL.revokeObjectURL(enlaceDescarga.href);
	FASI.runtime.debugLog("storage", "Exported settings file", nombreArchivo);
}
function importFile(archivo) {
	if (!archivo) return;

	const reader = new FileReader();

	reader.onload = function (event) {
		const parsedData = checkJSON(event.target.result);
		const validation = FASI.runtime.validateImportedSettings(parsedData);

		if (!validation.ok) {
			showTransientInfo(validation.message, 2500);
			FASI.runtime.debugLog("storage", "Rejected imported settings file", {
				file: archivo.name,
				reason: validation.message,
			});
			return;
		}

		FASI.runtime.applyPersistedSettings(parsedData);
		FASI.ui.updateDisplay();
		FASI.ui.closeGeneralWindow();
		FASI.runtime.debugLog("storage", "Imported settings file", archivo?.name || "(unknown)");
	};

	reader.readAsText(archivo);
}
function updateDisplay() {
	FASI.runtime.updateInfo();
	FASI.runtime.updateClassif();
	changeSmoothing();
}

function pushUndoSnapshot(element) {
	const history = appState.history;

	if (history.undoPointer < history.undoStack.length - 1) {
		history.undoStack.splice(history.undoPointer + 1);
	}

	while (history.undoStack.length >= 100) {
		history.undoStack.shift();
	}

	history.undoStack.push(element);
	history.undoPointer = history.undoStack.length - 1;

}
function undoEdit() {
	const history = appState.history;
	if (history.undoStack.length > 0 && history.undoPointer > 0) {
		history.undoPointer--;
		FASI.runtime.applySettings(history.undoStack[history.undoPointer]);
		FASI.ui.updateDisplay();
		FASI.runtime.debugLog("ui", "Undo applied", { pointer: history.undoPointer });
	}
}
function redoEdit() {
	const history = appState.history;
	if (history.undoStack.length > 0 && history.undoPointer < history.undoStack.length - 1) {
		history.undoPointer++;
		FASI.runtime.applySettings(history.undoStack[history.undoPointer]);
		FASI.ui.updateDisplay();
		FASI.runtime.debugLog("ui", "Redo applied", { pointer: history.undoPointer });
	}
}

function hideCursor() {
	document.body.classList.add('hide-cursor');
}
function showCursor() {
	document.body.classList.remove('hide-cursor');
	clearTimeout(hideCursorTimer);
	hideCursorTimer = setTimeout(hideCursor, hideCursorDly);
}

FASI.ui = {
	makeDragable,
	openModalForElement,
	closeModal,
	openGeneralWindow,
	closeGeneralWindow,
	modalApply,
	modalAccept,
	modalCancel,
	generalApply,
	generalAccept,
	generalCancel,
	generalReset,
	generalEdit,
	generalSave,
	readAllSettings,
	updateDisplay,
	pushUndoSnapshot,
	undoEdit,
	redoEdit,
	hideCursor,
	showCursor,
};
FASI.contracts.ui = {
	publicApi: [
		"openModalForElement",
		"closeModal",
		"openGeneralWindow",
		"closeGeneralWindow",
		"updateDisplay",
		"pushUndoSnapshot",
		"readAllSettings",
	],
	shouldNotTouch: ["raw websocket event wiring", "storage key names"],
};
(function () {
	hideCursorTimer = setTimeout(hideCursor, hideCursorDly);
	setTimeout(() => { hideMe.style.display = "none"; }, 5000);
	FASI.runtime.initializeDebugLogs();
	FASI.runtime.ensureDebugPanel();
	FASI.runtime.ensureReplayPanel();
	FASI.setup.buildTableRefs();
	FASI.setup.defaultTextsAndFlags();
	FASI.runtime.applyPersistedSettings(FASI.runtime.loadStoredSettings());
	FASI.setup.animablesAndDragables();
	FASI.setup.eventTriggers();
	FASI.ui.updateDisplay();
	FASI.ui.pushUndoSnapshot(FASI.ui.readAllSettings());
	FASI.runtime.debugLog("boot", "Application boot completed", { debug: appState.debug.enabled });
})();
