/**
 * @ngdoc directive
 * @name ng.directive:rdLoading
 * @description
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
DashModule
.directive('rdLoading', [
function() {
  var directive = {
    restrict: 'AE',
    template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
      
  };
  return directive;
}]);