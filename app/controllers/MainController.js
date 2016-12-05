(function(){
  'use strict';

  angular
  	.module('appController')
  	.controller('mainController', mainController)
  	.controller('LeftCtrl', leftCtrl)
    .controller('BasicDemoCtrl', BasicDemoCtrl)
    .controller('PanelDialogCtrl', PanelDialogCtrl);

  function mainController ($scope, $timeout, $mdSidenav, $log, $firebaseArray) {
    var vm = this;

    /* SideNav Menu */
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

    /* Data Kandang */
    var ref = firebase.database().ref().child('kandang').child('g');
    vm.data = $firebaseArray(ref);

    vm.color = function (a) {
      if (a < 19 || a > 30) 
        return 'red';
      else 
        return 'green';
    };

    /* Data Sensor */
    var ref2 = firebase.database().ref().child('kandang').child('so');
    vm.data2 = $firebaseArray(ref2);

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

  /* Menu Dialog Ubah Data Kandang */
  function BasicDemoCtrl($mdPanel) {
    this._mdPanel = $mdPanel;
    this.disableParentScroll = false;
  }

  BasicDemoCtrl.prototype.showDialog = function() {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: this.disableParentScroll,
      templateUrl: 'app/views/partials/panel.html',
      hasBackdrop: true,
      panelClass: 'demo-dialog-example',
      position: position,
      trapFocus: true,
      zIndex: 150,
      clickOutsideToClose: true,
      escapeToClose: true,
      focusOnOpen: true
    };

    this._mdPanel.open(config);
  };

  function PanelDialogCtrl(mdPanelRef) {
    this._mdPanelRef = mdPanelRef;
  }

  PanelDialogCtrl.prototype.closeDialog = function() {
    var panelRef = this._mdPanelRef;

    panelRef && panelRef.close().then(function() {
      angular.element(document.querySelector('md-grid-tile')).focus();
      panelRef.destroy();
    });
  };

})();
