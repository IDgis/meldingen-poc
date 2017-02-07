// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'nl.idgis.offlinecontacts',
  name: 'Offline Meldingen',
  description: 'Keep track off your contacts, even offline.',
  author: 'IDgis',
  email: 'mart.nijzink@idgis.nl',
  website: 'http://www.idgis.nl/'
});
// Set up resources such as icons and launch screens.
// App.icons({
  // 'iphone': 'icons/icon-60.png',
  // 'iphone_2x': 'icons/icon-60@2x.png',
// });
// App.launchScreens({
  // 'iphone': 'splash/Default~iphone.png',
  // 'iphone_2x': 'splash/Default@2x~iphone.png',
// });
// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xff0000ff');
// Add custom tags for a particular PhoneGap/Cordova plugin
// to the end of generated config.xml.
// Universal Links is shown as an example here.
App.appendToConfig(`
  <universal-links>
    <host name="http://lolee:3000" />
  </universal-links>
`);