(function(){
  'use strict';

  angular
    .module('appController')
    .controller('fcrController', fcrController);

  function fcrController() {
    var vm = this;
    var tglPakan  = [];
    var tglBerat  = [];
    var beratAyam = [];
    var pakanAyam = [];

    var beratCount = 0;
    var pakanCount = 0;

    var beratRef = firebase.database().ref('percobaangrafik/lantai1/grid');
    beratRef.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          childSnapshot.forEach(function (childSnapshot){
            tglBerat.push(childSnapshot.key);
            var berat = childSnapshot.val().berat;
            beratAyam.push(berat);
            beratCount++;
          });
        });
      });

    var pakanRef = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');
    pakanRef.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          tglPakan.push(childSnapshot.key);
          var pakan = childSnapshot.val().pakan;
          pakanAyam.push(pakan);
          pakanCount++;
        });

        var fcr = (pakanAyam[pakanCount-1]*50) / (beratAyam[pakanCount-1] / 100);
        vm.fcr = fcr.toFixed(2);
      });

    

    /*vm.labels = tglPakan;
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
    };*/
    
  }

})();
