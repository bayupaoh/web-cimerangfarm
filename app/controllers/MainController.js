(function(){
  'use strict';

  angular
    .module('appController')
    .controller('mainController', mainController)
    .controller('LeftCtrl', leftCtrl);

  function mainController ($scope, $timeout, $mdSidenav, $log) {
    var vm = this;

    /* SideNav Menu */
    vm.menuItems = [
      {
        name: 'Dashboard',
        icon: 'dashboard',
        sref: 'dashboard'
      },
      {
        name: 'Input Data',
        icon: 'create',
        sref: 'input-data'
      }

    /*  {
        name: 'Daftar',
        icon: 'person',
        sref: 'daftar'
      },
      {
        name: 'Kandang',
        icon: 'view_module',
        sref: 'kandang'
      },
      {
        name: 'Sensor',
        icon: 'settings',
        sref: 'sensor'
      } */
    ];
   
    /* md-sidenav */
    $scope.toggleLeft = buildDelayedToggler('left');

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
  }
  
  function leftCtrl ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  }

})();