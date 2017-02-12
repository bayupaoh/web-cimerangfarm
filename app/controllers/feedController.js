(function(){
  'use strict';

  angular
    .module('appController')
    .controller('feedController', feedController);

  function feedController() {
    var vm = this;
    var tanggal = [];
    var pakanHarian = [];
    var pakanTotal = [];
    var pakanStandar = [
      5, 6, 7, 9, 10, 11, 12, 14, 16, 18, 21, 23, 25, 28, 30,
      33, 35, 38, 40, 43, 45, 47, 50, 52, 54, 56, 58, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60
    ];

    var total = 0;

    var ref = firebase.database().ref().child('grafik').child('kandang1').child('feedandmortality');
    ref.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var date = childSnapshot.key;
          var split = date.split('-');

          var tgl = split[2] + '-' + split[1] + '-' + split[0];
          
          var pakan = childSnapshot.val().pakan;

          total += pakan;

          if (pakan != null) {
            tanggal.push(tgl);
          }
          
          pakanHarian.push(pakan);
          pakanTotal.push(total);
        });
      });

    vm.labels = tanggal;
    vm.data = [pakanHarian, pakanTotal, pakanStandar];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#ff6384', '#FFC107', '#98fb98'];
    vm.datasetOverride = [
      {
        label: 'Pakan Harian',
        borderWidth: 3,
        type: 'line'
      },
      {
        label: 'Pakan Total',
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
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'karung'
          }
        }]
      } 
    };
    
  }

})();
