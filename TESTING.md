# FASI Manual Testing

## Purpose

This file is the operational regression checklist for manual testing after meaningful changes.


## Core Smoke Test

1. Open the app normally and confirm no debug panel is visible.
2. Open the app with `?debug=1` and confirm only the debug panel is visible.
3. Open the app with `?replay=1` and confirm only the replay panel is visible.
4. Open the app with `?debug=1&replay=1` and confirm both panels are visible.
5. Press `Clear` in debug mode and confirm the panel log is emptied.
6. Press `Export` in debug mode and confirm a JSON file is downloaded.


## Editor Regression

1. Enter edit mode from the general window.
2. Drag several overlay elements quickly in diagonal and long movements.
3. Confirm elements do not detach from the cursor.
4. Double click one element and confirm its modal opens.
5. Edit size/color/text fields and confirm inputs are clickable without dragging the window.
6. Drag `general` and `modal` windows from the title bar only.
7. Confirm clicking inside inputs does not move the window.
8. Exit edit mode and confirm hidden elements and `ELIMINATED` visibility behave correctly.


## Undo/Redo Regression

1. In edit mode, move at least two elements.
2. Press `Ctrl+Z` and confirm the previous layout state is restored.
3. Press `Ctrl+Y` or `Ctrl+Shift+Z` and confirm redo works.
4. Confirm undo/redo does not reconnect Flow or timer sockets.


## Persistence Regression

1. Save settings from the general window.
2. Reload the page and confirm the layout is restored.
3. If Flow/timer addresses were saved, confirm auto-connect still works.
4. Export settings.
5. Reset settings.
6. Import the exported JSON.
7. Confirm the imported layout and connection fields are restored.
8. Try importing an invalid JSON file and confirm the app rejects it without breaking.


## Flow Regression

1. Connect to FlowAgility with a valid URL.
2. Confirm status goes from `Trying` to `Connected`.
3. Confirm invalid Flow input is rejected before opening a socket.
4. Confirm `run` updates current competitor fields.
5. Confirm `run_ready` updates next competitor behavior with the configured delay.
6. Confirm course results update from `results_best`.
7. Confirm combined results update from `results_combined`.
8. Confirm faults/refusals/elimination visible on screen come from Flow when Flow is connected.


## Timer Regression

1. Connect to ZonEcron with a valid `host:port`.
2. Confirm invalid timer input without port is rejected before opening a socket.
3. Confirm live time updates while the run is active.
4. Disconnect Flow and confirm timer F/R/E can appear on screen.
5. Reconnect Flow and confirm timer F/R/E no longer override screen values.
6. If Galican hardware is available, repeat the same checks on Galican.


## Reconnection Regression

1. With Flow connected, force the socket to close.
2. Confirm the UI shows retry countdown instead of reconnecting immediately.
3. Repeat for the timer socket.
4. Confirm pressing `Cancel` stops the reconnect loop.


## Multi-Window Regression

1. Open the same app in two windows of the same browser.
2. Save a visible layout change in one window.
3. Confirm the second window receives the stored update.
4. Confirm persisted/shared config flows still reapply connection settings.


## Debug Regression

1. Open with `?debug=1`.
2. Confirm the panel shows Flow state, timer state, current team, next team and table counts.
3. Confirm debug logs are preserved after refresh.
4. Confirm the buffer never grows beyond 1000 entries.
5. Confirm timer debug entries include `faults`, `refusals` and `elimination`.
6. With Galican, confirm pure `uptime` spam and running-only `time` updates do not flood debug or recording.


## Replay Regression

1. Open with `?replay=1`.
2. Load `fixtures/flow/flow-demo.json` and confirm the replay type is detected automatically as Flow.
3. Confirm `Next` injects one message at a time.
4. Confirm `Back` steps to the previous replay message.
5. Open with `?debug=1&replay=1` and confirm replay still works while debug is also visible.
6. With a live Flow connection open, confirm Flow fixtures are rejected for replay.
7. With a live timer connection open, confirm timer fixtures are rejected for replay.
8. Load `fixtures/zonecron/zonecron-demo.txt` and confirm replay uses the ZonEcron parser automatically.
9. Load `fixtures/galican/Galican-demo.json` and confirm replay uses the Galican parser automatically.
10. Start `Record` and confirm the other replay controls are disabled.
11. Feed real or simulated traffic and stop recording.
12. Confirm only the source types that received messages are exported.
13. Confirm recording status shows elapsed time plus Flow and Timer message counts while recording.
