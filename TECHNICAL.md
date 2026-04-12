# FASI Technical Notes

## Purpose

FASI is a standalone HTML/CSS/JS overlay for dog agility streaming.

It is designed to:

- run directly in a browser without a build step
- connect to FlowAgility through WebSocket
- optionally connect to local timers such as ZonEcron and Galican
- be customized visually by drag and drop plus per-element properties
- persist settings in browser local storage

The project is intentionally lightweight and portable. Operational reliability during events takes priority over architectural purity.


## Runtime Model

The app is loaded from `index.html`, styled by `FAstreamInfo.css`, and driven by ordered classic scripts under `js/`.

Current script split:

- `js/state.js`
  runtime state, DOM references and global constants
- `js/setup.js`
  table-cache bootstrap, default data, dragable setup and event wiring
- `js/runtime.js`
  settings snapshots, storage helpers, element metadata/layout helpers and shared render helpers
- `js/connections.js`
  FlowAgility and timer transport, message handling and live timing helpers
- `js/ui.js`
  drag/drop, modal/general windows, import/export, undo/redo, cursor helpers and final app boot

The scripts also register public APIs under the global `window.FASI` namespace:

- `FASI.state`
- `FASI.setup`
- `FASI.runtime`
- `FASI.connections`
- `FASI.ui`
- `FASI.contracts`

This is still classic-browser JS, not ES modules, but the namespace provides a first technical contract between files.
Most important cross-file calls now go through this namespace instead of relying only on free-floating global functions.

Key runtime concerns handled by the JS:

- FlowAgility connection and heartbeat
- timer connection and heartbeat
- current competitor and next competitor state
- course and combined result tables
- edit mode and drag/drop positioning
- modal/general settings windows
- optional debug panel enabled through `?debug=1`
- local storage persistence
- import/export and cross-window sync


## Main State

The main competition state is now grouped in `appState`.

Current `appState` fields in active use:

- `appState.currentTeam`
  currently displayed competitor or latest calculated competitor
- `appState.nextTeam`
  competitor received through `run_ready`, used for delayed transition
- `appState.clasifTeams`
  table data for course results, fed from `results_best`
- `appState.generalTeams`
  table data for combined results, fed from `results_combined`
- `appState.history`
  local undo/redo stack and pointer for editor snapshots
- `appState.ui`
  UI-only state such as edit mode, window visibility, fade timing, loaded image flag and active drag target

`state.js` contract:

- exposes state containers and shared DOM references
- should not register runtime browser events
- should not open sockets
- should not mutate UI behavior by itself

Connection-related state:

- `connectionF`
  FlowAgility WebSocket
- `connectionT`
  timer WebSocket
- heartbeat and reconnect timers for both connections

UI-related state:

- `appState.ui.editing`
  edit mode flag
- `appState.ui.showingGeneral`
  general settings window visible
- `appState.ui.showingModal`
  element properties window visible
- `appState.ui.fadingDelay`
  current fade transition delay used by next-team transitions
- `appState.ui.imageLoaded`
  whether an overlay image is currently loaded
- `appState.ui.activeDragTarget`
  currently active draggable element during drag operations
- `appState.ui.modalTarget`
  currently edited draggable element in the properties modal
- `appState.ui.generalDraft`
  temporary snapshot used while the general settings window is open
- `dragRuntime`
  `WeakMap` holding transient drag-only state such as enablement, cursor origin and current deltas
- `elementMeta`
  `WeakMap` holding editor-oriented per-element metadata such as before/after texts, backup texts and hidden flag
- `elementLayout`
  `WeakMap` holding per-element persisted visual/layout state such as font, colors, dimensions and coordinates
- `tableRefs`
  cached DOM references for table rows, headers and cells used by `updateClassif()`
- per-element custom properties stored directly on DOM nodes:
  very little remains beyond browser-native DOM/style data


## FlowAgility Data Flow

The app sends:

- `ping`
- `streaming_data`

The app expects:

- `pong`
- JSON messages containing `run`
- JSON messages containing `run_ready`

Current behavior:

- `run.playset` updates the currently shown team
- `run.results_best` updates `clasifTeams`
- `run.results_combined` updates `generalTeams`
- `run_ready.playset` is stored as `nextTeam`
- the screen change to `nextTeam` is delayed according to the configured fade delay

Important functional decisions:

- if FlowAgility and a timer are both connected, faults/refusals/elimination are taken from FlowAgility
- time and speed may be updated live by the timer while the run is active
- the FlowAgility URL is expected without protocol prefix in the input field

Flow parsing is now split into explicit helpers:

- `annotateFlowPlayset()`
- `applyFlowRunData()`
- `applyFlowRunReadyData()`
- `triggerNextTeamDisplay()`
- `handleFlowSocketMessage()`
- `configureFlowSocketHandlers()`
- `getFlowSocketUrl()`

These helpers should remain transport-agnostic. The websocket handler should only receive the raw message, validate it and pass parsed structures into them.

`connections.js` contract:

- may own websocket creation, message dispatch, heartbeat and reconnect behavior
- may call public runtime/render helpers
- should not manipulate modal/general window behavior
- should not write undo/redo history directly


## Timer Data Flow

Supported timers in current code:

- ZonEcron
- Galican

ZonEcron:

- connects through `ws://host:port`
- expects `d0` after connection
- handles `__ping__`
- handles fixed-format 11-character status telegrams

Galican:

- kept for compatibility because it has worked in real competition use
- public documentation is known to be unreliable
- current implementation should be treated carefully and verified only with real hardware/logs

Important functional decision:

- when FlowAgility is connected, timer faults/refusals/elimination should not override FlowAgility data
- timer messages may be delayed intentionally by a configurable per-message delay in milliseconds to compensate for slower video pipelines

Timer parsing is now split into explicit helpers:

- `updateOfflineScoreDisplay()`
- `applyZonecronTimerMessage()`
- `mergeGalicanTimerStatus()`
- `applyGalicanTimerMessage()`
- `handleTimerSocketMessage()`
- `configureTimerSocketHandlers()`
- `getTimerSocketUrl()`

The websocket layer should stay focused on transport and choose the correct helper based on the selected timer type.

Current timer-delay behavior:

- the delay is configured in the general window as milliseconds
- it applies to every incoming ZonEcron or Galican message
- ZonEcron `__ping__` is not delayed, to avoid breaking heartbeat timing
- pending delayed timer messages are cleared on timer reconnect/reset/disconnect paths to avoid ghost updates after the socket closes


## Reconnection Helpers

Reconnect scheduling is now centralized in:

- `scheduleFlowReconnect()`
- `scheduleTimerReconnect()`
- `resetFlowReconnectState()`
- `resetTimerReconnectState()`

This keeps `onerror` and `onclose` aligned for both socket types. If reconnect timing or UI status text changes, update these helpers first instead of duplicating logic again.


## Persistence Model

Settings are stored in browser local storage under:

- `FASIsettings`

Stored data includes:

- visual settings
- connection URLs
- image overlay
- position/size/style of draggable elements
- per-element before/after texts

The same settings object is also used for:

- import/export JSON
- undo/redo snapshots
- sync across browser windows through the `storage` event

Settings snapshot helpers now include:

- `readVisualSettingsSnapshot()`
- `applyVisualSettingsSnapshot()`
- `captureSettingsSnapshot()`
- `saveStoredSettings()`
- `loadStoredSettings()`
- `clearStoredSettings()`

Undo/redo history now uses:

- `pushUndoSnapshot()`
- `appState.history.undoStack`
- `appState.history.undoPointer`

`runtime.js` contract:

- owns settings snapshots, per-element metadata/layout helpers and shared render helpers
- may be used by setup, connections and ui through `FASI.runtime`
- should not register global DOM events
- should not directly own drag interaction logic

Important maintenance note:

- connection information is part of the persisted settings on purpose
- this means settings application and socket behavior are related by design
- undo/redo is intentionally local and should apply settings without reopening sockets
- persisted/shared configuration flows should explicitly use both:
  `applySettings()`
  `applyConnections()`


## Validation

Phase 4 has started adding explicit runtime validation in a few high-value places.

Current validations:

- Flow input must be non-empty, trimmed, without protocol prefix and without spaces
- timer input must be non-empty, trimmed, without protocol prefix, without spaces and must include `host:port`
- imported settings files must parse as JSON and contain at least a top-level object with a `visual` section
- invalid Flow `run` and `run_ready` payload shapes are ignored and logged in debug mode
- invalid JSON payloads from external sources are ignored and logged in debug mode

Current behavior on validation failure:

- socket connection is not attempted
- connection status text shows the validation error
- import rejection shows a short transient on-screen message
- debug mode logs the rejection reason


## Rendering

The main render functions are:

- `updateInfo()`
- `updateClassif()`
- `updateDisplay()`

Rendering is now partially split into smaller helpers:

- `setFormattedText()`
- `renderTeamField()`
- `renderTableRow()`
- `setConnectionUi()`

Table rendering also uses cached DOM references through `tableRefs` instead of repeated `getElementById()` lookups during every update.

Per-element settings persistence is also now centralized in:

- `applyElementSettings()`
- `readElementSettings()`

Text affixes and visibility metadata are now read through `elementMeta` instead of ad-hoc DOM properties.
Layout and style snapshots are now read through `elementLayout` instead of ad-hoc DOM properties.

Current table mapping:

- course results table uses `appState.clasifTeams`
- combined results table uses `appState.generalTeams`

Important maintenance note:

- if `updateClassif()` is modified, verify both tables separately
- do not assume the same data source is valid for both


## Debug And Replay Modes

Optional diagnosis panels are available through URL flags:

- `?debug=1`
- `?replay=1`
- `?debug=1&replay=1`

Current behavior:

- normal URL without params shows neither panel and does not touch debug-log storage
- `?debug=1` shows only the debug panel
- `?replay=1` shows only the replay panel
- `?debug=1&replay=1` shows both panels
- both panels now live in `index.html` hidden by default and are only unhidden/bound by JS when the matching URL flag is present

Debug behavior:

- `?debug=1` enables persistent debug logging
- persisted debug log storage is capped at 1000 entries
- `Clear` clears both the visible debug panel log and persisted debug-log storage
- `Export` writes a `.json` file
- debug log `data` is exported as structured JSON values when possible, not as escaped JSON strings

Current debug panel contents:

- Flow socket state and configured URL
- timer socket state, selected timer type and configured URL
- edit/modal/general window state
- current team and next team summary
- current counts for `results_best` and `results_combined`
- rolling log of recent runtime events

Current debug logging focuses on:

- boot
- socket open/error/close/reconnect scheduling
- Flow `run` and `run_ready`
- timer state transitions
- timer F/R/E values
- local storage save/load/clear and storage sync
- import/export
- modal/general window open/close
- undo/redo

Galican noise filtering:

- Galican tends to spam full state updates roughly every 500 ms even when nothing relevant has changed
- if only `uptime` changes, the message is ignored for debug-log and replay recording purposes
- if `running === true` and only `time` plus `uptime` change, the message is also ignored for debug-log and replay recording purposes
- the reason is practical: logging every telegram makes the debug panel and recorded fixtures noisy and much less useful for diagnosis or replay
- the live timer state is still processed normally; only logging/recording is filtered

Replay behavior:

- replay is shown in its own panel, separate from debug
- replay panel is split into playback and recording sections
- load a local fixture file
- fixture type is auto-detected from file contents as `flow`, `zonecron` or `galican`
- Flow replay is blocked while a live Flow connection is open
- timer replay is blocked while a live timer connection is open
- `Next` injects one message
- `Back` steps to the previous replay message
- `Record` starts capturing real incoming traffic and changes to `Stop Recording`
- while recording, the other replay controls are disabled
- recording status shows elapsed time plus message counts for Flow and Timer
- when recording stops, fixture files are exported only for sources that actually received data
- exported filenames use the timestamp of the recording start, not the first message time

Replay expectations:

- ZonEcron fixtures are treated as one message per line
- Flow fixtures accept a single JSON object, a JSON array, or multiple JSON objects separated by newlines
- Galican fixtures are JSON payloads and replay switches the timer parser to Galican automatically
- replay no longer uses a manual source selector; source type is inferred from file contents
- replay uses the same internal handlers as the live socket paths, but bypasses the configurable live timer delay
- Flow recording exports a JSON array
- ZonEcron recording exports line-based TXT
- Galican recording exports a JSON array

Timer delay expectations:

- the configured timer delay is taken from the applied UI state, not from whatever the user may be typing in the input before pressing `Preview`, `Accept` or `Save`
- live timer messages are delayed; manual replay messages are not
- pending delayed timer messages are cleared on timer disconnect/reconnect to avoid stale delayed updates
- Galican fixture recording happens at receive time, before the delayed visual processing, so delayed messages are not lost if the timer disconnects

Both panels stay off by default so the normal emission window remains unaffected.


## Edit Mode And Drag/Drop

Edit mode allows:

- dragging elements
- changing properties by double click
- saving layout and style changes

Current drag approach:

- drag starts on `mousedown` over a draggable target
- movement is tracked on the whole `document`
- drag ends on global `mouseup`
- active drag is cancelled on window blur
- transient drag runtime is kept in `dragRuntime` instead of mutating DOM nodes with `isDragging`, `dx`, `mouseX`, etc.
- per-element text affixes, hidden flag and modal backup text now live in `elementMeta`
- per-element layout/style snapshots now live in `elementLayout`
- `general` and `modal` windows only start dragging from `.windowTitle`
- clicks on interactive controls inside those windows should not start dragging

This global tracking is important. Do not revert to element-only `mousemove` or `mouseout` handling, or fast cursor movement may break dragging again.

`ui.js` contract:

- owns drag/drop, editor windows, import/export, undo/redo and final boot sequence
- may call `FASI.setup`, `FASI.runtime` and `FASI.connections`
- should not parse websocket payloads directly

`setup.js` contract:

- owns one-time wiring of defaults, cached table refs and browser event registration
- may call public runtime/ui APIs
- should not own socket internals or storage key details


## Known Couplings

The code currently has some deliberate but important couplings:

- persisted settings include connection settings
- DOM nodes still hold some visual configuration plus some logical state on a per-element basis
- socket handlers update state and DOM in the same flow
- undo/redo uses full settings snapshots, but should stay local to layout/state restoration

Recent progress:

- main competition state now lives in `appState`
- key UI mode flags now also live in `appState.ui`
- modal target state now lives in `appState.ui.modalTarget`
- general window draft state now lives in `appState.ui.generalDraft`
- render logic for team fields and table rows is now centralized in helpers instead of being duplicated inline
- dragable element settings serialization and application now go through shared helpers instead of open-coded property copies
- drag runtime state is no longer attached directly to DOM nodes
- per-element text metadata and hidden flags are no longer attached directly to DOM nodes
- per-element layout metadata is no longer attached directly to DOM nodes

This is workable, but refactors should isolate these responsibilities gradually instead of rewriting everything at once.


## Settings Application Paths

There are now two distinct application paths:

- `applySettings()`
  applies local state and UI only
- `applyPersistedSettings()`
  applies settings plus connection behavior for persisted/shared configuration flows

Current intended usage:

- app startup: `applyPersistedSettings()`
- imported JSON file: `applyPersistedSettings()`
- browser `storage` sync between windows: `applyPersistedSettings()`
- undo/redo snapshots: `applySettings()`

If this distinction is broken again, reconnect side effects are likely to come back.


## Safe Refactor Strategy

Recommended order:

1. Separate applying settings from applying connections
2. Ensure undo/redo does not reconnect sockets
3. Reduce duplicated reconnect logic
4. Introduce a more explicit app state object
5. Move parsing and rendering responsibilities apart
6. Split JS into modules/files only after the responsibilities are clearer

This project has now completed the first physical split into multiple browser-loaded files without adding a build step.


## High-Risk Areas

When changing these parts, test carefully:

- `importSettings()` and any future settings-application helpers
- `updateClassif()`
- FlowAgility `run_ready` transition logic
- drag and drop behavior during fast movement
- reconnect behavior after error and after clean close
- import/export plus storage sync between two windows


## Practical Test Checklist

After meaningful JS changes, manually verify:

1. FlowAgility connects and reconnects
2. timer connects and reconnects
3. edit mode drag/drop still works with fast cursor movement
4. undo/redo still restores layout correctly without reconnecting sockets
5. save/reload restores settings correctly
6. second browser window receives saved changes correctly
7. course results table still paints
8. combined results table still paints when `results_combined` exists
9. `?debug=1` opens the debug panel and normal URL does not

Operational references now also live in:

- `TESTING.md`
- `fixtures/README.md`
