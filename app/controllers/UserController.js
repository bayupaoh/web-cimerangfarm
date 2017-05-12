(function(){
  'use strict';

  angular
    .module('appController')
    .controller('userController', userController);

      function userController($firebaseAuth, $state) {
        var vm = this;

        var ref = firebase.database().ref('admin/')

        vm.addAdmin = function () {
          var email = vm.user.email + '@gmail.com';
          var password = vm.user.password;

          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function (authData) {
            firebase.database().ref('admin/' + authData.uid).set({
              nama: vm.user.nama,
              role: 'petugas'
            });
          })
          .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
        }

        vm.errorMessage = '';

        vm.login = function() {
          var email = vm.user.email + '@gmail.com';
          var password = vm.user.password;
          firebase.auth().signInWithEmailAndPassword(email, password)
            .then (function () {
              console.log('Logged In' + vm.user.email);
              $state.go('menu.home');
            })
            .catch(function(err) {
              var errorCode = err.code;
              var errorMessage = err.message;
              if (errorCode === 'auth/wrong-password') {
                alert('Password salah. Silahkan isi kembali');
              } else {
                alert(errorMessage);
              }
          });
        };

        vm.logout = function() {
          firebase.auth().signOut().then(function() {
            console.log('Successfully Logout');
            $state.go('login');
          }, function(error) {
            
          });
        }
      }  

})();