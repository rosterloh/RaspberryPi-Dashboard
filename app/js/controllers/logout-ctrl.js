/**
 * @ngdoc controller
 * @name ng.controller:LogoutCtrl
 * @requires $alert
 * @requires $auth
 * @description
 * Controller for Logout page
 */
DashModule
.controller('LogoutCtrl', [
  '$alert', 
  '$auth',
function($alert, $auth) {
  if (!$auth.isAuthenticated()) {
    return;
  }
  $auth.logout()
    .then(function() {
      $alert({
        content: 'You have been logged out',
        animation: 'fadeZoomFadeDown',
        type: 'material',
        duration: 3
      });
    });
}]);