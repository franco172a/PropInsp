$.support.cors = true;
(function () {
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'offlineController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('main').controller(controllerId,
        ['common', '$location', '$routeParams', offlineController]);

    function offlineController(common, $location, $routeParams) {
        var vm = this;

        var loadResource = common.myResource.loginResource;
        var loadResourceSync = common.myResource.mobilepropinspections;
        //var getUrl = common.myResource.getUrl;
        var currentUrl = localStorage.getItem('urlstorageSource');
        var loginurl = currentUrl + '/Login';
        var checkedURL = localStorage.getItem('checkedURL');
        vm.showLoginForm = true;
        vm.showLoading = false;
        vm.loadingMsg = 'Connecting to server, please wait...';

        var user = localStorage.getItem('userName');
        var pass = localStorage.getItem('password');
        vm.userModel = { userName: user, password: pass };

        vm.redirectToPropertyList = redirectToPropertyList;

        vm.syncData = syncData;

        vm.mySpotNameOne = JSON.parse(localStorage.getItem('mySpotNameOne'));
        vm.mySpotNameTwo = JSON.parse(localStorage.getItem('mySpotNameTwo'));
        vm.mySpotNameThree = JSON.parse(localStorage.getItem('mySpotNameThree'));
        vm.mySpotNameFour = JSON.parse(localStorage.getItem('mySpotNameFour'));
        vm.mySpotNameFive = JSON.parse(localStorage.getItem('mySpotNameFive'));

        var propinspecVM;
        vm.mySpotNameOneStatus;
        vm.mySpotNameTwoStatus;
        vm.mySpotNameThreeStatus;
        vm.mySpotNameFourStatus;
        vm.mySpotNameFiveStatus;


        if ((vm.mySpotNameOne) && (vm.mySpotNameOne.ReviewStatus) && (vm.mySpotNameOne.ReviewStatuses)) {
            var i;
            for (i = 0; i < vm.mySpotNameOne.ReviewStatuses.length ; i++) {
                if (vm.mySpotNameOne.ReviewStatuses[i].Value == vm.mySpotNameOne.ReviewStatus.toString()) {
                    vm.mySpotNameOneStatus = vm.mySpotNameOne.ReviewStatuses[i].Text;
                }
            }
        }

        if ((vm.mySpotNameTwo) && (vm.mySpotNameTwo.ReviewStatus) && (vm.mySpotNameTwo.ReviewStatuses)) {
            var i;
            for (i = 0; i < vm.mySpotNameTwo.ReviewStatuses.length ; i++) {
                if (vm.mySpotNameTwo.ReviewStatuses[i].Value == vm.mySpotNameTwo.ReviewStatus.toString()) {
                    vm.mySpotNameTwoStatus = vm.mySpotNameTwo.ReviewStatuses[i].Text;
                }
            }
        }

        if ((vm.mySpotNameThree) && (vm.mySpotNameThree.ReviewStatus) && (vm.mySpotNameThree.ReviewStatuses)) {
            var i;
            for (i = 0; i < vm.mySpotNameThree.ReviewStatuses.length ; i++) {
                if (vm.mySpotNameThree.ReviewStatuses[i].Value == vm.mySpotNameThree.ReviewStatus.toString()) {
                    vm.mySpotNameThreeStatus = vm.mySpotNameThree.ReviewStatuses[i].Text;
                }
            }
        }

        if ((vm.mySpotNameFour) && (vm.mySpotNameFour.ReviewStatus) && (vm.mySpotNameFour.ReviewStatuses)) {
            var i;
            for (i = 0; i < vm.mySpotNameFour.ReviewStatuses.length ; i++) {
                if (vm.mySpotNameFour.ReviewStatuses[i].Value == vm.mySpotNameFour.ReviewStatus.toString()) {
                    vm.mySpotNameFourStatus = vm.mySpotNameFour.ReviewStatuses[i].Text;
                }
            }
        }

        if ((vm.mySpotNameFive) && (vm.mySpotNameFive.ReviewStatus) && (vm.mySpotNameFive.ReviewStatuses)) {
            var i;
            for (i = 0; i < vm.mySpotNameFive.ReviewStatuses.length ; i++) {
                if (vm.mySpotNameFive.ReviewStatuses[i].Value == vm.mySpotNameFive.ReviewStatus.toString()) {
                    vm.mySpotNameFiveStatus = vm.mySpotNameFive.ReviewStatuses[i].Text;
                }
            }
        }


        function redirectToPropertyList() {

            vm.showLoading = true;
            loadResource.login(vm.userModel, function (successResult) {
                vm.showLoading = false;
                vm.message = successResult.Message

                if (successResult.UserValid) {
                    window.location.href = 'propertyList.html#' + successResult.SecUserId;
                }

            }, function (errorResult) {

                vm.errorResult = errorResult.data.message;
                vm.showLoading = false;
            });
        };

        function syncData(review, spot, spotId){

            var r = confirm("Syncing will overwrite the current review. Do you want to sync this review?");
            if (r == true)
            {
            propinspecVM = new AppViewModel(review);
            ko.applyBindings(propinspecVM);
            var result = ko.toJSON(propinspecVM);

            loadResourceSync.update(result, function (successResult) {
                localStorage.removeItem(spot);
                localStorage.removeItem(spotId);
                window.location.reload();
                alert('Review has been synced successfuly!');

            }, function (errorResult) {

                alert('Review could not be synced! Verify Wi-Fi or mobile data connection!');
                window.location.reload();
            });

            }
            else
            {
                return;
            }

        }


//        from Knockout           

        function AppViewModel(data) {

            var self = this;

            function formatDate(date) {

                if (date == undefined) return;
                var parts = date.split('/');
                if (parts[1] != undefined) {
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

                        if (($day > 31 || $day < 1) || ($month > 12 || $month < 1) || (year < 1900 || year > 9000))
                            return null;
                        else {

                            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                                monthLength[1] = 29;

                            if ($day.charAt(1) == "")
                                $day = '0' + $day;

                            if ($month.charAt(0) != '1')
                                $month = '0' + $month;

                            return year + '-' + $month + '-' + $day;
                        }
                    }
                    else return null;
                }
                else return date;
            };

            self.id = ko.observable(data.Id);

            self.reviewTypeDescription = ko.observable(data.ReviewTypeDescription);
            self.propMemo = ko.observable(data.PropMemo);

            self.reviewDate = ko.observable(formatDate(data.ReviewDate));
            self.gradeType = ko.observable(data.GradeType);
            self.gradeTypes = ko.observable(data.GradeTypes);
            self.reviewStatus = ko.observable(data.ReviewStatus);
            self.reviewStatuses = ko.observable(data.ReviewStatuses);
            self.reviewType = ko.observable(data.ReviewType);
            self.reviewTypes = ko.observable(data.ReviewTypes);
            self.reviewYear = ko.observable(data.ReviewYear);
            self.reviewedBy = ko.observable(data.ReviewedBy);
            self.scheduledRevDt = ko.observable(formatDate(data.ScheduledRevDt));
            self.reacScore = ko.observable(data.REACScore);
            self.nbrReviewed = ko.observable(data.NbrReviewed);
            self.nbrUnits = ko.observable(data.NbrUnits);
            self.selectedTab = ko.observable(0);
            self.myDocumentsList = ko.observable(data.DocumentsList);
            self.myDocStatusList = ko.observable(data.DocStatusList);

            self.propertyId = ko.observable(data.PropertyId);

            self.reviewUnits = ko.observable(data.ReviewUnits);
            self.mybldlist = ko.observableArray(data.BuildingsList);
            self.mytenantfindinglist = ko.observableArray(data.TenFindingsList);
            self.mybuildunitcombinations = ko.observableArray(data.BuildUnitCombinations);
            self.myitemDecisionsList = ko.observable(data.ItemDecisionsList);
            self.myreviewItemsList = ko.observable(data.ReviewItemsList);
            self.myreviewItemDetailsList = ko.observable(data.ReviewItemDetailsList);
            self.myfilteredbuildunitcombinations = ko.observableArray(data.FilteredBuildUnitCombinations);
            self.myFindingsList = ko.observable(data.FindingsList);
            self.selectedBuildUnitNumber = ko.observable();
            self.unitNumber = ko.observable();
            self.popupValidation = ko.observable();

            self.myentitymodellist = ko.observableArray(data.EntityModelList);
            self.contactmodellist = ko.observableArray(data.ContactModelList);
            self.entityModelID = ko.observable(data.EntityModelID);
            self.contactModelID = ko.observable(data.ContactModelID);

            self.lookupContacts = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var listOfContacts = new Array();
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].EntityKey == value) {

                        listOfContacts.push(lookupItems[i]);
                    }
                    else { }
                }
                return listOfContacts;
            };


            if (self.entityModelID != 0) {

                self.mycontactmodellist = self.lookupContacts(self.contactmodellist(), self.entityModelID());

            }
            else {

                self.mycontactmodellist = ko.observableArray();
            }

            self.entityModelID.subscribe(function (newValue) {

                self.mycontactmodellist = self.lookupContacts(self.contactmodellist(), newValue);

            });

            self.propertyrevitemslist = ko.observableArray($.map(data.PropertyRevItemsList || [], function (m) { return new PropertyReviewItemsViewModel(m); }));

            self.reviewdocumentslist = ko.observableArray($.map(data.ReviewDocumentsList || [], function (m) { return new ReviewDocumentsViewModel(m); }));

            self.unitreviewitemslist = ko.observableArray($.map(data.UnitReviewItemsList || [], function (m) { return new UnitReviewItemsListViewModel(m); }));

            self.plainunitreviewitemslist = ko.observableArray(data.UnitReviewItemsList);

            self.buildingsunitselections = ko.observableArray($.map(data.BuildingsUnitSelections || [], function (m) { return new BuildingUnitSelectionViewModel(self, m); }));

            self.tenantfindingseditmodellist = ko.observableArray($.map(data.TenantFindingsEditModelList || [], function (model) { return new TenantFindingsEditViewModel(self, model); }));

            self.lookupValue = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].UnitNumber.toString().toLowerCase() == value.toString().toLowerCase()) return lookupItems[i];
                }

                return null;
            };


            self.secondlookup = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].buildNbr() == value.BuildingNumber && lookupItems[i].unit() == value.UnitKey) {
                        lookupItems[i].display(true);
                    }
                    else {
                        lookupItems[i].display(false);
                    }
                }
            };

            self.thirdlookup = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;
                for (i = 0; i < len; i++) {

                    if (lookupItems[i].buildNbr() == value.BuildingNumber && lookupItems[i].unit() == value.UnitKey) {
                        lookupItems[i].display(true);
                    }
                    else {
                        lookupItems[i].display(false);
                    }
                }
            };

            self.selectedBuildUnitNumber.subscribe(function (newValue) {

                var selectedBIN = self.lookupValue(self.mybuildunitcombinations(), newValue);
                self.unitNumber = ko.observable(selectedBIN.UnitKey);
                self.buildNbr = ko.observable(selectedBIN.BuildingNumber);

                self.thirdlookup(self.unitreviewitemslist(), selectedBIN);

            });

        };


        var VarModel = function () { };

        var ReviewDocumentsViewModel = function (proprevItem) {
            var self = this;

            function formatDate(date) {

                if (date == undefined) return;
                var parts = date.split('/');
                if (parts[1] != undefined) {
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

                        if (($day > 31 || $day < 1) || ($month > 12 || $month < 1) || (year < 1900 || year > 9000))
                            return null;
                        else {

                            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                                monthLength[1] = 29;

                            if ($day.charAt(1) == "")
                                $day = '0' + $day;

                            if ($month.charAt(0) != '1')
                                $month = '0' + $month;

                            return year + '-' + $month + '-' + $day;
                        }
                    }
                    else return null;
                }
                else return date;
            };

            if (proprevItem != undefined) {

                self.accepted_date = ko.observable(formatDate(proprevItem.Accepted_date));
                self.received_date = ko.observable(formatDate(proprevItem.Received_date));
                self.comments = ko.observable(proprevItem.Comments);
                self.doc_Status = ko.observable(proprevItem.Doc_Status);
                self.docDescription = ko.observable(proprevItem.DocDescription);
                self.deleted = ko.observable(false);

            }

            else {

                self.id = ko.observable();
                self.comments = ko.observable();
                self.received_date = ko.observable();
                self.accepted_date = ko.observable();

                self.doc_Status = ko.observable();
                self.docDescription = ko.observable();
                self.deleted = ko.observable(false);
            }

            return self;
        };

        var PropertyReviewItemsViewModel = function (proprevItem) {
            var self = this;

            function formatDate(date) {

                if (date == undefined) return;
                var parts = date.split('/');
                if (parts[1] != undefined) {
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

                        if (($day > 31 || $day < 1) || ($month > 12 || $month < 1) || (year < 1900 || year > 9000))
                            return null;
                        else {

                            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                                monthLength[1] = 29;

                            if ($day.charAt(1) == "")
                                $day = '0' + $day;

                            if ($month.charAt(0) != '1')
                                $month = '0' + $month;

                            return year + '-' + $month + '-' + $day;
                        }
                    }
                    else return null;
                }
                else return date;
            };

            if (proprevItem != undefined) {

                self.comments = ko.observable(proprevItem.Comments);
                self.targetDt = ko.observable(formatDate(proprevItem.TargetDt));
                self.closeDt = ko.observable(formatDate(proprevItem.CloseDt));

                self.itemDecision = ko.observable(proprevItem.ItemDecision);
                self.reviewItem = ko.observable(proprevItem.ReviewItem);
                self.revItemDetail = ko.observable(proprevItem.RevItemDetail);
                self.revItemTemplates = ko.observable(proprevItem.RevItemTemplates);
                self.deleted = ko.observable(false);

                self.id = ko.observable(proprevItem.Id);
                self.currentImage = ko.observable();
                self.imageSrc = ko.observable();

                //booleans for Image
                self.hasId = ko.observable(true);
                self.showLoading = ko.observable(false);
                self.hasChanges = ko.observable(false);
                self.showImage = ko.observable(false);
                self.hasImage = ko.observable(proprevItem.HasImage);
                self.message = ko.observable('Loading Image');
                self.showDelete = ko.observable(false);

                self.fixableIssue = ko.observable(proprevItem.FixableIssue);

                if (proprevItem.FixableIssue == "Y") { self.selectedFix = ko.observable(true); }
                else { self.selectedFix = ko.observable(false); }

                self.seriousIssue = ko.observable(proprevItem.SeriousIssue);

                if (proprevItem.SeriousIssue == "Y") { self.selectedSerious = ko.observable(true); }
                else { self.selectedSerious = ko.observable(false); }


            }

            else {

                self.id = ko.observable();
                self.comments = ko.observable();
                self.fixableIssue = ko.observable(false);
                self.seriousIssue = ko.observable(false);
                self.targetDt = ko.observable();
                self.closeDt = ko.observable();

                self.itemDecision = ko.observable();
                self.reviewItem = ko.observable();
                self.reviewItemDetail = ko.observable();
                self.revItemTemplates = ko.observable();
                self.deleted = ko.observable(false);
            }

            self.selectedSerious.subscribe(function (newValue) {
                if (newValue == true) { self.seriousIssue = ko.observable("Y"); }
                else { self.seriousIssue = ko.observable("N"); }
            });

            self.selectedFix.subscribe(function (newValue) {
                if (newValue == true) { self.fixableIssue = ko.observable("Y"); }
                else { self.fixableIssue = ko.observable("N"); }
            });

            return self;
        };

        var BuildingUnitSelectionViewModel = function (propinspec, buselect) {
            var self = this;

            if (buselect != undefined) {

                self.comments = ko.observable(buselect.Comments);
                self.build_Unit = ko.observable(buselect.Build_Unit);
                self.deleted = ko.observable(false);
                self.unit = ko.observable(buselect.Unit);
                self.selected = ko.observable(buselect.Selected);
                self.duplicated = ko.observable(true);

                self.lookupValue = function (lookupItems, value) {

                    if (value == undefined) return "";
                    var i;
                    var len = lookupItems.length;

                    for (i = 0; i < len; i++) {

                        if (lookupItems[i].Unit == value) return false;
                    }

                    return true;
                };

                self.isInUse = self.lookupValue(propinspec.plainunitreviewitemslist(), buselect.Unit);

            }

            else {

                self.build_Unit = ko.observable();
                self.unit = ko.observable();
                self.comments = ko.observable();
                self.deleted = ko.observable(false);
                self.isInUse = ko.observable(true);
                self.selected = ko.observable(false);
                self.duplicated = ko.observable(true);
            }

            self.lookup = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].UnitNumber.toString().toLowerCase() == value.toString().toLowerCase()) return true;
                }

                return false;
            };

            self.secondlookup = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].UnitNumber.toString().toLowerCase() == value.toString().toLowerCase()) return lookupItems[i];
                }

                return null;
            };

            // Whenever the building/unit changes, reset the unit Key
            self.build_Unit.subscribe(function (newValue) {

                var validateSelection = ko.observable(self.lookup(propinspec.myfilteredbuildunitcombinations(), newValue));

                if (validateSelection() == true) {
                    self.duplicated(false);
                    alert('this Unit is already taken');
                }
                else {
                    self.duplicated(true);
                    self.selected(true);
//                    var newRowId = document.getElementById("currentRow");
//                    newRowId.id = newValue;
//                    document.getElementById(newRowId.id).disabled = true;

                    var selection = ko.observable(self.secondlookup(propinspec.mybuildunitcombinations(), newValue));
                    var thisKey = selection().UnitKey;
                    self.unit = ko.observable(thisKey);
                    self.comments = ko.observable();
                    propinspec.addBuildingUnitCombinations(selection());
                    document.getElementById("addBuildingUnitSelectionButton").disabled = false;
                }

            });

        };

        var UnitReviewItemsListViewModel = function (uril) {

            var self = this;

            function formatDate(date) {

                if (date == undefined) return;
                var parts = date.split('/');
                if (parts[1] != undefined) {
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

                        if (($day > 31 || $day < 1) || ($month > 12 || $month < 1) || (year < 1900 || year > 9000))
                            return null;
                        else {

                            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                                monthLength[1] = 29;

                            if ($day.charAt(1) == "")
                                $day = '0' + $day;

                            if ($month.charAt(0) != '1')
                                $month = '0' + $month;

                            return year + '-' + $month + '-' + $day;
                        }
                    }
                    else return null;
                }
                else return date;
            };

            if (uril != undefined) {

                self.id = ko.observable(uril.Id);
                self.unit = ko.observable(uril.Unit);

                self.reviewItemDescription = ko.observable(uril.ReviewItemDescription);
                self.reviewItemDetailDescription = ko.observable(uril.ReviewItemDetailDescription);
                self.itemDecision = ko.observable(uril.ItemDecision);

                self.closeDate = ko.observable(formatDate(uril.CloseDate));
                self.targetDate = ko.observable(formatDate(uril.TargetDate));

                self.fixableIssue = ko.observable(uril.FixableIssue);
                self.qualifiedUnit = ko.observable(uril.QualifiedUnit);
                self.seriousIssue = ko.observable(uril.SeriousIssue);

                self.comments = ko.observable(uril.Comments);

                self.unitNbr = ko.observable(uril.UnitNbr);
                self.buildNbr = ko.observable(uril.BuildNbr);

                self.deleted = ko.observable(false);
                self.display = ko.observable(false);

                self.currentImage = ko.observable();
                self.imageSrc = ko.observable();

                //booleans for Image
                self.hasKey = ko.observable(true);
                self.showLoading = ko.observable(false);
                self.hasChanges = ko.observable(false);
                self.showImage = ko.observable(false);
                self.hasImage = ko.observable(uril.HasImage);
                self.message = ko.observable('Loading Image');
                self.showDelete = ko.observable(false);

                self.fixableIssue.subscribe(function (newValue) {
                    if (newValue == true) { self.fixableIssue = ko.observable(true); }
                    else { self.fixableIssue = ko.observable(false); }
                });

                self.qualifiedUnit.subscribe(function (newValue) {
                    if (newValue == true) { self.qualifiedUnit = ko.observable(true); }
                    else { self.qualifiedUnit = ko.observable(false); }
                });

                self.seriousIssue.subscribe(function (newValue) {
                    if (newValue == true) { self.seriousIssue = ko.observable(true); }
                    else { self.seriousIssue = ko.observable(false); }
                });

            }

            else {

                self.id = ko.observable();
                self.unit = ko.observable();

                self.reviewItemDescription = ko.observable();
                self.reviewItemDetailDescription = ko.observable();
                self.itemDecision = ko.observable();

                self.closeDate = ko.observable();
                self.targetDate = ko.observable();

                self.fixableIssue = ko.observable(false);
                self.qualifiedUnit = ko.observable(false);
                self.seriousIssue = ko.observable(false);

                self.comments = ko.observable();

                self.unitNbr = ko.observable();
                self.buildNbr = ko.observable();

                self.deleted = ko.observable(false);
                self.display = ko.observable(false);
                self.hasKey = ko.observable();

            }

        };

        var TenantFindingsEditViewModel = function (propinspec, tenantFind) {
            var self = this;

            function formatDate(date) {

                if (date == undefined) return;
                var parts = date.split('/');
                if (parts[1] != undefined) {
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

                        if (($day > 31 || $day < 1) || ($month > 12 || $month < 1) || (year < 1900 || year > 9000))
                            return null;
                        else {

                            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                                monthLength[1] = 29;

                            if ($day.charAt(1) == "")
                                $day = '0' + $day;

                            if ($month.charAt(0) != '1')
                                $month = '0' + $month;

                            return year + '-' + $month + '-' + $day;
                        }
                    }
                    else return null;
                }
                else return date;
            };

            if (tenantFind != undefined) {

                self.id = ko.observable(tenantFind.Id);

                self.unitKey = ko.observable(tenantFind.UnitKey);
                self.build_Unit = ko.observable(tenantFind.Build_Unit);

                self.currentTenant = ko.observable(tenantFind.CurrentTenant);
                self.certType = ko.observable(tenantFind.CertType);
                self.nbrBedrooms = ko.observable(tenantFind.NbrBedrooms);

                if (tenantFind.Cert_date != "") {
                    self.cert_date = ko.observable(tenantFind.Cert_date);
                }
                else { self.cert_date = ko.observable("N/A"); }

                self.opened_date = ko.observable(formatDate(tenantFind.Opened_date));
                self.resolved_date = ko.observable(formatDate(tenantFind.Resolved_date));
                self.seriousIssue = ko.observable(tenantFind.SeriousIssue);

                self.comments = ko.observable(tenantFind.Comments);
                self.findingKey = ko.observable(tenantFind.FindingKey);

                self.deleted = ko.observable(false);
            }

            else {

                self.id = ko.observable();
                self.findingKey = ko.observable();
                self.unitKey = ko.observable();
                self.build_Unit = ko.observable();

                self.currentTenant = ko.observable();
                self.certType = ko.observable();
                self.nbrBedrooms = ko.observable();
                self.cert_date = ko.observable();
                self.opened_date = ko.observable();
                self.resolved_date = ko.observable();
                self.seriousIssue = ko.observable();

                self.comments = ko.observable();
                self.deleted = ko.observable(false);
            }

            self.lookupValue = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].UnitKey.toString().toLowerCase() == value.toString().toLowerCase()) return lookupItems[i];
                }

                return null;
            };

            self.secondlookup = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].UnitNumber.toString().toLowerCase() == value.toString().toLowerCase()) return lookupItems[i].UnitKey;
                }

                return null;
            };

            //Whenever the UnitKey changes, reset the other fields
            self.build_Unit.subscribe(function (newValue) {

                self.unitKey = self.secondlookup(propinspec.mybuildunitcombinations(), newValue);

                var selectedTenant = self.lookupValue(propinspec.mytenantfindinglist(), newValue);
                if (selectedTenant != null) {
                    self.nbrBedrooms = selectedTenant.NbrBedrooms;
                    self.currentTenant = selectedTenant.CurrentTenant;
                    self.certType = selectedTenant.CertType;

                    if (selectedTenant.Cert_date != "") {
                        self.cert_date = ko.observable(selectedTenant.Cert_date);
                    }
                    else { self.cert_date = ko.observable("N/A") };
                }
                else {
                    self.nbrBedrooms = ko.observable("N/A");
                    self.currentTenant = ko.observable("N/A");
                    self.certType = ko.observable("N/A");
                    self.cert_date = ko.observable("N/A");
                }
            });

            return self;

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

                if (($day > 31 || $day < 1) || ($month > 12 || $month < 1) || (year < 1900 || year > 9000))
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
        }

        


//      from Knockout END

    }



})();
