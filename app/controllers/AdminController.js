(function(){
  'use strict';

  angular
    .module('appController')
    .controller('adminController', adminController)
    .controller('BasicDemoCtrl', BasicDemoCtrl)
    .controller('PanelDialogCtrl', PanelDialogCtrl);

  function adminController($firebaseArray, $mdDialog, $scope) {
    var refGrafik  = firebase.database().ref('grafik');
    var refKandang = firebase.database().ref('kandangmirror/g');

    $scope.grafik  = $firebaseArray(refGrafik);
    $scope.kandang = $firebaseArray(refKandang);
    $scope.now     = now();

    function now() {
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

      return now;
    }

    $scope.tambahKandang = function() {
      var kandang = 1;
      var jumlah = 0;

      refGrafik.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          kandang += 1;
        })
      });

      refKandang.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          jumlah += 1;
        })
      });

      var updates = {};
      updates['grafik/kandang' + kandang + '/namaKandang'] = $scope.data.namaKandang;
      updates['grafik/kandang' + kandang + '/jmlKolom'] = $scope.data.jumlahKolom;
      updates['grafik/kandang' + kandang + '/setting/jumlahAwalAyamLantai'] = $scope.data.jumlahAyam;
      updates['grafik/kandang' + kandang + '/setting/panenLantai'] = "false";
      updates['grafik/kandang' + kandang + '/setting/tanggalMulaiLantai'] = $scope.now;

      
      for (var i = 1; i <= $scope.data.jumlahGrid; i++) {
        var key = jumlah + i;
        updates['kandangmirror/g/' + key + '/idGrid'] = i;
        updates['kandangmirror/g/' + key + '/idKandang'] = kandang;
        updates['kandangmirror/g/' + key + '/namaKandang'] = $scope.data.namaKandang;
        updates['kandangmirror/g/' + key + '/posisi'] = i;
      }      
    
      return firebase.database().ref().update(updates);
    };

    $scope.ubahGrid = function(id, idGrid, idKandang, namaKandang, posisi, ev) {
      var confirm = $mdDialog.prompt()
        .title('Masukkan No.RFID')
        .placeholder('No. RFID')
        .ariaLabel('No. RFID')
        .targetEvent(ev)
        .ok('Simpan');

      $mdDialog.show(confirm).then(function(result) {
        var updates = {};
      
        refKandang.child(id).remove();
        updates['kandangmirror/g/' + result + '/idGrid'] = idGrid;
        updates['kandangmirror/g/' + result + '/idKandang'] = idKandang;
        updates['kandangmirror/g/' + result + '/namaKandang'] = namaKandang;
        updates['kandangmirror/g/' + result + '/posisi'] = posisi;
        
        return firebase.database().ref().update(updates);
      }, function() {
        console.log('error');
      });
    }
    
  }

  /* Menu Dialog Tambah Data */
  function BasicDemoCtrl($mdPanel) {
    this._mdPanel = $mdPanel;
    this.disableParentScroll = false;
  }

  BasicDemoCtrl.prototype.showDialogTambahKandang = function() {
    var position = this._mdPanel.newPanelPosition()
        .absolute()
        .center();

    var config = {
      attachTo: angular.element(document.body),
      controller: PanelDialogCtrl,
      controllerAs: 'ctrl',
      disableParentScroll: this.disableParentScroll,
      templateUrl: 'app/views/partials/kandang.html',
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
