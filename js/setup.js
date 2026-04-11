function buildTableRefs() {
	for (const prefix of ["tab", "gen"]) {
		for (let i = 0; i < 11; i++) {
			tableRefs[prefix].rowContainers[i] = document.getElementById(prefix + "Row" + i);
			tableRefs[prefix].positionLabels[i] = document.getElementById(prefix + "Pos" + i + "o");
		}

		for (const key of ["Dog", "Handler", "Penalty", "Time", "Speed"]) {
			if (prefix === "gen" && key === "Speed") continue;
			tableRefs[prefix].headerCells[key] = document.getElementById(prefix + key + "0o");
		}

		for (let i = 1; i <= 10; i++) {
			tableRefs[prefix].dogCells[i - 1] = document.getElementById(prefix + "Dog" + i + "o");
			tableRefs[prefix].handlerCells[i - 1] = document.getElementById(prefix + "Handler" + i + "o");
			tableRefs[prefix].penaltyCells[i - 1] = document.getElementById(prefix + "Penalty" + i + "o");
			tableRefs[prefix].timeCells[i - 1] = document.getElementById(prefix + "Time" + i + "o");
			if (prefix === "tab") tableRefs[prefix].speedCells[i - 1] = document.getElementById(prefix + "Speed" + i + "o");
		}
	}
}
function defaultTextsAndFlags() {
	const faultsMeta = getElementMeta(faults);
	const refusalsMeta = getElementMeta(refusals);
	const eliminatedMeta = getElementMeta(eliminated);
	const roundTypeMeta = getElementMeta(roundType);
	const scoreTableMeta = getElementMeta(scoreTable);
	const scoreGeneralMeta = getElementMeta(scoreGeneral);

	faultsMeta.text1 = "F";
	refusalsMeta.text1 = "R";
	eliminatedMeta.text1 = eliminated.innerText;
	roundTypeMeta.text2 = " /";

	scoreTableMeta.text1 = scoreTableTitle.innerText;
	scoreGeneralMeta.text1 = scoreGeneralTitle.innerText;

	for (let i = 0; i < 11; i++) {
		getElementMeta(tableRefs.tab.rowContainers[i]).text1 = tableRefs.tab.positionLabels[i].innerText;
		getElementMeta(tableRefs.gen.rowContainers[i]).text1 = tableRefs.gen.positionLabels[i].innerText;
	}

	const mid = ["Dog", "Handler", "Penalty", "Time", "Speed"];
	for (let midIndex = 0; midIndex < mid.length; midIndex++) {
		getElementMeta(tableRefs.tab.headerCells[mid[midIndex]]).text1 = tableRefs.tab.headerCells[mid[midIndex]].innerText;
		if (midIndex !== 4) getElementMeta(tableRefs.gen.headerCells[mid[midIndex]]).text1 = tableRefs.gen.headerCells[mid[midIndex]].innerText;
	}

	appState.currentTeam.start_order = "00";
	appState.currentTeam.handler = "Handler Handleson";
	appState.currentTeam.dog_family_name = "Puppy";
	appState.currentTeam.club = "Dogs & Handlers agility club";
	appState.currentTeam.time = "00.00";
	appState.currentTeam.speed = "0.00 m/s";
	appState.currentTeam.faults = "0";
	appState.currentTeam.refusals = "0";
	appState.currentTeam.disqualification = "";
	appState.currentTeam.status_string = "calculated"
	appState.currentTeam.trialName = "Trial Name"
	appState.currentTeam.gradeSize = "G2 / M"
	appState.currentTeam.roundType = "AG"

	for (let i = 0; i < 10; i++) {
		const j = i + 1;
		const k = i + 1 > 9 ? 0 : i + 1;
		appState.clasifTeams[i] = {
			classification: j,
			dog_family_name: "Dog " + j,
			handler: "Handler " + j,
			total_penalization: "00." + ("0" + j).slice(-2),
			speed: "0.00 m/s",
			time: `${k}${k}.${k}${k}`
		};
		appState.generalTeams[i] = {
			classification: j,
			dog_family_name: "Dog " + j,
			handler: "Handler " + j,
			total_penalization: "00." + ("0" + j).slice(-2),
			time: `${k}${k}.${k}${k}`
		};
	}

	appState.ui.editing = false;
	appState.ui.showingGeneral = false;
	appState.ui.showingModal = false;

}
function animablesAndDragables() {
	for (const [index, item] of Array.from(animable).entries()) {
		item.addEventListener("animationstart", () => {});

		item.addEventListener("animationiteration", () => {

			item.style["-webkit-animation-direction"] = "reverse";

			appState.currentTeam = appState.nextTeam;
			if (index === 0) updateInfo();
		});

		item.addEventListener("animationend", () => {
			item.style["-webkit-animation-direction"] = "normal";
			item.classList.remove("active");
		});
	}
	for (let item of dragable) {
		const meta = getElementMeta(item);
		meta.text1 = meta.text1 || "";
		meta.text2 = meta.text2 || "";
		meta.text1old = meta.text1;
		meta.text2old = meta.text2;
		makeDragable(item);
		item.addEventListener("dblclick", () => {

			if (appState.ui.editing && !appState.ui.showingGeneral && !appState.ui.showingModal) {

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

				if (item.classList.contains('tableCont') || item.classList.contains('rowTab') || item.classList.contains('rowGen') || item.classList.contains('tableCoTi')) {
					textsTitle.innerHTML = "Text for";
					labelText1.innerHTML = "Table title";
					text2.style.visibility = "hidden"
					labelText2.style.visibility = "hidden";
				}

				openModalForElement(item);

			}
		});

	}
	for (let item of windowBG) {
		makeDragable(item);
	}
	for (let item of windowTitle) {
		makeDragable(item);
		getDragRuntime(item).enabled = false;
	}
}
function eventTriggers() {
	window.addEventListener('mousemove', showCursor);
	window.addEventListener('keydown', showCursor);
	window.addEventListener('storage', event => {
		if (event.key !== STORAGE_KEYS.settings) return;
		const storedSettings = FASI.runtime.loadStoredSettings();
		if (storedSettings) {
			FASI.runtime.debugLog("storage", "Received settings from storage event");
			FASI.runtime.applyPersistedSettings(storedSettings);
		} else {
			FASI.runtime.debugLog("storage", "Storage event requested reload");
			location.reload();
		}
	});
	window.onclick = function (event) {
		if (appState.ui.showingModal && event.target != modal && !modal.contains(event.target)) {
			vInfo.style.display = "block";
			vInfo.innerHTML = "Close properties window to drag & drop items";
			clearTimeout(closeWarningTimeout);
			closeWarningTimeout = setTimeout(oInfo, 1500);
		}
		if (appState.ui.showingGeneral && event.target != general && !general.contains(event.target)) {
			vInfo.style.display = "block";
			vInfo.innerHTML = "Close options window to drag & drop items";
			clearTimeout(closeWarningTimeout);
			closeWarningTimeout = setTimeout(oInfo, 1500);
		}
	}
	window.ondblclick = event => {
		hideMe.style.display = "none";
		window.getSelection()?.removeAllRanges();
		if ((event.target == croma || event.target == overlay) && !appState.ui.showingModal) {
			FASI.runtime.debugLog("ui", "Opened general window by double click");
			FASI.ui.openGeneralWindow();
		}
	}
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
	document.addEventListener("mousemove", drag);
	document.addEventListener("mouseup", dragEnd);
	window.addEventListener("blur", cancelActiveDrag);
	document.addEventListener('keydown', event => {
		if (appState.ui.editing) {
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
	imageFile.addEventListener('change', event => {
		if (event.target.files[0]) {
			const reader = new FileReader();
			reader.onload = e => overlay.src = e.target.result;
			reader.readAsDataURL(event.target.files[0]);
		}
	});
}
FASI.setup = {
	buildTableRefs,
	defaultTextsAndFlags,
	animablesAndDragables,
	eventTriggers,
};
FASI.contracts.setup = {
	publicApi: ["buildTableRefs", "defaultTextsAndFlags", "animablesAndDragables", "eventTriggers"],
	shouldNotTouch: ["websocket creation", "storage keys", "undo stack internals"],
};

