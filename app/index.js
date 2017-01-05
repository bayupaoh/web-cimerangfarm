'use strict'

angular
  .module('farmCimerang', ['appController', 'ngMaterial', 'ngMessages', 'ui.router', 'firebase', 'chart.js'])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $stateProvider
      .state('menu', {
        url: '/menu',
        templateUrl: 'app/views/menu.html'
      })
      .state('menu.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/dashboard.html'
      })
      .state('menu.home', {
        url: '/home',
        templateUrl: 'app/views/home.html'
      })
      .state('menu.input-data', {
        url: '/input-data',
        templateUrl: 'app/views/admin.html'
      })
      .state('menu.panen', {
        url: '/panen',
        templateUrl: 'app/views/panen.html',
        controller: 'adminController',
        controllerAs: 'vm'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'login.html'
      })
      .state('menu.daftar', {
        url: '/daftar',
        templateUrl: 'app/views/daftar.html',
        controller: 'userController',
        controllerAs: 'vm'
      })
      .state('menu.kandang', {
        url: '/kandang',
        templateUrl: 'app/views/kandang.html',
        controller: 'kandangController',
        controllerAs: 'vm'
      })
      .state('menu.sensor', {
        url: '/sensor',
        templateUrl: 'app/views/sensor.html',
        controller: 'kandangController',
        controllerAs: 'vm'
      })
      .state('menu.pengaturan', {
        url: '/pengaturan',
        templateUrl: 'app/views/setting.html',
        controller: 'kandangController',
        controllerAs: 'vm'
      })
      .state('android/lantai1', {
        url: '/android/lantai1',
        templateUrl: 'app/views/android/lantai1.html'
      })
      .state('android/lantai2', {
        url: '/android/lantai2',
        templateUrl: 'app/views/android/lantai2.html'
      })
      .state('android/dashboard1', {
        url: '/android/dashboard1',
        templateUrl: 'app/views/android/dashboard1.html'
      })
      .state('android/dashboard2', {
        url: '/android/dashboard2',
        templateUrl: 'app/views/android/dashboard2.html'
      });
    
    $urlRouterProvider.otherwise('/login');
  
    $mdThemingProvider
      .theme('default')
      .primaryPalette('amber')
      .accentPalette('red');

    $mdThemingProvider
      .theme('tabs')
      .primaryPalette('red')
      .accentPalette('amber');
  });