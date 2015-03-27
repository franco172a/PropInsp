$.support.cors = true;

angular.module('main', ['ui.bootstrap']);

function CarouselDemoCtrl($scope,$http) {
  var vm = this;  
  vm.showLoading = true;
  vm.selectedImage;
  vm.availablePictures = false;
  vm.noPictures = false;
  vm.savePicture = false;
  vm.deletePicture = false;
  vm.selectedPicture = false;
  var receiveddata = window.location.hash.substr(1).replace('/','');
  var result = receiveddata.split("#");
  var propertyId = result[0];
  var currentUrl = localStorage.getItem('urlstorageSource');
  var picturesURL = currentUrl + 'upload/' + propertyId;
  var postPicturesURL = currentUrl + 'upload/';
  var Token = localStorage.getItem('token');
  vm.userId = localStorage.getItem('userId');

  $http({
    url: picturesURL,
    method: 'GET',
    headers: { deviceHeaderStorage: Token}
  }).success(function(response) {
    $scope.pictures = response.FileList;
    vm.showLoading = false;
    if(response.FileList.length>0){
      vm.availablePictures = true;
      vm.deletePicture = true;
      vm.noPictures = false;
      vm.savePicture = false;
      vm.selectedPicture = false;
    }
    else{
      vm.availablePictures = false;
      vm.deletePicture = false;
      vm.noPictures = true;
      vm.savePicture = false;
      vm.selectedPicture = false;
    }
  }).error(function() {
      alert('getPicture Error');
  });


  var pictureSource;   // picture source
  var destinationType; // sets the format of returned value 
  document.addEventListener("deviceready", onDeviceReady, false);        
  // Cordova is ready to be used!
  function onDeviceReady() {
      pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;

  }
    
    $('#mycarousel').each(function(){
        $(this).carousel({
            pause: true,
            interval: false
        });
    });

  $scope.back = function(){
    window.location.reload();
  };

  $scope.backtoReview = function(){
    window.history.back()
  };  

  $scope.takePicture = function() {

    vm.noPictures = false;
    vm.availablePictures = false;
    vm.deletePicture = false;
    vm.savePicture = true;
    vm.selectedPicture = true;
    var imageToSave = document.getElementById('imageToSave');
    
    try
      {
        navigator.camera.getPicture(
        function(data){
          var nameAndDescription = guid();
          var imageObj = { 
            Id : null,
            Data : data,
            size:25,
            name:nameAndDescription,
            description:nameAndDescription,
            type:".jpg" ,
            WebDelAllowed:true,
            WebDeletionAllowed:true
          };

          imageToSave.style.display = 'block';
          imageToSave.src = "data:image/jpeg;base64," + imageObj.Data;
          vm.selectedImage = imageObj;
          
          },
          onFail,
          { quality: 20, 
              destinationType: destinationType.DATA_URL
          });
      }
      catch(err)
        {
          imageToSave.style.display = "none";
        }
    
  };

  $scope.uploadPicture = function() {

    vm.noPictures = false;
    vm.availablePictures = false;
    vm.deletePicture = false;
    vm.savePicture = true;
    vm.selectedPicture = true;
    var imageToSave = document.getElementById('imageToSave');
    
    try
      {
        navigator.camera.getPicture(
        function(data){
          var nameAndDescription = guid();
          var imageObj = { 
            Id : null,
            Data : data,
            size:25,
            name:nameAndDescription,
            description:nameAndDescription,
            type:".jpg" ,
            WebDelAllowed:true,
            WebDeletionAllowed:true
          };

          imageToSave.style.display = 'block';
          imageToSave.src = "data:image/jpeg;base64," + imageObj.Data;
          vm.selectedImage = imageObj;
          
          },
          onFail,
          { quality: 20, 
              destinationType: destinationType.DATA_URL,
              sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
          });
      }
      catch(err)
        {
          imageToSave.style.display = "none";
        }
    
  };

  $scope.savePicture = function() {

    try
      {
        var modelObj = {EntityKey : propertyId };
        modelObj.FileList = [];         
        modelObj.FileList.push(vm.selectedImage);

        $http.post(postPicturesURL, modelObj).success(function(data) {
          var last = data.FileList.length; 
          vm.selectedImage.Id = data.FileList[last-1].Id
          $scope.pictures.push(vm.selectedImage);
          $("#mycarousel").carousel();
          vm.availablePictures = true;
          vm.noPictures = false;
          vm.savePicture = false;
          vm.deletePicture = true;
          vm.selectedPicture = false;
          vm.selectedImage = null;
        }).error(function() {
          alert('savePicture Error');
        });

      }
      catch(err)
        {
          alert(err);     
        }
  };


  $scope.deletePicture = function(imageId) {

    var r = confirm("Are you sure you want to delete the selected Image?");
      if (r == true){

        var modelObj = {EntityKey : propertyId };
        modelObj.FileList = [];
        var imageObj = { 
          Id : imageId,
          delete_url:'true' 
        };
        modelObj.FileList.push(imageObj); 

        $http.post(postPicturesURL, modelObj).success(function(data) {
          window.location.reload();
        }).error(function() {
          alert('deletePicture Error');
        });
      }
      else
        {
          return;
        }
  };

  // function readURL(input) {

  //   vm.noPictures = false;
  //   vm.availablePictures = false;
  //   vm.deletePicture = false;
  //   vm.savePicture = true;
  //   vm.selectedPicture = true;

  //     var imageToSave = document.getElementById('imageToSave');
  //     imageToSave.style.display = 'block';

  //       if (input.files && input.files[0]) {
  //           var reader = new FileReader();
            
  //           reader.onload = function (e) {
  //               $('#imageToSave').attr('src', e.target.result).width(150).height(200);

  //               var str = e.target.result;
  //               var res = str.split(",");

  //               var imageObj = { 
  //                 Id : null,
  //                 Data : res[1],
  //                 size:25,
  //                 name:"Name",
  //                 description:"Description",
  //                 type:".jpg" ,
  //                 WebDelAllowed:true,
  //                 WebDeletionAllowed:true
  //               };

  //               vm.selectedImage = imageObj;
  //           }
            
  //           reader.readAsDataURL(input.files[0]);
  //       }
  //   }
    
  // $("#imgInp").change(function(){
  //    readURL(this);
  // });

  function onFail(message) {
             alert(message);
        }
    
       function guid() {
            function s4() {
               return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
       }

}