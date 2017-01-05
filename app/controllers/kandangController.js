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
        else if (input == 0)
          return 0.00 + ' gr';
        else {
          return input/2 + ' gr';
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

  function kandangController($firebaseArray, $mdToast) {
    var vm = this;

    var refGrid = firebase.database().ref('kandangmirror/g');
    var refSensor = firebase.database().ref('kandangmirror/s');
    var refSetting = firebase.database().ref().child('setting');
    var refPakan = firebase.database().ref('percobaangrafik/lantai1/feedandmortality');
    var refPakanL2 = firebase.database().ref('percobaangrafik/lantai2/feedandmortality');

    const dates = new Date();
    var year = dates.getFullYear();
    var month = dates.getMonth() + 1;
    var date = dates.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    var now = year + '-' + month + '-' + date;
    vm.now = now;
    
    vm.grid = $firebaseArray(refGrid);
    vm.sensor = $firebaseArray(refSensor);
    
    refSetting.on("value", function (snapshot) {
        vm.setAmmonia = snapshot.val().amonia;
        vm.setAnemometer = snapshot.val().anemometer;
        vm.setInterval = parseInt(snapshot.val().interval_check_sensor);
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
        var waktuSkrg = '';
        var tglSkrg = '';

        var totalAmmoniaL2 = 0;
        var totalHumidityL2 = 0;
        var totalSuhuL2 = 0;
        var totalBeratL2 = 0;
        var countAmmoniaL2 = 0;
        var countHumidityL2 = 0;
        var countSuhuL2 = 0;
        var countBeratL2 = 0;
        var waktuSkrgL2 = '';
        var tglSkrgL2 = '';

        var totalAmmoniaYs = 0;
        var totalHumidityYs = 0;
        var totalSuhuYs = 0;
        var totalBeratYs = 0;
        var countAmmoniaYs = 0;
        var countHumidityYs = 0;
        var countSuhuYs = 0;
        var countBeratYs = 0;
        var waktuKmrn = '';
        var tglKmrn = '';

        var totalAmmoniaYsL2 = 0;
        var totalHumidityYsL2 = 0;
        var totalSuhuYsL2 = 0;
        var totalBeratYsL2 = 0;
        var countAmmoniaYsL2 = 0;
        var countHumidityYsL2 = 0;
        var countSuhuYsL2 = 0;
        var countBeratYsL2 = 0;
        var waktuKmrnL2 = '';
        var tglKmrnL2 = '';

        snapshot.forEach(function (childSnapshot) {
          
          var getTanggal = childSnapshot.val().tanggal;

          var lastDate = new Date();
          var yyyy = lastDate.getFullYear();
          var mm = lastDate.getMonth() + 1;
          var dd = lastDate.getDate() - 1;

          if (mm < 10) {
            mm = '0' + mm;
          }

          if (date < 10) {
            dd = '0' + dd;
          }

          var yesterday = yyyy + '-' + mm + '-' + dd;
          vm.yesterday = yesterday;          

          //Tanggal Sekarang
          if (childSnapshot.val().tanggal == vm.now) {

            if (childSnapshot.val().lantai == 1) {
              var berat = childSnapshot.val().a;
              var ammonia = childSnapshot.val().b;
              var humidity = childSnapshot.val().c;
              var suhu = childSnapshot.val().d;

              var waktu = childSnapshot.val().waktu;

              if (waktu > waktuSkrg) {
                waktuSkrg = waktu;
                tglSkrg = childSnapshot.val().tanggal;
              }

              if (berat > 0) {
                totalBerat += parseFloat(berat/2);
                countBerat++;
              }

              if (ammonia > 0) {
                totalAmmonia += (-0.0357)*parseFloat(ammonia)+12.843;
                countAmmonia++;
              }

              if (suhu >= 20 && suhu <= 40) {
                totalSuhu += parseFloat(suhu);
                countSuhu++;
              }

              if(humidity > 0) {
                totalHumidity += parseFloat(humidity);
                countHumidity++;
              }

            } else if (childSnapshot.val().lantai == 2) {
              var beratL2 = childSnapshot.val().a;
              var ammoniaL2 = childSnapshot.val().b;
              var humidityL2 = childSnapshot.val().c;
              var suhuL2 = childSnapshot.val().d;

              var waktuL2 = childSnapshot.val().waktu;

              if (waktuL2 > waktuSkrgL2) {
                waktuSkrgL2 = waktuL2;
                tglSkrgL2 = childSnapshot.val().tanggal;
              }

              if (beratL2 > 0) {

                totalBeratL2 += parseFloat(beratL2/2);
                countBeratL2++;
              }

              if (ammoniaL2 > 0) {
                totalAmmoniaL2 += (-0.0357)*parseFloat(ammoniaL2)+12.843;
                countAmmoniaL2++;
              }

              if (suhuL2 >= 20 && suhuL2 <= 40) {
                totalSuhuL2 += parseFloat(suhuL2);
                countSuhuL2++;
              }

              if(humidityL2 > 0) {
                totalHumidityL2 += parseFloat(humidityL2);
                countHumidityL2++;
              }

            }
          
          }

          //Tanggal Kemarin
          if (childSnapshot.val().tanggal == yesterday) {

            if (childSnapshot.val().lantai == 1) {
              var beratYs = childSnapshot.val().a;
              var ammoniaYs = childSnapshot.val().b;
              var humidityYs = childSnapshot.val().c;
              var suhuYs = childSnapshot.val().d;

              var waktuK = childSnapshot.val().waktu;

              if (waktuK > waktuKmrn) {
                waktuKmrn = waktuK;
                tglKmrn = childSnapshot.val().tanggal;
              }              

              if (beratYs > 0) {

                totalBeratYs += parseFloat(beratYs/2);
                countBeratYs++;
              }

              if (ammoniaYs > 0) {
                totalAmmoniaYs += (-0.0357)*parseFloat(ammoniaYs)+12.843;
                countAmmoniaYs++;
              }

              if (suhuYs >= 20 && suhuYs <= 40) {
                totalSuhuYs += parseFloat(suhuYs);
                countSuhuYs++;
              }

              if(humidityYs > 0) {
                totalHumidityYs += parseFloat(humidityYs);
                countHumidityYs++;
              }  

            } else if (childSnapshot.val().lantai == 2) {
              var beratYsL2 = childSnapshot.val().a;
              var ammoniaYsL2 = childSnapshot.val().b;
              var humidityYsL2 = childSnapshot.val().c;
              var suhuYsL2 = childSnapshot.val().d;

              var waktuK2 = childSnapshot.val().waktu;

              if (waktuK2 > waktuKmrnL2) {
                waktuKmrnL2 = waktuK2;
                tglKmrnL2 = childSnapshot.val().tanggal;
              } 

              if (beratYsL2 > 0) {

                totalBeratYsL2 += parseFloat(beratYsL2/2);
                countBeratYsL2++;
              }

              if (ammoniaYsL2 > 0) {
                totalAmmoniaYsL2 += (-0.0357)*parseFloat(ammoniaYsL2)+12.843;
                countAmmoniaYsL2++;
              }

              if (suhuYsL2 >= 20 && suhuYsL2 <= 40) {
                totalSuhuYsL2 += parseFloat(suhuYsL2);
                countSuhuYsL2++;
              }

              if(humidityYsL2 > 0) {
                totalHumidityYsL2 += parseFloat(humidityYsL2);
                countHumidityYsL2++;
              }

            }
          
          }

        });

        if (countBerat > 0 && countAmmonia > 0 && countHumidity > 0 && countSuhu > 0) {
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

          vm.tglUpdateTemp = tglSkrg;
          var split = tglSkrg.split('-');

          vm.tglUpdate = split[2] + '-' + split[1] + '-' + split[0];

          vm.waktuUpdate = waktuSkrg; 
        } else {
            vm.rerataBerat = (totalBeratYs / countBeratYs).toFixed(2);
            vm.rerataAmmonia = (totalAmmoniaYs / countAmmoniaYs).toFixed(2);
            vm.rerataHumidity = (totalHumidityYs / countHumidityYs).toFixed(2);
            vm.rerataSuhu = (totalSuhuYs / countSuhuYs).toFixed(2);

            vm.tglUpdateTemp = tglKmrn;
            var split = tglKmrn.split('-');

            vm.tglUpdate = split[2] + '-' + split[1] + '-' + split[0];

            vm.waktuUpdate = waktuKmrn;
        }

        if (countBeratL2 > 0 && countAmmoniaL2 > 0 && countHumidityL2 > 0 && countSuhuL2 > 0) {
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
          
          vm.tglUpdateTempL2 = tglSkrgL2;
          var split = tglSkrgL2.split('-');

          vm.tglUpdateL2 = split[2] + '-' + split[1] + '-' + split[0]; 

          vm.waktuUpdateL2 = waktuSkrgL2;  
        } else {
            vm.rerataBeratL2 = (totalBeratYsL2 / countBeratYsL2).toFixed(2);
            vm.rerataAmmoniaL2 = (totalAmmoniaYsL2 / countAmmoniaYsL2).toFixed(2);
            vm.rerataHumidityL2 = (totalHumidityYsL2 / countHumidityYsL2).toFixed(2);
            vm.rerataSuhuL2 = (totalSuhuYsL2 / countSuhuYsL2).toFixed(2);

            vm.tglUpdateTempL2 = tglKmrnL2;
            var split = tglKmrnL2.split('-');

            vm.tglUpdateL2 = split[2] + '-' + split[1] + '-' + split[0];
            vm.waktuUpdateL2 = waktuKmrnL2;
        }
        
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
        
        if (tanggal == vm.tglUpdateTemp) {
          rataBerat = (childSnapshot.val().berat)/1000;
        }

        totalPakan += pakan * 50;
        ayamMati += mati;

      })

      //function hitung FCR
      var ayamHidup = vm.setAyamLantai1 - ayamMati;

      vm.totalPakan = totalPakan/50;
      if (rataBerat == 0) {
        var fcr = 0; 
      } else {
        var fcr = totalPakan / (ayamHidup * rataBerat);
      }
      
      vm.fcr  = fcr.toFixed(2);

      //function hitung IP
      var percentMortality = (ayamMati / vm.setAyamLantai1)*100;

      if (fcr == 0.00) {
        var ip = 0;
      } else {
        var ip = ((100 - percentMortality) * rataBerat * 100) / (fcr * vm.dateLantai1);
      }
      
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

        if (tanggalL2 == vm.tglUpdateTempL2) {
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

      vm.totalPakanL2 = totalPakanL2/50;
      if (rataBeratL2 == 0) {
        var fcrL2 = 0; 
      } else {
        var fcrL2 = totalPakanL2 / (ayamHidupL2 * rataBeratL2);
      }

      vm.fcrL2  = fcrL2.toFixed(2);

      //function hitung IP
      var percentMortalityL2 = (ayamMatiL2 / vm.setAyamLantai2)*100;

      if (fcrL2 == 0.00) {
        var ipL2 = 0;
      } else {
        var ipL2 = ((100 - percentMortalityL2) * rataBeratL2 * 100) / (fcrL2 * vm.dateLantai2);
      }
      
      vm.ipL2 = ipL2.toFixed(2);
    });

    // Fungsi Notifikasi Penjarangan 15%
    if (vm.dateLantai1 == 27 || vm.rerataBerat >= 1500) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Hari ke-27, Penjarangan Populasi 15%')
          .position('top right')
          .hideDelay(6000)
      );  
    }

    if (vm.dateLantai2 == 27 || vm.rerataBeratL2 >= 1500) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Hari ke-27, Penjarangan Populasi 15%')
          .position('top right')
          .hideDelay(6000)
      );  
    }
    
    // Fungsi Notifikasi Mulai Panen
    if (vm.dateLantai1 == 32 || vm.rerataBerat >= 1900) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Hari ke-32, Mulai Panen')
          .position('top right')
          .hideDelay(6000)
      );  
    }

    if (vm.dateLantai2 == 32 || vm.rerataBeratL2 >= 1900) {
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

    vm.beratColor = beratColor;
    vm.ammoniaColor = ammoniaColor;
    vm.temperatureColor = temperatureColor;
    vm.humidityColor = humidityColor;    
    vm.sensorColor = sensorColor;

    function beratColor (a, tgl) {
      if (tgl == vm.now) {
        if (a < 0 || a == 'ERROR')
          return 'indicator-red';
        else 
          return '';
      } else {
        return 'indicator-grey';
      }
      
    };

    function ammoniaColor (b, tgl) {
      var a = (-0.0357)*parseInt(b)+12.843;

      if (tgl == vm.now) {
        if (a > 20.00 || b == 'ERROR')
          return 'indicator-red';
        else 
          return '';
      } else {
        return 'indicator-grey';
      }
    };

    function humidityColor (c, tgl) {
      if (tgl == vm.now) {
        if ((c < 60 || c > 70)  || c == 'ERROR')
          return 'indicator-red';
        else 
          return '';
      } else {
        return 'indicator-grey';
      }
    };

    function temperatureColor (d, tgl) {
      if (tgl == vm.now) {
        if ((d < 20 || d > 40)  || d == 'ERROR')
          return 'indicator-red';
        else 
          return '';
      } else {
        return 'indicator-grey';
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