(function(){
  'use strict';

  angular
    .module('appController')
    .controller('kandangController', kandangController)
    .filter('filterSuhu', function () {
      return function (input) {

        if (input == null)
          return 0;
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else {
          input = parseFloat(input);
          return input.toFixed(2) + ' \xB0C';
        }
      }
    })
    .filter('filterBerat', function () {
      return function (input) {
        if (input == null)
          return 0;
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else if (input == 0)
          return 0.00 + ' gr';
        else {
          input = parseFloat(input);
          return input.toFixed(2) + ' gr';
        }
      }
    })
    .filter('filterAmmonia', function () {
      return function (input) {
        if (input == null || input == 0)
          return 0;
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else {
          var kalibrasi = (-0.1545)*parseFloat(input)+26.664;
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
        else {
          input = parseFloat(input);
          return input.toFixed(2) + ' km/jam';
        }
      }
    })
    .filter('filterHumidity', function () {
      return function (input) {
        if (input == null)
          return 0;
        else if (input < 0 || input.match(/.*er/))
          return 'ERROR';
        else {
          input = parseFloat(input);
          return input.toFixed(2) + ' %';
        }
      }
    }); 

  function kandangController($firebaseArray, $mdToast) {
    var vm = this;

    // Database Reference
    var refGrid    = firebase.database().ref('kandangmirror/g');
    var refSensor  = firebase.database().ref('kandangmirror/s');
    var refSetting = firebase.database().ref('setting');
    var refPakan   = firebase.database().ref('grafik/kandang1/feedandmortality');
    var refPakanL2 = firebase.database().ref('grafik/kandang2/feedandmortality');
    var refPakanL3 = firebase.database().ref('grafik/kandang3/feedandmortality');
    var refPakanL4 = firebase.database().ref('grafik/kandang4/feedandmortality');


    // Read Data
    vm.grid    = $firebaseArray(refGrid);    
    vm.sensor  = $firebaseArray(refSensor);

    // Watch Database
    refSetting.on("value", function refSetting (snapshot) {
      vm.jumlahAyamL1   = snapshot.val().jumlahAwalAyamLantai1;
      vm.jumlahAyamL2   = snapshot.val().jumlahAwalAyamLantai2;
      vm.tanggalMulaiL1 = snapshot.val().tanggalMulaiLantai1;
      vm.tanggalMulaiL2 = snapshot.val().tanggalMulaiLantai2;
      vm.jumlahAyamL3   = snapshot.val().jumlahAwalAyamLantai3;
      vm.jumlahAyamL4   = snapshot.val().jumlahAwalAyamLantai4;
      vm.tanggalMulaiL3 = snapshot.val().tanggalMulaiLantai4;
      vm.tanggalMulaiL4 = snapshot.val().tanggalMulaiLantai4;

      const d = new Date();
      var year  = d.getFullYear();
      var month = d.getMonth() + 1;
      var date  = d.getDate();

      if (month < 10) {
        month = '0' + month;
      }

      if (date < 10) {
        date = '0' + date;
      }

      const ONE_DAY = 1000 * 60 * 60 * 24;

      var dates = year + '-' + month + '-' + date;
      var dateL1 = vm.tanggalMulaiL1;
      var dateL2 = vm.tanggalMulaiL2;
      var dateL3 = vm.tanggalMulaiL3;
      var dateL4 = vm.tanggalMulaiL4;

      var timestamp = new Date(dates).getTime();
      var timestampL1 = new Date(dateL1).getTime();
      var timestampL2 = new Date(dateL2).getTime();
      var timestampL3 = new Date(dateL3).getTime();
      var timestampL4 = new Date(dateL4).getTime();

      var diffL1 = Math.abs(timestamp - timestampL1);
      var diffL2 = Math.abs(timestamp - timestampL2);
      var diffL3 = Math.abs(timestamp - timestampL3);
      var diffL4 = Math.abs(timestamp - timestampL4);

      vm.dateLantai1 = Math.round(diffL1/ONE_DAY);
      vm.dateLantai2 = Math.round(diffL2/ONE_DAY);
      vm.dateLantai3 = Math.round(diffL3/ONE_DAY);
      vm.dateLantai4 = Math.round(diffL4/ONE_DAY);
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
      var lastUpdate = 0;
      var lastTime = 0;
      var updateDate, updateTime;
        
      var totalAmmoniaL2 = 0;
      var totalHumidityL2 = 0;
      var totalSuhuL2 = 0;
      var totalBeratL2 = 0;
      var countAmmoniaL2 = 0;
      var countHumidityL2 = 0;
      var countSuhuL2 = 0;
      var countBeratL2 = 0;
      var lastUpdateL2 = 0;
      var lastTimeL2 = 0;
      var updateDateL2, updateTimeL2;

      var totalAmmoniaL3 = 0;
      var totalHumidityL3 = 0;
      var totalSuhuL3 = 0;
      var totalBeratL3 = 0;
      var countAmmoniaL3 = 0;
      var countHumidityL3 = 0;
      var countSuhuL3 = 0;
      var countBeratL3 = 0;
      var lastUpdateL3 = 0;
      var lastTimeL3 = 0;
      var updateDateL3, updateTimeL3;

      var totalAmmoniaL4 = 0;
      var totalHumidityL4 = 0;
      var totalSuhuL4 = 0;
      var totalBeratL4 = 0;
      var countAmmoniaL4 = 0;
      var countHumidityL4 = 0;
      var countSuhuL4 = 0;
      var countBeratL4 = 0;
      var lastUpdateL4 = 0;
      var lastTimeL4 = 0;
      var updateDateL4, updateTimeL4;

      snapshot.forEach(function (childSnapshot) {
        var tanggal, ts, tsL2, tsL3, tsL4;

        tanggal = childSnapshot.val().tanggal;

        if (childSnapshot.val().idKandang == 1) {

          if (tanggal != null) {
            var timestamp = new Date(tanggal).getTime();
            if (timestamp > lastUpdate) {
              lastUpdate = timestamp;
            }

            const d = new Date(lastUpdate);
            var year  = d.getFullYear();
            var month = d.getMonth() + 1;
            var date  = d.getDate();

            if (month < 10) {
              month = '0' + month;
            }

            if (date < 10) {
              date = '0' + date;
            }

            ts = year + '-' + month + '-' + date;


            if (tanggal == ts) {

              var berat    = parseFloat(childSnapshot.val().a);
              var ammonia  = parseFloat(childSnapshot.val().b);
              var humidity = parseFloat(childSnapshot.val().c);
              var suhu     = parseFloat(childSnapshot.val().d);

              vm.updateTemp = tanggal;
              var updateDate = tanggal;
              var updateTime = childSnapshot.val().waktu;

              if (tanggal != null) {
                var timeSplit = updateTime.split(':');
                var split = updateDate.split('-');

                var sec = timeSplit[1]*1 + timeSplit[0]*60

                vm.updateDate = split[2] + '-' + split[1] + '-' + split[0];

                if (sec > lastTime) {
                  lastTime = sec;
                  vm.updateTime = updateTime;  
                }      
              }
              
                 

              if (berat > 0) {
                totalBerat += berat;
                countBerat++;
              }

              if (ammonia > 0) {
                totalAmmonia += (-0.1545)*ammonia+26.664;
                countAmmonia++;
              }

              if (suhu > 0) {
                totalSuhu += suhu;
                countSuhu++;
              }

              if (humidity > 0) {
                totalHumidity += humidity;
                countHumidity++;
              }

            }

          }

        } 

        if (childSnapshot.val().idKandang == 2) {

          if (tanggal != null) {
            var timestamp = new Date(tanggal).getTime();
            if (timestamp > lastUpdateL2) {
              lastUpdateL2 = timestamp;
            }

            const d = new Date(lastUpdateL2);
            var year  = d.getFullYear();
            var month = d.getMonth() + 1;
            var date  = d.getDate();

            if (month < 10) {
              month = '0' + month;
            }

            if (date < 10) {
              date = '0' + date;
            }

            tsL2 = year + '-' + month + '-' + date;
          

            if (tanggal == tsL2) {

              var beratL2    = parseFloat(childSnapshot.val().a);
              var ammoniaL2  = parseFloat(childSnapshot.val().b);
              var humidityL2 = parseFloat(childSnapshot.val().c);
              var suhuL2     = parseFloat(childSnapshot.val().d);

              vm.updateTempL2 = tanggal;
              var updateDateL2 = tanggal;
              var updateTimeL2 = childSnapshot.val().waktu;

              if (tanggal != null) {
                var splits = updateDateL2.split('-');
                var timeSplit = updateTimeL2.split(':');

                var sec = timeSplit[1]*1 + timeSplit[0]*60

                vm.updateDateL2 = splits[2] + '-' + splits[1] + '-' + splits[0];

                if (sec > lastTimeL2) {
                  lastTimeL2 = sec;
                  vm.updateTimeL2 = updateTimeL2;  
                }
              }
              

              if (beratL2 > 0) {
                totalBeratL2 += beratL2;
                countBeratL2++;
              }

              if (ammoniaL2 > 0) {
                totalAmmoniaL2 += (-0.1545)*ammoniaL2+26.664;
                countAmmoniaL2++;
              }

              if (suhuL2 > 0) {
                totalSuhuL2 += suhuL2;
                countSuhuL2++;
              }

              if (humidityL2 > 0) {
                totalHumidityL2 += humidityL2;
                countHumidityL2++;
              }

            }

          }

        } 

        if (childSnapshot.val().idKandang == 3) {

          if (tanggal != null) {
            var timestamp = new Date(tanggal).getTime();
            if (timestamp > lastUpdateL3) {
              lastUpdateL3 = timestamp;
            }

            const d = new Date(lastUpdateL3);
            var year  = d.getFullYear();
            var month = d.getMonth() + 1;
            var date  = d.getDate();

            if (month < 10) {
              month = '0' + month;
            }

            if (date < 10) {
              date = '0' + date;
            }

            tsL3 = year + '-' + month + '-' + date;
          

            if (tanggal == tsL3) {

              var beratL3    = parseFloat(childSnapshot.val().a);
              var ammoniaL3  = parseFloat(childSnapshot.val().b);
              var humidityL3 = parseFloat(childSnapshot.val().c);
              var suhuL3     = parseFloat(childSnapshot.val().d);

              vm.updateTempL3 = tanggal;
              var updateDateL3 = tanggal;
              var updateTimeL3 = childSnapshot.val().waktu;

              if (tanggal != null) {
                var splits = updateDateL3.split('-');
                var timeSplit = updateTimeL3.split(':');

                var sec = timeSplit[1]*1 + timeSplit[0]*60

                vm.updateDateL3 = splits[2] + '-' + splits[1] + '-' + splits[0];

                if (sec > lastTimeL3) {
                  lastTimeL3 = sec;
                  vm.updateTimeL3 = updateTimeL3;  
                }
              }
              

              if (beratL3 > 0) {
                totalBeratL3 += beratL3;
                countBeratL3++;
              }

              if (ammoniaL3 > 0) {
                totalAmmoniaL3 += (-0.1545)*ammoniaL3+26.664;
                countAmmoniaL3++;
              }

              if (suhuL3 > 0) {
                totalSuhuL3 += suhuL3;
                countSuhuL3++;
              }

              if (humidityL3 > 0) {
                totalHumidityL3 += humidityL3;
                countHumidityL3++;
              }

            }

          }  

        }

        if (childSnapshot.val().idKandang == 4) {

          if (tanggal != null) {
            var timestamp = new Date(tanggal).getTime();
            if (timestamp > lastUpdateL4) {
              lastUpdateL4 = timestamp;
            }

            const d = new Date(lastUpdateL4);
            var year  = d.getFullYear();
            var month = d.getMonth() + 1;
            var date  = d.getDate();

            if (month < 10) {
              month = '0' + month;
            }

            if (date < 10) {
              date = '0' + date;
            }

            tsL4 = year + '-' + month + '-' + date;
          

            if (tanggal == tsL4) {

              var beratL4    = parseFloat(childSnapshot.val().a);
              var ammoniaL4  = parseFloat(childSnapshot.val().b);
              var humidityL4 = parseFloat(childSnapshot.val().c);
              var suhuL4     = parseFloat(childSnapshot.val().d);

              vm.updateTempL4 = tanggal;
              var updateDateL4 = tanggal;
              var updateTimeL4 = childSnapshot.val().waktu;

              if (tanggal != null) {
                var splits = updateDateL4.split('-');
                var timeSplit = updateTimeL4.split(':');

                var sec = timeSplit[1]*1 + timeSplit[0]*60

                vm.updateDateL4 = splits[2] + '-' + splits[1] + '-' + splits[0];

                if (sec > lastTimeL4) {
                  lastTimeL4 = sec;
                  vm.updateTimeL4 = updateTimeL4;  
                }
              }
              

              if (beratL4 > 0) {
                totalBeratL4 += beratL4;
                countBeratL4++;
              }

              if (ammoniaL4 > 0) {
                totalAmmoniaL4 += (-0.1545)*ammoniaL4+26.664;
                countAmmoniaL4++;
              }

              if (suhuL4 > 0) {
                totalSuhuL4 += suhuL4;
                countSuhuL4++;
              }

              if (humidityL4 > 0) {
                totalHumidityL4 += humidityL4;
                countHumidityL4++;
              }

            }

          }

        }

      });

      // Hitung Rata-Rata Non-Error Lantai 1
      if (countBerat == 0) {
        vm.rerataBerat = 0;
      } else {
        vm.rerataBerat = (totalBerat / countBerat).toFixed(2);
      }

      if (countAmmonia == 0) {
        vm.rerataAmmonia = 0;
      } else {
        vm.rerataAmmonia = (totalAmmonia / countAmmonia).toFixed(2);
      }

      if (countHumidity == 0) {
        vm.rerataHumidity = 0;
      } else {
        vm.rerataHumidity = (totalHumidity / countHumidity).toFixed(2);
      }

      if (countSuhu == 0) {
        vm.rerataSuhu = 0;
      } else {
        vm.rerataSuhu = (totalSuhu / countSuhu).toFixed(2);
      }       

      vm.rerataFeelsLike = feelsLike(vm.rerataHumidity, vm.rerataSuhu);

      var updates = {};
      updates['/grafik/kandang1/perhitungan/berat'] = parseFloat(vm.rerataBerat);
      updates['/grafik/kandang1/perhitungan/NH3'] = parseFloat(vm.rerataAmmonia);
      updates['/grafik/kandang1/perhitungan/kelembapan'] = parseFloat(vm.rerataHumidity);
      updates['/grafik/kandang1/perhitungan/suhu'] = parseFloat(vm.rerataSuhu);
      updates['/grafik/kandang1/perhitungan/feelslike'] = parseFloat(vm.rerataFeelsLike);
      updates['/grafik/kandang1/perhitungan/hari'] = vm.dateLantai1;
      updates['/grafik/kandang1/perhitungan/lastupdate'] = vm.updateDate;
      firebase.database().ref().update(updates); 

      // Hitung Rata-Rata Non-Error Lantai 2 
      if (countBeratL2 == 0) {
        vm.rerataBeratL2 = 0;
      } else {
        vm.rerataBeratL2 = (totalBeratL2 / countBeratL2).toFixed(2);
      }
      
      if (countAmmoniaL2 == 0) {
        vm.rerataAmmoniaL2 = 0;
      } else {
        vm.rerataAmmoniaL2 = (totalAmmoniaL2 / countAmmoniaL2).toFixed(2);
      }

      if (countHumidityL2 == 0) {
        vm.rerataHumidityL2 = 0;
      } else {
        vm.rerataHumidityL2 = (totalHumidityL2 / countHumidityL2).toFixed(2);
      }

      if (countSuhuL2 == 0) {
        vm.rerataSuhuL2 = 0;
      } else {
        vm.rerataSuhuL2 = (totalSuhuL2 / countSuhuL2).toFixed(2);
      }          
             
      vm.rerataFeelsLikeL2 = feelsLikeL2(vm.rerataHumidityL2, vm.rerataSuhuL2);

      var updates2 = {};
      updates2['/grafik/kandang2/perhitungan/berat'] = parseFloat(vm.rerataBeratL2);
      updates2['/grafik/kandang2/perhitungan/NH3'] = parseFloat(vm.rerataAmmoniaL2);
      updates2['/grafik/kandang2/perhitungan/kelembapan'] = parseFloat(vm.rerataHumidityL2);
      updates2['/grafik/kandang2/perhitungan/suhu'] = parseFloat(vm.rerataSuhuL2);
      updates2['/grafik/kandang2/perhitungan/feelslike'] = parseFloat(vm.rerataFeelsLikeL2);
      updates2['/grafik/kandang2/perhitungan/hari'] = vm.dateLantai2;
      updates2['/grafik/kandang2/perhitungan/lastupdate'] = vm.updateDateL2;
      firebase.database().ref().update(updates2);

      // Hitung Rata-Rata Non-Error Lantai 3
      if (countBeratL3 == 0) {
        vm.rerataBeratL3 = 0;
      } else {
        vm.rerataBeratL3 = (totalBeratL3 / countBeratL3).toFixed(2);
      }
      
      if (countAmmoniaL3 == 0) {
        vm.rerataAmmoniaL3 = 0;
      } else {
        vm.rerataAmmoniaL3 = (totalAmmoniaL3 / countAmmoniaL3).toFixed(2);
      }

      if (countHumidityL3 == 0) {
        vm.rerataHumidityL3 = 0;
      } else {
        vm.rerataHumidityL3 = (totalHumidityL3 / countHumidityL3).toFixed(2);
      }

      if (countSuhuL3 == 0) {
        vm.rerataSuhuL3 = 0;
      } else {
        vm.rerataSuhuL3 = (totalSuhuL3 / countSuhuL3).toFixed(2);
      }          
                         
      vm.rerataFeelsLikeL3 = feelsLikeL3(vm.rerataHumidityL3, vm.rerataSuhuL3);

      var updates3 = {};
      updates3['/grafik/kandang3/perhitungan/berat'] = parseFloat(vm.rerataBeratL3);
      updates3['/grafik/kandang3/perhitungan/NH3'] = parseFloat(vm.rerataAmmoniaL3);
      updates3['/grafik/kandang3/perhitungan/kelembapan'] = parseFloat(vm.rerataHumidityL3);
      updates3['/grafik/kandang3/perhitungan/suhu'] = parseFloat(vm.rerataSuhuL3);
      updates3['/grafik/kandang3/perhitungan/feelslike'] = parseFloat(vm.rerataFeelsLikeL3);
      updates3['/grafik/kandang3/perhitungan/hari'] = vm.dateLantai3;
      updates3['/grafik/kandang3/perhitungan/lastupdate'] = vm.updateDateL3;
      firebase.database().ref().update(updates3);

      // Hitung Rata-Rata Non-Error Lantai 4
      if (countBeratL4 == 0) {
        vm.rerataBeratL4 = 0;
      } else {
        vm.rerataBeratL4 = (totalBeratL4 / countBeratL4).toFixed(2);
      }
      
      if (countAmmoniaL4 == 0) {
        vm.rerataAmmoniaL4 = 0;
      } else {
        vm.rerataAmmoniaL4 = (totalAmmoniaL4 / countAmmoniaL4).toFixed(2);
      }

      if (countHumidityL4 == 0) {
        vm.rerataHumidityL4 = 0;
      } else {
        vm.rerataHumidityL4 = (totalHumidityL4 / countHumidityL4).toFixed(2);
      }

      if (countSuhuL4 == 0) {
        vm.rerataSuhuL4 = 0;
      } else {
        vm.rerataSuhuL4 = (totalSuhuL4 / countSuhuL4).toFixed(2);
      }          
              
      vm.rerataFeelsLikeL4 = feelsLikeL4(vm.rerataHumidityL4, vm.rerataSuhuL4);

      var updates4 = {};
      updates4['/grafik/kandang4/perhitungan/berat'] = parseFloat(vm.rerataBeratL4);
      updates4['/grafik/kandang4/perhitungan/NH3'] = parseFloat(vm.rerataAmmoniaL4);
      updates4['/grafik/kandang4/perhitungan/kelembapan'] = parseFloat(vm.rerataHumidityL4);
      updates4['/grafik/kandang4/perhitungan/suhu'] = parseFloat(vm.rerataSuhuL4);
      updates4['/grafik/kandang4/perhitungan/feelslike'] = parseFloat(vm.rerataFeelsLikeL4);
      updates4['/grafik/kandang4/perhitungan/hari'] = vm.dateLantai4;
      updates4['/grafik/kandang4/perhitungan/lastupdate'] = vm.updateDateL4;
      firebase.database().ref().update(updates4);

    });

    function feelsLike (rerataHumidity, rerataSuhu) {
      if (rerataHumidity < 50) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 29.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 30.2) {
          feelsLike = 25;
        } else if (rerataSuhu <= 31.3) {
          feelsLike = 26;
        } else if (rerataSuhu <= 32.5) {
          feelsLike = 27;
        } else if (rerataSuhu <= 33.7) {
          feelsLike = 28;
        } else if (rerataSuhu > 33.7) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 60) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 26.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 27.8) {
          feelsLike = 25;
        } else if (rerataSuhu <= 28.6) {
          feelsLike = 26;
        } else if (rerataSuhu <= 29.9) {
          feelsLike = 27;
        } else if (rerataSuhu <= 31.2) {
          feelsLike = 28;
        } else if (rerataSuhu > 31.2) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 70) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 24.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 25.7) {
          feelsLike = 25;
        } else if (rerataSuhu <= 26.7) {
          feelsLike = 26;
        } else if (rerataSuhu <= 27.7) {
          feelsLike = 27;
        } else if (rerataSuhu <= 28.9) {
          feelsLike = 28;
        } else if (rerataSuhu > 28.9) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 25.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 27.3) {
          feelsLike = 28;
        } else if (rerataSuhu > 27.3) {
          feelsLike = 30;
        }
      } else if (rerataHumidity >= 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 22.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 28;
        } else if (rerataSuhu > 26.0) {
          feelsLike = 30;
        }
      }

      return feelsLike;
    }

    function feelsLikeL2 (rerataHumidity, rerataSuhu) {
      if (rerataHumidity < 50) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 29.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 30.2) {
          feelsLike = 25;
        } else if (rerataSuhu <= 31.3) {
          feelsLike = 26;
        } else if (rerataSuhu <= 32.5) {
          feelsLike = 27;
        } else if (rerataSuhu <= 33.7) {
          feelsLike = 28;
        } else if (rerataSuhu > 33.7) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 60) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 26.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 27.8) {
          feelsLike = 25;
        } else if (rerataSuhu <= 28.6) {
          feelsLike = 26;
        } else if (rerataSuhu <= 29.9) {
          feelsLike = 27;
        } else if (rerataSuhu <= 31.2) {
          feelsLike = 28;
        } else if (rerataSuhu > 31.2) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 70) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 24.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 25.7) {
          feelsLike = 25;
        } else if (rerataSuhu <= 26.7) {
          feelsLike = 26;
        } else if (rerataSuhu <= 27.7) {
          feelsLike = 27;
        } else if (rerataSuhu <= 28.9) {
          feelsLike = 28;
        } else if (rerataSuhu > 28.9) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 25.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 27.3) {
          feelsLike = 28;
        } else if (rerataSuhu > 27.3) {
          feelsLike = 30;
        }
      } else if (rerataHumidity >= 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 22.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 28;
        } else if (rerataSuhu > 26.0) {
          feelsLike = 30;
        }
      }

      return feelsLike;
    }

    function feelsLikeL3 (rerataHumidity, rerataSuhu) {
      if (rerataHumidity < 50) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 29.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 30.2) {
          feelsLike = 25;
        } else if (rerataSuhu <= 31.3) {
          feelsLike = 26;
        } else if (rerataSuhu <= 32.5) {
          feelsLike = 27;
        } else if (rerataSuhu <= 33.7) {
          feelsLike = 28;
        } else if (rerataSuhu > 33.7) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 60) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 26.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 27.8) {
          feelsLike = 25;
        } else if (rerataSuhu <= 28.6) {
          feelsLike = 26;
        } else if (rerataSuhu <= 29.9) {
          feelsLike = 27;
        } else if (rerataSuhu <= 31.2) {
          feelsLike = 28;
        } else if (rerataSuhu > 31.2) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 70) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 24.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 25.7) {
          feelsLike = 25;
        } else if (rerataSuhu <= 26.7) {
          feelsLike = 26;
        } else if (rerataSuhu <= 27.7) {
          feelsLike = 27;
        } else if (rerataSuhu <= 28.9) {
          feelsLike = 28;
        } else if (rerataSuhu > 28.9) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 25.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 27.3) {
          feelsLike = 28;
        } else if (rerataSuhu > 27.3) {
          feelsLike = 30;
        }
      } else if (rerataHumidity >= 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 22.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 28;
        } else if (rerataSuhu > 26.0) {
          feelsLike = 30;
        }
      }

      return feelsLike;
    }

    function feelsLikeL4 (rerataHumidity, rerataSuhu) {
      if (rerataHumidity < 50) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 29.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 30.2) {
          feelsLike = 25;
        } else if (rerataSuhu <= 31.3) {
          feelsLike = 26;
        } else if (rerataSuhu <= 32.5) {
          feelsLike = 27;
        } else if (rerataSuhu <= 33.7) {
          feelsLike = 28;
        } else if (rerataSuhu > 33.7) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 60) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 26.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 27.8) {
          feelsLike = 25;
        } else if (rerataSuhu <= 28.6) {
          feelsLike = 26;
        } else if (rerataSuhu <= 29.9) {
          feelsLike = 27;
        } else if (rerataSuhu <= 31.2) {
          feelsLike = 28;
        } else if (rerataSuhu > 31.2) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 70) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 24.8) {
          feelsLike = 24;
        } else if (rerataSuhu <= 25.7) {
          feelsLike = 25;
        } else if (rerataSuhu <= 26.7) {
          feelsLike = 26;
        } else if (rerataSuhu <= 27.7) {
          feelsLike = 27;
        } else if (rerataSuhu <= 28.9) {
          feelsLike = 28;
        } else if (rerataSuhu > 28.9) {
          feelsLike = 30;
        }
      } else if (rerataHumidity < 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 25.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 27.3) {
          feelsLike = 28;
        } else if (rerataSuhu > 27.3) {
          feelsLike = 30;
        }
      } else if (rerataHumidity >= 80) {
        if (rerataSuhu == 0) {
          feelsLike = 0;
        } else if (rerataSuhu <= 22.0) {
          feelsLike = 24;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 25;
        } else if (rerataSuhu <= 23.0) {
          feelsLike = 26;
        } else if (rerataSuhu <= 24.0) {
          feelsLike = 27;
        } else if (rerataSuhu <= 26.0) {
          feelsLike = 28;
        } else if (rerataSuhu > 26.0) {
          feelsLike = 30;
        }
      }

      return feelsLike;
    }

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

        
        if (tanggal == vm.updateTemp) {
          rataBerat = parseFloat(childSnapshot.val().berat)/1000;
        }

        totalPakan += pakan * 50;
        ayamMati += mati;

      })

      //function hitung FCR
      var ayamHidup = vm.jumlahAyamL1 - ayamMati;

      vm.totalPakan = totalPakan/50;
      if (rataBerat == 0) {
        var fcr = 0; 
      } else {
        var fcr = totalPakan / (ayamHidup * rataBerat);
      }
      
      vm.fcr  = fcr.toFixed(2);

      //function hitung IP
      var percentMortality = (ayamMati / vm.jumlahAyamL1)*100;

      if (fcr == 0.00) {
        var ip = 0;
      } else {
        var ip = ((100 - percentMortality) * rataBerat * 100) / (fcr * vm.dateLantai1);
      }
      
      vm.ip = ip.toFixed(2);

      var updates = {};
      updates['/grafik/kandang1/perhitungan/fcr'] = parseFloat(vm.fcr);
      updates['/grafik/kandang1/perhitungan/ip'] = parseFloat(vm.ip);
      firebase.database().ref().update(updates);
    });

    refPakanL2.on("value", function (snapshot) {
      var totalPakanL2 = 0;
      var ayamMatiL2   = 0;
      var rataBeratL2  = 0;

      snapshot.forEach(function (childSnapshot) {
        var tanggalL2 = childSnapshot.key;
        var pakanL2 = childSnapshot.val().pakan;
        var matiL2  = childSnapshot.val().ayamMati;

        if (tanggalL2 == vm.updateTempL2) {
          rataBeratL2 = parseFloat(childSnapshot.val().berat)/1000;
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

      var ayamHidupL2 = vm.jumlahAyamL2 - ayamMatiL2;

      vm.totalPakanL2 = totalPakanL2/50;
      if (rataBeratL2 == 0) {
        var fcrL2 = 0; 
      } else {
        var fcrL2 = totalPakanL2 / (ayamHidupL2 * rataBeratL2);
      }

      vm.fcrL2  = fcrL2.toFixed(2);

      //function hitung IP
      var percentMortalityL2 = (ayamMatiL2 / vm.jumlahAyamL2)*100;

      if (fcrL2 == 0.00) {
        var ipL2 = 0;
      } else {
        var ipL2 = ((100 - percentMortalityL2) * rataBeratL2 * 100) / (fcrL2 * vm.dateLantai2);
      }
      
      vm.ipL2 = ipL2.toFixed(2);

      var updates = {};
      updates['/grafik/kandang2/perhitungan/fcr'] = parseFloat(vm.fcrL2);
      updates['/grafik/kandang2/perhitungan/ip'] = parseFloat(vm.ipL2);
      firebase.database().ref().update(updates);
    });

    refPakanL3.on("value", function (snapshot) {
      var totalPakanL3 = 0;
      var ayamMatiL3   = 0;
      var rataBeratL3  = 0;

      snapshot.forEach(function (childSnapshot) {
        var tanggalL3 = childSnapshot.key;
        var pakanL3 = childSnapshot.val().pakan;
        var matiL3  = childSnapshot.val().ayamMati;

        if (tanggalL3 == vm.updateTempL3) {
          rataBeratL3 = parseFloat(childSnapshot.val().berat)/1000;
        }

        if (pakanL3 == null) {
          pakanL3 = 0;
        }

        if (matiL3 == null) {
          matiL3 = 0;
        }

        totalPakanL3 += pakanL3 * 50;
        ayamMatiL3 += matiL3;
      })

      var ayamHidupL3 = vm.jumlahAyamL3 - ayamMatiL3;

      vm.totalPakanL3 = totalPakanL3/50;
      if (rataBeratL3 == 0) {
        var fcrL3 = 0; 
      } else {
        var fcrL3 = totalPakanL3 / (ayamHidupL3 * rataBeratL3);
      }

      vm.fcrL3  = fcrL3.toFixed(2);

      //function hitung IP
      var percentMortalityL3 = (ayamMatiL3 / vm.jumlahAyamL3)*100;

      if (fcrL3 == 0.00) {
        var ipL3 = 0;
      } else {
        var ipL3 = ((100 - percentMortalityL3) * rataBeratL3 * 100) / (fcrL3 * vm.dateLantai3);
      }
      
      vm.ipL3 = ipL3.toFixed(2);

      var updates = {};
      updates['/grafik/kandang3/perhitungan/fcr'] = parseFloat(vm.fcrL3);
      updates['/grafik/kandang3/perhitungan/ip'] = parseFloat(vm.ipL3);
      firebase.database().ref().update(updates);
    });

    refPakanL4.on("value", function (snapshot) {
      var totalPakanL4 = 0;
      var ayamMatiL4   = 0;
      var rataBeratL4  = 0;

      snapshot.forEach(function (childSnapshot) {
        var tanggalL4 = childSnapshot.key;
        var pakanL4 = childSnapshot.val().pakan;
        var matiL4  = childSnapshot.val().ayamMati;

        if (tanggalL4 == vm.updateTempL4) {
          rataBeratL4 = parseFloat(childSnapshot.val().berat)/1000;
        }

        if (pakanL4 == null) {
          pakanL4 = 0;
        }

        if (matiL4 == null) {
          matiL4 = 0;
        }

        totalPakanL4 += pakanL4 * 50;
        ayamMatiL4 += matiL4;
      })

      var ayamHidupL4 = vm.jumlahAyamL4 - ayamMatiL4;

      vm.totalPakanL4 = totalPakanL4/50;
      if (rataBeratL4 == 0) {
        var fcrL4 = 0; 
      } else {
        var fcrL4 = totalPakanL4 / (ayamHidupL4 * rataBeratL4);
      }

      vm.fcrL4  = fcrL4.toFixed(2);

      //function hitung IP
      var percentMortalityL4 = (ayamMatiL4 / vm.jumlahAyamL4)*100;

      if (fcrL4 == 0.00) {
        var ipL4 = 0;
      } else {
        var ipL4 = ((100 - percentMortalityL4) * rataBeratL4 * 100) / (fcrL4 * vm.dateLantai4);
      }
      
      vm.ipL4 = ipL4.toFixed(2);

      var updates = {};
      updates['/grafik/kandang4/perhitungan/fcr'] = parseFloat(vm.fcrL4);
      updates['/grafik/kandang4/perhitungan/ip'] = parseFloat(vm.ipL4);
      firebase.database().ref().update(updates);
    });

    // Fungsi Notifikasi Penjarangan 15%
    if (vm.dateLantai1 == 27) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Hari ke-27, Penjarangan Populasi 15%')
          .position('top right')
          .hideDelay(6000)
      );  
    }

    if (vm.dateLantai2 == 27) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Hari ke-27, Penjarangan Populasi 15%')
          .position('top right')
          .hideDelay(6000)
      );  
    }
    
    // Fungsi Notifikasi Mulai Panen
    if (vm.dateLantai1 == 32) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Hari ke-32, Mulai Panen')
          .position('top right')
          .hideDelay(6000)
      );  
    }

    if (vm.dateLantai2 == 32) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Hari ke-32, Mulai Panen')
          .position('top right')
          .hideDelay(6000)
      );  
    }

    // Fungsi Notifikasi Kontrol Pakan
    if (vm.totalPakan >= 1200) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Kontrol Pakan')
          .position('top right')
          .hideDelay(6000)
      );  
    }

    if (vm.totalPakanL2 >= 1200) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Kontrol Pakan')
          .position('top right')
          .hideDelay(6000)
      );  
    }

    // Formatting
    vm.setTanggal = setTanggal;
    vm.beratColor = beratColor;
    vm.ammoniaColor = ammoniaColor;
    vm.temperatureColor = temperatureColor;
    vm.humidityColor = humidityColor;    
    vm.sensorColor = sensorColor;

    function setTanggal (tanggal) {
      var push, split;

      if (tanggal != null) {
        split = tanggal.split('-');
        tanggal = split[2] + '-' + split[1] + '-' + split[0];
      } else {
        tanggal  = null;
      }      

      return tanggal;
    }

    function beratColor (a, tgl) {
      if (tgl == vm.now) {
        if (a < 0 || a == 'ERROR')
          return 'indicator-red';
        else 
          return 'indicator-grey';
      } else {
        return '';
      }
      
    };

    function ammoniaColor (b, tgl) {
      var a = (-0.0357)*parseInt(b)+12.843;

      if (tgl == vm.now) {
        if (a > 20.00 || b == 'ERROR')
          return 'indicator-red';
        else 
          return 'indicator-grey';
      } else {
        return '';
      }
    };

    function humidityColor (c, tgl) {
      if (tgl == vm.now) {
        if ((c < 60 || c > 70)  || c == 'ERROR')
          return 'indicator-red';
        else 
          return 'indicator-grey';
      } else {
        return '';
      }
    };

    function temperatureColor (d, tgl) {
      if (tgl == vm.now) {
        if ((d < 20 || d > 40)  || d == 'ERROR')
          return 'indicator-red';
        else 
          return 'indicator-grey';
      } else {
        return '';
      }
    };

    function sensorColor (a) {
      if (a > 28) 
        return 'sensor-indoor-red';
      else 
        return 'sensor-indoor-green';
    };

  }

})();