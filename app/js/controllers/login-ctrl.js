/**
 * @ngdoc controller
 * @name ng.controller:LoginCtrl
 * @requires $scope
 * @requires $log
 * @requires $auth
 * @description
 * Controller for Login page
 */
angular.module('RaspberryPi-Dashboard')
.controller('LoginCtrl', [
  '$scope',
  '$log',
  '$auth',
function($scope, $log, $auth) {
  $scope.login = function() {
    $auth.login({ email: $scope.email, password: $scope.password })
      .then(function() { $log.info('You have successfully logged in'); })
      .catch(function(response) { $log.error(response.data.message); });
  };

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() { $log.info('You have successfully logged in'); })
      .catch(function(response) { $log.error(response.data); });
  };
}]);
