# Add project specific ProGuard rules here.
 By default, the flags in this file are appended to flags specified
 in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
 You can edit the include path and order by changing the proguardFiles
 directive in build.gradle.

 For more details, see
   http://developer.android.com/guide/developing/tools/proguard.html
keep class com.rhcqs_customer_app.** { *; }
keep class com.facebook.react.** { *; }
keep class com.bumptech.glide.** { *; }
keep class com.bumptech.glide.load.resource.bitmap.** { *; }
keep class com.bumptech.glide.load.engine.** { *; }
keep class com.google.firebase.** { *; }
# Add any project specific keep options here: