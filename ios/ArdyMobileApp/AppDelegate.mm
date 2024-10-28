#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <RNCPushNotificationIOS.h> // RNCPushNotificationIOS'u içe aktarıyoruz
#import <UserNotifications/UserNotifications.h> // UserNotifications Framework

@interface AppDelegate () <UNUserNotificationCenterDelegate> // UNUserNotificationCenterDelegate protokolü eklendi
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ArdyMobileApp";
  self.initialProps = @{};

  // Uygulamanın bildirimleri yönetmesi için UNUserNotificationCenterDelegate ayarlanır
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  // launchOptions'ın nil olup olmadığını kontrol ediyoruz
  if (launchOptions) {
    [RNCPushNotificationIOS didReceiveRemoteNotification:launchOptions];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// Cihazın başarıyla bir DeviceToken alması durumunda çağrılan metod
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Remote Notification alındığında çağrılan metod
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  if (userInfo) {
    [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
  } else {
    completionHandler(UIBackgroundFetchResultNoData);
  }
}

// Cihazın bir DeviceToken alırken hata alması durumunda çağrılan metod
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// Local Notification geldiğinde çağrılan metod
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
  completionHandler();
}

// Foreground (Uygulama açıkken) gelen bildirimi işlemek için
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBadge);
}

@end
