(function(){
  'use strict';

  angular
    .module('appController')
    .controller('mortalityController', mortalityController);

  function mortalityController() {
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
        vm.totalAyam = snapshot.val().jumlahAwalAyamLantai1;
      });  

    var refMortality = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');
    refMortality.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          tanggal.push(childSnapshot.key);
          var ayamMati = childSnapshot.val().ayamMati;
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
