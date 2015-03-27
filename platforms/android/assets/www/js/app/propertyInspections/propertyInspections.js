$.support.cors = true;
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'inspectionsController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('main').controller(controllerId,
        ['common', '$location', '$routeParams', inspectionsController]);

    function inspectionsController(common, $location, $routeParams) {
        var vm = this;

         var receiveddata = window.location.hash.substr(1).replace('/','');
         var res = receiveddata.split("#");
         var res2 = res[1].split("$");
         var currentId = res[0];
         vm.userId = res2[0].replace(/%20/g, " ");
         vm.propertyName= res2[1].replace(/%20/g, " ");

        var loadResource = common.myResource.propertyInspection;
        vm.showLoading = false;
        vm.loadingMsg = 'Loading, please wait...';
        vm.getProperties = getProperties;
        vm.propertyInspectionsList = [];
        vm.obj = { id: 0 };
        vm.obj.id = currentId;
        vm.propertyId = currentId;
       

        function getProperties() {           
            vm.showLoading = true;
            loadResource.getProperties(vm.obj, function (successResult) {
                vm.propertyInspectionsList = successResult.PropertyInspectionsList;
                vm.showLoading = false;
            }, function (errorResult) {
                vm.errorResult = errorResult.data.message;
                vm.showLoading = false;
            });
        };
    }


})();
