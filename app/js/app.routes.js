/**
 * @ngdoc object
 * @name RouteConfig
 * @module RaspberryPi-Dashboard
 * @description
 * Route configuration for the Dashboard module.
 */
DashModule
.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$authProvider',
  'AnalyticsProvider',
function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider, AnalyticsProvider) {

  // Application routes
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'dashboard.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'login.html',
      controller: 'LoginCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'signup.html',
      controller: 'SignupCtrl'
    })
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'profile.html',
      controller: 'ProfileCtrl',
      resolve: {
        authenticated: ['$location', '$auth', function($location, $auth) {
          if (!$auth.isAuthenticated()) {
            return $location.path('/login');
          }
        }]
      }
    });

  $urlRouterProvider.otherwise('/');

  // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
  $urlRouterProvider.rule(function ($injector, $location) {
    var path = $location.url();

    // check to see if the path has a trailing slash
    if ('/' === path[path.length - 1]) {
      return path.replace(/\/$/, '');
    }

    if (path.indexOf('/?') > 0) {
      return path.replace('/?', '?');
    }

    return false;
  });

  $locationProvider.html5Mode(true);

  $authProvider.google({
    clientId: '437417304285-lnb3unarsdh5nv8frcr848sk5omckqq3.apps.googleusercontent.com'
  });
  
  AnalyticsProvider.setAccount('UA-54797889-1');
  //Use analytics.js instead of ga.js
  AnalyticsProvider.useAnalytics(true);
  //Change the default page event name. This is useful for ui-router, which fires $stateChangeSuccess instead of $routeChangeSuccess
  AnalyticsProvider.setPageEvent('$stateChangeSuccess');
}])
.run(function(Analytics) {
  // In case you are relying on automatic page tracking, you need to inject Analytics
  // at least once in your application (for example in the main run() block)
});
