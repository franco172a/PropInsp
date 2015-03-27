$.support.cors = true;
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'loginController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.

    angular.module('main').controller(controllerId,
        ['common', '$location', '$routeParams', loginController]);

    function loginController(common, $location, $routeParams) {
        var vm = this;

        var loadResource = common.myResource.loginResource;
        var getUrl = common.myResource.getUrl;
        var currentUrl = localStorage.getItem('urlstorageSource');
        var loginurl = currentUrl + '/Login';
        var checkedURL = localStorage.getItem('checkedURL');
        vm.showLoginForm = true;
        vm.showLoading = false;
        vm.loadingMsg = 'Connecting to server, please wait...';
        vm.message = "";
        vm.userError = false;
        vm.passwordError = false;
        vm.userModel = { userName: '', password: '' };
        vm.userLogin = userLogin;
        vm.setUrl = setUrl;




        function existURL() {

            var url = localStorage.getItem('urlstorageSource');

            if (url != null) {
                vm.showLoginForm = true;
            }
            else {
                vm.showLoginForm = false;
            }

        };


        existURL();

        function userLogin() {
            vm.showLoading = true;

            loadResource.login(vm.userModel, function (successResult) {

                vm.showLoading = false;
                vm.message = successResult.Message

                if (successResult.UserValid) {
                    localStorage.setItem('userName', successResult.UserName);
                    localStorage.setItem('password', successResult.Password);
                    localStorage.setItem('userId', successResult.SecUserId);
                    localStorage.setItem('token', successResult.token);
                    window.location.href = 'propertyList.html#' + successResult.SecUserId;
                }
                else{

                    var offUser = localStorage.getItem('userName');
                    var offPass = localStorage.getItem('password');

                    if ((vm.userModel.userName == offUser)&&(vm.userModel.password == offPass)) {
                        window.location.href = 'offlineInspections.html';
                    };
                }

            }, function (errorResult) {

                var offUser = localStorage.getItem('userName');
                var offPass = localStorage.getItem('password');

                if ((vm.userModel.userName == offUser)&&(vm.userModel.password == offPass)) {
                    window.location.href = 'offlineInspections.html';
                }
                else{
                    vm.message = "Invalid User ID or Password supplied";
                    vm.showLoading = false;
                }
            });
        };


        function setUrl() {
            var url = document.getElementById("urlString").value;

            if (url != undefined) {
                var loginurl = url + '/Login';
                document.getElementById("urlLoadingMessage").style.display = "block";
                document.getElementById("urlValidationMessage").style.display = "none";

                $.ajax({
                    url: loginurl,
                    cache: false,
                    dataType: 'json',
                    success: function (successResult) {

                        if (successResult == 'successful') {
                            localStorage.setItem('urlstorageSource', url);
                        }
                        window.location.reload();
                        document.getElementById("urlLoadingMessage").style.display = "none";
                    },
                    error: function () {
                        document.getElementById("urlLoadingMessage").style.display = "none";
                        document.getElementById("urlValidationMessage").style.display = "block";
                    }
                });
            }
        };




    };

})();