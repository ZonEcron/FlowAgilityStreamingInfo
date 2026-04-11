# Flow Agility Streaming Info V0.7.0

Standalone HTML overlay for dog agility streaming. It shows the handler, dog, club, time, faults, refusals, elimination status and result tables on screen.

[English](README.md) | [Español](README.es.md)

## Quick Start

If you just want to open it and make it work:

1. Download the project and open `index.html`.
2. Double-click on an empty area.
3. If you are using FlowAgility:
   paste the URL without `wss://` and click `Connect`.
4. If you are using a local timer:
   choose the brand, enter `host:port` and click `Connect`.
5. If you want to move texts or tables:
   click `Enter Edit`.
6. When you are done:
   click `Save`.
7. If you want a backup:
   use `Export`.

If you are connecting a local timer, always use the local HTML file. Do not use the GitHub Pages version.

## Index

1. [What It Is](#what-it-is)
2. [What It Is For](#what-it-is-for)
3. [Ways To Use It](#ways-to-use-it)
4. [Quick Installation](#quick-installation)
5. [First Start](#first-start)
6. [FlowAgility Connection](#flowagility-connection)
7. [Local Timer Connection](#local-timer-connection)
8. [Edit Mode](#edit-mode)
9. [Save, Export And Import](#save-export-and-import)
10. [How Multi-Window Sync Works](#how-multi-window-sync-works)
11. [Debug And Replay Panels](#debug-and-replay-panels)
12. [Common Problems](#common-problems)
13. [Competition Tips](#competition-tips)
14. [References](#references)

## What It Is

FASI is a single HTML file that opens directly in the browser, with no extra installation steps.

It can work:

- only with FlowAgility
- only with a local timer
- with FlowAgility and a timer at the same time
- with no connections at all, just to design the overlay

## What It Is For

Typical use cases:

- graphics layer for OBS, vMix or other streaming software
- information screen at the ring
- videowall
- editing window on one monitor and clean output window on another

## Ways To Use It

There are two main ways:

1. Online through GitHub Pages  
   Link: `https://zonecron.github.io/FlowAgilityStreamingInfo/`

2. Local use by downloading the project  
   This is the recommended option if you want to connect a local timer.

Important:

- if you open the online version through `https`, you will not be able to connect to a local timer because of browser security restrictions
- to use a local timer, download the full project and open index.html directly in your browser

## Quick Deployment

1. On GitHub, click the green `Code` button.
2. Click `Download ZIP`.
3. Extract the ZIP into a folder.
4. Open `index.html` with your browser.

No dependencies or build step are required.

## First Start

When you open the page:

1. Double-click on an empty area.
2. The general window will open.
3. From there you can:
   - configure connections
   - change the background color
   - load an overlay image
   - enter edit mode
   - save or export the configuration

If you do nothing else, the page shows sample data so you can design the overlay.

## FlowAgility Connection

### What To Enter

In the FlowAgility field, enter only the address provided by FlowAgility, without protocol.

Correct:

- `flow.example.com/stream/abc123`
- `myserver.com/ws/ring1`

Incorrect:

- `wss://flow.example.com/stream/abc123`
- `ws://flow.example.com/stream/abc123`
- `https://flow.example.com/...`

### How To Connect

1. Double-click on an empty area.
2. In `Flow Agility Connection`, paste the URL.
3. Click `Connect`.

If it works:

- the status will change to `Connected`
- the overlay will update with FlowAgility data

### Which Data Comes From FlowAgility

When FlowAgility is connected, FASI uses it as the main source for:

- dog
- handler
- club
- faults
- refusals
- elimination
- `Course Results` table
- `Combined Results` table

## Local Timer Connection

### What To Enter

In the timer field, enter `host:port`, without protocol.

Correct:

- `192.168.4.1:81`
- `192.168.4.10:8080`

Incorrect:

- `ws://192.168.4.1:81`
- `http://192.168.4.1:81`
- `192.168.4.1`

### Supported Types

Currently this html supports:

- `ZonEcron`
- `Galican`

### Common Examples

- ZonEcron display: `192.168.4.1:81`
- ZonEcron dongle app: `localhost:8080` or `192.168.1.43:8080`
**Note:** Port number used in app can be from 8080 to 8100.

### How To Connect

1. Double-click on an empty area.
2. Choose the timer type.
3. Enter `host:port`.
4. Click `Connect`.

### What The Timer Does

If a timer is connected:

- the time can run live while the team is on course
- speed is calculated in real time

If FlowAgility is also connected:

- faults, refusals and elimination come from FlowAgility
- the timer does not overwrite those values on screen

If FlowAgility is not connected:

- FASI can show faults, refusals and elimination received from the timer

## Edit Mode

Edit mode is used to change the look and position of the elements.

### Enter Edit Mode

1. Double-click on an empty area.
2. Click `Enter Edit`.

### What You Can Do

In edit mode you can:

- drag texts and tables
- change size, color and background
- change position
- change layer order
- hide elements
- change the text shown before and after a value

### How To Move An Element

1. Enter edit mode.
2. Drag the element with the mouse.

### How To Change Element Properties

1. Enter edit mode.
2. Double-click the element.
3. Change what you need.
4. Click `OK` to save or `Cancel` to discard.

### Property Windows

The `General` and `Properties` windows can be dragged from the title bar.

If they are open:

- you cannot edit other elements until you close them

### Hide Option

If you enable `Hide` on an element:

- it will not disappear immediately while you are still in edit mode
- it will be applied when you exit edit mode

Special behavior:

- `ELIMINATED` only appears when the team is eliminated
- `Faults` and `Refusals` are hidden when `ELIMINATED` is shown

### Undo And Redo

In edit mode:

- `Ctrl + Z` undo
- `Ctrl + Y` redo
- `Ctrl + Shift + Z` also redo

History keeps the last 100 actions.

## Save, Export And Import

### Save

The `Save` button:

- saves the current configuration in the browser
- keeps the configuration after closing the page
- syncs other windows in the same browser

If connection settings were saved, reopening the page will try to reconnect automatically.

### Export

The `Export` button:

- saves the full configuration to a `.json` file

Use it as a backup.

### Import

The `Import` button:

- loads a previously saved configuration

Important:

- `Import` is only available in a fresh or reset state
- once you make a real configuration change, that button becomes `Export`
- entering edit mode by itself does not change the button
- if you want to import again from scratch, use `Reset`

### Reset

`Reset` removes the saved configuration and reloads the page.

## How Multi-Window Sync Works

If you open the same page in two windows of the same browser:

- you can edit one window
- click `Save`
- and the other window will update automatically

This is useful for:

- one editing window
- one clean output window

Important:

- sync depends on the browser local storage
- different browsers do not share that configuration

## Debug And Replay Panels

These panels are optional. They do not affect the normal output window unless you enable them.

### Debug

Open the page like this:

- `index.html?debug=1`

It is used to see:

- connection state
- current and next team
- table sizes
- technical event log

### Replay

Open the page like this:

- `index.html?replay=1`

It is used to:

- load fixtures
- step through messages manually
- automatically detect whether a fixture is Flow, ZonEcron or Galican
- record real traffic to create new fixtures

### Both At The Same Time

- `index.html?debug=1&replay=1`

## Common Problems

### FlowAgility Does Not Connect

Check:

- that you entered the URL without `wss://`
- that there are no spaces
- that the URL is correct

### The Timer Does Not Connect

Check:

- that you are using the local HTML file, not the GitHub Pages version
- that you entered `host:port`
- that you selected the correct timer type

### I Lost My Layout

If you did not click `Save`, the changes were not stored.

Recommendation:

- click `Save` when you are done
- also export a backup `.json`

### The Import Button Is Not Available

That is normal if you already changed the configuration.

To import again from a clean state:

1. Click `Reset`
2. Open the general window again
3. Use `Import`

### Two Windows Do Not Sync

Check:

- that both are in the same browser
- that both are opening the same page
- that you clicked `Save`

### GitHub Pages Does Not Connect To The Timer

It’s normal. The local timer uses unencrypted `ws`, and that type of connection is not allowed from an `https` page like the one on GitHub.

To use the timer:

- download the project
- open `index.html` locally

## Competition Tips

Recommended:

1. Prepare the layout before the event starts.
2. Click `Save`.
3. Export a backup `.json`.
4. If you are streaming, use one window for editing and another for clean output.
5. If something unusual happens, open another window with `?debug=1`.
6. If you need to capture real traffic for later debugging, use `?replay=1` and `Record`.

## References

FlowAgility Streaming API:

- https://github.com/flowagility/streaming

ZonEcron Interfacing:

- https://github.com/ZonEcron/ZonEcron-Interfacing

ZonEcron website:

- https://www.zonecron.com
