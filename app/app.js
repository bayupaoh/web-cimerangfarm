angular
  .module('FarmCimerang', ['ngMaterial', 'ui.router'])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    'use strict';

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard.html'
      })
      .state('peternak', {
        url: '/peternak',
        templateUrl: 'app/views/peternak.html'
      })
      .state('kandang', {
        url: '/kandang',
        templateUrl: 'app/views/kandang.html'
      });

    $urlRouterProvider.otherwise('/dashboard');
  
    $mdThemingProvider
      .theme('default')
      .primaryPalette('amber')
      .accentPalette('red');
  })

  .controller('MainController', function ($scope, $timeout, $mdSidenav, $log) {
    var vm = this;

    vm.selectItem = selectItem;

    function selectItem (item) {
      vm.title = item.name;
      vm.toggleItemsList();
      vm.showSimpleToast(vm.title);
    }

    vm.menuItems = [
      {
        name: 'Dashboard',
        icon: 'dashboard',
        sref: '.dashboard'
      },
      {
        name: 'Peternak',
        icon: 'person',
        sref: '.peternak'
      },
      {
        name: 'Kandang',
        icon: 'view_module',
        sref: '.kandang'
      }
    ];


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
  })

  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  });