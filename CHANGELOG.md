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