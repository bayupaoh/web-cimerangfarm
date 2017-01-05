(function(){
  'use strict';

  angular
    .module('appController')
    .controller('adminController', adminController)
    .controller('BasicDemoCtrl', BasicDemoCtrl)
    .controller('PanelDialogCtrl', PanelDialogCtrl);

  function adminController($firebaseArray) {
    var vm = this;
    var ref = firebase.database().ref().child('percobaangrafik').child('lantai1').child('feedandmortality');
    var ref2 = firebase.database().ref().child('percobaangrafik').child('lantai2').child('feedandmortality');
    var refPanen   = firebase.database().ref('panen/lantai1');
    var refPanenL2 = firebase.database().ref('panen/lantai2');
    var refSetting = firebase.database().ref('setting');

    refSetting.on("value", function (snapshot) {
      vm.setAyamLantai1 = snapshot.val().jumlahAwalAyamLantai1;
      vm.setAyamLantai2 = snapshot.val().jumlahAwalAyamLantai2;
      vm.setPanenLantai1 = snapshot.val().panenLantai1;
      vm.setPanenLantai2 = snapshot.val().panenLantai2;
      vm.setMulaiLantai1 = snapshot.val().tanggalMulaiLantai1;
      vm.setMulaiLantai2 = snapshot.val().tanggalMulaiLantai2;
    });

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    var now = year + '-' + month + '-' + date;
    vm.now = now;

    vm.tanggal = new Date();

      var dateL1 = vm.setMulaiLantai1;
      var dateL2 = vm.setMulaiLantai2;

      var timestamp = new Date(vm.tanggal).getTime();
      var timestampL1 = new Date(dateL1).getTime();
      var timestampL2 = new Date(dateL2).getTime();

      var diffL1 = timestamp - timestampL1;
      var diffL2 = timestamp - timestampL2;

      var newDateL1 = new Date(diffL1);
      var newDateL2 = new Date(diffL2);

      vm.dateLantai1 = newDateL1.getDate() - 1;
      vm.dateLantai2 = newDateL2.getDate() - 1;

    vm.change = function () {
      var dateL1 = vm.setMulaiLantai1;
      var dateL2 = vm.setMulaiLantai2;

      var timestamp = new Date(vm.tanggal).getTime();
      var timestampL1 = new Date(dateL1).getTime();
      var timestampL2 = new Date(dateL2).getTime();

      var diffL1 = timestamp - timestampL1;
      var diffL2 = timestamp - timestampL2;

      var newDateL1 = new Date(diffL1);
      var newDateL2 = new Date(diffL2);

      vm.dateLantai1 = newDateL1.getDate() - 1;
      vm.dateLantai2 = newDateL2.getDate() - 1;
    }    

    vm.data = $firebaseArray(ref);
    vm.data2 = $firebaseArray(ref2);

    vm.panen = $firebaseArray(refPanen);
    vm.panen2 = $firebaseArray(refPanenL2);

    vm.onTabChanges = function (key) {
      vm.lantai = key;
    }

    vm.tambahData = function () {
      var tanggal = vm.tanggal;

      var dates = new Date(tanggal);
      var yyyy  = dates.getFullYear();
      var mm  = dates.getMonth() + 1;
      var dd  = dates.getDate();

      if (mm < 10) {
        mm = '0' + mm;
      }

      if (dd < 10) {
        dd = '0' + dd;
      }

      var tgl = yyyy + '-' + mm + '-' + dd; 

      var updates = {};
        updates['/percobaangrafik/lantai1/feedandmortality/' + tgl + '/ayamMati'] = vm.data.ayamMati;
        updates['/percobaangrafik/lantai1/feedandmortality/' + tgl + '/pakan'] = vm.data.pakan;
        firebase.database().ref().update(updates);
    };

    vm.tambahData2 = function () {
      var tanggal = vm.tanggal;

      var dates = new Date(tanggal);
      var yyyy  = dates.getFullYear();
      var mm  = dates.getMonth() + 1;
      var dd  = dates.getDate();

      if (mm < 10) {
        mm = '0' + mm;
      }

      if (dd < 10) {
        dd = '0' + dd;
      }

      var tgl = yyyy + '-' + mm + '-' + dd; 

      var updates = {};
        updates['/percobaangrafik/lantai2/feedandmortality/' + tgl + '/ayamMati'] = vm.data.ayamMati;
        updates['/percobaangrafik/lantai2/feedandmortality/' + tgl + '/pakan'] = vm.data.pakan;
        firebase.database().ref().update(updates);
    };

    vm.hapusData = function (key) {
      var updates = {};
        updates['/percobaangrafik/lantai1/feedandmortality/' + now + '/ayamMati'] = 0;
        updates['/percobaangrafik/lantai1/feedandmortality/' + now + '/pakan'] = 0;
        firebase.database().ref().update(updates);
    };

    vm.hapusData2 = function (key) {
      var updates = {};
        updates['/percobaangrafik/lantai2/feedandmortality/' + now + '/ayamMati'] = 0;
        updates['/percobaangrafik/lantai2/feedandmortality/' + now + '/pakan'] = 0;
        firebase.database().ref().update(updates);
    };

    vm.panenLantai1 = function() {
      var tanggal = vm.tanggal;

      var dates = new Date(tanggal);
      var yyyy  = dates.getFullYear();
      var mm  = dates.getMonth() + 1;
      var dd  = dates.getDate();

      if (mm < 10) {
        mm = '0' + mm;
      }

      if (dd < 10) {
        dd = '0' + dd;
      }

      var tgl = yyyy + '-' + mm + '-' + dd; 

      var updates = {};
      updates['/setting/panenLantai1'] = true;
      updates['panen/lantai1/' + tgl + '/ayamPanen'] = vm.data.ayamPanen;

      return firebase.database().ref().update(updates);
    };

    vm.panenLantai2 = function() {
      var tanggal = vm.tanggal;

      var dates = new Date(tanggal);
      var yyyy  = dates.getFullYear();
      var mm  = dates.getMonth() + 1;
      var dd  = dates.getDate();

      if (mm < 10) {
        mm = '0' + mm;
      }

      if (dd < 10) {
        dd = '0' + dd;
      }

      var tgl = yyyy + '-' + mm + '-' + dd; 

      var updates = {};
      updates['/setting/panenLantai2'] = true;
      updates['panen/lantai2/' + tgl + '/ayamPanen'] = vm.data.ayamPanen;

      return firebase.database().ref().update(updates);
    };

    vm.mulaiLantai1 = function() {
      var updates = {};
      updates['/setting/panenLantai1'] = false;

      refPanen.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          refPanen.child(key).remove();
        })
      });

      return firebase.database().ref().update(updates);
    };

    vm.mulaiLantai2 = function() {
      var updates = {};
      updates['/setting/panenLantai2'] = false;

      refPanenL2.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          refPanenL2.child(key).remove();
        })
      });

      return firebase.database().ref().update(updates);
    };
    
  }

  /* Menu Dialog Tambah Data */
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

  BasicDemoCtrl.prototype.showDialog2 = function() {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: this.disableParentScroll,
      templateUrl: 'app/views/partials/panel2.html',
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

  BasicDemoCtrl.prototype.showDialogPanen1 = function() {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: this.disableParentScroll,
      templateUrl: 'app/views/partials/panen1.html',
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

  BasicDemoCtrl.prototype.showDialogPanen2 = function() {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: this.disableParentScroll,
      templateUrl: 'app/views/partials/panen2.html',
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

  BasicDemoCtrl.prototype.showDialogMulai1 = function() {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: this.disableParentScroll,
      templateUrl: 'app/views/partials/mulai1.html',
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

  BasicDemoCtrl.prototype.showDialogMulai2 = function() {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: this.disableParentScroll,
      templateUrl: 'app/views/partials/mulai2.html',
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
