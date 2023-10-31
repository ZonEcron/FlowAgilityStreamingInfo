/* ----- OBJETOS CON INFO DEL SERVIDOR ----- */
var currentTeam = {};
var nextTeam = null;
var clasifTeams = {};
var defSettings = true;

/* ----- COMUNICACION WEBSOCKET Y HEARTBEAT ----- */
const retNoPong = 55000;
var noPongTimer;
var pidePong;

var connectionF;
var conectadoF = false;

/* ----- VARIABLES RETARDO STREAMING Y SUAVIZADO ----- */
var retSuave = 5000;
var suaveTimer;
var suavizar = true;

/* ----- ELEMENTOS CRONO ----- */
const tiempo = document.getElementById("tiempo");
const veloci = document.getElementById("veloci");
const faltas = document.getElementById("faltas");
const rehuse = document.getElementById("rehuse");
const eliRec = document.getElementById("eliRec");

const orden = document.getElementById("orden");
const nGuia = document.getElementById("nGuia");
const perro = document.getElementById("perro");
const nClub = document.getElementById("nClub");

/* ----- SELECTORES POR CLASE ----- */
const dragable = document.getElementsByClassName("dragable");
const animable = document.getElementsByClassName("animable");
const ventana = document.getElementsByClassName("ventana");
const ventanaTitulo = document.getElementsByClassName("ventanaTitulo");

/* ----- VENTANA PROPIEDADES ELEMENTOS CRONO ----- */
const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modalTitulo');
const font = document.getElementById("font");
const size = document.getElementById("size");
const colo = document.getElementById("colo");
const fond = document.getElementById("fond");
const anch = document.getElementById("anch");
const posX = document.getElementById("posX");
const posY = document.getElementById("posY");
const posZ = document.getElementById("posZ");
const tex1 = document.getElementById("tex1");
const tex2 = document.getElementById("tex2");
const tituloTextos = document.getElementById("tituloTextos");
const labelTex1 = document.getElementById("labelTex1");
const labelTex2 = document.getElementById("labelTex2");

/* ----- VENTANA PROPIEDADES GENERALES ----- */
const hideMe = document.getElementById("hideMe");
const general = document.getElementById("general");
const generalTitulo = document.getElementById("generalTitulo");
const urlWebsocket = document.getElementById("urlWebsocket");
const conStatus = document.getElementById("conStatus");
const bConFlow = document.getElementById("bConFlow");
const selSuavizar = document.getElementById("selSuavizar");
const inpRetSuave = document.getElementById("inpRetSuave");
const backG = document.getElementById("backG");
const bgColor = document.getElementById("bgColor");
const botonEditar = document.getElementById("botonEditar");
const botonImpExTar = document.getElementById("botonImpExTar");

/* ----- VENTANA EMERGENTE AYUDA -----*/
var infoTimeout;
const vInfo = document.getElementById("vInfo");

main();

/* ----- FUNCION INICIAL ----- */
function main() {

	/* ----- TEXTOS POR DEFECTO DE LOS ELEMENTOS DEL CRONO -----*/
	faltas.tex1 = "F";
	rehuse.tex1 = "R";
	eliRec.tex1 = "ELIMINATED";

	/* ----- VALORES POR DEFECTO DEL BINOMIO EN PANTALLA -----*/
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

	/* ----- VALORES POR DEFECTO DE LA CLASIFICACION -----*/
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

	/* ----- FLAG MODO EDICION -----*/
	general.editando = false;

	/* ----- CONFIGURAR ELEMENTOS SUAVIZABLES ----- */
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
	/* ----- CONFIGURAR ELEMENTOS ARRASTRABLES ----- */
	for (let item of dragable) {
		item.tex1 = item.tex1 || "";
		item.tex2 = item.tex2 || "";
		item.tex1old = item.tex1;
		item.tex2old = item.tex2;
		makeDragable(item);
		item.addEventListener("dblclick", function () {

			if (general.editando) {

				const compStyle = window.getComputedStyle(modal);			// verificamos que no se esta mostrando ya la ventana modal para que no se abra la ventada de tabla encima del elemento de la tabla

				if (compStyle.getPropertyValue("display") === "none") {

					modalTitulo.innerHTML = "<b>Propiedades " + item.id + '</b><button onclick="modalCancelar()" class="botonX">X</button>';

					if (item.id === "eliRec") {
						tituloTextos.innerHTML = "Text for";
						labelTex1.innerHTML = "Eliminated";
						tex2.style.visibility = "hidden"
						labelTex2.style.visibility = "hidden";
					} else {
						tituloTextos.innerHTML = "Before and After Texts";
						labelTex1.innerHTML = "Before";
						labelTex2.innerHTML = "After";
						tex2.style.visibility = "visible"
						labelTex2.style.visibility = "visible";
					}

					dragPropperties(item);
					modal.elemento = item;

					font.value = item.font;
					size.value = item.size;
					colo.value = item.colo;
					fond.value = item.fond;

					alto.value = item.alto;
					anch.value = item.anch;

					posX.value = item.posX;
					posY.value = item.posY;
					posZ.value = item.posZ;

					tex1.value = item.tex1;
					tex2.value = item.tex2;

					modal.style.display = "block";
				}
			}
		});

	}
	/* ----- CONFIGURAR ELEMENTOS DE VENTANAS ----- */
	for (let item of ventana) {
		makeDragable(item);					//hacemos arrastrables las ventanas y  barra de titulo 
	}
	for (let item of ventanaTitulo) {
		makeDragable(item);
		item.isDragable = false;			// evitamos que la barra de la ventana sea arrastrable para que las funciones drag lo intenten con el padre contenedor
	}

	/* ----- CONTROLADORES DE EVENTOS -----*/
	/*
	// Close window when user clicks out of the window
	window.onclick = function (event) {
		if (event.target != modal && !modal.contains(event.target)) {
			modalCancelar();
		}
		if (event.target != general && !general.contains(event.target)) {
			generalCancelar();
		}
	}
	*/
	window.ondblclick = function (event) {
		hideMe.style.display = "none";
		window.getSelection()?.removeAllRanges();
		if (event.target == backG) {

			const compStyle = window.getComputedStyle(backG);
			bgColor.value = rgbaToHex(compStyle.getPropertyValue("background-color"))

			general.urlWebsocket = urlWebsocket.value;
			general.suavizar = selSuavizar.selectedIndex;
			general.retSuave = inpRetSuave.value;
			general.bgColor = bgColor.value;

			general.style.display = "block";

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
function importSettings(ajustes) {

	if (ajustes) {

		toggleImpExp();

		urlWebsocket.value = ajustes.visual.urlWebsocket || "";

		if (urlWebsocket.value) websocFlow();

		selSuavizar.selectedIndex = ajustes.visual.suavizar || 0;
		inpRetSuave.value = ajustes.visual.retSuave || 5000;
		backG.style.backgroundColor = ajustes.visual.bgColor || "#000000";

		for (let item of dragable) {

			item.style.fontFamily = ajustes[item.id].font;
			item.style.fontSize = ajustes[item.id].size * 1 + 'px';
			item.style.color = ajustes[item.id].colo;
			item.style.backgroundColor = ajustes[item.id].fond;

			item.style.height = ajustes[item.id].alto * 1 + 'px';
			item.style.width = ajustes[item.id].anch * 1 + 'px';
			item.style.left = ajustes[item.id].posX * 1 + 'px';
			item.style.top = ajustes[item.id].posY * 1 + 'px';
			item.style.zIndex = ajustes[item.id].posZ * 1;

			item.font = ajustes[item.id].font;
			item.size = ajustes[item.id].size;
			item.colo = ajustes[item.id].colo;
			item.fond = ajustes[item.id].fond;

			item.alto = ajustes[item.id].alto;
			item.anch = ajustes[item.id].anch;
			item.posX = ajustes[item.id].posX;
			item.posY = ajustes[item.id].posY;
			item.posZ = ajustes[item.id].posZ;

			item.tex1 = ajustes[item.id].tex1;
			item.tex2 = ajustes[item.id].tex2;

		}

		cambiaSuavizar();
	}

}
function storeLocal(keyName, obj) {
	const jsonString = JSON.stringify(obj);
	localStorage.setItem(keyName, jsonString);
}
function readLocal(keyName) {
	const jsonString = localStorage.getItem(keyName);
	const obj = JSON.parse(jsonString);
	return obj;
}

/* ----- FUNCIONES COMUNICACION WEBSOCKET ----- */
function websocFlow() {
	/* ----- COMUNICACION WEBSOCKET FLOW ----- */
	connectionF = new WebSocket('wss://' + urlWebsocket.value); // p ej: facom-stage.fly.dev/ws/streaming/3EYtxCDX
	connectionF.onopen = () => {
		connectionF.send("ping");
		connectionF.send("streaming_data");
		conectadoF = true;
		conStatus.innerHTML = "Conectado";
		conStatus.style.color = "green";
		bConFlow.innerHTML = "Desconectar";
	};
	connectionF.onmessage = (mensaje) => {

		if (mensaje.data === 'pong') {

			clearTimeout(noPongTimer);
			noPongTimer = setTimeout(noPong, retNoPong);

			clearTimeout(pidePong);
			pidePong = setTimeout(() => {
				connectionF.send("ping");
			}, 25000);

		} else {

			const parsedData = JSON.parse(mensaje.data);

			if (parsedData.run.playset) {
				currentTeam = parsedData.run.playset;
				ponInfo();
			} else {
				currentTeam = null;
			}

			if (parsedData.run.results_best) {
				clasifTeams = parsedData.run.results_best;
				ponClasif();
			}

			if (parsedData.run_ready.playset) {
				nextTeam = parsedData.run_ready.playset;
				clearTimeout(suaveTimer);
				suaveTimer = setTimeout(() => {
					if (suavizar) {
						for (let item of animable) {
							item.classList.add("active");
						}
					} else {
						currentTeam = nextTeam;
						ponInfo();
					}
				}, retSuave);
			} else {
				nextTeam = null;
			}



		}
	};
}
function conectarFlow() {
	if (conectadoF) {
		connectionF.close();
		clearTimeout(noPongTimer);
		conectadoF = false;
		conStatus.innerHTML = "Desconectado";
		conStatus.style.color = "red";
		bConFlow.innerHTML = "Conectar";
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

	eliRec.innerHTML = eliRec.tex1;

	if (!general.editando) {
		eliRec.style.visibility = "hidden";
		tiempo.style.visibility = "hidden";
		veloci.style.visibility = "hidden";
	}

	if (currentTeam) {

		orden.innerHTML = `${orden.tex1}${currentTeam.start_order}${orden.tex2}`;
		nGuia.innerHTML = `${nGuia.tex1}${currentTeam.handler}${nGuia.tex2}`;
		perro.innerHTML = `${perro.tex1}${currentTeam.dog_family_name}${perro.tex2}`;
		nClub.innerHTML = `${nClub.tex1}${currentTeam.club}${nClub.tex2}`;
		faltas.innerHTML = `${faltas.tex1}${currentTeam.faults}${faltas.tex2}`;
		rehuse.innerHTML = `${rehuse.tex1}${currentTeam.refusals}${rehuse.tex2}`;

		if (currentTeam.status_string === "calculated") {
			tiempo.innerHTML = `${tiempo.tex1}${currentTeam.time}${tiempo.tex2}`;
			veloci.innerHTML = `${veloci.tex1}${currentTeam.speed}${veloci.tex2}`;
		} else {
			tiempo.innerHTML = `${tiempo.tex1}00.00${tiempo.tex2}`;
			veloci.innerHTML = `${veloci.tex1}0.00 m/s${veloci.tex2}`;
		}

		if (!general.editando) {

			if (currentTeam.status_string === "calculated") {
				tiempo.style.visibility = "visible";
				veloci.style.visibility = "visible";
			} else {
				tiempo.style.visibility = "hidden";
				veloci.style.visibility = "hidden";
			}

			if (currentTeam.disqualification === "elim") {
				faltas.style.visibility = "hidden";
				rehuse.style.visibility = "hidden";
				eliRec.style.visibility = "visible";
			} else {
				faltas.style.visibility = "visible";
				rehuse.style.visibility = "visible";
				eliRec.style.visibility = "hidden";
			}
		}
	}
}
function ponClasif() {

	for (let i = 0; i < 5; i++) {

		const tabPer = document.getElementById("tabPer" + (i + 1) + "o");
		const tabGui = document.getElementById("tabGui" + (i + 1) + "o");
		const tabPen = document.getElementById("tabPen" + (i + 1) + "o");
		const tabTie = document.getElementById("tabTie" + (i + 1) + "o");

		const hayInfo = clasifTeams[i]
			? clasifTeams[i].classification
				? true
				: false
			: false;

		if (hayInfo) {
			tabPer.innerHTML = `${tabPer.tex1}${clasifTeams[i].dog_family_name}${tabPer.tex2}`;
			tabGui.innerHTML = `${tabGui.tex1}${clasifTeams[i].handler}${tabGui.tex2}`;
			tabPen.innerHTML = `${tabPen.tex1}${clasifTeams[i].total_penalization}${tabPen.tex2}`;
			tabTie.innerHTML = `${tabTie.tex1}${clasifTeams[i].time}${tabTie.tex2}`;
		} else {
			tabPer.innerHTML = `${tabPer.tex1}-----${tabPer.tex2}`;
			tabGui.innerHTML = `${tabGui.tex1}-----${tabGui.tex2}`;
			tabPen.innerHTML = `${tabPen.tex1}- -.- -${tabPen.tex2}`;
			tabTie.innerHTML = `${tabTie.tex1}- -.- -${tabTie.tex2}`;
		}
	};
}

/* ----- FUNCIONES ELEMENTOS ARRASTRABLES ----- */
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

	dragPropperties(element);

}
function dragStart(e) {

	let target = e.target.isDragable
		? e.target
		: e.target.parentNode;

	if (target.isDragable && general.editando) {
		target.mouseX = e.clientX;
		target.mouseY = e.clientY;
		target.isDragging = true;
		target.style.outline = "1px solid #FF0000FF";
		target.style.zIndex = 1000;
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
function dragPropperties(e) {

	const compStyle = window.getComputedStyle(e);

	e.font = compStyle.getPropertyValue("font-family");
	e.size = parseInt(compStyle.getPropertyValue("font-size"), 10);
	e.colo = rgbaToHex(compStyle.getPropertyValue("color"));
	e.fond = rgbaToHex(compStyle.getPropertyValue("background-color"));

	e.alto = parseInt(compStyle.getPropertyValue("height"), 10);
	e.anch = parseInt(compStyle.getPropertyValue("width"), 10);

	e.posX = parseInt(compStyle.getPropertyValue("left"), 10);
	e.posY = parseInt(compStyle.getPropertyValue("top"), 10);
	e.posZ = parseInt(compStyle.getPropertyValue("z-index"), 10);

}

/* ----- FUNCIONES FORMATO ----- */
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

/* ----- FUNCIONES VENTANA DE PROPIEDADES ELEMENTOS ----- */
function modalAplicar() {

	modal.elemento.style.fontFamily = font.value;
	modal.elemento.style.fontSize = size.value * 1 + 'px';
	modal.elemento.style.color = colo.value;
	modal.elemento.style.backgroundColor = fond.value;

	modal.elemento.style.height = alto.value * 1 + 'px';
	modal.elemento.style.width = anch.value * 1 + 'px';

	modal.elemento.style.left = posX.value * 1 + 'px';
	modal.elemento.style.top = posY.value * 1 + 'px';

	let zMinMax = posZ.value * 1;
	if (zMinMax > 9) zMinMax = 999;
	if (zMinMax < 1) zMinMax = 1;
	modal.elemento.posZ = zMinMax;
	modal.elemento.style.zIndex = zMinMax;

	modal.elemento.tex1 = tex1.value;
	modal.elemento.tex2 = tex2.value;

	if (modal.elemento.id.startsWith("tab")) {
		ponClasif();
	} else {
		ponInfo();
	}
}
function modalAceptar() {
	modalAplicar();
	modal.elemento.tex1old = tex1.value;
	modal.elemento.tex2old = tex2.value;
	modal.style.display = "none";
}
function modalCancelar() {

	let modalEstado = getComputedStyle(modal);

	if (modalEstado.getPropertyValue("display") != "none") {

		modal.style.display = "none";

		modal.elemento.style.fontFamily = modal.elemento.font;
		modal.elemento.style.fontSize = modal.elemento.size * 1 + 'px';
		modal.elemento.style.color = modal.elemento.colo;
		modal.elemento.style.backgroundColor = modal.elemento.fond;

		modal.elemento.style.height = modal.elemento.alto * 1 + 'px';
		modal.elemento.style.width = modal.elemento.anch * 1 + 'px';

		modal.elemento.style.left = modal.elemento.posX * 1 + 'px';
		modal.elemento.style.top = modal.elemento.posY * 1 + 'px';
		modal.elemento.style.zIndex = modal.elemento.posZ * 1;

		modal.elemento.tex1 = modal.elemento.tex1old;
		modal.elemento.tex2 = modal.elemento.tex2old;

		ponInfo();

	}

}

/* ----- FUNCIONES VENTANA DE PROPIEDADES GENERAL ----- */
function generalAplicar() {
	toggleImpExp();
	backG.style.backgroundColor = bgColor.value;
	cambiaSuavizar();
}
function generalAceptar() {

	generalAplicar();
	general.style.display = "none";

}
function generalCancelar() {

	let generalEstado = getComputedStyle(general);

	if (generalEstado.getPropertyValue("display") != "none") {

		general.style.display = "none";
		urlWebsocket.value = general.urlWebsocket;
		selSuavizar.selectedIndex = general.suavizar;
		inpRetSuave.value = general.retSuave;
		backG.style.backgroundColor = general.bgColor;

	}

	ponInfo();

}
function generalReset() {
	if (rUsure()) {
		localStorage.removeItem("FASIsettings");
		location.reload();
	}
}
function generalEditar() {

	toggleImpExp();

	general.editando = !general.editando;

	for (let item of dragable) {
		item.classList.toggle("move");
	}
	/*
	for (let item of ventanaTitulo) {
		item.classList.toggle("move");
	}
	*/
	if (general.editando) {

		botonEditar.innerHTML = "Exit Edit";

		for (let item of dragable) {
			item.style.visibility = "visible";
		}

	} else {
		botonEditar.innerHTML = "Enter Edit";
		ponInfo();
		ponClasif();
	}

	generalAplicar();

}
function generalGuardar() {

	generalAplicar();
	let ajustes = {
		visual: {
			"urlWebsocket": urlWebsocket.value,
			"suavizar": selSuavizar.selectedIndex,
			"retSuave": inpRetSuave.value * 1,
			"bgColor": bgColor.value
		}
	}

	for (let item of dragable) {

		dragPropperties(item);

		ajustes[item.id] = {};

		ajustes[item.id].font = item.font;
		ajustes[item.id].size = item.size;
		ajustes[item.id].colo = item.colo;
		ajustes[item.id].fond = item.fond;
		ajustes[item.id].alto = item.alto;
		ajustes[item.id].anch = item.anch;
		ajustes[item.id].posX = item.posX;
		ajustes[item.id].posY = item.posY;
		ajustes[item.id].posZ = item.posZ;
		ajustes[item.id].tex1 = item.tex1;
		ajustes[item.id].tex2 = item.tex2;

	}

	storeLocal("FASIsettings", ajustes);

	return ajustes;

}
function generalImpExTar() {
	if (defSettings) {
		archivoJSON.click();
	} else {
		exportar();
	}
}
function toggleImpExp() {
	defSettings = false;
	botonImpExTar.innerHTML = "Exportar";
}
function cambiaSuavizar() {
	suavizar = selSuavizar.selectedIndex;
	retSuave = inpRetSuave.value * 1 || 5000;
	if (!suavizar) {
		clearTimeout(suaveTimer);
	}
}

/* ----- FUNCIONES VENTANA EMERGENTE AYUDA -----*/
function mInfo(tipo) {
	infoTimeout = setTimeout(function () {
		vInfo.style.display = "block";
		if (tipo === "visual") {
			vInfo.innerHTML = "Temporarily apply the modifications";
		}
		if (tipo === "aceptar") {
			vInfo.innerHTML = "Apply the modifications and close this window";
		}
		if (tipo === "cancelar") {
			vInfo.innerHTML = "Discard the modifications and close this window";
		}
		if (tipo === "editar") {
			vInfo.innerHTML = "Toggle between running mode and editing mode to show hidden elements and enable editing";
		}
		if (tipo === "guardar") {
			vInfo.innerHTML = "Apply the modifications and save <b>all settings</b>";
		}
		if (tipo === "reset") {
			vInfo.innerHTML = "Return to <b>factory settings</b> and delete saved settings";
		}
		if (tipo === "suavizar") {
			vInfo.innerHTML = "When dog finishes the course, after the time indicated in the delay, info will change to next dog with a smooth fade.";
		}
		if (tipo === "impExTar") {
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

/* ----- FUNCIONES DE EXPORTACION E IMPORTACION DE CONFIGURACION -----*/
function exportar() {

	const actualDate = new Date();

	const YYYY = actualDate.getFullYear();
	const MM = ('0' + (actualDate.getMonth() + 1)).slice(-2);
	const DD = ('0' + actualDate.getDate()).slice(-2);
	const hh = ('0' + actualDate.getHours()).slice(-2);
	const mm = ('0' + actualDate.getMinutes()).slice(-2);
	const ss = ('0' + actualDate.getSeconds()).slice(-2);

	const contenido = JSON.stringify(generalGuardar());

	const nombreArchivo = `${YYYY}${MM}${DD}-${hh}${mm}${ss}-FASI.json`;
	const tipoArchivo = "text/json;charset=utf-8;";

	const enlaceDescarga = document.createElement("a");
	const archivoBlob = new Blob([contenido], { type: tipoArchivo });

	enlaceDescarga.href = URL.createObjectURL(archivoBlob);
	enlaceDescarga.download = nombreArchivo;
	enlaceDescarga.click();

	// Limpiar el objeto URL creado para evitar memoria no utilizada
	URL.revokeObjectURL(enlaceDescarga.href);
}
function importar(archivo) {

	const reader = new FileReader();

	reader.onload = function (event) {
		importSettings(JSON.parse(event.target.result));
		ponInfo();
		ponClasif();
	};

	reader.readAsText(archivo);
}