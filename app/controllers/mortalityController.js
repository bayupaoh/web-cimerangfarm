(function(){
  'use strict';

  angular
    .module('appController')
    .controller('mortalityController', mortalityController);

  function mortalityController() {
    var vm = this;
    var tanggal = [];
    var jumlahAyamMati = [];
    var mortalityStandar = [
      19, 11, 12, 23, 25, 17, 18, 20, 20, 23, 15, 13, 
      14, 18, 14, 15, 10, 7, 13, 15, 9, 10, 10, 13, 20, 
      37, 35, 18, 14, 16, 10, 24, 11, 13, 11, 20
    ];

    var ref = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');
    ref.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          tanggal.push(childSnapshot.key);
          var ayamMati = childSnapshot.val().ayamMati;
          jumlahAyamMati.push(ayamMati);
        });
      });

    vm.labels = tanggal;
    vm.data = [jumlahAyamMati, mortalityStandar];
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
    vm.options = { 
      legend: { 
        display: true 
      } 
    };
    
  }

})();
