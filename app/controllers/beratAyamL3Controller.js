(function(){
  'use strict';

  angular
    .module('appController')
    .controller('beratAyamL3Controller', beratAyamL3Controller);

  function beratAyamL3Controller() {
    var vm = this;
    var tanggal = [];
    var beratAktual = [];
    var beratIdeal = [0, 0, 0, 0, 0, 0, 160, 200, 240, 280, 320, 350, 390, 430, 490, 550,
                      610, 670, 730, 780, 840, 920, 1000, 1080, 1160, 1240, 1320, 1400, 1490, 1570,
                      1660, 1750, 1840, 1930, 2020, 2100, 2190, 2280, 2370, 2450, 2540, 2630];

    var ref = firebase.database().ref('grafik/kandang3/grid');

    /* Hitung Rata-Rata Berat Ayam*/
    ref.once('value')
    .then(function (snapshot) {

      snapshot.forEach(function (childSnapshot) {          
        var date = childSnapshot.key;
        var split = date.split('-');

        var tgl = split[2] + '-' + split[1] + '-' + split[0];

        tanggal.push(tgl);

        /* Hitung Total Berat Ayam per Hari */
        var sum = 0;
        var count = 0;
        childSnapshot.forEach(function (childSnapshot) {
          var berat = childSnapshot.val().berat * 3;

          if (berat > 0) {
            sum += berat;
            count ++;

          }
        });

        if (count == 0) {
          beratAktual.push(0);
        } else {
          beratAktual.push((sum/count).toFixed(2));
        }
        
      });

    });

    vm.labels = tanggal;
    vm.data = [beratAktual, beratIdeal];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.colors = ['#ff6384', '#98fb98'];
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
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'gram'
          }
        }]
      }    
    };
    
  }

})();
