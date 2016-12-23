(function(){
  'use strict';

  angular
    .module('appController')
    .controller('kandangController', kandangController)
    .filter('filterSuhu', function () {
      return function (input) {

        if (input == null)
          return 0;
        else if ((input < 20 || input > 40) || input.match(/.*er/))
          return 'ERROR';
        else
          return input + ' \xB0C';
      }
    })
    .filter('filterBerat', function () {
      return function (input) {
        if (input == null)
          return 0;
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else
          return input + ' gr';
      }
    })
    .filter('filterAmmonia', function () {
      return function (input) {
        if (input == null)
          return 0;
        else if (input > 40 || input.match(/.*er/))
          return 'ERROR';
        else
          return input + ' ppm';
      }
    })
    .filter('filterAngin', function () {
      return function (input) {
        if (input == null)
          return 0;
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else
          return input + ' km/jam';
      }
    })
    .filter('filterHumidity', function () {
      return function (input) {
        if (input == null)
          return 0;
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else
          return input + ' %';
      }
    }); 

  function kandangController($firebaseArray) {
    var vm = this;

    var refGrid = firebase.database().ref('kandangmirror/g');
    var refSensor = firebase.database().ref('kandangmirror/s');
    var refSetting = firebase.database().ref().child('setting');

    const dates = new Date();
    const year = dates.getFullYear();
    const month = dates.getMonth() + 1;
    const date = dates.getDate();

    var now = year + '-' + month + '-' + date;
    
    vm.grid = $firebaseArray(refGrid);
    vm.sensor = $firebaseArray(refSensor);
    
    refSetting.on("value", function (snapshot) {
        vm.setAmmonia = snapshot.val().amonia;
        vm.setAnemometer = snapshot.val().anemometer;
        vm.setInterval = snapshot.val().interval_check_sensor;
        vm.setAyamLantai1 = snapshot.val().jumlahAwalAyamLantai1;
        vm.setAyamLantai2 = snapshot.val().jumlahAwalAyamLantai2;
        vm.setPanenLantai1 = snapshot.val().panenLantai1;
        vm.setPanenLantai2 = snapshot.val().panenLantai2;
        vm.setMulaiLantai1 = snapshot.val().tanggalMulaiLantai1;
        vm.setMulaiLantai2 = snapshot.val().tanggalMulaiLantai2;

        var date = now;
        var dateL1 = vm.setMulaiLantai1;
        var dateL2 = vm.setMulaiLantai2;

        var timestamp = new Date(date).getTime();
        var timestampL1 = new Date(dateL1).getTime();
        var timestampL2 = new Date(dateL2).getTime();

        var diffL1 = timestamp - timestampL1;
        var diffL2 = timestamp - timestampL2;

        var newDateL1 = new Date(diffL1);
        var newDateL2 = new Date(diffL2);

        vm.dateLantai1 = newDateL1.getDate() - 1;
        vm.dateLantai2 = newDateL2.getDate() - 1;
      });
    

    refGrid.on("value", function (snapshot) {

        var totalAmmonia = 0;
        var totalHumidity = 0;
        var totalSuhu = 0;
        var count = 0;

        snapshot.forEach(function (childSnapshot) {
            var ammonia = childSnapshot.val().b;
            var humidity = childSnapshot.val().c;
            var suhu = childSnapshot.val().d;

            if (ammonia == null)
              ammonia = 0;

            if (humidity == null)
              humidity = 0;

            if (suhu == null)
              suhu = 0;

            totalAmmonia += parseInt(ammonia);
            totalHumidity += parseInt(humidity);
            totalSuhu += parseInt(suhu);
            count++;
        });

        vm.rerataAmmonia = (totalAmmonia / count).toFixed(2);
        vm.rerataHumidity = (totalHumidity / count).toFixed(2);
        vm.rerataSuhu = (totalSuhu / count).toFixed(2);

        var feelsLike = 0;

          if (vm.rerataHumidity < 50) {
            if (vm.rerataSuhu <= 29.0) {
              feelsLike = 24;
            } else if (vm.rerataSuhu <= 30.2) {
              feelsLike = 25;
            } else if (vm.rerataSuhu <= 31.3) {
              feelsLike = 26;
            } else if (vm.rerataSuhu <= 32.5) {
              feelsLike = 27;
            } else if (vm.rerataSuhu <= 33.7) {
              feelsLike = 28;
            } else if (vm.rerataSuhu > 33.7) {
              feelsLike = 30;
            }
          } else if (vm.rerataHumidity < 60) {
            if (vm.rerataSuhu <= 26.8) {
              feelsLike = 24;
            } else if (vm.rerataSuhu <= 27.8) {
              feelsLike = 25;
            } else if (vm.rerataSuhu <= 28.6) {
              feelsLike = 26;
            } else if (vm.rerataSuhu <= 29.9) {
              feelsLike = 27;
            } else if (vm.rerataSuhu <= 31.2) {
              feelsLike = 28;
            } else if (vm.rerataSuhu > 33.2) {
              feelsLike = 30;
            }
          } else if (vm.rerataHumidity < 70) {
            if (vm.rerataSuhu <= 24.8) {
              feelsLike = 24;
            } else if (vm.rerataSuhu <= 25.7) {
              feelsLike = 25;
            } else if (vm.rerataSuhu <= 26.7) {
              feelsLike = 26;
            } else if (vm.rerataSuhu <= 27.7) {
              feelsLike = 27;
            } else if (vm.rerataSuhu <= 28.9) {
              feelsLike = 28;
            } else if (vm.rerataSuhu > 30.8) {
              feelsLike = 30;
            }
          } else if (vm.rerataHumidity < 80) {
            if (vm.rerataSuhu <= 23.0) {
              feelsLike = 24;
            } else if (vm.rerataSuhu <= 24.0) {
              feelsLike = 25;
            } else if (vm.rerataSuhu <= 25.0) {
              feelsLike = 26;
            } else if (vm.rerataSuhu <= 26.0) {
              feelsLike = 27;
            } else if (vm.rerataSuhu <= 27.3) {
              feelsLike = 28;
            } else if (vm.rerataSuhu > 29.2) {
              feelsLike = 30;
            }
          } else if (vm.rerataHumidity >= 80) {
            if (vm.rerataSuhu <= 22.0) {
              feelsLike = 24;
            } else if (vm.rerataSuhu <= 23.0) {
              feelsLike = 25;
            } else if (vm.rerataSuhu <= 23.0) {
              feelsLike = 26;
            } else if (vm.rerataSuhu <= 24.0) {
              feelsLike = 27;
            } else if (vm.rerataSuhu <= 26.0) {
              feelsLike = 28;
            } else if (vm.rerataSuhu > 27.0) {
              feelsLike = 30;
            }
          }

        vm.rerataFeelsLike = feelsLike;

      });

    vm.beratColor = beratColor;
    vm.ammoniaColor = ammoniaColor;
    vm.temperatureColor = temperatureColor;
    vm.humidityColor = humidityColor;    
    vm.sensorColor = sensorColor;

    function beratColor (a) {
      if (a < 0 || a == 'ERROR')
        return 'indicator-red';
      else 
        return '';
    };

    function ammoniaColor (b) {
      if (b > 20  || b == 'ERROR')
        return 'indicator-red';
      else 
        return '';
    };

    function humidityColor (c) {
      if ((c < 60 || c > 70)  || c == 'ERROR')
        return 'indicator-red';
      else 
        return '';
    };

    function temperatureColor (d) {
      if ((d < 20 || d > 40)  || d == 'ERROR')
        return 'indicator-red';
      else 
        return '';
    };

    function sensorColor (a) {
      if (a > 28) 
        return 'sensor-indoor-red';
      else 
        return 'sensor-indoor-green';
    };

  }

})();
