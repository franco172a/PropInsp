(function () {
    'use strict';

    var app = angular.module('main');

    // Configure Toastr
    toastr.options.timeOut = 5000;
    toastr.options.positionClass = 'toast-bottom-right';

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46,
        rClick: 0
    };


    var remoteServiceName = 'api/mobilePropInspections/';

    var imageSettings = {
        imageBasePath: '../content/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg'
    };


    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    var config = {
        appErrorPrefix: '[Application] ', //Configure the exceptionHandler decorator
        docTitle: 'Property Inspections: ',
        events: events,
        imageSettings: imageSettings,
        keyCodes: keyCodes,
        remoteServiceName: remoteServiceName,
        version: '1.0.0',
        requestantiforgeryToken: getAntiforgeryToken()
    };

    app.value('config', config);

    app.config(['$logProvider', '$compileProvider', function ($logProvider, $compileProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data):/);
    } ]);

    //#region Configure the common services via commonConfig
    app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    } ]);

    function getAntiforgeryToken() {
        var antiforgeryelement = angular.element('input[name="__RequestVerificationToken"]');
        if (antiforgeryelement) {
            return antiforgeryelement.val();
        }
        return 'invalidtoken';
    }
    //#endregion
})();