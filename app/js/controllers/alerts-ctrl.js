/**
 * @ngdoc controller
 * @name ng.controller:AlertsCtrl
 * @requires $scope
 * @description
 * Controller for Dashboard alerts
 */
DashModule
.controller('AlertsCtrl', [
  '$scope',
function($scope) {
  $scope.alerts = [
    { type: 'success', msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!' },
    { type: 'danger', msg: 'Found a bug? Create an issue with as many details as you can.' }
  ];

  /**
   * @ngdoc method
   * @name ng.controller:AlertsCtrl#addAlert
   * @methodOf ng.controller:AlertsCtrl
   * @description
   * Add an alert
   */
  $scope.addAlert = function() {
    $scope.alerts.push({msg: 'Another alert!'});
  };

  /**
   * @ngdoc method
   * @name ng.controller:AlertsCtrl#closeAlert
   * @param {int} index of alert to remove
   * @methodOf ng.controller:AlertsCtrl
   * @description
   * Dismiss an alert at an index
   */
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}]);