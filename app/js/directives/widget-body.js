/**
 * @ngdoc directive
 * @name ng.directive:rdWidgetBody
 * @description
 * Widget Body Directive
 */
DashModule
.directive('rdWidgetBody', [
function() {
  var directive = {
    requires: '^rdWidget',
    scope: {
      loading: '@?',
      classes: '@?'
    },
	transclude: true,
    template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
    restrict: 'E'
  };
  return directive;
}]);