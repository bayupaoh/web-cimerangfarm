(function(){
  'use strict';

  angular
    .module('appController')
    .controller('mortalityL3Controller', mortalityL3Controller);

  function mortalityL3Controller() {
    var vm = this;
    var tanggal = [];
    var mortalitasHarian = [];
    var mortalitasTotal  = [];
    var mortalitasBatas  = [];

    var total = 0;
    var count = 0;
    var batasCount = 0;

    var refSetting = firebase.database().ref().child('setting');  
    refSetting.on("value", function (snapshot) {
        vm.totalAyam = snapshot.val().jumlahAwalAyamLantai3;
      });

    var refMortality = firebase.database().ref('grafik/kandang3/feedandmortality');
    refMortality.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var date = childSnapshot.key;
          var split = date.split('-');

          var tgl = split[2] + '-' + split[1] + '-' + split[0];
        
          var ayamMati = childSnapshot.val().ayamMati;

          if (ayamMati != null) {
            tanggal.push(tgl);
          }
          
          mortalitasHarian.push(ayamMati);
          count++;
          total += ayamMati;
          mortalitasTotal.push(total);
        });

        for (var i=0; i <= count-1; i++) {
          var batasCount = (vm.totalAyam * 2)/100;
          mortalitasBatas.push(batasCount);
        }
      });

    vm.labels = tanggal;
    vm.data = [mortalitasHarian, mortalitasTotal, mortalitasBatas];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#ff6384', '#FFC107', '#98fb98'];
    vm.datasetOverride = [
      {
        label: 'Mortalitas Harian',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Mortalitas Total',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Batas',
        borderWidth: 3,
        type: 'line'
      }
    ];
    vm.options = { 
      legend: { 
        display: true 
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'ekor'
          }
        }]
      } 
    };
    
  }

})();