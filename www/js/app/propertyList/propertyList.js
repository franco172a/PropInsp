$.support.cors = true;
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'propertyListController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('main').controller(controllerId,
        ['common', '$location', '$routeParams',  propertyListController]);

    function propertyListController(common, $location, $routeParams) {
        var vm = this;
        var currentId = window.location.hash.substr(1).replace('/','');
        var loadResource = common.myResource.propertyList;
        vm.showLoading = false;
        vm.showSettingOffline = false;
        vm.loadingMsg = 'Loading, please wait...';
        vm.getProperties = getProperties;
//        vm.setOfflineMode = setOfflineMode;
        vm.propertiesList = [];
        var userID = currentId;
        vm.userId = currentId;

        var currentUrl = localStorage.getItem('urlstorageSource');
        var propertyurl = currentUrl + '/Property';

        vm.obj = { 'id': userID};

        //var getUrl = common.myResource.getUrl;

        function getProperties() {           

            vm.showLoading = true;

//            getUrl().loginResource.getConnection(function (successResult) {

//                if(successResult[4] == 'c')
//                {

                    loadResource.getProperties(vm.obj, function (successResult) {
                        vm.propertiesList = successResult.PropertiesList;
                        vm.showLoading = false;
                    }, function (errorResult) {
                        vm.errorResult = errorResult.data.message;
                        vm.showLoading = false;
                    });

//                }

//                }, function (errorResult) {

//                var checkedURL = localStorage.getItem('checkedURL');

//                if(checkedURL == 'true')
//                {
//                    var offlineMode = localStorage.getItem('offlineMode');
//                    if(offlineMode == 'true')
//                    {
//                        document.getElementById("offlineButton").style.display = "none";
//                        var result = localStorage.getItem('propertiesList');
//                        var PropertyList = JSON.parse(result);

//                        vm.propertiesList = PropertyList;
//                        vm.showLoading = false;
//                    }
//                    else
//                    {
//                        alert('Unfortunally you are offline and this device does not have any saved data!')
//                    }
//                }
//                else
//                {
//                    window.location.href = 'index.html';
//                }
//            });

        };

//        function setOfflineMode() {

//            var r = confirm("Are you sure you want to set the Offline Mode?");
//            if (r == true) {

//                vm.showSettingOffline = true;
//                localStorage.setItem('offlineMode', 'true');
//                
//                loadResource.getProperties(vm.obj, function (successResult) {

//                var result = JSON.stringify(successResult.PropertiesList);

//                localStorage.setItem('propertiesList', result);

//                vm.showSettingOffline = false;

//                }, function (errorResult) {
//                    vm.errorResult = errorResult.data.message;
//                    vm.showSettingOffline = false;

//                });

//            }
//            else {
//                return;
//            }
//        };
    }

})();
