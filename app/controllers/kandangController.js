(function(){
  'use strict';

  angular
    .module('appController')
    .controller('kandangController', kandangController)
    .filter('errFilter', function () {
      return function (input) {
        if ((input < 20 || input > 40) || input.match(/.*er/))
          return 'ERROR';
        else
          return input + ' C';
      }
    });
    

  function kandangController($firebaseArray) {
    var vm = this;
    var gridRef = firebase.database().ref().child('kandang').child('g');
    var sensorRef = firebase.database().ref().child('kandang').child('s');

    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();

    var now = year + '-' + month + '-' + date;
    vm.day = date;

    gridRef.once("value")
      .then(function (snapshot) {

        var totalAmmonia = 0;
        var totalHumidity = 0;
        var totalSuhu = 0;
        var count = 0;
        snapshot.forEach(function (childSnapshot) {
            var ammonia = childSnapshot.val().b;
            var humidity = childSnapshot.val().c;
            var suhu = childSnapshot.val().d;

            totalAmmonia += parseInt(ammonia);
            totalHumidity += parseInt(humidity);
            totalSuhu += parseInt(suhu);
            count++;
            console.log(totalSuhu, count);
        });

        vm.rerataAmmonia = (totalAmmonia / count).toFixed(2);
        vm.rerataHumidity = (totalHumidity / count).toFixed(2);
        vm.rerataSuhu = totalSuhu / count;
      });

    vm.grids = $firebaseArray(gridRef);
    vm.sensor = $firebaseArray(sensorRef);

    vm.ammoniaColor = ammoniaColor;
    vm.temperatureColor = temperatureColor;
    vm.humidityColor = humidityColor;    
    vm.tableColor = tableColor;

    function ammoniaColor (b) {
      if (b > 20)
        return 'indicator-red';
      else 
        return '';
    };

    function humidityColor (c) {
      if (c < 60 || c > 70)
        return 'indicator-red';
      else 
        return '';
    };

    function temperatureColor (d) {
      if (d >= 20 && d <= 40)
        return '';
      else 
        return 'indicator-red';
    };

    function tableColor (a) {
      if (a > 28) 
        return 'sensor-indoor-red';
      else 
        return 'sensor-indoor-green';
    };

  }

})();
