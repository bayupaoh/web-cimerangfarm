(function(){
  'use strict';

  angular
    .module('appController')
    .controller('loginCtrl',['$firebaseAuth','$cookies',
      function($firebaseAuth, $cookies) {
        //var ref = new Firebase("https://cimerangfarm-421db.firebaseio.com/");

        var vm = this;
        var auth = $firebaseAuth();

        var current = $cookies.get('user_id');
        console.log(auth.$currentUser)
        // if(current != ''){
        //   window.location.href = '/';
        // }
        console.log(current);

        vm.login = function() {
          console.log(vm.user);
          var email = vm.user.email;
          var password = vm.user.password;
          if(email == '' || password == ''){
            console.log('harus lengkap');
          }else{
            auth.$signInWithEmailAndPassword(email,password)
            .then(function(authData) {
              console.log('Logged in as:', authData.uid);
              console.log('Logged in as:', authData.email);
              $cookies.put('user_id',authData.uid);

              //window.location.href = '/';
              //$state.go('profile');
            })
            .catch(function(err) {
              console.log('error:',err);
              //$state.go('login');
            });
          }

        };
      }]
    );
})();