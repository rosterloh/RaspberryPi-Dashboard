/**
 * @ngdoc controller
 * @name ng.controller:ProfileCtrl
 * @requires $scope
 * @requires $log
 * @requires $auth
 * @requires Account
 * @description
 * Controller for Profile page
 */
angular.module('RaspberryPi-Dashboard')
.controller('ProfileCtrl', [
  '$scope',
  '$log',
  '$auth',
  'Account',
function($scope, $log, $auth, Account) {
  /**
   * Get user's profile information.
   */
  $scope.getProfile = function() {
    Account.getProfile()
      .success(function(data) {
        $scope.user = data;
      })
      .error(function(error) { $log.error(error.message);  });
  };


  /**
   * Update user's profile information.
   */
  $scope.updateProfile = function() {
    Account.updateProfile({
      displayName: $scope.user.displayName,
      email: $scope.user.email
    }).then(function() { $log.info('Profile has been updated'); });
  };

  /**
   * Link third-party provider.
   */
  $scope.link = function(provider) {
    $auth.link(provider)
      .then(function() { $log.info('You have successfully linked ' + provider + ' account'); })
      .then(function() { $scope.getProfile(); })
      .catch(function(response) { $log.error(response.data.message); });
  };

  /**
   * Unlink third-party provider.
   */
  $scope.unlink = function(provider) {
    $auth.unlink(provider)
      .then(function() { $log.info('You have successfully unlinked ' + provider + ' account'); })
      .then(function() { $scope.getProfile(); })
      .catch(function(response) { $log.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account'); });
  };

  $scope.getProfile();
}]);
