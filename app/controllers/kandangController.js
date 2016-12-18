(function(){
  'use strict';

  angular
    .module('appController')
    .controller('kandangController', kandangController);

  function kandangController($firebaseArray) {
    var vm = this;
    var gridRef = firebase.database().ref().child('percobaantampilkandang').child('g');
    var sensorRef = firebase.database().ref().child('percobaantampilkandang').child('s');

    vm.grids = $firebaseArray(gridRef);
    vm.sensor = $firebaseArray(sensorRef);

    vm.humidityColor = humidityColor;
    vm.ammoniaColor = ammoniaColor;
    vm.tableColor = tableColor;

    function humidityColor (d) {
      if (d < 60 || d > 70)
        return 'indicator-red';
      else 
        return '';
    };

    function ammoniaColor (b) {
      if (b > 20)
        return 'indicator-red';
      else 
        return '';
    };

    function tableColor (a) {
      if (a > 28) 
        return 'sensor-indoor-red';
      else 
        return 'sensor-indoor-green';
    };
    
  }

})();
