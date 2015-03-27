// Main configuration file. Sets up AngularJS module and routes and any other config objects

var appRoot = angular.module('main', [
    //Angular Modules
    'ngAnimate',        // animations
    'ngRoute',
    'ngResource',
    'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
   

     //// Custom modules 
     'common',           // common functions, logger, spinner
     //'common.bootstrap', // bootstrap dialog wrapper functions

    // 3rd Party Modules
     // ui-bootstrap (ex: carousel, pagination, dialog)
    'ui.bootstrap'

]);     //Define the main module
