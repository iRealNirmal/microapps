'use strict';

/**
 * @ngdoc overview
 * @name microappsApp
 * @description
 * # microappsApp
 *
 * Main module of the application.
 */
angular
  .module('microappsApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',//bootstrap angular plugin
    'ngValidate'//for form validation
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/thanks', {
        templateUrl: 'views/thanks.html',
        controller: 'ThanksCtrl',
        controllerAs: 'thanks'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

//added custom validator for amout
$().ready(function() {

    $.validator.addMethod("lessThan",
        function(value, element, param) {
            var i = parseFloat(value);
            var j = parseFloat(param);
            return (i < j) ? true : false;
        }
    );

});
//added custom validator for text only
jQuery.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please"); 