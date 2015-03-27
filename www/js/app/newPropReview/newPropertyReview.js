$.support.cors = true;

(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'newPropReviewController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('main').controller(controllerId,
        ['common', '$location', '$routeParams', 'dateFilter', newPropReviewController]);

    function newPropReviewController(common, $location, $routeParams, dateFilter) {
        var vm = this;

        var receiveddata = window.location.hash.substr(1).replace('/', '');
        var res = receiveddata.split("#");
        var res2 = res[1].split("$");
        var propId = res[0];
        vm.userId = res2[0].replace(/%20/g, " ");
        vm.propertyName = res2[1].replace(/%20/g, " ");

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var loadResource = common.myResource.newpropertyreview;
        vm.showLoading = false;
        vm.loadingMsg = 'Loading, please wait...';
        vm.getNewPropReview = getNewPropReview;
        vm.addPropReview = addPropReview;
        var currentUserId  = localStorage.getItem('userId');
        var currentUserName  = localStorage.getItem('userName'); 
        vm.obj = { id: 0 , revUserId: currentUserId , ReviewedBy: currentUserName};
        vm.obj.id = propId;
        vm.id = propId;
        vm.revType = {Text:"", Value:"", Selected:""};

        function getNewPropReview() {

            vm.showLoading = true;
            loadResource.getNewPropReview(vm.obj, function (successResult) {

                var data = successResult;
                vm.reviewedBy = data.ReviewedBy;
                vm.revUserId = data.revUserId;
                vm.reviewTypes = data.ReviewTypes;
                vm.scheduledRevDt = data.ScheduledRevDt;
                vm.showLoading = false;

            }, function (errorResult) {
                vm.errorResult = errorResult.data.message;
                vm.showLoading = false;
                toastr.error(errorResult.data.message);
            });
        };

        function addPropReview() {

            if(checkdate(formatDate(vm.scheduledRevDt)) == true)
                {
                    $("#invalidSchedDateAlert").removeClass("hide");
                }
            else 
            {
                $("#invalidSchedDateAlert").addClass("hide");
            }

            if ($("#selectRevType").val() == "" || checkdate(formatDate(vm.scheduledRevDt)) == true) {
                $("#validationErrorAlert").removeClass("hide");
                return;
            };
            
            vm.showLoading = true;
            vm.loadingMsg = 'Creating Property Inspection…';
            vm.reviewType = vm.revType.Value;
            var model = JSON.stringify(vm);

            loadResource.addPropReview(model, function (successResult) {
            
                var data = successResult;
                vm.showLoading = false;
                log("The Property Review has been added successfully!");
                window.location.href = "propertyInspections.html#" + vm.id + "#" + vm.userId + "$" + vm.propertyName;
            })

            
        };

        function checkdate(date) {       

            var parts = date.split('/');
            if ((parts[0] != null) && (parts[1] != null) && (parts[2] != null) && (parts[3] == null)) {
                var day = parts[1];
                var month = parts[0];
                var year = parts[2];
                var $day = (day.charAt(0) == '0') ? day.charAt(1) : day;
                var $month = (month.charAt(0) == '0') ? month.charAt(1) : month;
                var now = new Date();
                var currentYear = now.getFullYear();
                var currentMonth = now.getMonth();
                var currentDay = now.getDay();
                var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                if (($day > 31 || $day < 1 || isNaN($day)) || ($month > 12 || $month < 1 || isNaN($month)) || (year < 1900 || year > 9000 || isNaN(year)))
                    return true;
                else {

                    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                        monthLength[1] = 29;

                    return $day > monthLength[$month - 1];
                }
            }
            else return true;
        }

        function formatDate(date) {

            var parts = date.split('-');
            var day = parts[2];
            var month = parts[1];
            var year = parts[0];


            var result = month + '/' + day + '/' + year;
            return result;
        };

     };
})();


