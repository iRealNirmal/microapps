'use strict';

/**
 * @ngdoc service
 * @name microappsApp.checkout
 * @description
 * # checkout
 * Service in the microappsApp.
 */
angular.module('microappsApp')
  .service('checkout', function ($http,$resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var url = 'http://www.doma1n.tk/php/checkout.php',data;
    return $resource(url,{}, {
        put:{
          method: 'POST',
          data: JSON.stringify(data)
        },
        create: {
            method: 'POST'
        }
    });
  });
