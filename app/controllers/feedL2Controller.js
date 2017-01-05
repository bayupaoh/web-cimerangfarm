(function(){
  'use strict';

  angular
    .module('appController')
    .controller('feedL2Controller', feedL2Controller);

  function feedL2Controller() {
    var vm = this;
    var tanggal = [];
    var pakanHarian = [];
    var pakanStandar = [
      5, 6, 7, 9, 10, 11, 12, 14, 16, 18, 21, 23, 25, 28, 30,
      33, 35, 38, 40, 43, 45, 47, 50, 52, 54, 56, 58, 60
    ];

    var ref = firebase.database().ref().child('percobaangrafik').child('lantai2').child('feedandmortality');
    ref.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var date = childSnapshot.key;
          var split = date.split('-');

          var tgl = split[2] + '-' + split[1] + '-' + split[0];

          tanggal.push(tgl);
        
          var pakan = childSnapshot.val().pakan;
          pakanHarian.push(pakan);
        });
      });

    vm.labels = tanggal;
    vm.data = [pakanHarian, pakanStandar];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#ff6384', '#98fb98'];
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
