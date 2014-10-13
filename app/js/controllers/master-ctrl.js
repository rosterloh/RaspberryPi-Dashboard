/**
 * @ngdoc controller
 * @name ng.controller:MasterCtrl
 * @requires $scope
 * @description
 * Main Controller for the Dashboard
 */
DashModule
.controller('MasterCtrl', [
  '$scope',
  '$cookieStore',
function ($scope, $cookieStore, $auth) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
  /**
   * Sidebar Toggle & Cookie Control
   *
   */
  var mobileView = 992;

  $scope.getWidth = function() { return window.innerWidth; };

  $scope.$watch($scope.getWidth, function(newValue, oldValue)
  {
    if(newValue >= mobileView)
    {
      $scope.toggle = ( ! angular.isDefined( $cookieStore.get('toggle') ) &&
        $cookieStore.get('toggle')) ? true : false;
    }
    else
    {
      $scope.toggle = false;
    }

  });

  $scope.toggleSidebar = function()
  {
    $scope.toggle = ! $scope.toggle;

    $cookieStore.put('toggle', $scope.toggle);
  };

  window.onresize = function() { $scope.$apply(); };
}]);
