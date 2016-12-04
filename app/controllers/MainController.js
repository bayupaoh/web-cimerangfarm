(function(){
  'use strict';

  angular
  	.module('appController')
  	.controller('mainController', mainController)
  	.controller('LeftCtrl', leftCtrl);

  function mainController ($scope, $timeout, $mdSidenav, $log, $firebaseArray) {
    var vm = this;

    vm.menuItems = [
      {
        name: 'Dashboard',
        icon: 'dashboard',
        sref: '.dashboard'
      },
      {
        name: 'Daftar',
        icon: 'person',
        sref: '.daftar'
      },
      {
        name: 'Kandang',
        icon: 'view_module',
        sref: '.kandang'
      }
    ];

    var ref = firebase.database().ref().child('kandang').child('g');
    vm.data = $firebaseArray(ref);

    vm.color = function (a) {
      if (a < 19 || a > 30) 
        return 'red';
      else 
        return 'green';
    };

    vm.tabs =  [
      {
        title: 'Lantai 1',
        content: 'Kandang Ayam Lantai-1'
      }
    ];
    vm.selectedIndex = 1;    

    vm.addTab = function (title, view) {
      view = view || title + " Content View";
      vm.tabs.push ({title: title, content: view, disabled: false});
    };

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
