(function(){
  'use strict';

  angular
    .module('appController')
    .controller('feelsLikeController', feelsLikeController);

  function feelsLikeController($scope) {

    //Database Reference
    var ref = firebase.database().ref('kandangmirror/s');

    //Read Data
    ref.on('value', function ref(snapshot) {
      var count = 0, count2 = 0;
      var totalSuhu = 0, totalSuhu2 = 0; 
      var totalHumidity = 0, totalHumidity2 = 0;

      snapshot.forEach(function (childSnapshot) {

        if (childSnapshot.val().tipe == 'si') {
          var suhu = parseFloat(childSnapshot.val().a);
          var humidity = parseFloat(childSnapshot.val().b);   
                    
          if (childSnapshot.val().lantai == 1) {
            totalSuhu = totalSuhu + suhu;
            totalHumidity += humidity;
            count++;
          }

          if (childSnapshot.val().lantai == 2) {
            totalSuhu2 = totalSuhu2 + suhu;
            totalHumidity2 += humidity;
            count2++;
          }
        }
      });

      var rerataSuhu = totalSuhu / count;
      var rerataHumidity = totalHumidity / count;
      var rerataSuhu2 = totalSuhu2 / count2;
      var rerataHumidity2 = totalHumidity2 / count2;

      var rerataFeelsLike = feelsLike(rerataHumidity, rerataSuhu);
      var rerataFeelsLike2 = feelsLike2(rerataHumidity2, rerataSuhu2);

      console.log(rerataFeelsLike);
      console.log(rerataFeelsLike2);

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

    function feelsLike2 (rerataHumidity, rerataSuhu) {
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
  }

})();