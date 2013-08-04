'use strict';

describe('Controller: ViewappCtrl', function () {

  // load the controller's module
  beforeEach(module('VisforApp'));

  var ViewappCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewappCtrl = $controller('ViewappCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
