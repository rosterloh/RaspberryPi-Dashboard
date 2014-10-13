/**
 * @ngdoc controller
 * @name ng.controller:SignupCtrl
 * @requires $scope
 * @requires $log
 * @requires $auth
 * @description
 * Controller for user signup
 */
angular.module('RaspberryPi-Dashboard')
.controller('SignupCtrl', [
  '$scope',
  '$log',
  '$auth',
function($scope, $log, $auth) {
  $scope.signup = function() {
    $auth.signup({
      displayName: $scope.displayName,
      email: $scope.email,
      password: $scope.password
    }).catch(function(response) { $log.error(response.data.message); });
  };
}]);
