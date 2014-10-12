/**
 * @ngdoc controller
 * @name ng.controller:SignupCtrl
 * @requires $scope
 * @requires $alert
 * @requires $auth
 * @description
 * Controller for user signup
 */
angular.module('RaspberryPi-Dashboard')
.controller('SignupCtrl', [
  '$scope',
  '$alert', 
  '$auth',
function($scope, $alert, $auth) {
  $scope.signup = function() {
    $auth.signup({
      displayName: $scope.displayName,
      email: $scope.email,
      password: $scope.password
    }).catch(function(response) {
      $alert({
        content: response.data.message,
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      });
    });
  };
}]);