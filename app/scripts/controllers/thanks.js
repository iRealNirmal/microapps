'use strict';

/**
 * @ngdoc function
 * @name microappsApp.controller:ThanksCtrl
 * @description
 * # ThanksCtrl
 * Controller of the microappsApp
 */
angular.module('microappsApp')
  .controller('ThanksCtrl', function ($scope,$location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var timeDiff=()=>{
      var d1 = new Date(localStorage.getItem("time"));
      var d2 =new Date();
      var diff =  Math.abs(d1 - d2);
      if(Math.floor((diff/1000)/60)>60){
      	localStorage.clear();
        return false;
      }else{
        return true;
      }
    }
    if(timeDiff()){
    	$scope.donated=true;
    }
    var session = localStorage.getItem('session');
    if(session!="yes"){
    	$location.path("/home")
    }
  });
