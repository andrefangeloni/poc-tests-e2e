# Detox Setup
Reference: [Detox](https://github.com/wix/Detox)

## Requirements

`yarn add -D detox`
<br />
`yarn add -D jest`

## Android:

## android/build.gradle

```java
allprojects {
  repositories {
    ...
    maven {
        // Detox is installed from npm
        url "$rootDir/../node_modules/detox/Detox-android"
    }
  }
}
```

## android/app/build.gradle

```java
android {
  defaultConfig {
    ...
    // Setup for Detox
    testBuildType System.getProperty('testBuildType', 'debug')
    testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
  }
}

dependencies {
  ...
  // Setup for Detox
  androidTestImplementation('com.wix:detox:+') { transitive = true }
  androidTestImplementation 'junit:junit:4.12'
}
```

## Test Setup

Create the DetoxTest.java file in the following directory:
`android/app/src/androidTest/java/com/<package_name>/DetoxTest.java`

```java
package com.<package_name>; // Change package name

import com.wix.detox.Detox;
import com.wix.detox.config.DetoxConfig;

import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.rule.ActivityTestRule;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class DetoxTest {
    @Rule
    public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

    @Test
    public void runDetoxTests() {
        DetoxConfig detoxConfig = new DetoxConfig();
        detoxConfig.idlePolicyConfig.masterTimeoutSec = 90;
        detoxConfig.idlePolicyConfig.idleResourceTimeoutSec = 60;
        detoxConfig.rnContextLoadTimeoutSec = (com.<package_name>.BuildConfig.DEBUG ? 180 : 60); // Change package name

        Detox.runTests(mActivityRule, detoxConfig);
    }
}
```

## iOS:
```
brew tap wix/brew
brew install applesimutils
```

## Starting Detox

`yarn detox init -r jest`

## Setup .detoxrc.json

```json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.json",
  "apps": {
    "ios.debug": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/poc_e2e.app",
      "build": "xcodebuild -workspace ios/poc_e2e.xcworkspace -scheme poc_e2e -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": "iPhone 13"
    }
  },
  "configurations": {
    "android.emu.debug": {
      "type": "android.attached", //for genymotion
      "name": "192.168.58.102:5555", //name found on adb devices
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd .."
    },
    "ios.sim.debug": {
      "app": "ios.debug",
      "device": "simulator"
    }
  }
}
```

## Generate build for testing

```
Android:
yarn detox build -c android.emu.debug

iOS:
yarn detox build -c ios.sim.debug
```

## Testing with Detox

```
Android:
yarn detox test -c android.emu.debug

iOS:
yarn detox test -c ios.sim.debug
```
