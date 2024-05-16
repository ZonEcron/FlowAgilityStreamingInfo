# FLOW AGILITY STREAMING INFO V 0.6.2

## DEVELOPMENT
Flow Agility Streaming Info by **ZonEcron** Agility Timers. 
 - Visit us https://www.zonecron.com
 - Insult us https://facebook.com/zonecron
 - Write us zonecron@zonecron.com

## USAGE
This HTML file is designed to run standalone, just unzip and double click on it. This HTML file will show the name of the guide, dog, club... etc as provided by Flow Agility platform https://flowagility.com .  
Examples of use:
 - Event videowall
 - Info layer on a streaming service
 - ...

## MANUAL
 1. Double click on an empty point on the screen to edit general values ​​(such as the connection URL or background color) and enable edit mode.
 2. For info to be updated it will be necessary to input the connection URL provided by the Flow Agility platform in the general menu of the screen and press connect button. The API used is described at https://github.com/flowagility/streaming#flowagility-streaming-service-v100 .
 3. In edit mode, you can drag & drop every item, and by double clicking it you can change its size, color, transparency, texts... If any properties window is open, you cannot drag and drop anything except the window itself. Close it to drag or edit other items.
 4. In edit mode, you can undo with <kbd>Ctrl</kbd> + <kbd>z</kbd> the last 100 actions or redo with <kbd>Shift</kbd> + <kbd>Ctrl</kbd> + <kbd>z</kbd> the last 100 undo actions.
 5. You can load a background image to position elements propperly.
 6. Once finished, double click again on an empty area and press exit edit mode button in general window.
 7. In general windiw you can configure connection to Flow Agility platform and/or to local timer.
 8. Connection with timer wont work loading this HTML directly from github as https. You must download files and run from your computer so it runs as http, for communication with timer to work.
 9. Both option will work to connect to Flow Agility platform.
 10. In case of communication error with timer or Flow Agility, new coennection will be tried continuously with 5 sec pause between tries.
 11. When connected both to Flow agility and timer, course length is automatically updated and speed will be calculated continuously and will be shown decreasing as time increases. Use Max Speed input in general window to avoid showing too high speeds. Speed wont be shown during the first 5 secs of course.
 12. Save button, will store settings locally so sustomized settings will be persistent if HTML is closed and reopened later. It will also synchronize two windows in same browser, so window layout can be updated while streaming without showing prpperties window in the streaming.
 13. If connections to FA or timer are configured and saved, a window reload or new window will automatically try to connect with those settings.
 14. The Import/Export button allows you to save settings to a file for backup or migration. Import feature will only be available on new configurations or fresh reseted. Any change will convert the import button into export button.
 15. Some buttons or actions will show a popup help on click or pausing the mouse over the element for a couple of seconds.

## NOTES
 1. Saved configuration data will be stored in your browser's local storage. We encourage to export your settings for backup.
 2. Different browsers have different response to local storage. I.e. Firefox won´t share local storage between 2 local html files or if you rename/move the file or the container folder. Chrome will. Tht's why 2 differeng browsers wont synchronise changes when saved. Use that diferences to your convenience. Once again, we encourage to export your settings.
