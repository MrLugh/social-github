// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('socialGithub', ["ionic", "socialGithub.services", "socialGithub.controllers"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.constant("apiOauth", {
  "access_token":""
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state("app", {
    cache: false,
    url: "/app",
    abstract: true,
    templateUrl: "js/templates/menu.html",
    controller: "AppCtrl"
  })

  .state("app.start", {
    cache: false,
    url: "/start",
    views: {
      "menuContent": {
        templateUrl: "js/templates/start.html",
        controller: "StartCtrl"
      }
    }
  })

  .state("app.settings", {
    cache: false,
    url: "/settings",
    views: {
      "menuContent": {
        templateUrl: "js/templates/settings.html",
        controller: "SettingsCtrl"
      }
    }
  })

  .state("app.users", {
    cache: false,
    url: "/users",
    views: {
      "menuContent": {
        templateUrl: "js/templates/users.html",
        controller: "UsersCtrl"
      }
    }
  })

  .state("app.repositories", {
    cache: false,
    url: "/repositories/:username",
    views: {
      "menuContent": {
        templateUrl: "js/templates/repositories.html",
        controller: "RepositoryCtrl"
      }
    }
  })  

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/app/start");
})

.config(function ($urlRouterProvider,$httpProvider) {
  $httpProvider.interceptors.push('customInterceptor');
});