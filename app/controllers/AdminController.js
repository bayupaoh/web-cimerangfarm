(function(){
  'use strict';

  angular
    .module('appController')
    .controller('adminController', adminController);

  function adminController($firebaseArray) {
    var vm = this;
    var ref = firebase.database().ref().child('admin');

    vm.admin = $firebaseArray(ref);
    vm.addAdmin = function () {
      vm.admin.$add({
      	username: vm.admin.username,
      	password: vm.admin.password
      })
      .then(function (ref) {
      	console.log("Admin dengan username " + vm.admin.username + " berhasil ditambahkan");
      });
    };
    
  }

})();
