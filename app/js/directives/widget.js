/**
 * @ngdoc directive
 * @name ng.directive:rdWidget
 * @description
 * Widget Directive
 */
DashModule
.directive('rdWidget', [
function() {
  var directive = {
		transclude: true,
    template: '<div class="widget" ng-transclude></div>',
    restrict: 'EA'
  };
  return directive;

  function link(scope, element, attrs) {
    /* */
  }
}]);