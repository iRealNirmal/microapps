'use strict';

describe('Controller: ThanksCtrl', function () {

  // load the controller's module
  beforeEach(module('microappsApp'));

  var ThanksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThanksCtrl = $controller('ThanksCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ThanksCtrl.awesomeThings.length).toBe(3);
  });
});
