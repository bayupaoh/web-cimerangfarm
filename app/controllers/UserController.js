var app = angular.module('myApp',['firebase','ngCookies']);


app.controller('loginCtrl',['$scope','$firebaseAuth','$cookies',
  function($scope ,$firebaseAuth, $cookies) {
    //var ref = new Firebase("https://cimerangfarm-421db.firebaseio.com/");
    var auth = $firebaseAuth();

    var current = $cookies.get('user_id');
    console.log(auth.$currentUser)
    // if(current != ''){
    //   window.location.href = '/';
    // }
    console.log(current);

    $scope.login = function() {
      console.log($scope.user);
      var email = $scope.user.email;
      var password = $scope.user.password;
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
