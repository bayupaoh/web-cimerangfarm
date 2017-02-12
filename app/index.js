'use strict'

angular
  .module('farmCimerang', ['appController', 'ngMaterial', 'ngMessages', 'ui.router', 'firebase', 'chart.js'])
  .config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {

    $stateProvider
      .state('menu', {
        url: '/menu',
        templateUrl: 'app/views/menu.html'
      })
      .state('menu.dashboard1', {
        url: '/dashboard/kandang1',
        templateUrl: 'app/views/dashboard1.html'
      })
      .state('menu.dashboard2', {
        url: '/dashboard/kandang2',
        templateUrl: 'app/views/dashboard2.html'
      })
      .state('menu.dashboard3', {
        url: '/dashboard/kandang3',
        templateUrl: 'app/views/dashboard3.html'
      })
      .state('menu.dashboard4', {
        url: '/dashboard/kandang4',
        templateUrl: 'app/views/dashboard4.html'
      })
      .state('menu.home', {
        url: '/dashboard',
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
        controller: 'adminController',
        controllerAs: 'vm'
      })
      .state('android/kandang1', {
        url: '/android/kandang1',
        templateUrl: 'app/views/android/kandang1.html'
      })
      .state('android/kandang2', {
        url: '/android/kandang2',
        templateUrl: 'app/views/android/kandang2.html'
      })
      .state('android/kandang3', {
        url: '/android/kandang3',
        templateUrl: 'app/views/android/kandang3.html'
      })
      .state('android/kandang4', {
        url: '/android/kandang4',
        templateUrl: 'app/views/android/kandang4.html'
      })
      .state('android/dashboard1', {
        url: '/android/dashboard1',
        templateUrl: 'app/views/android/dashboard1.html'
      })
      .state('android/dashboard2', {
        url: '/android/dashboard2',
        templateUrl: 'app/views/android/dashboard2.html'
      })
      .state('android/dashboard3', {
        url: '/android/dashboard3',
        templateUrl: 'app/views/android/dashboard3.html'
      })
      .state('android/dashboard4', {
        url: '/android/dashboard4',
        templateUrl: 'app/views/android/dashboard4.html'
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