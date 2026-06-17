export default {
  "expo": {
    "name": "Arena 24",
    "slug": "arena-24",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/arena24-logo.png",
    "scheme": "myapp",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.sunnyasin.arena24",
      "icon": "./assets/ios_icon.jpg",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
        "NSCameraUsageDescription": "Această aplicație folosește camera pentru a scana codurile QR de pe mese.",
        "NSPhotoLibraryUsageDescription": "Această aplicație folosește galeria foto pentru a schimba poza de profil."
      },
      "associatedDomains": [
        "applinks:arena-24.expo.app"
      ]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "https",
              "host": "arena-24.expo.app",
              "pathPrefix": "/events",
            },
            {
              "scheme": "https",
              "host": "arena-24.expo.app",
              "pathPrefix": "/location"
            },
            {
              "scheme": "https",
              "host": "arena-24.expo.app",
              "pathPrefix": "/resetPassword"
            },
            {
              "scheme": "https",
              "host": "arena-24.expo.app",
              "pathPrefix": "/*"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ],
      "icon": "./assets/android_icon.jpg",
      "adaptiveIcon": {
        "foregroundImage": "./assets/android_icon.jpg",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": false,
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLEMAPS_APIKEY
        }
      },
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      "package": "com.sunnyasin.arena24"
    },
    "web": {
      "bundler": "metro",
      "output": "server",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/icon-maro.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Această aplicație folosește galeria foto pentru a schimba poza de profil."
        }
      ],
      [
        "expo-maps",
        {
          "requestLocationPermission": true,
          "locationPermission": "Allow $(PRODUCT_NAME) to use your location"
        }
      ],
      "expo-font",
      "expo-web-browser",
      "expo-system-ui"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "a7cdfb15-7be3-4206-a7f7-9c1d0e2beb72"
      }
    }
  }
}