# FLOW AGILITY STREAMING INFO V 0.6.4

## DEVELOPMENT
Flow Agility Streaming Info by **ZonEcron** Agility Timers.
 - Visit us https://www.zonecron.com
 - Insult us https://facebook.com/zonecron
 - Write us zonecron@zonecron.com

## USAGE
This application is available online through GitHub Pages at the following link: https://zonecron.github.io/FlowAgilityStreamingInfo/. However, due to security restrictions of the HTTPS protocol, it is not possible to connect to a local timer.
If you want to use a local timer, you will need to download the application and open it directly on your computer. To do this, clone or download the repository by following these steps:
1. Click on the green Code button at the top of this repository.
2. Select "Download ZIP" to download the repository to your computer.
3. Once downloaded, extract the ZIP file and open the HTML file with your favorite browser.
This application will show the name of the guide, dog, club... etc., as provided by the FlowAgility platform (https://flowagility.com).
Examples of use:
- Event videowall
- Info layer on a streaming service
- ...

## MANUAL
1. Double-click on an empty spot on the screen to edit general values such as the connection URLs or background color, etc.
2. From this general window, you can upload a background image, which will be saved with the rest of the customizations when you press the save button.
3. This window also shows the input box to enter the URL provided by the FlowAgility platform. Enter the URL and press the connect button. Once connected, the info displayed will be updated in real-time. The API used is described at https://github.com/flowagility/streaming#flowagility-streaming-service-v100.
4. There is also another input box to configure the URL to connect to a local timer.
5. Keep in mind that if you try to connect to a local timer from this app running on an HTTPS server, like GitHub Pages, it won't work due to the security restrictions mentioned above.
6. In case of a communication error with the timer or FlowAgility, a new connection will be tried continuously with a 5-second pause between attempts.
7. When connected to FlowAgility, the course length is automatically updated, and if connected to the timer as well, speed will be calculated continuously and will be shown decreasing as time increases. Use the Max Speed input in the general window to avoid showing excessively high speeds. Speed won't be shown during the first 5 seconds of the course.
8. If there is no connection to FlowAgility, the distance must be entered manually for each course for the speed to be displayed properly.
9. At the bottom of this general window, there is a button to enter edit mode. In this mode, you can drag and drop each text (time, faults, dog’s name, etc.) to position it wherever you want. Double-clicking on each text opens a properties window where you can change its size, color, transparency, etc. If any window is open, you cannot drag and drop anything except the window itself. It must be closed to drag or edit other texts.
10. Activating the "Hide" option for an element will not hide it until you exit edit mode. In normal mode (non-edit), the "Eliminated" element and the "Faults" and "Refusals" elements will alternate (one or the other) depending on whether the pair has been eliminated or not. In edit mode, both will be visible so that they can be edited. For example, if you decide to permanently hide "Faults" and "Refusals" by activating the "Hide" option, the "Eliminated" element will maintain its behavior in normal mode, only becoming visible when the pair is eliminated, and vice versa.
11. In edit mode, you can undo the last 100 actions with <kbd>Ctrl</kbd> + <kbd>z</kbd> or redo the last 100 undone actions with <kbd>Shift</kbd> + <kbd>Ctrl</kbd> + <kbd>z</kbd>.
12. Once you have finished customizing, double-click on an empty area to display the general window again and press the exit edit mode button.
13. In the same window, pressing the save button will save the adjustments made and keep them even if the web page is closed and opened later.
14. Pressing the save button will also sync these customizations across all **same browser** windows displaying the same streaming page, using the storage that each browser shares among its windows. This feature allows you to modify the design of the different texts in one window of the browser, and when you save, it updates the window being streamed without showing the menus and properties opened for modifications.
15. If connections to FlowAgility or the timer are configured and saved, a window reload or new window will automatically try to connect with those settings.
16. The Import/Export button allows you to save settings to a file for backup or migration. The import feature will only be available on non-customized or freshly reset windows. Any change in any setting or property will convert the import button into the export button. If the import option does not appear, you need to press the reset button to restart all the settings.
17. Some buttons or actions will show a pop-up help message when clicked or when the mouse hovers over the element for a couple of seconds.

## NOTES
1. Saved configuration data will be stored in your browser's local storage, which allows different windows from the same browser to synchronize the configurations. Despite this storage, we encourage you to export your settings for backup or migration to another browser.
2. Different browsers have different responses to local storage. For example, Firefox won’t share local storage between two local HTML files or if you rename/move the file or the container folder, whereas Chrome will. That’s why two different browsers won’t synchronize changes when saved. Use these differences to your convenience. Once again, we encourage you to export your settings.
