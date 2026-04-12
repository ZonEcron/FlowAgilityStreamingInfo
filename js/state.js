const hideCursorDly = 5000;
let hideCursorTimer;
const urlParams = new URLSearchParams(window.location.search);

const appState = {
	currentTeam: {},
	nextTeam: null,
	clasifTeams: {},
	generalTeams: {},
	history: {
		undoStack: [],
		undoPointer: 0,
	},
	ui: {
		defSettings: true,
		fadingDelay: 1000,
		timerDelay: 0,
		imageLoaded: false,
		activeDragTarget: null,
		modalTarget: null,
		modalDraft: null,
		generalDraft: null,
		editing: false,
		showingGeneral: false,
		showingModal: false,
	},
	debug: {
		enabled: urlParams.get("debug") === "1",
		persistLogs: urlParams.get("debug") === "1",
		maxEntries: 1000,
		logs: [],
		panel: null,
		statusNode: null,
		logNode: null,
	},
	replay: {
		enabled: urlParams.get("replay") === "1",
		panel: null,
		fileNode: null,
		fileNameNode: null,
		statusNode: null,
		recordStatusNode: null,
		recordButtonNode: null,
		messages: [],
		sourceType: "",
		pointer: -1,
		recordStatusTimer: null,
		recording: {
			active: false,
			startedAtLabel: "",
			startedAtDate: null,
			flowMessages: [],
			zonecronMessages: [],
			galicanMessages: [],
		},
	},
};
const dragRuntime = new WeakMap();
const elementMeta = new WeakMap();
const elementLayout = new WeakMap();
const STORAGE_KEYS = {
	settings: "FASIsettings",
	debugLogs: "FASIdebugLogs",
};
const FASI = window.FASI = window.FASI || {};
FASI.state = appState;
FASI.contracts = FASI.contracts || {};
FASI.contracts.state = {
	publicApi: ["state"],
	shouldNotTouch: ["socket creation", "global event registration", "editor workflows"],
};

let connectionF = { readyState: WebSocket.CLOSED };
let flowPingTimeout;
const flowPingDelay = 25000;
let noPongTimeout;
const noPongDelay = 55000;
let flowReconnTimeout;
let flowReconnTimeoutActive = false;
let flowReconnCountD;
let flowReconnTimeLeft = 5;
let flowConnToggleFromUser = false;

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
let modo = "d";
let timeRefreshInterval;
let timerReconnTimeout;
let timerReconnTimeoutActive = false;
let timerReconnCountD;
let timerReconnTimeLeft = 5;
let timerConnToggleFromUser = false;

let fadingTimer;

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

const dragable = document.getElementsByClassName("dragable");
const animable = document.getElementsByClassName("animable");
const windowBG = document.getElementsByClassName("windowBG");
const windowTitle = document.getElementsByClassName("windowTitle");

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

const hideMe = document.getElementById("hideMe");
const general = document.getElementById("general");
const urlWebsocket = document.getElementById("urlWebsocket");
const connFlowStatus = document.getElementById("connFlowStatus");
const connFlowButton = document.getElementById("connFlowButton");
const timerSelector = document.getElementById("timerSelector");
const timerWebsocket = document.getElementById("timerWebsocket");
const timerDelayInput = document.getElementById("timerDelayInput");
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

const scoreTable = document.getElementById("scoreTable");
const scoreTableTitle = document.getElementById("scoreTableTitle");
const scoreGeneral = document.getElementById("scoreGeneral");
const scoreGeneralTitle = document.getElementById("scoreGeneralTitle");
const tableRefs = {
	tab: {
		rowContainers: [],
		positionLabels: [],
		headerCells: {},
		dogCells: [],
		handlerCells: [],
		penaltyCells: [],
		timeCells: [],
		speedCells: [],
	},
	gen: {
		rowContainers: [],
		positionLabels: [],
		headerCells: {},
		dogCells: [],
		handlerCells: [],
		penaltyCells: [],
		timeCells: [],
		speedCells: [],
	},
};

let closeWarningTimeout;
let infoTimeout;
const infoDelay = 1000;
const vInfo = document.getElementById("vInfo");
