eduplus
=======

An open source Chrome extension that facilitates EDU usage

How to add to Chrome:
-------
1. Download eduplus.crx from the crx directory
2. Open Google Chrome
3. From the customize menu (top right) go to Tools > Extensions
Or type this in the address bar: chrome://extensions/
4. Drag eduplus.crx to the Chrome Extensions window you just opened
It should say something like "Drop to install"

DONE! Now if you like, you can change some setting by clicking on Options near EDU Plus in the Chrome Extensions page.


What does it do:
-------
EDU plus is an open source Chrome extension designed to faciliate your EDU (edu.sharif.edu) usage:

1. It automatically fills the login Captcha for you
2. It remembers the last used username so that you don't have to enter your ID everytime
3. It can remember the last used password so that you don't have to enter your password everytime (NOTE: this is not enabled by default and can be enabled from the extension's options page.)
4. Smat Focus: It automatically focuses the keyboard on the field that needs to be filled on page load. If user id, password, and captcha are all set to be filled automatically, it focuses on the Login button so you only need to press Enter to login.
 

Will EDU Plus steal my data?
-------
Short answer: NO!

Longer answer: Technically, in order to process the Captcha we need to access the EDU page's code so it is indeed possible to sniff your username and password and etc. BUT we don't do it and will never do it. EDU Plus sends no data out of your PC and we encourage you to check that for yourself by using Chrome developer tools (press F12 on any page). And if you are not sure yet, we encourage you to check the source code as it is all open source! We also suggest that you don't accept any unofficial version of the extension from anyone.
