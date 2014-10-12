/**
 * @ngdoc module
 * @name RaspberryPi-Dashboard
 * @module RaspberryPi-Dashboard
 * @requires ui.bootstrap
 * @requires ui.router
 * @requires ngResources
 * @requires ngMessages
 * @requires satellizer
 * @description
 * Dashboard application on my Raspberry Pi
 */
var DashModule = angular.module('RaspberryPi-Dashboard', [
  'ui.bootstrap', 
  'ui.router', 
  'ngResource', 
  'ngMessages', 
  'ngCookies', 
  'satellizer']),
extend = angular.extend,
forEach = angular.forEach,
isDefined = angular.isDefined,
isString = angular.isString;
