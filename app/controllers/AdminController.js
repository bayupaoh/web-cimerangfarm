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

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();

    var now = year + '-' + month + '-' + date;
    vm.now = now;

    vm.data = $firebaseArray(ref);
    vm.data2 = $firebaseArray(ref2);

    vm.onTabChanges = function (key) {
      vm.lantai = key;
    }

    vm.tambahData = function () {
      firebase.database().ref('percobaangrafik/lantai1/feedandmortality/' + now).set({
        ayamMati: vm.data.ayamMati,
        pakan: vm.data.pakan
      })
      .then(function (ref) {
      	window.alert("Data pada tanggal " + now + " berhasil ditambahkan");
      });
    };

    vm.tambahData2 = function () {
      firebase.database().ref('percobaangrafik/lantai2/feedandmortality/' + now).set({
        ayamMati: vm.data.ayamMati,
        pakan: vm.data.pakan
      })
      .then(function (ref) {
        window.alert("Data pada tanggal " + now + " berhasil ditambahkan");
      });
    };

    vm.hapusData = function (key) {
      firebase.database().ref('percobaangrafik/lantai1/feedandmortality/' + key).remove()
      .then(function (ref) {
        window.alert("Data pada tanggal " + key + " telah dihapus");
      });
    };

    vm.hapusData2 = function (key) {
      firebase.database().ref('percobaangrafik/lantai2/feedandmortality/' + key).remove()
      .then(function (ref) {
        window.alert("Data pada tanggal " + key + " telah dihapus");
      });
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
