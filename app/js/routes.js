(function () {
 
  'use strict';
 
  /**
   * @class RouteConfig
   * @classdesc Route configuration for the Dashboard module.
   * @ngInject
   */
  function RouteConfig ($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
    
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
        templateUrl: 'profile',
        controller: 'ProfileCtrl',
        resolve: {
          authenticated: ['$location', '$auth', function($location, $auth) {
            if (!$auth.isAuthenticated()) {
              return $location.path('/login');
            }
          }]
        }
      })
    
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
      clientId: '631036554609-v5hm2amv4pvico3asfi97f54sc51ji4o.apps.googleusercontent.com'
    });
  };
  
  RouteConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$authProvider'];
  
  angular
    .module('RaspberryPi-Dashboard')
    .config('RouteConfig', RouteConfig);
 
})();
