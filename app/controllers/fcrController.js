(function(){
  'use strict';

  angular
    .module('appController')
    .controller('fcrController', fcrController);

  function fcrController() {
    var vm = this;
    var tanggal   = [];
    var nilaiFcr  = [];
    var standarFcr = [
      0, 0, 0, 0, 0, 0, 0.856, 0.885, 0.914, 0.943, 0.972, 1.001, 1.030, 1.059, 1.088, 1.117, 1.145, 1.174, 1.203, 1.232, 
      1.261, 1.287, 1.314, 1.340, 1.367, 1.393, 1.419, 1.446, 1.470, 1.493, 1.517, 1.540, 1.564, 1.587, 1.611, 1.632, 1.653, 
      1.675, 1.696, 1.717, 1.738, 1.760, 1.780, 1.8, 1.821, 1.841, 1.861, 1.881, 1.902, 1.922, 1.943, 1.963, 1.984, 2.004
    ];

    var refSetting = firebase.database().ref().child('setting');
    var refPakan = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');

    refSetting.on("value", function (snapshot) {
        vm.totalAyam = snapshot.val().jumlahAwalAyamLantai1;
    });

    refPakan.once("value")
    .then(function (snapshot) {
      var totalPakan = 0;
      var ayamMati   = 0;
      var ayamHidup  = 0;
      var rataBerat  = 0;

      snapshot.forEach(function (childSnapshot) {
        var tgl = childSnapshot.key;
        var pakan = childSnapshot.val().pakan;
        var mati  = childSnapshot.val().ayamMati;

        if (pakan == null) {
          pakan = 0;
        }

        if (mati == null) {
          mati = 0;
        }
        
        rataBerat = (childSnapshot.val().berat)/1000;
        totalPakan += pakan * 50;
        ayamMati += mati;

        ayamHidup = vm.totalAyam - ayamMati;

        if (rataBerat == 0) {
          var fcr = 0; 
        } else {
          var fcr = totalPakan / (ayamHidup * rataBerat);
        }

        tanggal.push(tgl);
        nilaiFcr.push(fcr.toFixed(2));
      })
    });

    vm.labels = tanggal;
    vm.data = [nilaiFcr, standarFcr];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#ff6384', '#98fb98'];
    vm.datasetOverride = [
      {
        label: 'Nilai FCR',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'FCR Standar',
        borderWidth: 3,
        type: 'line'
      }
    ];
    vm.options = { 
      legend: { 
        display: true 
      } 
    };
    
  }

})();
