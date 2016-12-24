(function(){
  'use strict';

  angular
    .module('appController')
    .controller('fcrL2Controller', fcrL2Controller);

  function fcrL2Controller() {
    var vm = this;
    var tglPakan  = [];
    var tglBerat  = [];
    var beratAyam = [];
    var pakanAyam = [];
    var nilaiFcr  = [];
    var standarFcr = [
      0, 0, 0, 0, 0, 0, 0.856, 0.885, 0.914, 0.943, 0.972, 1.001, 1.030, 1.059, 1.088, 1.117, 1.145, 1.174, 1.203, 1.232, 
      1.261, 1.287, 1.314, 1.340, 1.367, 1.393, 1.419, 1.446, 1.470, 1.493, 1.517, 1.540, 1.564, 1.587, 1.611, 1.632, 1.653, 
      1.675, 1.696, 1.717, 1.738, 1.760, 1.780, 1.8, 1.821, 1.841, 1.861, 1.881, 1.902, 1.922, 1.943, 1.963, 1.984, 2.004
    ];

    var beratCount = 0;
    var pakanCount = 0;
    var totalPakan = 0;

    var beratRef = firebase.database().ref('percobaangrafik/lantai2/grid');
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

    var pakanRef = firebase.database().ref('percobaangrafik/lantai2/feedandmortality');
    pakanRef.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          tglPakan.push(childSnapshot.key);
          var pakan = childSnapshot.val().pakan;
          totalPakan += pakan;
          pakanAyam.push(totalPakan);
          pakanCount++;
        });

        var fcr = 0;

        for (var i = 0; i <= pakanCount-1; i++) {
          fcr = (pakanAyam[i]) / (beratAyam[i]);
          nilaiFcr.push(fcr.toFixed(3)); 
        }       
      });

    vm.labels = tglPakan;
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
