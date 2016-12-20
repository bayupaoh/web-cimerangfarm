(function(){
  'use strict';

  angular
    .module('appController')
    .controller('fcrController', fcrController);

  function fcrController() {
    var vm = this;
    var tglBerat = [];
    var tglPakan = [];
    var beratAyam = [];
    var pakanAyam = [];
    

    var pakanRef = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');
    ref.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          tglPakan.push(childSnapshot.key);
          var pakan = childSnapshot.val().pakan;
          pakanAyam.push(pakan);
        });
      });

    var beratRef = firebase.database().ref('percobaangrafik/lantai1/grid');
    ref.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          tglBerat.push(childSnapshot.key);
          var berat = childSnapshot.val().berat;
          beratAyam.push(pakan);
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
        label: 'Jumlah Ayam Mati',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Standar Kematian Ayam',
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
