(function(){
  'use strict';

  angular
    .module('appController')
    .controller('eefL2Controller', eefL2Controller);

  function eefL2Controller() {
    var vm = this;
    var tanggal   = [];
    var nilaiEef  = [];
    var standarEef = [
      0, 0, 0, 0, 0, 0, 271, 282, 288, 291, 291, 290, 288, 285, 294, 301, 305, 308, 310, 311, 310, 317, 322, 326, 329,
      331, 333, 334, 337, 339, 341, 342, 343, 343, 343, 343, 343, 342, 341, 340, 339, 337
    ];

    var refSetting = firebase.database().ref().child('setting');
    var refPakan = firebase.database().ref('grafik/kandang2/feedandmortality');

    refSetting.on("value", function (snapshot) {
        vm.totalAyam = snapshot.val().jumlahAwalAyamLantai2;
        vm.tglMulai = snapshot.val().tanggalMulaiLantai2;

    });

    refPakan.once("value")
    .then(function (snapshot) {
      var totalPakan = 0;
      var ayamHidup  = 0;
      var ayamMati   = 0;
      var percentMortality  = 0;
      var rataBerat  = 0;

      snapshot.forEach(function (childSnapshot) {
        var tgl = childSnapshot.key;
        var berat = childSnapshot.val().berat;
        var pakan = childSnapshot.val().pakan;
        var mati  = childSnapshot.val().ayamMati;

        var date = vm.tglMulai;
        var dateL2 = tgl;

        var timestamp = new Date(date).getTime();
        var timestampL2 = new Date(dateL2).getTime();

        var diff = timestampL2 - timestamp;

        var newDate = new Date(diff);

        vm.date = newDate.getDate() - 1;

        var date = childSnapshot.key;
        var split = date.split('-');

        var push = split[2] + '-' + split[1] + '-' + split[0];

        if (berat != null) {
          tanggal.push(push);
        }

        if (pakan == null) {
          pakan = 0;
        }

        if (mati == null) {
          mati = 0;
        }
        
        rataBerat = (childSnapshot.val().berat)/1000;
        totalPakan += pakan * 50;
        ayamMati += mati;

        // Hitung FCR
        ayamHidup = vm.totalAyam - ayamMati;

        if (rataBerat == 0) {
          var fcr = 0; 
        } else {
          var fcr = totalPakan / (ayamHidup * rataBerat);
        }

        // Hitung EEF
        percentMortality = (ayamMati / vm.totalAyam)*100;  

        if (fcr == 0) {
          var eef = 0
        } else {
          var eef = ((100 - percentMortality) * rataBerat * 100) / (fcr * vm.date);
        }        

        nilaiEef.push(eef.toFixed(2));
      })
    });

    vm.labels = tanggal;
    vm.data = [nilaiEef, standarEef];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#ff6384', '#98fb98'];
    vm.datasetOverride = [
      {
        label: 'Nilai IP Aktual',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Nilai IP Standar',
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
