'use strict'

angular
  .module('farmCimerang', ['appController', 'ngMaterial', 'ui.router', 'firebase', 'chart.js'])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard.html'
      })
      .state('input-data', {
        url: '/input-data',
        templateUrl: 'app/views/admin.html'
      })

    /*  .state('daftar', {
        url: '/daftar',
        templateUrl: 'app/views/daftar.html',
        controller: 'adminController',
        controllerAs: 'vm'
      })
      .state('kandang', {
        url: '/kandang',
        templateUrl: 'app/views/kandang.html'
      })
      .state('sensor', {
        url: '/sensor',
        templateUrl: 'app/views/sensor.html'
      }) */
      .state('android/lantai1', {
        url: '/android/lantai1',
        templateUrl: 'app/views/android/lantai1.html'
      })
      .state('android/lantai2', {
        url: '/android/lantai2',
        templateUrl: 'app/views/android/lantai2.html'
      }).state('pengguna', {
        url: '/pengguna',
        templateUrl: 'app/views/android/lantai2.html'
      });

    $urlRouterProvider.otherwise('/dashboard');

    $mdThemingProvider
      .theme('default')
      .primaryPalette('amber')
      .accentPalette('red');

    $mdThemingProvider
      .theme('tabs')
      .primaryPalette('red')
      .accentPalette('amber');
  });
