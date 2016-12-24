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
        else if (input.match(/.*er/))
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
    var refBerat = firebase.database().ref('percobaangrafik/lantai1/grid');
    var refPakan = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');
    var refBeratL2 = firebase.database().ref('percobaangrafik/lantai1/grid');
    var refPakanL2 = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');

    const dates = new Date();
    const year = dates.getFullYear();
    const month = dates.getMonth() + 1;
    const date = dates.getDate();

    var now = year + '-' + month + '-' + date;
    
    refBerat.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          childSnapshot.forEach(function (childSnapshot){
            if (childSnapshot.key == now) {
              vm.berat = childSnapshot.val().berat;
            } else {
              vm.berat = 0;
            }
          });
        });
      });

    refBeratL2.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          childSnapshot.forEach(function (childSnapshot){
            if (childSnapshot.key == now) {
              vm.beratL2 = childSnapshot.val().berat;
            } else {
              vm.beratL2 = 0;
            }
          });
        });
      });
    
    vm.ayamMati = 0;
    vm.totalPakan = 0;

    refPakan.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.key == now) {
            vm.pakan = childSnapshot.val().pakan;
          } else {
            vm.pakan = 0;
          }

          vm.ayamMati += childSnapshot.val().ayamMati;
          vm.totalPakan += childSnapshot.val().pakan;
        });

        var fcr = 0;

        if (vm.berat == 0) {
          fcr = 0;
        } else {
          fcr = vm.pakan / vm.berat;
        }

        vm.fcr = fcr.toFixed(2);
      });

     refPakanL2.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (childSnapshot.key == now) {
            vm.pakanL2 = childSnapshot.val().pakan;
          } else {
            vm.pakanL2 = 0;
          }
        });

        var fcrL2 = 0;

        if (vm.beratL2 == 0) {
          fcrL2 = 0;
        } else {
          fcrL2 = vm.pakanL2 / vm.beratL2;
        }

        vm.fcrL2 = fcrL2.toFixed(2);
      });
    
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



        /* Hitung IP */

        //function hitung BB
        var berat_bobot = 337 / 100; 
        var jumlah_ayam = vm.setAyamLantai1; 
        var BB =  ((jumlah_ayam * berat_bobot) / jumlah_ayam).toFixed(2);

        //function hitung deplesi
        var jumlah_panen = vm.ayamMati;
        var D = ((jumlah_ayam-jumlah_panen)/(jumlah_ayam)).toFixed(2);

        //function hitung fcr
        var total_pakan = vm.totalPakan;

        var FCR = total_pakan/berat_bobot;

        //function hitung AU
        var AU = (15 * jumlah_panen)  / jumlah_panen;

        vm.IP = ((100-D) * BB/(FCR*AU)*100).toFixed(2);

        /* */



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

        var totalAmmoniaL2 = 0;
        var totalHumidityL2 = 0;
        var totalSuhuL2 = 0;
        var countL2 = 0;

        var totalAmmoniaNE = 0;
        var totalHumidityNE = 0;
        var totalSuhuNE = 0;
        var totalBeratNE = 0;
        var countAmmoniaNE = 0;
        var countHumidityNE = 0;
        var countSuhuNE = 0;
        var countBeratNE = 0;

        var totalAmmoniaNE2 = 0;
        var totalHumidityNE2 = 0;
        var totalSuhuNE2 = 0;
        var totalBeratNE2 = 0;
        var countAmmoniaNE2 = 0;
        var countHumidityNE2 = 0;
        var countSuhuNE2 = 0;
        var countBeratNE2 = 0;

        snapshot.forEach(function (childSnapshot) {

            if (childSnapshot.val().lantai == 1) {
              var berat = childSnapshot.val().a;
              var ammonia = childSnapshot.val().b;
              var humidity = childSnapshot.val().c;
              var suhu = childSnapshot.val().d;
            } else if (childSnapshot.val().lantai == 2) {
              var beratL2 = childSnapshot.val().a;
              var ammoniaL2 = childSnapshot.val().b;
              var humidityL2 = childSnapshot.val().c;
              var suhuL2 = childSnapshot.val().d;
            }            

            if (berat == null)
              berat = 0;

            if (ammonia == null)
              ammonia = 0;

            if (humidity == null)
              humidity = 0;

            if (suhu == null)
              suhu = 0;

            if (beratL2 == null)
              beratL2 = 0;

            if (ammoniaL2 == null)
              ammoniaL2 = 0;

            if (humidityL2 == null)
              humidityL2 = 0;

            if (suhuL2 == null)
              suhuL2 = 0;

            /*Rata-Rata Non Error*/
            if (berat >= 0) {
              totalBeratNE += parseInt(berat);
              countBeratNE++;
            }

            if (suhu >= 20 && suhu <= 40) {
              totalSuhuNE += parseInt(suhu);
              countSuhuNE++;
            }

            if (ammonia >= 0) {
              totalAmmoniaNE += parseInt(-0.0357*ammonia+12.843);
              countAmmoniaNE++;
            }

            if (humidity >= 0) {
              totalHumidityNE += parseInt(humidity);
              countHumidityNE++;
            }

            if (suhuL2 >= 20 && suhuL2 <= 40) {
              totalSuhuNE2 += parseInt(suhuL2);
              countSuhuNE2++;
            }

            if (beratL2 >= 0) {
              totalBeratNE2 += parseInt(beratL2);
              countBeratNE2++;
            }

            if (ammoniaL2 >= 0) {
              totalAmmoniaNE2 += parseInt(-0.0357*ammoniaL2+12.843);
              countAmmoniaNE2++;
            }

            if (humidityL2 >= 0) {
              totalHumidityNE2 += parseInt(humidityL2);
              countHumidityNE2++;
            }

            /* */

            totalAmmonia += parseInt(ammonia);
            totalHumidity += parseInt(humidity);
            totalSuhu += parseInt(suhu);
            count++;

            totalAmmoniaL2 += parseInt(ammoniaL2);
            totalHumidityL2 += parseInt(humidityL2);
            totalSuhuL2 += parseInt(suhuL2);
            countL2++;
        });

        vm.rerataAmmonia = (totalAmmonia / count).toFixed(2);
        vm.rerataHumidity = (totalHumidity / count).toFixed(2);
        vm.rerataSuhu = (totalSuhu / count).toFixed(2);

        vm.rerataAmmoniaL2 = (totalAmmoniaL2 / countL2).toFixed(2);
        vm.rerataHumidityL2 = (totalHumidityL2 / countL2).toFixed(2);
        vm.rerataSuhuL2 = (totalSuhuL2 / countL2).toFixed(2);

        /* Rata-rata Non Error */

        if (countBeratNE == 0) {
          vm.rerataBeratNE = 0;
        } else {
          vm.rerataBeratNE = (totalBeratNE / countBeratNE).toFixed(2);
        }

        if (countAmmoniaNE == 0) {
          vm.rerataAmmoniaNE = 0;
        } else {
          vm.rerataAmmoniaNE = (totalAmmoniaNE / countAmmoniaNE).toFixed(2);
        }

        if (countHumidityNE == 0) {
          vm.rerataHumidityNE = 0;
        } else {
          vm.rerataHumidityNE = (totalHumidityNE / countHumidityNE).toFixed(2);
        }

        if (countSuhuNE == 0) {
          vm.rerataSuhuNE = 0;
        } else {
          vm.rerataSuhuNE = (totalSuhuNE / countSuhuNE).toFixed(2);
        }

        if (countBeratNE2 == 0) {
          vm.rerataBeratNE2 = 0;
        } else {
          vm.rerataBeratNE2 = (totalBeratNE2 / countBeratNE2).toFixed(2);
        }

        if (countAmmoniaNE2 == 0) {
          vm.rerataAmmoniaNE2 = 0;
        } else {
          vm.rerataAmmoniaNE2 = (totalAmmoniaNE2 / countAmmoniaNE2).toFixed(2);
        }

        if (countHumidityNE2 == 0) {
          vm.rerataHumidityNE2 = 0;
        } else {
          vm.rerataHumidityNE2 = (totalHumidityNE2 / countHumidityNE2).toFixed(2);
        }

        if (countSuhuNE2 == 0) {
          vm.rerataSuhuNE2 = 0;
        } else {
          vm.rerataSuhuNE2 = (totalSuhuNE2 / countSuhuNE2).toFixed(2);
        }

        /* */

        var feelsLike = 0;

          if (vm.rerataHumidity < 50) {
            if (vm.rerataSuhu == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhu <= 29.0) {
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
            if (vm.rerataSuhu == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhu <= 26.8) {
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
            if (vm.rerataSuhu == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhu <= 24.8) {
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
            if (vm.rerataSuhu == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhu <= 23.0) {
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
            if (vm.rerataSuhu == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhu <= 22.0) {
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

        var feelsLikeL2 = 0;

          if (vm.rerataHumidityL2 < 50) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhuL2 <= 29.0) {
              feelsLikeL2 = 24;
            } else if (vm.rerataSuhuL2 <= 30.2) {
              feelsLikeL2 = 25;
            } else if (vm.rerataSuhuL2 <= 31.3) {
              feelsLikeL2 = 26;
            } else if (vm.rerataSuhuL2 <= 32.5) {
              feelsLikeL2 = 27;
            } else if (vm.rerataSuhuL2 <= 33.7) {
              feelsLikeL2 = 28;
            } else if (vm.rerataSuhuL2 > 33.7) {
              feelsLikeL2 = 30;
            }
          } else if (vm.rerataHumidityL2 < 60) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhuL2 <= 26.8) {
              feelsLikeL2 = 24;
            } else if (vm.rerataSuhuL2 <= 27.8) {
              feelsLikeL2 = 25;
            } else if (vm.rerataSuhuL2 <= 28.6) {
              feelsLikeL2 = 26;
            } else if (vm.rerataSuhuL2 <= 29.9) {
              feelsLikeL2 = 27;
            } else if (vm.rerataSuhuL2 <= 31.2) {
              feelsLikeL2 = 28;
            } else if (vm.rerataSuhuL2 > 33.2) {
              feelsLikeL2 = 30;
            }
          } else if (vm.rerataHumidityL2 < 70) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhuL2 <= 24.8) {
              feelsLikeL2 = 24;
            } else if (vm.rerataSuhuL2 <= 25.7) {
              feelsLikeL2 = 25;
            } else if (vm.rerataSuhuL2 <= 26.7) {
              feelsLikeL2 = 26;
            } else if (vm.rerataSuhuL2 <= 27.7) {
              feelsLikeL2 = 27;
            } else if (vm.rerataSuhuL2 <= 28.9) {
              feelsLikeL2 = 28;
            } else if (vm.rerataSuhuL2 > 30.8) {
              feelsLikeL2 = 30;
            }
          } else if (vm.rerataHumidityL2 < 80) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhuL2 <= 23.0) {
              feelsLikeL2 = 24;
            } else if (vm.rerataSuhuL2 <= 24.0) {
              feelsLikeL2 = 25;
            } else if (vm.rerataSuhuL2 <= 25.0) {
              feelsLikeL2 = 26;
            } else if (vm.rerataSuhuL2 <= 26.0) {
              feelsLikeL2 = 27;
            } else if (vm.rerataSuhuL2 <= 27.3) {
              feelsLikeL2 = 28;
            } else if (vm.rerataSuhuL2 > 29.2) {
              feelsLikeL2 = 30;
            }
          } else if (vm.rerataHumidityL2 >= 80) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLike = 0;
            } else if (vm.rerataSuhuL2 <= 22.0) {
              feelsLikeL2 = 24;
            } else if (vm.rerataSuhuL2 <= 23.0) {
              feelsLikeL2 = 25;
            } else if (vm.rerataSuhuL2 <= 23.0) {
              feelsLikeL2 = 26;
            } else if (vm.rerataSuhuL2 <= 24.0) {
              feelsLikeL2 = 27;
            } else if (vm.rerataSuhuL2 <= 26.0) {
              feelsLikeL2 = 28;
            } else if (vm.rerataSuhuL2 > 27.0) {
              feelsLikeL2 = 30;
            }
          }

        vm.rerataFeelsLikeL2 = feelsLikeL2;

      });   

    vm.beratColor = beratColor;
    vm.ammoniaColor = ammoniaColor;
    vm.temperatureColor = temperatureColor;
    vm.humidityColor = humidityColor;    
    vm.sensorColor = sensorColor;

    vm.panenLantai1 = function() {
      var updates = {};
      updates['/setting/panenLantai1'] = true;
      updates['/setting/jumlahAwalAyamLantai1'] = 0;

      return firebase.database().ref().update(updates);
    };

    vm.panenLantai2 = function() {
      var updates = {};
      updates['/setting/panenLantai2'] = true;
      updates['/setting/jumlahAwalAyamLantai2'] = 0;

      return firebase.database().ref().update(updates);
    };

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
