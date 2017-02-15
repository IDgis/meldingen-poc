# meldingen-poc

## Installing app on Android device

### Building

- First, make sure that
  * the `mobile-config.js` file is in the root folder;
  * the android platform has been added by running `meteor add-platform android`;
  * you have installed the Android SDK;
  * you have set `ANDROID_HOME`;
  * you have a Java KeyStore (and a password) to sign your app with.
- Change the host name in `mobile-config.js` to your host name.
- Build APK by running `meteor build ..\output --server=http://<your-host>:3000/meldingen`. The APK will be generated as `..\output\android\release-unsigned.apk`.
- The tool needed for aligning and signed can be found in `%ANDROID_HOME%\build-tools\<your-version>`. Add this location to your PATH;
- Move to the folder `output\android`.
- Zipalign the APK by running `zipalign 4 release-unsigned.apk release-unsigned-aligned.apk`.
- Sign the APK by running `apksigner sign --ks <your-keystore>.jks release-unsigned-aligned.apk`.
- Rename `release-unsigned-aligned.apk` to `release-signed-aligned.apk` to prevent confusion.

### Installing
- First, make sure that
  * you have enabled debugging on your Android device;
  * you have installed your device's ADB driver;
  * your device is USB connected.
- To install the APK, run `adb install release-signed-aligned.apk`.
- Check if the app has been installed on your device.
