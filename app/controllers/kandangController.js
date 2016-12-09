(function(){
  'use strict';

  angular
    .module('appController')
    .controller('kandangController', kandangController);

  function kandangController($firebaseArray) {
    var vm = this;
    var ref = firebase.database().ref().child('percobaantampilkandang').child('g');
    vm.data = $firebaseArray(ref);

    vm.color = function (a) {
      if (a < 19 || a > 30) 
        return 'red';
      else 
        return 'green';
    };

    /* Data Sensor */
    var ref2 = firebase.database().ref().child('percobaantampilkandang').child('so');
    vm.data2 = $firebaseArray(ref2);

    var ref3 = firebase.database().ref().child('percobaantampilkandang').child('si');
    vm.data3 = $firebaseArray(ref3);

    /* Grafik Produktivitas Ternak */  
    var x_axis = [];
    var rerataBerat = [];
    var ref4 = firebase.database().ref().child('percobaangrafik').child('lantai1').child('grid');

    /* Hitung Rata-Rata Berat Ayam*/
    ref4.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var sum = 0;
          var count = 0;
          x_axis.push(childSnapshot.key);
          childSnapshot.forEach(function(childSnapshot) {
            var snap = childSnapshot.val().berat;
            sum += snap;
            count += 1;
          });
          rerataBerat.push((sum/count).toFixed(2));
        });
      });

    vm.labels = x_axis;
    vm.series = ['Rata-Rata Berat Ayam'];
    vm.datas = [rerataBerat];
    vm.onClick = function (points, evt) {
      console.log(points, evt);
    };
    vm.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    vm.options = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ]
      }
    };
    
  }

})();
