/**
 * @ngdoc controller
 * @name ng.controller:LogoutCtrl
 * @requires $log
 * @requires $auth
 * @description
 * Controller for Logout page
 */
DashModule
.controller('LogoutCtrl', [
  '$log',
  '$auth',
function($log, $auth) {
  if (!$auth.isAuthenticated()) {
    return;
  }
  $auth.logout()
    .then(function() { $log.info('You have been logged out'); });
}]);
