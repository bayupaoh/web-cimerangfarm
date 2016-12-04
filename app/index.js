'use strict'

angular
  .module('farmCimerang', ['ngMaterial', 'ui.router', 'appController'])

  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    'use strict';

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard.html'
      })
      .state('daftar', {
        url: '/daftar',
        templateUrl: 'app/views/daftar.html',
        controller: 'adminController',
        controllerAs: 'vm'
      })
      .state('kandang', {
        url: '/kandang',
        templateUrl: 'app/views/kandang.html'
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