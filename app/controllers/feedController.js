(function(){
  'use strict';

  angular
    .module('appController')
    .controller('feedController', feedController);

  function feedController() {
    var vm = this;
    var tanggal = [];
    var pakanHarian = [];
    var pakanStandar = [
      250, 300, 350, 450, 500, 550, 600, 700, 800, 900, 1050, 
      1150, 1250, 1400, 1500, 1650, 1750, 1900, 2000, 2150, 
      2250, 2350, 2500, 2600, 2700, 2800, 2900, 3000
    ];

    var ref = firebase.database().ref().child('percobaangrafik').child('lantai1').child('feedandmortality');
    ref.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          tanggal.push(childSnapshot.key);
          var pakan = childSnapshot.val().pakan;
          pakanHarian.push(pakan);
        });
      });

    vm.labels = tanggal;
    vm.data = [pakanHarian, pakanStandar];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#98fb98', '#ff6384'];
    vm.datasetOverride = [
      {
        label: 'Pakan Harian',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Pakan Standar',
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
