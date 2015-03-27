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

function loadOfflineData() {

    var receiveddata = window.location.hash.substr(1).replace('/', '');
    var res = receiveddata.split("#");

    if (res[1] == 'offline') {
        var data = JSON.parse(localStorage.getItem(res[0]));
    }
    else {
        return alert('inspection has not data!');
    }

    propinspecVM = new AppViewModel(data);
    ko.applyBindings(propinspecVM);

};


function AppViewModel(data) {

            var self = this;

            self.validationErrors = ko.observable(null);
            self.validationErrorsPresent = ko.computed(function () {
                if (self.validationErrors() == undefined) return false;
                return (self.validationErrors().length > 0);
            });


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

                var newUnitDetail = new UnitReviewItemsListViewModel(self);
                newUnitDetail.display(true);
                newUnitDetail.hasKey(false);
                newUnitDetail.unit(self.unitNumber());
                newUnitDetail.buildNbr(self.buildNbr());
                self.unitreviewitemslist.push(newUnitDetail);
            };

            self.deleteunitreviewitem = function (item) {
                self.unitreviewitemslist.remove(item);
                item.deleted(true);
            };

            self.addPropertyReviewItem = function () {
                var newPropRev = new PropertyReviewItemsViewModel(self);
                newPropRev.hasId(false);
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


            self.addBuildingUnitCombinations = function (comb) {
                self.myfilteredbuildunitcombinations.push(comb);
            };

            self.erasebuildingsunitselection = function (comb) {
                var i;
                var len = self.myfilteredbuildunitcombinations().length;

                for (i = 0; i < len; i++) {
                    if (self.myfilteredbuildunitcombinations()[i].UnitKey == comb.unit()) {
                        self.myfilteredbuildunitcombinations.remove(self.myfilteredbuildunitcombinations()[i]);
                    }
                }
                return;
            };


            self.savetoLocal = function () {

                validatePropInspection(this);

                if(self.validationErrors().length > 0)
                {
                    showValidationErrors();
                    return;
                }

                var newData = {};
                newData.Id = self.id();
                newData.ReviewTypeDescription = self.reviewTypeDescription();
                newData.PropMemo = self.propMemo();
                newData.ReviewDate = self.reviewDate();
                newData.GradeType = self.gradeType();
                newData.GradeTypes = self.gradeTypes();
                newData.ReviewStatus = self.reviewStatus();
                newData.ReviewStatuses = self.reviewStatuses();
                newData.ReviewType = self.reviewType();
                newData.ReviewTypes = self.reviewTypes();
                newData.ReviewYear = self.reviewYear();
                newData.ReviewedBy = self.reviewedBy();
                newData.ScheduledRevDt = self.scheduledRevDt();
                newData.REACScore = self.reacScore();
                newData.NbrReviewed = self.nbrReviewed();
                newData.NbrUnits = self.nbrUnits();
                newData.DocumentsList = self.myDocumentsList();
                newData.DocStatusList = self.myDocStatusList();
                newData.PropertyId = self.propertyId();
                newData.ReviewUnits = self.reviewUnits();
                newData.BuildingsList = self.mybldlist();
                newData.TenFindingsList = self.mytenantfindinglist();
                newData.BuildUnitCombinations = self.mybuildunitcombinations();
                newData.ItemDecisionsList = self.myitemDecisionsList();
                newData.ReviewItemsList = self.myreviewItemsList();
                newData.ReviewItemDetailsList = self.myreviewItemDetailsList();
                newData.FilteredBuildUnitCombinations = self.myfilteredbuildunitcombinations();
                newData.FindingsList = self.myFindingsList();
                newData.EntityModelList = self.myentitymodellist();
                newData.ContactModelList = self.contactmodellist();
                newData.EntityModelID = self.entityModelID();
                newData.ContactModelID = self.contactModelID();

                newData.SelectedBuildUnitNumber = self.selectedBuildUnitNumber();
                self.unitNumber = ko.observable();
                self.buildNbr = ko.observable();
                self.popupValidation = ko.observable();

                newData.PropertyRevItemsList = self.propertyrevitemslist();
                var propertyRevItemsList = self.propertyrevitemslist();

                if (propertyRevItemsList.length > 0) {
                    for (var i = 0; i < propertyRevItemsList.length; i++) {
                        var pRevItem = propertyRevItemsList[i];
                        pRevItem.Comments = propertyRevItemsList[i].comments();
                        pRevItem.TargetDt = propertyRevItemsList[i].targetDt();
                        pRevItem.CloseDt = propertyRevItemsList[i].closeDt();
                        pRevItem.ItemDecision = propertyRevItemsList[i].itemDecision();
                        pRevItem.ReviewItem = propertyRevItemsList[i].reviewItem();
                        pRevItem.RevItemDetail = propertyRevItemsList[i].revItemDetail();
                        pRevItem.RevItemTemplates = propertyRevItemsList[i].revItemTemplates();
                        pRevItem.Id = propertyRevItemsList[i].id();
                        pRevItem.FixableIssue = propertyRevItemsList[i].fixableIssue();
                        pRevItem.SeriousIssue = propertyRevItemsList[i].seriousIssue();
                    }
                }


                newData.BuildingsUnitSelections = self.buildingsunitselections();
                var buildingsunitselections = self.buildingsunitselections();

                if (buildingsunitselections.length > 0) {

                    for (var i = 0; i < buildingsunitselections.length; i++) {
                        var bUnitSel = buildingsunitselections[i];
                        bUnitSel.Comments = buildingsunitselections[i].comments();
                        bUnitSel.Build_Unit = buildingsunitselections[i].build_Unit();
                        bUnitSel.Unit = buildingsunitselections[i].unit();
                        bUnitSel.Selected = buildingsunitselections[i].selected();

                    }
                }


                newData.UnitReviewItemsList = self.unitreviewitemslist();
                var unitreviewitems = self.unitreviewitemslist();

                if (unitreviewitems.length > 0) {

                    for (var i = 0; i < unitreviewitems.length; i++) {
                        var uRevItem = unitreviewitems[i];
                        uRevItem.Id = unitreviewitems[i].id();
                        uRevItem.Comments = unitreviewitems[i].comments();
                        uRevItem.Unit = unitreviewitems[i].unit();
                        uRevItem.ReviewItemDescription = unitreviewitems[i].reviewItemDescription();
                        uRevItem.ReviewItemDetailDescription = unitreviewitems[i].reviewItemDetailDescription();
                        uRevItem.ItemDecision = unitreviewitems[i].itemDecision();
                        uRevItem.CloseDate = unitreviewitems[i].closeDate();
                        uRevItem.TargetDate = unitreviewitems[i].targetDate();
                        uRevItem.FixableIssue = unitreviewitems[i].fixableIssue();
                        uRevItem.QualifiedUnit = unitreviewitems[i].qualifiedUnit();
                        uRevItem.SeriousIssue = unitreviewitems[i].seriousIssue();
                        uRevItem.UnitNbr = unitreviewitems[i].unitNbr();
                        uRevItem.BuildNbr = unitreviewitems[i].buildNbr();
                        uRevItem.HasImage = unitreviewitems[i].hasImage();

                    }
                }


                newData.TenantFindingsEditModelList = self.tenantfindingseditmodellist();
                var tenantfindings = self.tenantfindingseditmodellist();

                if (unitreviewitems.length > 0) {
                    for (var i = 0; i < tenantfindings.length; i++) {
                        var tenFind = tenantfindings[i];
                        tenFind.Id = tenantfindings[i].id();
                        tenFind.Comments = tenantfindings[i].comments();
                        tenFind.UnitKey = tenantfindings[i].unitKey;
                        tenFind.Build_Unit = tenantfindings[i].build_Unit();
                        tenFind.CurrentTenant = tenantfindings[i].currentTenant();
                        tenFind.CertType = tenantfindings[i].certType();
                        tenFind.NbrBedrooms = tenantfindings[i].nbrBedrooms();
                        tenFind.Cert_date = tenantfindings[i].cert_date();
                        tenFind.Opened_date = tenantfindings[i].opened_date();
                        tenFind.Resolved_date = tenantfindings[i].resolved_date();
                        tenFind.SeriousIssue = tenantfindings[i].seriousIssue();
                        tenFind.FindingKey = tenantfindings[i].findingKey();

                    }
                }


                newData.ReviewDocumentsList = self.reviewdocumentslist();
                var reviewDocumentsList = self.reviewdocumentslist();

                if (reviewDocumentsList.length > 0) {
                    for (var i = 0; i < reviewDocumentsList.length; i++) {
                        var rDoc = reviewDocumentsList[i];
                        rDoc.Comments = reviewDocumentsList[i].comments();
                        rDoc.Accepted_date = reviewDocumentsList[i].accepted_date();
                        rDoc.Received_date = reviewDocumentsList[i].received_date();
                        rDoc.Doc_Status = reviewDocumentsList[i].doc_Status();
                        rDoc.DocDescription = reviewDocumentsList[i].docDescription();
                    }
                }


                var receiveddata = window.location.hash.substr(1).replace('/', '');
                var res = receiveddata.split("#");

                if (res[1] == 'offline') {

                    localStorage.setItem(res[0], JSON.stringify(newData));
                    alert('Inspection has been saved!')
                    window.location.reload();
                }
                else {
                    return alert('Inspection can not be saved!');
                }
            };

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

        var showValidationErrors = function () {
            $("#validationErrorAlert").removeClass("hide");
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        };


       

