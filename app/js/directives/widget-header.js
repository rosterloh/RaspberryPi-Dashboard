/**
 * @ngdoc directive
 * @name ng.directive:rdWidgetHeader
 * @description
 * Widget Header Directive
 */
DashModule
.directive('rdWidgetHeader', [
function() {
	var directive = {
    requires: '^rdWidget',
    scope: {
      title: '@',
      icon: '@'
    },
	transclude: true,
    template: '<div class="widget-header"> <i class="fa" ng-class="icon"></i> {{title}} <div class="pull-right" ng-transclude></div></div>',
    restrict: 'E'
  };
  return directive;
}]);
