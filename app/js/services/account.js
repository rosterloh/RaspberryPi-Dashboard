/**
 * @ngdoc service
 * @name ng.service:Account
 * @requires $http
 * @requires $auth
 * @description
 * Factory to model user info
 */
angular.module('RaspberryPi-Dashboard')
.factory('Account', [
  '$http',
  '$auth',
function($http, $auth) {
  return {
    getProfile: function() {
      return $http.get('/api/me');
    },
    updateProfile: function(profileData) {
      return $http.put('/api/me', profileData);
    }
  };
}]);