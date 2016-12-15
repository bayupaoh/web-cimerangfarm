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
        sref: 'dashboard'
      },
      {
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
      }
    ];

    /* Data Kandang */
    var ref = firebase.database().ref().child('percobaantampilkandang').child('g');
    vm.data = $firebaseArray(ref);

    vm.color = function (b,d) {
      if (b >= 20 || (d < 60 || d > 70)) 
        return 'red';
      else 
        return 'green';
    };

    vm.tableColor = function (a) {
      if (a > 28) 
        return 'table-red';
      else 
        return 'table-green';
    };

    /* Data Sensor */
    var ref2 = firebase.database().ref().child('percobaantampilkandang').child('s');
    vm.data2 = $firebaseArray(ref2);

    /* Grafik Produktivitas Ternak */  
    var x_axis = [];
    var rerataBerat = [];
    var beratIdeal = [0, 0, 0, 0, 0, 0, 160, 200, 240, 280, 320, 350, 390, 430, 490, 550,
                      610, 670, 730, 780, 840, 920, 1000, 1080, 1160, 1240, 1320, 1400, 1490, 1570,
                      1660, 1750, 1840, 1930, 2020, 2100, 2190, 2280, 2370, 2450, 2540, 2630];
    var ref4 = firebase.database().ref().child('percobaangrafik').child('lantai1').child('grid');

    /* Hitung Rata-Rata Berat Ayam*/
    ref4.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var sum = 0;
          var count = 0;
          x_axis.push(childSnapshot.key);
          childSnapshot.forEach(function(childSnapshot) {
            var snap = childSnapshot.val().berat;
            sum += snap;
            count += 1;
          });
          rerataBerat.push((sum/count).toFixed(2));
        });
      });

    vm.labels = x_axis;
    vm.datas = [rerataBerat, beratIdeal];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#98fb98', '#ff6384'];
    vm.datasetOverride = [
      {
        label: 'Berat Aktual',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Berat Ideal',
        borderWidth: 3,
        type: 'line'
      }
    ];
    vm.options = { legend: { display: true } };


    /* Grafik Akumulasi Kematian Ayam */  
    var mor_x_axis = [];
    var ayamMati = [];
    var mortalityStd = [19, 11, 12, 23, 25, 17, 18, 20, 20, 23, 15, 13, 14, 18, 
                     14, 15, 10, 7, 13, 15, 9, 10, 10, 13, 20, 37, 35, 18, 
                     14, 16, 10, 24, 11, 13, 11, 20];

    var pakanHarian = [];
    var ref5 = firebase.database().ref().child('percobaangrafik').child('lantai1').child('feedandmortality');

    ref5.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          mor_x_axis.push(childSnapshot.key);
          var mortality = childSnapshot.val().ayamMati;
          var feed = childSnapshot.val().pakan;
          ayamMati.push(mortality);
          pakanHarian.push(feed);
        });
      });

    /* Grafik Mortality */
    vm.mor_labels = mor_x_axis;
    vm.mor_datas = [ayamMati, mortalityStd];
    vm.mor_onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.mor_colors = ['#98fb98', '#ff6384'];
    vm.mor_datasetOverride = [
      {
        label: 'Berat Aktual',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Berat Ideal',
        borderWidth: 3,
        type: 'line'
      }
    ];
    vm.mor_options = { legend: { display: true } };

    /* Grafik Pakan */
    vm.feed_labels = mor_x_axis;
    vm.feed_datas = [pakanHarian];
    vm.feed_onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.feed_colors = ['#98fb98'];
    vm.feed_datasetOverride = [
      {
        label: 'Pakan Harian',
        borderWidth: 3,
        type: 'line'
      }
    ];
    vm.feed_options = { legend: { display: true } };

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
      controllerAs: 'vm',
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