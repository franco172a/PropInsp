$.support.cors = true;

function displayTab(tab, selected_tab) {

    $('#GeneralInformation').hide();
    $('#PropertyReviewItems').hide();
    $('#BldgUnitSelection').hide();
    $('#ReviewItems').hide();
    $('#TenantFindings').hide();
    $('#DocumentationReview').hide();

    $(".header").removeClass("open");
    $(".header").slideUp(400);

    $(tab).show('slow');
    $(".menu-btn").show('slow');
    $("#selectedTab").text(selected_tab).animate({
    }, 400);
};

function getNextTab() {

    var currentTab = document.getElementById("selectedTab").innerHTML;

    if (currentTab == 'General Information')
    { displayTab('#PropertyReviewItems', 'Property Review Items'); }
    else if (currentTab == 'Property Review Items')
    { displayTab('#BldgUnitSelection', 'Building/Unit Selection'); }
    else if (currentTab == 'Building/Unit Selection')
    { displayTab('#ReviewItems', 'Unit Review Items'); }
    else if (currentTab == 'Unit Review Items')
    { displayTab('#TenantFindings', 'Tenant Findings'); }
    else if (currentTab == 'Tenant Findings')
    { displayTab('#DocumentationReview', 'Documentation Review'); }
    else if (currentTab == 'Documentation Review')
    { displayTab('#GeneralInformation', 'General Information'); }

};

function getPreviousTab() {

    var currentTab = document.getElementById("selectedTab").innerHTML;

    if (currentTab == 'General Information')
    { displayTab('#DocumentationReview', 'Documentation Review'); }
    else if (currentTab == 'Documentation Review')
    { displayTab('#TenantFindings', 'Tenant Findings'); }
    else if (currentTab == 'Tenant Findings')
    { displayTab('#ReviewItems', 'Unit Review Items'); }
    else if (currentTab == 'Unit Review Items')
    { displayTab('#BldgUnitSelection', 'Building/Unit Selection'); }
    else if (currentTab == 'Building/Unit Selection')
    { displayTab('#PropertyReviewItems', 'Property Review Items'); }
    else if (currentTab == 'Property Review Items')
    { displayTab('#GeneralInformation', 'General Information'); }

};


(function () 


{
    'use strict';

    var controllerId = 'editController';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('main').controller(controllerId,
        ['common', '$location', '$routeParams', 'dateFilter', editController]);

    function editController(common, $location, $routeParams, dateFilter) {
        
        var vm = this;       
        
        var receiveddata = window.location.hash.substr(1).replace('/','');
        var res = receiveddata.split("#");

        vm.offline = false;
        vm.propInspId = res[0];
        var res2 = res[1].split("$");
        var currentId = res[0];
        vm.userId = res2[0].replace(/%20/g, " ");
        vm.propertyName= res2[1].replace(/%20/g, " ");
        vm.inspectionName = res2[2].replace(/%20/g, " ");
        vm.propertyId = res2[3].replace(/%20/g, " ");
        var reloaded = res2[4].replace(/%20/g, " ");

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        if(reloaded == "true")
         {
            log("updated successfully!");
         }

        var loadResource = common.myResource.mobilepropinspections;
        var imagesResource = common.myResource.uploads;
        var propertyReviewResource = common.myResource.propertyreviewuploads;
        var unitReviewResource = common.myResource.unitreviewuploads;
        var loadResourceLogin = common.myResource.loginResource;

        var user = localStorage.getItem('userName');
        var pass = localStorage.getItem('password');
        var currentUserId  = localStorage.getItem('userId');
        
        vm.userModel = { userName: user, password: pass };

        vm.redirectToPropertyList = redirectToPropertyList;

        var propinspecVM;
        vm.showLoading = false;
        vm.showLoading1 = true;
        vm.loadingImage = false;
        vm.uploadingImage = false;
        vm.loadingMsg = 'Loading, please wait...';
        vm.imageMsg ="Loading images";
        
        vm.getById = getById;
        vm.update = update;
        vm.deletePropInspec = deletePropInspec;
        vm.addtoOfflineAccess = addtoOfflineAccess;
        //vm.getImages = getImages;
        vm.getImageById = getImageById;

        //vm.previewPicture = previewPicture;
        vm.deleteImage = deleteImage;
        vm.savePicture = savePicture;

        vm.propertyInspectionsList = [];
        vm.obj = { id: 0 , revUserId: currentUserId};
        vm.obj.id = currentId;
        vm.propId = currentId;
        vm.capturePhotoEdit = capturePhotoEdit;
        vm.imageList = [];
        vm.canDeleteImage = canDeleteImage;
        vm.canSaveImage = true;

        vm.saveLocal = saveLocal;
        vm.clearLocal = clearLocal;

        function getUploadsResource(){
        
            return common.myResource.propertyreviewuploadsURL;
        };
        
        function getReviewItemURL(){
        
            return common.myResource.propertyreviewitemURL;
        };
        
        function getUnitReviewItemURL(){
        
            return common.myResource.unitreviewitemURL;
        };

        function getUnitReviewUploadsResource(){
        
            return common.myResource.unitreviewuploadsURL;
        };

        function getEditResource(){
        
            return common.myResource.editpropinspectionsURL;
        };

        function redirectToPropertyList() {

            vm.showLoading = true;
            loadResourceLogin.login(vm.userModel, function (successResult) {
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

    

        function getById () {
//            $("#selectedTab").hide();
            vm.showLoading = true;

            if(vm.offline == true)
            {
                var data = JSON.parse(localStorage.getItem(vm.currentOfflineInspection));
                propinspecVM = new AppViewModel(data);
                ko.applyBindings(propinspecVM);
            }

            else{
                $("#selectedTab").hide();

                loadResource.getById(vm.obj,function (successResult) {

                var myJsonObject = localStorage.getItem('myJsonObject');
                if(myJsonObject != null)
                { $('#jsonToSave').show();}

                    var data = successResult;
                    propinspecVM = new AppViewModel(data);

                    ko.applyBindings(propinspecVM);
                    vm.showLoading = false;

                    var currentTab = localStorage.getItem('currentTab');

                    if(currentTab != null)
                    {
                        if (currentTab == 'General Information')
                            { displayTab('#GeneralInformation', 'General Information'); }
                        else if (currentTab == 'Property Review Items')
                            { displayTab('#PropertyReviewItems', 'Property Review Items'); }    
                        else if (currentTab == 'Building/Unit Selection')
                            { displayTab('#BldgUnitSelection', 'Building/Unit Selection'); }
                        else if (currentTab == 'Unit Review Items')
                            { displayTab('#ReviewItems', 'Unit Review Items'); }
                        else if (currentTab == 'Tenant Findings')
                            { displayTab('#TenantFindings', 'Tenant Findings'); }
                        else if (currentTab == 'Documentation Review')
                            { displayTab('#DocumentationReview', 'Documentation Review'); }
                
                    }

                    localStorage.removeItem('currentTab');
                    $("#selectedTab").show();

                    vm.propId = data.PropertyId;
                    vm.loadingImage = true;
                    //getImages();

                    vm.showLoading1 = false;

                }, function (errorResult) {
                    vm.errorResult = errorResult.data.Message;
                    vm.showLoading = false;
                    $("#selectedTab").show();
                    log(errorResult.data.Message,'error');
                });
            }
            vm.showLoading = false;
        };

        function getImages () {      
             
        var obj = { id: vm.propertyId};
            imagesResource.getImages(obj,function (successResult) {              
                vm.imageList = successResult.FileList;
                 vm.loadingImage = false;

                 //previewPicture(successResult.FileList[0]);
               
            }, function (errorResult) {
                vm.errorResult = errorResult.data.Message;               
                log(errorResult.data.Message,'error');
                 vm.loadingImage = false;
            });
        };

        function getImageById (fileId) {   
        vm.loadingImage = true;        
        var obj = { id: vm.propertyId, fileId:fileId };
            imagesResource.getImages(obj,function (successResult) {             
               vm.loadingImage = false; 
                //previewPicture(successResult.FileList[0].Data);
               
            }, function (errorResult) {
             vm.loadingImage = true; 
                vm.errorResult = errorResult.data.Message;               
                log(errorResult.data.Message,'error');
            });
        };

        function deleteImage()
        {         
           var r = confirm("Are you sure you want to delete the selected Image?");
                if (r == true){

                        vm.loadingImage = true;
                        vm.imageMsg = "Deleting image...";
                        var modelObj = {EntityKey :vm.propertyId };

                        modelObj.FileList = [];
                        var imageObj = { 
                            Id : vm.selectedImage.Id,
                            delete_url:'true' };
                        modelObj.FileList.push(imageObj);        
       
                        imagesResource.deleteImage(modelObj,function (successResult) {             
                        vm.imageList = successResult.FileList;
                        vm.loadingImage = false;

                        previewPicture(successResult.FileList[0]);
                        log('Image deleted successfully!');
                        vm.imageMsg = "Loading images...";
                        vm.canSaveImage = true;
               
                        }, function (errorResult) {
                            
                            vm.loadingImage = false; 
                            vm.errorResult = errorResult.data.Message;               
                            log(errorResult.data.Message,'error');
                            vm.imageMsg = "Loading images...";
                        });
                      
                    }
                    else
                    {
                        return;
                    }         

        }

        function update() {
            
            vm.loadingMsg = 'Updating...';
            vm.showLoading = true;
            vm.showLoading1 = true;

            if (!validatePropInspection(propinspecVM)) {
                showValidationErrors();
                vm.showLoading = false;
                vm.showLoading1 = false;
                return;
            };

            var result = ko.toJSON(propinspecVM);

            loadResource.update(result, function (successResult) {

                var data = successResult;
                vm.showLoading = false;

                window.open(window.location.href, "_self");
                window.location.href = "edit.html#" + vm.obj.id + "#" + vm.userId + "$" + vm.propertyName + "$" + vm.inspectionName + "$" + vm.propertyId + "$true";

                location.reload();

                var currentTab = document.getElementById("selectedTab").innerHTML;
                localStorage.setItem('currentTab', currentTab);
    
            }, function (errorResult) {

                var server = getEditResource();
                var url = server + '/' + propinspecVM.id();

                loadResource.getById(vm.obj,function (successResult) {

                    vm.showLoading = false; 
                    vm.errorResult = errorResult.data.Message;
                    log(errorResult.data.Message,'error');
             
                    }, function (errorResult2) {

                        alert('you are offline!');
                        addtoOfflineAccess();
                });
            });
        };


        function saveLocal() {

        var myJsonObject = localStorage.getItem('myJsonObject');

        if(myJsonObject != null){
            vm.showLoading = true;
            vm.loadingMsg = 'Updating...';

            loadResource.update(myJsonObject, function (successResult) {
                var data = successResult;
                vm.showLoading = false;
                localStorage.removeItem('myJsonObject');

                window.open(window.location.href, "_self");
                window.location.href = "edit.html#" + vm.obj.id + "#" + vm.userId + "$" + vm.propertyName + "$" + vm.inspectionName + "$" + vm.propertyId + "$true";

                location.reload();

            }, function (errorResult) {
                            
                vm.loadingImage = false; 
                vm.errorResult = errorResult.data.Message;
                log(errorResult.data.Message,'error');
            });
        }
        };

        function clearLocal() {

            localStorage.removeItem('myJsonObject');
            location.reload();
        };

        function checkSpot(mySpotId, mySpotName, spotId){

            if(spotId == propinspecVM.id()){

                loadResource.getById(vm.obj,function (successResult) {
                    var result = successResult;
                    localStorage.setItem(mySpotId, propinspecVM.id());
                    localStorage.setItem(mySpotName, JSON.stringify(result));

                    vm.showLoading = false;
                    alert('Inspection has been saved to Offline Access');

                    
                    }, function (errorResult) {
                            
                    return;
                });
             return true;
            }

            else { return false; }
        };

        function findSpot(spotId, mySpotId, mySpotName){

            if(spotId == null){

                loadResource.getById(vm.obj,function (successResult) {
                    var result = successResult;
                    localStorage.setItem(mySpotId, propinspecVM.id());
                    localStorage.setItem(mySpotName, JSON.stringify(result));

                    vm.showLoading = false;
                    alert('Inspection has been saved to Offline Access');

                    return true;
               }, function (errorResult) {
                            
                    return;
               });
            }

            else { return false; }
        };

        function addtoOfflineAccess(){

            validatePropInspection(propinspecVM);

            if(propinspecVM.validationErrors().length > 0)
            {
                showValidationErrors();
                return;
            }

            vm.showLoading = true;
            vm.loadingMsg = 'Saving Inspection for offline Access...';

            var mySpotIdOne = JSON.parse(localStorage.getItem('mySpotIdOne'));
            var mySpotIdTwo = JSON.parse(localStorage.getItem('mySpotIdTwo'));
            var mySpotIdThree = JSON.parse(localStorage.getItem('mySpotIdThree'));
            var mySpotIdFour = JSON.parse(localStorage.getItem('mySpotIdFour'));
            var mySpotIdFive = JSON.parse(localStorage.getItem('mySpotIdFive'));

            if(checkSpot('mySpotIdOne', 'mySpotNameOne', mySpotIdOne) == true)
            {
                return;
            }
            else
            {    
                if(checkSpot('mySpotIdTwo', 'mySpotNameTwo', mySpotIdTwo) == true)
                {
                    return;
                }
                else
                {    
                    if(checkSpot('mySpotIdThree', 'mySpotNameThree', mySpotIdThree) == true)
                    {
                        return;
                    }
                    else
                    {    
                        if(checkSpot('mySpotIdFour', 'mySpotNameFour', mySpotIdFour) == true)
                        {
                            return;
                        }
                        else
                        {    
                            if(checkSpot('mySpotIdFive', 'mySpotNameFive', mySpotIdFive) == true)
                            {
                                return;
                            }
                            else
                            {
                                if(findSpot(mySpotIdOne, 'mySpotIdOne', 'mySpotNameOne') == false)
                                {
                                    if(findSpot(mySpotIdTwo, 'mySpotIdTwo', 'mySpotNameTwo') == false)
                                        {
                                            if(findSpot(mySpotIdThree, 'mySpotIdThree', 'mySpotNameThree') == false)
                                            {
                                                if(findSpot(mySpotIdFour, 'mySpotIdFour', 'mySpotNameFour') == false)
                                                {
                                                    if(findSpot(mySpotIdFive, 'mySpotIdFive', 'mySpotNameFive') == false)
                                                    {
                                                        vm.showLoading = false;
                                                        alert('There is no more storage space!')
                                                    }
                                                }
                                            }
                                        }
                                }
                            }
                        }
                    }
                }
            }

        };


        function deletePropInspec() {
                
            var r = confirm("Are you sure you want to delete the selected Property Inspection?");
                if (r == true)
                    {

                        vm.showLoading = true;
                        vm.loadingMsg = 'Deleting...';
                        var id_Delete = vm.obj.id;

                        loadResource.deletePropInspec(id_Delete, function (successResult) {
                
                        vm.showLoading = false;
                        window.location.href = "propertyInspections.html#" + vm.propertyId + "#" + vm.userId + "$" + vm.propertyName;

                        }, function (errorResult) {
                        vm.errorResult = errorResult.data.message;
                        vm.showLoading = false;
                        log(vm.errorResult);
                        });
                    }
                    else
                    {
                        return;
                    }
        };

        function AppViewModel(data) {

            var self = this;

            self.validationErrors = ko.observable(null);
            self.validationErrorsPresent = ko.computed(function () {
                if (self.validationErrors() == undefined) return false;
                return (self.validationErrors().length > 0);
            });


            self.id = ko.observable(data.Id);

            self.reviewTypeDescription = ko.observable(data.ReviewTypeDescription);
            self.propMemo = ko.observable(data.PropMemo);

            self.reviewDate = ko.observable(dateFilter(new Date(data.ReviewDate), 'yyyy-MM-dd'));
            self.gradeType = ko.observable(data.GradeType);
            self.gradeTypes = ko.observable(data.GradeTypes);
            self.reviewStatus = ko.observable(data.ReviewStatus);
            self.reviewStatuses = ko.observable(data.ReviewStatuses);
            self.reviewType = ko.observable(data.ReviewType);
            if (data.ReviewTypeDescription == "UPCS") { self.revTypeUCPS = ko.observable(true); }
            else { self.revTypeUCPS = ko.observable(false); }
            self.reviewTypes = ko.observable(data.ReviewTypes);
            self.reviewYear = ko.observable(data.ReviewYear);
            self.reviewedBy = ko.observable(data.ReviewedBy);
            self.scheduledRevDt = ko.observable(dateFilter(new Date(data.ScheduledRevDt), 'yyyy-MM-dd'));
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

            self.myUCPSreviewItemsList = ko.computed(function () {
                var array = [];
                ko.utils.arrayForEach(self.myreviewItemsList(), function (revItem) {

                        var n = revItem.Text.indexOf("-");
                        var m = revItem.Text.indexOf("Unit -");
                        if ((n != -1)&&(m == -1)) { array.push(revItem); }
                    });
                    return array;
            });

            self.firstReviewItem = ko.observable();

            self.propRevItemslookup = function (lookupItems, value) {

                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].reviewItem() == value) {
                        lookupItems[i].reviewItemMatch(true);
                    }
                    else {
                        lookupItems[i].reviewItemMatch(false);
                    }
                }
            };

            self.firstReviewItem.subscribe(function (newValue) {

                self.propRevItemslookup(self.propertyrevitemslist(), newValue.Value);

            });

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
                    else {}
                }
                return listOfContacts;
            };


            if(self.entityModelID != 0) {

                self.mycontactmodellist = self.lookupContacts(self.contactmodellist(), self.entityModelID());

            }
            else {

                self.mycontactmodellist = ko.observableArray(); 
             }

            self.entityModelID.subscribe(function (newValue) {

                self.mycontactmodellist = self.lookupContacts(self.contactmodellist(), newValue);

            });

            self.propertyrevitemslist = ko.observableArray($.map(data.PropertyRevItemsList || [], function (m) { return new PropertyReviewItemsViewModel(self, m); }));

            self.reviewdocumentslist = ko.observableArray($.map(data.ReviewDocumentsList || [], function (m) { return new ReviewDocumentsViewModel(m); }));

            self.unitreviewitemslist = ko.observableArray($.map(data.UnitReviewItemsList || [], function (m) { return new UnitReviewItemsListViewModel(self, m); }));

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

            self.selectedBuildUnitNumber.subscribe(function (newValue) {

                var selectedBIN = self.lookupValue(self.mybuildunitcombinations(), newValue);
                self.unitNumber = ko.observable(selectedBIN.UnitKey);

                self.secondlookup(self.unitreviewitemslist(), selectedBIN);

            });

            self.addBuildingUnitSelection = function () {

                $('#binUnitHeader').show();

                var count = self.buildingsunitselections().length;

                if (self.nbrUnits() <= count) {
                    alert("Maximum # of Units have been reached.");
                }
                else {

                    var newBuildingUnit = new BuildingUnitSelectionViewModel(self);
                    self.buildingsunitselections.push(newBuildingUnit);
                    document.getElementById("addBuildingUnitSelectionButton").disabled = true;

                }
            };

            self.bUnitlookup = function (lookupItems, value) {
                if (value == undefined) return "";
                var i;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {

                    if (lookupItems[i].UnitNumber.toString().toLowerCase() == value.toString().toLowerCase()) return lookupItems[i];
                }
                return null;
            };

            self.deletebuildingsunitselection = function (item) {
                var selection = ko.observable(self.bUnitlookup(self.mybuildunitcombinations(), item.build_Unit()));
                self.myfilteredbuildunitcombinations.remove(selection());
                self.buildingsunitselections.remove(item);
                item.deleted(true);

                self.erasebuildingsunitselection(item);
            };

            self.removebuildingsunitselection = function (item) {
                document.getElementById("addBuildingUnitSelectionButton").disabled = false;
                self.buildingsunitselections.remove(item);
                item.deleted(true);
            };

            self.addTenantFinding = function () {
                var newTenantFind = new TenantFindingsEditViewModel(self);
                self.tenantfindingseditmodellist.push(newTenantFind);
            };

            self.deletetenantfinding = function (item) {
                self.tenantfindingseditmodellist.remove(item);
                item.deleted(true);
            };

            self.addReviewUnitDetail = function () {
                var item;
                var newUnitDetail = new UnitReviewItemsListViewModel(self,item);
                newUnitDetail.display(true);
                newUnitDetail.hasKey(false);
                newUnitDetail.unit(self.unitNumber());
                self.unitreviewitemslist.push(newUnitDetail);
            };

            self.deleteunitreviewitem = function (item) {
                self.unitreviewitemslist.remove(item);
                item.deleted(true);
            };

            self.addPropertyReviewItem = function () {
                var newPropRev = new PropertyReviewItemsViewModel(self);
                self.propertyrevitemslist.push(newPropRev);
            };

            self.deletePropertyReviewItem = function (item) {
                self.propertyrevitemslist.remove(item);
                item.deleted(true);
            };

            self.addReviewDocument = function () {
                var newRevDoc = new ReviewDocumentsViewModel(self);
                self.reviewdocumentslist.push(newRevDoc);
            };

            self.deleteReviewDocument = function (item) {
                self.reviewdocumentslist.remove(item);
                item.deleted(true);
            };


            self.addBuildingUnitCombinations = function (comb){
                self.myfilteredbuildunitcombinations.push(comb);
            };

            self.erasebuildingsunitselection = function (comb) {
                var i;
                var len = self.myfilteredbuildunitcombinations().length;

                for (i = 0; i < len; i++) {
                    if (self.myfilteredbuildunitcombinations()[i].UnitKey == comb.unit())
                     {
                        self.myfilteredbuildunitcombinations.remove(self.myfilteredbuildunitcombinations()[i]);
                     }
                }
                return;
            };

        };


        var VarModel = function () { };

        var ReviewDocumentsViewModel = function (proprevItem) {

            var self = this;
            if (proprevItem != undefined) {

                self.accepted_date = ko.observable(dateFilter(new Date(proprevItem.Accepted_date), 'yyyy-MM-dd')); //proprevItem.Accepted_date);
                self.received_date = ko.observable(dateFilter(new Date(proprevItem.Received_date), 'yyyy-MM-dd')); //ko.observable(proprevItem.Received_date);
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

        var PropertyReviewItemsViewModel = function (insp, proprevItem) {

            var self = this;

            if (proprevItem != undefined) {

                self.comments = ko.observable(proprevItem.Comments);
                self.targetDt = ko.observable(dateFilter(new Date(proprevItem.TargetDt), 'yyyy-MM-dd')); // ko.observable(proprevItem.TargetDt);
                self.closeDt = ko.observable(dateFilter(new Date(proprevItem.CloseDt), 'yyyy-MM-dd')); // ko.observable(proprevItem.CloseDt);

                self.itemDecision = ko.observable(proprevItem.ItemDecision);
                self.reviewItem = ko.observable(proprevItem.ReviewItem);
                self.revItemDetail = ko.observable(proprevItem.RevItemDetail);
                self.revItemTemplates = ko.observable(proprevItem.RevItemTemplates);
                self.deleted = ko.observable(false);

                self.id = ko.observable(proprevItem.Id);
                self.currentImage = ko.observable();
                self.imageSrc = ko.observable();

                //booleans for Image
                self.showLoading = ko.observable(false);
                self.hasChanges = ko.observable(false);
                self.showImage = ko.observable(false);
                if (proprevItem.hasImage == "Y") { self.ithasImage = ko.observable(true); self.hasNotImage = ko.observable(false); self.previewImage = ko.observable(true);}
                else { self.ithasImage = ko.observable(false); self.hasNotImage = ko.observable(true); self.previewImage = ko.observable(false);}

                self.hasImage = ko.observable(proprevItem.hasImage);
                self.message = ko.observable('Loading Image');
                self.showDelete = ko.observable(false);

                self.fixableIssue = ko.observable(proprevItem.FixableIssue);

                if (proprevItem.FixableIssue == "Y") { self.selectedFix = ko.observable(true); }
                else { self.selectedFix = ko.observable(false); }

                self.seriousIssue = ko.observable(proprevItem.SeriousIssue);

                if (proprevItem.SeriousIssue == "Y") { self.selectedSerious = ko.observable(true); }
                else { self.selectedSerious = ko.observable(false); }

                if (insp.firstReviewItem() != null) {
                    if (self.reviewItem() == insp.firstReviewItem().Value) { self.reviewItemMatch = ko.observable(true); }
                    else { self.reviewItemMatch = ko.observable(false); }
                }
                else { self.reviewItemMatch = ko.observable(false); }

                self.selectedSerious.subscribe(function (newValue) {
                    if (newValue == true) { self.seriousIssue = ko.observable("Y"); }
                    else { self.seriousIssue = ko.observable("N"); }
                });

                self.selectedFix.subscribe(function (newValue) {
                    if (newValue == true) { self.fixableIssue = ko.observable("Y"); }
                    else { self.fixableIssue = ko.observable("N"); }
                });

                self.displayImage = function() {
                    
                    debugger;

                    self.message('Loading Image');
                    self.showLoading(true);
                    var server = getUploadsResource();
                    var url = server + '/' + self.id();
                    var Token = localStorage.getItem('token');

                    $.ajax({
                        type: 'GET',
                        url: url,
                        headers: { deviceHeaderStorage: Token}
                    }).done(function (successResult){

                        self.showLoading(false);
                        self.showImage(true);
                        self.ithasImage(true);
                        self.hasNotImage(false);
                        self.previewImage(false);
                        self.showDelete(true);
                        self.imageSrc("data:image/jpeg;base64," + successResult.Data);
                        self.currentImage(successResult.Data);
             
                        }).fail(function (errorResult) {

                            self.showLoading(false);             
                            alert(errorResult.data.Message,'error');

                        });

                }

                self.uploadImage = function() {

                    self.message('Uploading Image');
                    self.showLoading(true);
                    
                    var imageObj = { 
                    Data : self.currentImage(),
                    size:25,
                    name:'nameAndDescription',
                    description:'nameAndDescription',
                    AddedDate: new Date(),
                    type:".jpg" ,
                    WebDelAllowed:true,
                    WebDeletionAllowed:true};

                    var fileImageObj = { EntityKey: self.id(), FileList: []};
                    fileImageObj.FileList.push(imageObj);
                    var server = getUploadsResource();
                    var Token = localStorage.getItem('token');

                    $.ajax({
                    url: server,
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(fileImageObj), 
                    dataType: 'json',
                    headers: { deviceHeaderStorage: Token},
                    success: function (data) { 
                        
                        self.showLoading(false);
                        self.ithasImage(true); 
                        self.hasChanges(false);
                        self.hasNotImage(false);
                        self.previewImage(false);
                        self.hasImage('Y');
                        self.showDelete(true);
                        self.displayImage();},
                    error: function (error) { alert('error'); }
                });

                }

                self.deleteImage = function() {

                    var r = confirm("Are you sure you want to delete the selected Image?");
                    if (r == true){

                        self.message("Deleting Image");

                        self.showLoading(true);
                    
                            var imageObj = { 
                            delete_url:'true'};

                            var fileImageObj = { EntityKey: self.id(), FileList: []};
                            fileImageObj.FileList.push(imageObj);
                            var server = getUploadsResource();
                            var Token = localStorage.getItem('token');

                            $.ajax({
                            url: server,
                            type: "Post",
                            data: JSON.stringify(fileImageObj), 
                            contentType: 'application/json; charset=utf-8',
                            headers: { deviceHeaderStorage: Token},
                            success: function (data) { 

                                self.showLoading(false);
                                self.ithasImage(false);
                                self.hasNotImage(true);
                                self.previewImage(false);
                                self.hasImage('N');
                                self.showDelete(false);
                                self.showImage(false);},
                            error: function (error) { alert('error'); }
                        });
                    }
                    else
                    {
                        return;
                    }
                }


                self.takePicture = function(){

                     var pictureSource = navigator.camera.PictureSourceType;
                     var destinationType = navigator.camera.DestinationType;
                
                     try
                     {
         
                         // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
                         navigator.camera.getPicture(function(data){

                         var nameAndDescription = guid();

                         var imageObj = { 
                         Data : data,
                         size:25,
                         name:nameAndDescription,
                         description:nameAndDescription,
                         type:".jpg" ,
                         WebDelAllowed:true,
                         WebDeletionAllowed:true};
                      
                         self.showImage(true);
                         self.hasChanges(true);
                         self.showDelete(true);
                         self.ithasImage(true);
                         self.previewImage(false);
                         self.hasNotImage(true);
                         self.imageSrc("data:image/jpeg;base64," + imageObj.Data);
                         self.currentImage(imageObj.Data);

                         },onFail,
                         {   quality: 20, 
                             destinationType: destinationType.DATA_URL
                         });
                     }
                     catch(err)
                     {
                         log(err.message,'error');            
                     }
                
                    };

            }

            else {

                self.id = ko.observable(insp.newPropertyReviewItemId);
                self.comments = ko.observable();
                self.selectedFix = ko.observable(false);
                self.selectedSerious = ko.observable(false);
                self.targetDt = ko.observable();
                self.closeDt = ko.observable();
                self.reviewItemMatch = ko.observable(true);

                self.itemDecision = ko.observable();
                self.reviewItem = ko.observable();
                self.revItemDetail = ko.observable();
                self.revItemTemplates = ko.observable();
                self.deleted = ko.observable(false);
                self.fixableIssue = ko.observable();
                self.seriousIssue = ko.observable();

                self.ithasImage = ko.observable(false);
                self.hasNotImage = ko.observable(true);
                self.hasImage = ko.observable();
                self.previewImage = ko.observable(false);
				self.showLoading = ko.observable(false);
				self.showImage = ko.observable(false);
				self.hasChanges = ko.observable(false);
				self.showDelete = ko.observable(false);
				self.imageSrc = ko.observable(false);
				self.message = ko.observable(false);
                self.currentImage = ko.observable();


                self.selectedSerious.subscribe(function (newValue) {
                    if (newValue == true) { self.seriousIssue("Y"); }
                    else { self.seriousIssue("N"); }
                });

                self.selectedFix.subscribe(function (newValue) {
                    if (newValue == true) { self.fixableIssue("Y"); }
                    else { self.fixableIssue("N"); }
                });
                
                self.takePictureWithID = function (proprevItemID) {
                    
                    //open the camera
                    var pictureSource = navigator.camera.PictureSourceType;
                    var destinationType = navigator.camera.DestinationType;
                
                     try
                     {
         
                         // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
                         navigator.camera.getPicture(function(data){

                         var nameAndDescription = guid();

                         var imageObj = { 
                         Data : data,
                         size:25,
                         name:nameAndDescription,
                         description:nameAndDescription,
                         type:".jpg" ,
                         WebDelAllowed:true,
                         WebDeletionAllowed:true};
                      
                         self.showImage(true);
                         self.hasChanges(true);
                         self.showDelete(true);
                         self.ithasImage(true);
                         self.previewImage(false);
                         self.hasNotImage(true);
                         self.imageSrc("data:image/jpeg;base64," + imageObj.Data);
                         self.currentImage(imageObj.Data);

                         },onFail,
                         {   quality: 20, 
                             destinationType: destinationType.DATA_URL
                         });
                     }
                     catch(err)
                     {
                         log(err.message,'error');            
                     }
                    
                };
                

                self.takePicture = function(){
                    
                    if(self.id() != undefined)
                    {
                        self.takePictureWithID(self.id());
                    }
                    else{                    
                        if ((checkdate(formatDate(self.targetDt())) != true) &&
                            (checkdate(formatDate(self.closeDt())) != true) &&
                            (self.reviewItem()!= undefined) && (self.revItemDetail()!= undefined))
                        {
                            //alert('call api');
                            var revItemURL = getReviewItemURL();
                            //var Token = localStorage.getItem('token');
                            
                            var model = {
                                Id:insp.id(),
                                Comments: self.comments(),
                                FixableIssue: self.fixableIssue(),
                                SeriousIssue: self.seriousIssue(),
                                TargetDt: self.targetDt(),
                                CloseDt: self.closeDt(),
                                ReviewItem: self.reviewItem(),
                                RevItemDetail: self.revItemDetail(),
                                ItemDecision: self.itemDecision(),
                                hasImage: 'X'
                            };
                            
                            $.ajax({
                            url: revItemURL,
                            type: "POST",
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(model), 
                            dataType: 'json',
                            success: function(data){ 
                                self.id(data);
                                self.takePictureWithID(data);
                                },
                            error: function (error) { alert('error'); }
                        });


                        }
                        else{
                            alert('The Item, Detail, Target Date and Close Date fields are required!!!');
                        }
                    }

                };
                
                self.deleteImage = function() {

                    var r = confirm("Are you sure you want to delete the selected Image?");
                    if (r == true){

                        self.message("Deleting Image");

                        self.showLoading(true);
                    
                            var imageObj = { 
                            delete_url:'true'};

                            var fileImageObj = { EntityKey: self.id(), FileList: []};
                            fileImageObj.FileList.push(imageObj);
                            var server = getUploadsResource();
                            var Token = localStorage.getItem('token');

                            $.ajax({
                            url: server,
                            type: "Post",
                            data: JSON.stringify(fileImageObj), 
                            contentType: 'application/json; charset=utf-8',
                            headers: { deviceHeaderStorage: Token},
                            success: function (data) { 

                                self.showLoading(false);
                                self.ithasImage(false);
                                self.hasNotImage(true);
                                self.previewImage(false);
                                self.hasImage('N');
                                self.showDelete(false);
                                self.showImage(false);},
                            error: function (error) { alert('error'); }
                        });
                    }
                    else
                    {
                        return;
                    }
                }
                
                
                self.uploadImage = function() {

                    self.message('Uploading Image');
                    self.showLoading(true);
                    
                    var imageObj = { 
                    Data : self.currentImage(),
                    size:25,
                    name:'nameAndDescription',
                    description:'nameAndDescription',
                    AddedDate: new Date(),
                    type:".jpg" ,
                    WebDelAllowed:true,
                    WebDeletionAllowed:true};

                    var fileImageObj = { EntityKey: self.id(), FileList: []};
                    fileImageObj.FileList.push(imageObj);
                    var server = getUploadsResource();

                    $.ajax({
                    url: server,
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(fileImageObj), 
                    dataType: 'json',
                    success: function (data) { 
                        
                        self.showLoading(false);
                        self.ithasImage(true); 
                        self.hasChanges(false);
                        self.hasNotImage(false);
                        self.previewImage(false);
                        self.hasImage('Y');
                        self.showDelete(true);
                    },
                    error: function (error) { alert('error'); }
                });

                }
                
                
                self.displayImage = ko.observable();
                
            }

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
                self.isInUse = true;
                self.selected = false;
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

                if(validateSelection() == true)
                {
                    self.duplicated(false);
                    alert('this Unit is already taken');
                }
                else
                {
                    self.duplicated(true);
                    var newRowId = document.getElementById("currentRow");
                    newRowId.id = newValue;
                    document.getElementById(newRowId.id).disabled = true;
                    
                    var selection = ko.observable(self.secondlookup(propinspec.mybuildunitcombinations(), newValue));
                    var thisKey = selection().UnitKey;
                    self.unit = ko.observable(thisKey);
                    self.comments = ko.observable();
                    propinspec.addBuildingUnitCombinations(selection());
                    document.getElementById("addBuildingUnitSelectionButton").disabled = false;
                }
                
            });

        };

        var UnitReviewItemsListViewModel = function (insp, uril) {

            var self = this;

            if (uril != undefined) {

                self.id = ko.observable(uril.Id);
                self.unit = ko.observable(uril.Unit);

                self.reviewItemDescription = ko.observable(uril.ReviewItemDescription);
                self.reviewItemDetailDescription = ko.observable(uril.ReviewItemDetailDescription);
                self.itemDecision = ko.observable(uril.ItemDecision);

                self.closeDate = ko.observable(dateFilter(new Date(uril.CloseDate), 'yyyy-MM-dd')); // ko.observable(uril.CloseDate);
                self.targetDate = ko.observable(dateFilter(new Date(uril.TargetDate), 'yyyy-MM-dd')); // ko.observable(uril.TargetDate);

                self.fixableIssue = ko.observable(uril.FixableIssue);
                self.qualifiedUnit = ko.observable(uril.QualifiedUnit);
                self.seriousIssue = ko.observable(uril.SeriousIssue);

                self.comments = ko.observable(uril.Comments);

                self.unitNbr = ko.observable(uril.UnitNbr);
                self.buildNbr = ko.observable(uril.BuildNbr);

                self.deleted = ko.observable(false);

                self.currentImage = ko.observable();
                self.imageSrc = ko.observable();

                self.display = ko.observable(false);

                //booleans for Image
                self.hasKey = ko.observable(true);
                self.showLoading = ko.observable(false);
                self.hasChanges = ko.observable(false);
                self.showImage = ko.observable(false);
                self.hasImage = ko.observable(uril.HasImage);
                self.message = ko.observable('Loading Image');
                self.showDelete = ko.observable(false);

                if (uril.hasImage == "Y") { self.ithasImage = ko.observable(true); self.hasNotImage = ko.observable(false); self.previewImage = ko.observable(true);}
                else { self.ithasImage = ko.observable(false); self.hasNotImage = ko.observable(true); self.previewImage = ko.observable(false);}


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


                self.displayImage = function() {

                self.message('Loading Image');
                self.showLoading(true);
                var server = getUnitReviewUploadsResource();
                var url = server + '/' + self.id();
                var Token = localStorage.getItem('token');

                $.ajax({
                        type: 'GET',
                        url: url,
                        headers: { deviceHeaderStorage: Token}
                    }).done(function (successResult){

                    self.showLoading(false);
                    self.showImage(true);

                    self.ithasImage(true);
                    self.hasNotImage(false);
                    self.previewImage(false);                    
                    self.showDelete(true);
                    self.imageSrc("data:image/jpeg;base64," + successResult.Data);
                    self.currentImage(successResult.Data);
             
                    }).fail(function (errorResult) {

                        self.showLoading(false);             
                        alert(errorResult.data.Message,'error');

                    });

                }

                self.uploadImage = function() {

                self.message('Uploading Image');
                self.showLoading(true);
                    
                    var imageObj = { 
                    Data : self.currentImage(),
                    size:25,
                    name:'nameAndDescription',
                    description:'nameAndDescription',
                    AddedDate: new Date(),
                    type:".jpg" ,
                    WebDelAllowed:true,
                    WebDeletionAllowed:true};

                    var fileImageObj = { EntityKey: self.id(), FileList: []};
                    fileImageObj.FileList.push(imageObj);
                    var server = getUnitReviewUploadsResource();
                    var Token = localStorage.getItem('token');

                    $.ajax({
                    url: server,
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(fileImageObj), 
                    dataType: 'json',
                    headers: { deviceHeaderStorage: Token},
                    success: function (data) { 
                        
                        self.showLoading(false);
                        self.ithasImage(true); 
                        self.hasChanges(false);
                        self.hasNotImage(false);
                        self.previewImage(false);
                        self.hasImage('Y');
                        self.showDelete(true);
                        self.displayImage();},
                    error: function (error) { alert('error'); }
                });

                }

                self.deleteImage = function() {
                    var r = confirm("Are you sure you want to delete the selected Image?");
                    if (r == true){

                        self.message('Deleting Image');
                        self.showLoading(true);
                    
                        var imageObj = { 
                        delete_url:'true'};

                        var fileImageObj = { EntityKey: self.id(), FileList: []};
                        fileImageObj.FileList.push(imageObj);
                        var server = getUnitReviewUploadsResource();
                        var Token = localStorage.getItem('token');

                        $.ajax({
                        url: server,
                        type: "Post",
                        data: JSON.stringify(fileImageObj), 
                        contentType: 'application/json; charset=utf-8',
                        headers: { deviceHeaderStorage: Token},
                        success: function (data) { 

                            self.showLoading(false);
                            self.ithasImage(false);
                            self.hasNotImage(true);
                            self.previewImage(false);
                            self.hasImage('N');
                            self.showDelete(false);
                            self.showImage(false);},
                        error: function (error) { alert('error'); }
                    });
                    }
                    else
                    {
                        return;
                    }

                }


                self.takePicture = function(){

                var pictureSource = navigator.camera.PictureSourceType;
                var destinationType = navigator.camera.DestinationType;
                
                try
                {
         
                    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
                    navigator.camera.getPicture(function(data){

                    var nameAndDescription = guid();

                    var imageObj = { 
                    Data : data,
                    size:25,
                    name:nameAndDescription,
                    description:nameAndDescription,
                    type:".jpg" ,
                    WebDelAllowed:true,
                    WebDeletionAllowed:true};

                    self.showImage(true);
                    self.hasChanges(true);
                    self.showDelete(true);
                    self.ithasImage(true);
                    self.previewImage(false);
                    self.hasNotImage(true);
                    self.imageSrc("data:image/jpeg;base64," + imageObj.Data);
                    self.currentImage(imageObj.Data);

                    },onFail,
                    {   quality: 20, 
                        destinationType: destinationType.DATA_URL
                    });
                }
                catch(err)
                {
                    log(err.message,'error');            
                }
                
                };

            }

            else {

                self.id = ko.observable(insp.newUnitrevItemId);
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
                self.hasKey = ko.observable();

                self.ithasImage = ko.observable(false);
                self.hasNotImage = ko.observable(true);
                self.hasImage = ko.observable();
                self.previewImage = ko.observable(false);
                self.showLoading = ko.observable(false);
                self.showImage = ko.observable(false);
                self.hasChanges = ko.observable(false);
                self.showDelete = ko.observable(false);
                self.imageSrc = ko.observable(false);
                self.message = ko.observable(false);
                self.currentImage = ko.observable();

                self.fixableIssue.subscribe(function (newValue) {
                    if (newValue == true) { self.fixableIssue(true); }
                    else { self.fixableIssue(false); }
                });

                self.qualifiedUnit.subscribe(function (newValue) {
                    if (newValue == true) { self.qualifiedUnit(true); }
                    else { self.qualifiedUnit(false); }
                });

                self.seriousIssue.subscribe(function (newValue) {
                    if (newValue == true) { self.seriousIssue(true); }
                    else { self.seriousIssue(false); }
                });

                self.display = ko.observable(false);


                self.takePictureWithID = function (unitrevItemID) {
                    
                    //open the camera
                    var pictureSource = navigator.camera.PictureSourceType;
                    var destinationType = navigator.camera.DestinationType;
                
                     try
                     {
         
                         // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
                         navigator.camera.getPicture(function(data){

                         var nameAndDescription = guid();

                         var imageObj = { 
                         Data : data,
                         size:25,
                         name:nameAndDescription,
                         description:nameAndDescription,
                         type:".jpg" ,
                         WebDelAllowed:true,
                         WebDeletionAllowed:true};
                      
                         self.showImage(true);
                         self.hasChanges(true);
                         self.showDelete(true);
                         self.ithasImage(true);
                         self.previewImage(false);
                         self.hasNotImage(true);
                         self.imageSrc("data:image/jpeg;base64," + imageObj.Data);
                         self.currentImage(imageObj.Data);

                         },onFail,
                         {   quality: 20, 
                             destinationType: destinationType.DATA_URL
                         });
                     }
                     catch(err)
                     {
                         log(err.message,'error');            
                     }
                    
                };


                self.takePicture = function(){
                    
                    if(self.id() != undefined)
                    {
                        self.takePictureWithID(self.id());
                    }
                    else{                    
                        if ((checkdate(formatDate(self.targetDate())) != true) &&
                            (checkdate(formatDate(self.closeDate())) != true) &&
                            (self.reviewItemDescription()!= undefined) && (self.reviewItemDetailDescription()!= undefined))
                        {
                            //alert('call api');
                            var unitrevItemURL = getUnitReviewItemURL();
                            //var Token = localStorage.getItem('token');
                            
                            var model = {
                                Id:insp.id(),
                                BuildNbr: self.buildNbr(),
                                CloseDate: self.closeDate(),
                                Comments: self.comments(),
                                FixableIssue: self.fixableIssue(),
                                ItemDecision: self.itemDecision(),
                                QualifiedUnit: self.qualifiedUnit(),
                                ReviewItemDescription: self.reviewItemDescription(),
                                ReviewItemDetailDescription: self.reviewItemDetailDescription(),
                                SeriousIssue: self.seriousIssue(),
                                TargetDate: self.targetDate(),
                                Unit: self.unit(),
                                UnitNbr: self.unitNbr(),
                                hasImage: 'X'

                            };
                            
                            $.ajax({
                            url: unitrevItemURL,
                            type: "POST",
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify(model), 
                            dataType: 'json',
                            success: function(data){ 
                                self.id(data);
                                self.takePictureWithID(data);
                                },
                            error: function (error) { alert('error'); }
                        });


                        }
                        else{
                            alert('The Item, Detail, Target Date and Close Date fields are required!!!');
                        }
                    }

                };



                self.deleteImage = function() {

                    var r = confirm("Are you sure you want to delete the selected Image?");
                    if (r == true){

                        self.message("Deleting Image");

                        self.showLoading(true);
                    
                            var imageObj = { 
                            delete_url:'true'};

                            var fileImageObj = { EntityKey: self.id(), FileList: []};
                            fileImageObj.FileList.push(imageObj);
                            var server = getUnitReviewUploadsResource();
                            var Token = localStorage.getItem('token');

                            $.ajax({
                            url: server,
                            type: "Post",
                            data: JSON.stringify(fileImageObj), 
                            contentType: 'application/json; charset=utf-8',
                            headers: { deviceHeaderStorage: Token},
                            success: function (data) { 

                                self.showLoading(false);
                                self.ithasImage(false);
                                self.hasNotImage(true);
                                self.previewImage(false);
                                self.hasImage('N');
                                self.showDelete(false);
                                self.showImage(false);},
                            error: function (error) { alert('error'); }
                        });
                    }
                    else
                    {
                        return;
                    }
                }



                self.uploadImage = function() {

                    self.message('Uploading Image');
                    self.showLoading(true);
                    
                    var imageObj = { 
                    Data : self.currentImage(),
                    size:25,
                    name:'nameAndDescription',
                    description:'nameAndDescription',
                    AddedDate: new Date(),
                    type:".jpg" ,
                    WebDelAllowed:true,
                    WebDeletionAllowed:true};

                    var fileImageObj = { EntityKey: self.id(), FileList: []};
                    fileImageObj.FileList.push(imageObj);
                    var server = getUnitReviewUploadsResource();

                    $.ajax({
                    url: server,
                    type: "POST",
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(fileImageObj), 
                    dataType: 'json',
                    success: function (data) { 
                        
                        self.showLoading(false);
                        self.ithasImage(true); 
                        self.hasChanges(false);
                        self.hasNotImage(false);
                        self.previewImage(false);
                        self.hasImage('Y');
                        self.showDelete(true);
                    },
                    error: function (error) { alert('error'); }
                });

                }
                
                
                self.displayImage = ko.observable();

            }

        };

        var TenantFindingsEditViewModel = function (propinspec, tenantFind) {
            var self = this;

            if (tenantFind != undefined) {

                self.id = ko.observable(tenantFind.Id);

                self.unitKey = ko.observable(tenantFind.UnitKey);
                self.build_Unit = ko.observable(tenantFind.Build_Unit);

                self.currentTenant = ko.observable(tenantFind.CurrentTenant);
                self.certType = ko.observable(tenantFind.CertType);
                self.nbrBedrooms = ko.observable(tenantFind.NbrBedrooms);

                if (tenantFind.Cert_date != "") {
                    self.cert_date = ko.observable(dateFilter(new Date(tenantFind.Cert_date), 'yyyy-MM-dd')); // ko.observable(tenantFind.Cert_date);
                }
                else { self.cert_date = ko.observable("N/A"); }

                self.opened_date = ko.observable(dateFilter(new Date(tenantFind.Opened_date), 'yyyy-MM-dd')); //ko.observable(tenantFind.Opened_date);
                self.resolved_date = ko.observable(dateFilter(new Date(tenantFind.Resolved_date), 'yyyy-MM-dd')); //ko.observable(tenantFind.Resolved_date);
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
                        self.cert_date = ko.observable(dateFilter(new Date(selectedTenant.Cert_date), 'yyyy-MM-dd')); //ko.observable(selectedTenant.Cert_date);
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


        var validatePropInspection = function (propinspecVM) {

            var errors = [];
            var generalErrors = { FieldName: "General Information", Errors: [] };
            var propRevItemsErrors = { FieldName: "Property Review Items", Errors: [] };
            var buildUnitSelectErrors = { FieldName: "Building/Unit Selection", Errors: [] };
            var unitRevItemsErrors = { FieldName: "Unit Review Items", Errors: [] };
            var tenantFindErrors = { FieldName: "Tenant Findings", Errors: [] };
            var documentReviewErrors = { FieldName: "Documentation Review", Errors: [] };

            function repeatedSelection(lookupItems) {

                if (lookupItems == undefined) return false;
                var i, j, z = 0;
                var len = lookupItems.length;

                for (i = 0; i < len; i++) {
                    z = 0;
                    var myvalue = lookupItems[i].unit();
                    for (j = 0; j < len; j++) {
                        if (lookupItems[j].unit() == myvalue) {
                            z += 1;
                            if (z == 2) return true;
                        }
                    }
                }
                return false;
            };


            //--General validators

            if ((propinspecVM.scheduledRevDt() == null) || (propinspecVM.scheduledRevDt().length == 0)) {
                generalErrors.Errors.push("The Scheduled Date is Required");
            } else {
                if (checkdate(formatDate(propinspecVM.scheduledRevDt())) == true) {
                    generalErrors.Errors.push("Invalid Scheduled Date")
                }
            }
            if (propinspecVM.reviewDate() != "") {
                if (checkdate(formatDate(propinspecVM.reviewDate())) == true) {
                    generalErrors.Errors.push("Invalid Review Date")
                }
            }


            if (generalErrors.Errors.length > 0) {
                errors.push(generalErrors);
            }

            //--Property Review Items validators

            var i;
            var propRevItems = propinspecVM.propertyrevitemslist().length;
            for (i = 0; i < propRevItems; i++) {

                if (propinspecVM.propertyrevitemslist()[i].reviewItem() == null) {
                    propRevItemsErrors.Errors.push("The Item is Required");
                }
                if (propinspecVM.propertyrevitemslist()[i].revItemDetail() == null) {
                    propRevItemsErrors.Errors.push("The Detail is Required");
                }

                if ((propinspecVM.propertyrevitemslist()[i].targetDt() != "") && (propinspecVM.propertyrevitemslist()[i].targetDt() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.propertyrevitemslist()[i].targetDt())) == true) {
                        propRevItemsErrors.Errors.push("Invalid Target Date");
                    }
                }
                if ((propinspecVM.propertyrevitemslist()[i].closeDt() != "") && (propinspecVM.propertyrevitemslist()[i].closeDt() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.propertyrevitemslist()[i].closeDt())) == true) {
                        propRevItemsErrors.Errors.push("Invalid Close Date");
                    }
                }
            }

            if (propRevItemsErrors.Errors.length > 0) {
                errors.push(propRevItemsErrors);
            }

            //  --Building/Unit Selection validators

            var i;
            var bin_Unit = propinspecVM.buildingsunitselections().length;
            for (i = 0; i < bin_Unit; i++) {

                if (propinspecVM.buildingsunitselections()[i].build_Unit() == null) {
                    buildUnitSelectErrors.Errors.push("The BIN/Unit is Required");
                }
            }

            if (repeatedSelection(propinspecVM.buildingsunitselections()) == true) {
                buildUnitSelectErrors.Errors.push("The BIN/Unit Selection must be unique");
            }

            if (buildUnitSelectErrors.Errors.length > 0) {
                errors.push(buildUnitSelectErrors);
            }

            //  --Unit Review Items validators

            var i;
            var unitRevItems = propinspecVM.unitreviewitemslist().length;
            for (i = 0; i < unitRevItems; i++) {

                if (propinspecVM.unitreviewitemslist()[i].reviewItemDescription() == null) {
                    unitRevItemsErrors.Errors.push("The Item is Required");
                }
                if (propinspecVM.unitreviewitemslist()[i].reviewItemDetailDescription() == null) {
                    unitRevItemsErrors.Errors.push("The Item Detail is Required");
                }

                if ((propinspecVM.unitreviewitemslist()[i].targetDate() != "") && (propinspecVM.unitreviewitemslist()[i].targetDate() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.unitreviewitemslist()[i].targetDate())) == true) {
                        unitRevItemsErrors.Errors.push("Invalid Target Date");
                    }
                }
                if ((propinspecVM.unitreviewitemslist()[i].closeDate() != "") && (propinspecVM.unitreviewitemslist()[i].closeDate() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.unitreviewitemslist()[i].closeDate())) == true) {
                        unitRevItemsErrors.Errors.push("Invalid Close Date");
                    }
                }
            }

            if (unitRevItemsErrors.Errors.length > 0) {
                errors.push(unitRevItemsErrors);
            }

            //  --Tenant Findings validators

            var i;
            var tenantFind = propinspecVM.tenantfindingseditmodellist().length;
            for (i = 0; i < tenantFind; i++) {

                if (propinspecVM.tenantfindingseditmodellist()[i].build_Unit() == null) {
                    tenantFindErrors.Errors.push("The BIN/Unit is Required");
                }

                if ((propinspecVM.tenantfindingseditmodellist()[i].opened_date() != "") && (propinspecVM.tenantfindingseditmodellist()[i].opened_date() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.tenantfindingseditmodellist()[i].opened_date())) == true) {
                        tenantFindErrors.Errors.push("Invalid Open Date");
                    }
                }
                if ((propinspecVM.tenantfindingseditmodellist()[i].resolved_date() != "") && (propinspecVM.tenantfindingseditmodellist()[i].resolved_date() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.tenantfindingseditmodellist()[i].resolved_date())) == true) {
                        tenantFindErrors.Errors.push("Invalid Resolved Date");
                    }
                }
            }

            if (tenantFindErrors.Errors.length > 0) {
                errors.push(tenantFindErrors);
            }

            //  --Documentation Review validators

            var i;
            var revDocuments = propinspecVM.reviewdocumentslist().length;
            for (i = 0; i < revDocuments; i++) {

                if (propinspecVM.reviewdocumentslist()[i].docDescription() == null) {
                    documentReviewErrors.Errors.push("The Document is Required");
                }

                if ((propinspecVM.reviewdocumentslist()[i].received_date() != "") && (propinspecVM.reviewdocumentslist()[i].received_date() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.reviewdocumentslist()[i].received_date())) == true) {
                        documentReviewErrors.Errors.push("Invalid Received Date");
                    }
                }
                if ((propinspecVM.reviewdocumentslist()[i].accepted_date() != "") && (propinspecVM.reviewdocumentslist()[i].accepted_date() != undefined)) {
                    if (checkdate(formatDate(propinspecVM.reviewdocumentslist()[i].accepted_date())) == true) {
                        documentReviewErrors.Errors.push("Invalid Accepted Date");
                    }
                }
            }

            if (documentReviewErrors.Errors.length > 0) {
                errors.push(documentReviewErrors);
            }


            propinspecVM.validationErrors(errors);
            return !errors.length > 0;

        };

        function checkdate(date) {     
            
            if(date != null)
            {
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
            else return true;
        }

        function formatDate(date) {
            
            if(date != undefined)
            {
                var parts = date.split('-');
                var day = parts[2];
                var month = parts[1];
                var year = parts[0];


                var result = month + '/' + day + '/' + year;
                return result;
            }
            else return null;
        }

        var showValidationErrors = function () {
            $("#validationErrorAlert").removeClass("hide");
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        };


         var pictureSource;   // picture source
        var destinationType; // sets the format of returned value 
          // Wait for Cordova to connect with the device
          //
         document.addEventListener("deviceready", onDeviceReady, false);
                    
         // Cordova is ready to be used!
         //
         function onDeviceReady() {
             pictureSource = navigator.camera.PictureSourceType;
             destinationType = navigator.camera.DestinationType;
         }

        function savePicture() {
         try
          {
          vm.canSaveImage = true;
          vm.loadingImage = true;   
          vm.imageMsg = "Saving image...";
          var modelObj = {EntityKey :vm.propertyId };
          modelObj.FileList = [];         
          modelObj.FileList.push(vm.selectedImage);    

          imagesResource.upload(modelObj,function (successResult) {            
               
               vm.loadingImage = false;   
               vm.imageList = successResult.FileList;           
               log('Saved image successfully');
               previewPicture(imageObj);
               vm.imageMsg = "Loading images...";
               
            }, function (errorResult) {          
                vm.loadingImage = false;      
                vm.errorResult = errorResult.data.Message;
                log(errorResult.data.Message,'error');
                vm.imageMsg = "Loading images...";
            });


           }
         catch(err)
            {
             log(err.message,'error');   
             vm.canSaveImage = false;         
            }
        
      }


      function canDeleteImage()
      {
      if(vm.selectedImage)
      {
      
      return true;
      }
      return false;
      
      } 

     function canSaveImage()
     {
     if(vm.selectedImage)
     {
     return vm.selectedImage.WebDelAllowed;
     }
     return false;
     
     } 

      function previewPicture(imageData) {
         
        canDeleteImage();
          
        vm.selectedImage = imageData;
        var smallImage = document.getElementById('smallImage');

        if(imageData != undefined){

            smallImage.style.display = 'block';
            smallImage.src = "data:image/jpeg;base64," + imageData.Data;
          }
          else
          {
            smallImage.style.display = "none";
            smallImage.src = null;
          }
      }

        
        function onFail(message) {
             log(message, 'error');
        }

        function capturePhotoEdit()
        {   

          try
          {
            vm.canSaveImage = false;
         // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
          navigator.camera.getPicture(
          function(data){
           
          var modelObj = {EntityKey :vm.propertyId };

          modelObj.FileList = [];

          var nameAndDescription = guid();

          var imageObj = { 
          Data : data,
          size:25,
          name:nameAndDescription,
          description:nameAndDescription,
          type:".jpg" ,
          WebDelAllowed:true,
          WebDeletionAllowed:true};

          modelObj.FileList.push(imageObj);

          previewPicture(imageObj);

          },
          onFail,
          { quality: 20, 
              destinationType: destinationType.DATA_URL
          });
          }
           catch(err)
            {
             log(err.message,'error');            
             vm.canSaveImage = true;
            }

        } 
		
		   function guid() {
                         function s4() {
                          return Math.floor((1 + Math.random()) * 0x10000)
                                 .toString(16)
                                 .substring(1);
                                 }
                        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                       }

     
      }
        
       

})();


