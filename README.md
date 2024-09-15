# FLOW AGILITY STREAMING INFO V 0.6.3

## DEVELOPMENT
Flow Agility Streaming Info by **ZonEcron** Agility Timers. 
 - Visit us https://www.zonecron.com
 - Insult us https://facebook.com/zonecron
 - Write us zonecron@zonecron.com

## USAGE
This application is available online through GitHub Pages at the following link: https://zonecron.github.io/FlowAgilityStreamingInfo/. However, due to security restrictions of the HTTPS protocol, it is not possible to connect to a local timer.
If you want to use a local timer, you will need to download the application and open it directly on your computer. To do this, clone or download the repository by following these steps:
1. Click on the green Code button at the top of this repository.
2. Select Download ZIP to download the repository to your computer.
3. Once downloaded, extract the ZIP file and open the HTML file with your favorite browser.
This application will show the name of the guide, dog, club... etc as provided by Flow Agility platform https://flowagility.com .  
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
7. In general window you can configure connection to Flow Agility platform and/or to local timer.
8. Keep in mind that attempting to connect to a local timer from this app, which is running on an HTTPS server like GitHub Pages, may not work due to the security restrictions mentioned above.
9. In case of communication error with timer or Flow Agility, new coennection will be tried continuously with 5 sec pause between tries.
10. When connected both to Flow agility and timer, course length is automatically updated and speed will be calculated continuously and will be shown decreasing as time increases. Use Max Speed input in general window to avoid showing too high speeds. Speed wont be shown during the first 5 secs of course.
11. Save button, will store settings locally so sustomized settings will be persistent if HTML is closed and reopened later. It will also synchronize two windows in same browser, so window layout can be updated while streaming without showing prpperties window in the streaming.
12. If connections to FA or timer are configured and saved, a window reload or new window will automatically try to connect with those settings.
13. The Import/Export button allows you to save settings to a file for backup or migration. Import feature will only be available on new configurations or fresh reseted. Any change will convert the import button into export button.
14. Some buttons or actions will show a popup help on click or pausing the mouse over the element for a couple of seconds.

## NOTES
1. Saved configuration data will be stored in your browser's local storage. We encourage to export your settings for backup.
2. Different browsers have different response to local storage. I.e. Firefox won´t share local storage between 2 local html files or if you rename/move the file or the container folder. Chrome will. Tht's why 2 differeng browsers wont synchronise changes when saved. Use that diferences to your convenience. Once again, we encourage to export your settings.
