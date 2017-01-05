(function(){
  'use strict';

  angular
    .module('appController')
    .controller('settingController', settingController)
    .controller('BasicDemoCtrl', BasicDemoCtrl)
    .controller('PanelDialogCtrl', PanelDialogCtrl);

  function settingController($firebaseArray) {
    var vm = this;

    var refPanen   = firebase.database().ref('panen/lantai1');
    var refPanenL2 = firebase.database().ref('panen/lantai2');
    var refSetting = firebase.database().ref('setting');

    const d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    var now = date + '-' + month + '-' + year;
    vm.now = now;

    vm.data = $firebaseArray(refPanen);
    vm.data2 = $firebaseArray(refPanenL2);
   
    vm.onTabChanges = function (key) {
      vm.lantai = key;
    }

    vm.panenLantai1 = function() {
      var updates = {};
      updates['/setting/panenLantai1'] = true;
      updates['/panen/lantai1/' + now + '/ayamPanen'] = vm.data.ayamPanen;

      return firebase.database().ref().update(updates);
    };

    vm.panenLantai2 = function() {
      var updates = {};
      updates['/setting/panenLantai2'] = true;
      updates['/panen/lantai2/' + now + '/ayamPanen'] = vm.data.ayamPanen;

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

    refSetting.on("value", function (snapshot) {
        vm.setAyamLantai1 = snapshot.val().jumlahAwalAyamLantai1;
        vm.setAyamLantai2 = snapshot.val().jumlahAwalAyamLantai2;
        vm.setPanenLantai1 = snapshot.val().panenLantai1;
        vm.setPanenLantai2 = snapshot.val().panenLantai2;
        vm.setMulaiLantai1 = snapshot.val().tanggalMulaiLantai1;
        vm.setMulaiLantai2 = snapshot.val().tanggalMulaiLantai2;
      });
  }

 /* Menu Dialog Tambah Data */
  function BasicDemoCtrl($mdPanel) {
    this._mdPanel = $mdPanel;
    this.disableParentScroll = false;
  }

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