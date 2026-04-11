# FLOW AGILITY STREAMING INFO

## 0.1.0 - 2023/10/27  
- First functional version and betatesting start.
- It is semi translated from spanish. Most code still has variable names and comments in spanish.

## 0.2.0 - 2023/10/31
- Fixed bug posZ resetting
- Added small red X button on top right of propperties windows
- Prevent window close clicking outside of the window
- Fixed 1px misplacement when dragging
- Fixed before and after text not showing offline
- Added import and export feature to save customized settings to a file

## 0.3.0 - 2023/11/08
- Code translated to english
- Added trial name, course, grade and size
- Improved drag & drop feature
- Drag and drop is only enabled if properties windows are closed to improve consistency of settings.

## 0.4.0 - 2023/11/30
- Fixed background color bug when importing
- Added undo <kbd>Ctrl</kbd> + <kbd>z</kbd> and redo <kbd>Shift</kbd> + <kbd>Ctrl</kbd> + <kbd>z</kbd> up to 100 actions.

## 0.5.0 - 2024/01/02
- Added background image (overlay) load feature.
- Image will be saved, exported and imported along with all other customized settings.

## 0.6.0 - 2024/01/26
- Added hide element feature
- Added conmined result table
- Table title texts are now customizable
- Reorganised table elements to drag all elements inside table at once or all elements in a row
- Changing table text color, size or font will change all elements inside table unless element has been previoustly customized. Same on each row.
- Added communication with ZonEcron and Galican timers through timer's websocket.
- Sync 2 windows of same browser. Save your changes in one window and the other will update.
- Added timer (ZonEcron & Galican) communication. 
- Added course lenght input
- Added max calculated speed to be displayed. (only when timer is connected) 
- Added auto connection retry after communication error.

## 0.6.1 - 2024/02/22
- Corrected minor bugs related to ZonEcron timer connection.
- Renamed main html to index.html to publish directly on github.io

## 0.6.2 - 2024/03/04
- Added speed to course results table.
- Added up to 10 first teams in each results table.

## 0.6.3 - 2024/09/15
- Fixed before and after texts issue when text is empty.
- Updated README.md with online link and clarifications regarding HTTPS and local timer connection.
- Added receiving faults and refusals from timer when FA connection is down.

## 0.6.4 - 2024/09/29
- Fixed image button not showing "Delete" when loaded from saved settings.
- Added verification before deleting image.
- Some spanish names in code translated to english
- Improve code maintainability

## 0.6.5 - 2024/10/09
- Improved popup info method
- Improved manual

## 0.6.6 - 2024/12/08
- Improved connect and disconect workflow

## 0.7.0 - 2026/04/11
- First version developed with AI assistance.
- Improved drag and drop robustness, especially during fast mouse movement and while editing popup windows.
- Improved settings import/export and restore behavior, including correct handling of null, empty and zero-like values.
- Refactored and split the codebase into several JS files with clearer responsibilities and less coupling between UI, state, connections and persistence.
- Improved FlowAgility and timer connection workflows, reconnect handling and validation of connection inputs.
- Added replay and debug tooling with separate panels, fixture recording, fixture replay for manual testing for flowagility, and zonecron and galican timers.
- Improved consistency of editing workflows, modal/general cancel behavior, undo/redo restoration and Import/Export state changes.
- Improved table rendering and data handling for course results, combined results and empty/current-team edge cases.
- Updated technical and user documentation to match the current architecture, replay workflow and local-use recommendations.
