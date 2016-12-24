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
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else {
          var kalibrasi = (-0.0357)*parseInt(input)+12.843;
          return kalibrasi.toFixed(2) + ' ppm';
        }
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
    var refPakan = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');
    var refPakanL2 = firebase.database().ref('percobaangrafik/lantai2/feedandmortality');

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
        var totalBerat = 0;

        var countAmmonia = 0;
        var countHumidity = 0;
        var countSuhu = 0;
        var countBerat = 0;

        var totalAmmoniaL2 = 0;
        var totalHumidityL2 = 0;
        var totalSuhuL2 = 0;
        var totalBeratL2 = 0;
        var countAmmoniaL2 = 0;
        var countHumidityL2 = 0;
        var countSuhuL2 = 0;
        var countBeratL2 = 0;

        snapshot.forEach(function (childSnapshot) {

            if (childSnapshot.val().lantai == 1) {
              var berat = childSnapshot.val().a;
              var ammonia = childSnapshot.val().b;
              var humidity = childSnapshot.val().c;
              var suhu = childSnapshot.val().d;

              if (berat > 0) {
                totalBerat += parseFloat(berat);
                countBerat++;
              }

              if (ammonia > 0) {
                totalAmmonia += (-0.0357)*parseInt(ammonia)+12.843;
                countAmmonia++;
              }

              if (suhu >= 20 && suhu <= 40) {
                totalSuhu += parseInt(suhu);
                countSuhu++;
              }

              if(humidity > 0) {
                totalHumidity += parseInt(humidity);
                countHumidity++;
              }  

            } else if (childSnapshot.val().lantai == 2) {
              var beratL2 = childSnapshot.val().a;
              var ammoniaL2 = childSnapshot.val().b;
              var humidityL2 = childSnapshot.val().c;
              var suhuL2 = childSnapshot.val().d;

              if (beratL2 > 0) {
                totalBeratL2 += parseFloat(beratL2);
                countBeratL2++;
              }

              if (ammoniaL2 > 0) {
                totalAmmoniaL2 += (-0.0357)*parseInt(ammoniaL2)+12.843;
                countAmmoniaL2++;
              }

              if (suhuL2 >= 20 && suhuL2 <= 40) {
                totalSuhuL2 += parseInt(suhuL2);
                countSuhuL2++;
              }

              if(humidityL2 > 0) {
                totalHumidityL2 += parseInt(humidityL2);
                countHumidityL2++;
              }

            }
            
        });

        vm.rerataBerat = (totalBerat / countBerat).toFixed(2);
        vm.rerataAmmonia = (totalAmmonia / countAmmonia).toFixed(2);
        vm.rerataHumidity = (totalHumidity / countHumidity).toFixed(2);
        vm.rerataSuhu = (totalSuhu / countSuhu).toFixed(2);

        vm.rerataBeratL2 = (totalBeratL2 / countBeratL2).toFixed(2);
        vm.rerataAmmoniaL2 = (totalAmmoniaL2 / countAmmoniaL2).toFixed(2);
        vm.rerataHumidityL2 = (totalHumidityL2 / countHumidityL2).toFixed(2);
        vm.rerataSuhuL2 = (totalSuhuL2 / countSuhuL2).toFixed(2);

        var updatesBerat = {};
        updatesBerat['/percobaangrafik/lantai1/feedandmortality/' + now + '/berat'] = vm.rerataBerat;
        firebase.database().ref().update(updatesBerat);

        var updatesBeratL2 = {};
        updatesBeratL2['/percobaangrafik/lantai2/feedandmortality/' + now + '/berat'] = vm.rerataBeratL2;
        firebase.database().ref().update(updatesBeratL2);
        
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
            } else if (vm.rerataSuhu > 31.2) {
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
            } else if (vm.rerataSuhu > 28.9) {
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
            } else if (vm.rerataSuhu > 27.3) {
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
            } else if (vm.rerataSuhu > 26.0) {
              feelsLike = 30;
            }
          }

        vm.rerataFeelsLike = feelsLike;

        var feelsLikeL2 = 0;

          if (vm.rerataHumidityL2 < 50) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLikeL2 = 0;
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
              feelsLikeL2 = 0;
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
            } else if (vm.rerataSuhuL2 > 31.2) {
              feelsLikeL2 = 30;
            }
          } else if (vm.rerataHumidityL2 < 70) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLikeL2 = 0;
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
            } else if (vm.rerataSuhuL2 > 28.9) {
              feelsLikeL2 = 30;
            }
          } else if (vm.rerataHumidityL2 < 80) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLikeL2 = 0;
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
            } else if (vm.rerataSuhuL2 > 27.3) {
              feelsLikeL2 = 30;
            }
          } else if (vm.rerataHumidityL2 >= 80) {
            if (vm.rerataSuhuL2 == 0) {
              feelsLikeL2 = 0;
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
            } else if (vm.rerataSuhuL2 > 26.0) {
              feelsLikeL2 = 30;
            }
          }

        vm.rerataFeelsLikeL2 = feelsLikeL2;

      });

    refPakan.on("value", function (snapshot) {
      var totalPakan = 0;
      var ayamMati   = 0;
      var rataBerat  = 0;

      snapshot.forEach(function (childSnapshot) {
        var tanggal = childSnapshot.key;
        var pakan = childSnapshot.val().pakan;
        var mati  = childSnapshot.val().ayamMati;

        if (pakan == null) {
          pakan = 0;
        }

        if (mati == null) {
          mati = 0;
        }
        
        if (tanggal == now) {
          rataBerat = (childSnapshot.val().berat)/1000;
        }

        totalPakan += pakan * 50;
        ayamMati += mati;

      })

      //function hitung FCR
      var ayamHidup = vm.setAyamLantai1 - ayamMati;

      if (rataBerat == 0) {
        var fcr = 0; 
      } else {
        var fcr = totalPakan / (ayamHidup * rataBerat);
      }
      
      vm.fcr  = fcr.toFixed(2);

      //function hitung IP
      var percentMortality = ayamMati / vm.setAyamLantai1;

      var ip = (1 - percentMortality) * rataBerat / (fcr * vm.dateLantai1) * 1000;
      vm.ip = ip.toFixed(2);
    });

    refPakanL2.on("value", function (snapshot) {
      var totalPakanL2 = 0;
      var ayamMatiL2   = 0;
      var rataBeratL2  = 0;

      snapshot.forEach(function (childSnapshot) {
        var tanggalL2 = childSnapshot.key;
        var pakanL2 = childSnapshot.val().pakan;
        var matiL2  = childSnapshot.val().ayamMati;

        if (tanggalL2 == now) {
          rataBeratL2 = (childSnapshot.val().berat)/1000;
        }

        if (pakanL2 == null) {
          pakanL2 = 0;
        }

        if (matiL2 == null) {
          matiL2 = 0;
        }

        totalPakanL2 += pakanL2 * 50;
        ayamMatiL2 += matiL2;
      })

      var ayamHidupL2 = vm.setAyamLantai2 - ayamMatiL2;

      if (rataBeratL2 == 0) {
        var fcrL2 = 0; 
      } else {
        var fcrL2 = totalPakanL2 / (ayamHidupL2 * rataBeratL2);
      }

      vm.fcrL2  = fcrL2.toFixed(2);

      //function hitung IP
      var percentMortalityL2 = ayamMatiL2 / vm.setAyamLantai2;

      var ipL2 = (1 - percentMortalityL2) * rataBeratL2 / (fcrL2 * vm.dateLantai2) * 1000;
      vm.ipL2 = ipL2.toFixed(2);
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
      var a = (-0.0357)*parseInt(b)+12.843;
      if (a > 20.00 || b == 'ERROR')
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
