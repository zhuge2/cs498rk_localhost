var appControllers = angular.module('appControllers', ['720kb.datepicker']);

appControllers.controller('MainCtrl', ['$scope', '$window', 'Auth', 'CommonData', function($scope, $window, Auth, CommonData) {
  $scope.auth = Auth;
  $scope.user = CommonData.getUser();
  $scope.img = CommonData.getProfileImg();
  $window.sessionStorage.baseurl = "http://localhost:4000/api"
  console.log("logged in? " + Auth.loggedIn);
}]);

appControllers.controller('LandingPageController', ['$scope', '$window', 'CommonData', function($scope, $window, CommonData) {
  $scope.data = "";
  $scope.displayText = ""
  $scope.img = CommonData.getProfileImg();
  $scope.roomImg = CommonData.getRoomImg();
  var imagePath = './data/';
  $scope.hotCities = [{name: 'Chicago', img: imagePath+'chicago.jpg'},{name: 'New York', img: imagePath+'newYork.jpg'},
  {name: 'London', img: imagePath+'london.jpeg'}, {name: 'San Francisco', img: imagePath+'sanFran.jpg'},
  {name: 'Seattle', img: imagePath+'seattle.jpg'}, {name: 'Paris', img: imagePath+'paris.jpg'}];

  $scope.clickCity = function(city){
    CommonData.setCity(city);
    $window.location.href = '#/searchads';
  }
}]);

appControllers.controller('ProfileController', ['$scope', '$http', 'Users', function($scope, $http, Users) {
   $scope.profile = false;
   Users.get().success(function(data) {
    console.log("frontend profile" + JSON.stringify(data));
		if(!data.error) {
			$scope.profile = true;
			$scope.user = data.data.user;
		}
   });
 }]);

appControllers.controller('LoginController', ['$scope', '$window', 'Users', function($scope, $window, Users) {
  $scope.data = "";
  $scope.displayText = ""

  $scope.login = function() {
    console.log($scope.user);
    Users.postLogIn($scope.user).success(function (data) {
      console.log("success");
      $window.location.href = '#/profile';
    });
  };

}]);

appControllers.controller('SignupController', ['$scope', '$window', 'Users', function($scope, $window, Users) {
  $scope.data = "";

  $scope.signup = function() {
    console.log($scope.user);
    Users.postSignUp($scope.user).success(function (data) {
      console.log("data: " + JSON.stringify(data));
      $window.location.href = '#/profile';
    });
  }

}]);

appControllers.controller('hostOrTravellerController', ['$scope', '$window', 'CommonData', function($scope, $window, CommonData){

}]);

appControllers.controller('TravellerSearchController', ['$scope', '$window', 'CommonData', function($scope, $window, CommonData) {
  $scope.city = "";

  $scope.chooseCity = function (city) {
    console.log("city chosen: " + city);
    CommonData.setCity(city);
  }

}]);

appControllers.controller('SearchAdsController', ['$scope', '$window', 'CommonData', 'Listings', function($scope, $window, CommonData, Listings) {
  $scope.city = CommonData.getCity();
  $scope.roomTypes = CommonData.getRoomTypes();
  //$scope.roomTypes.push({name: "All", value: "All"});
  $scope.roomType = $scope.roomTypes[0];
  $scope.dates = {dateDepart: "", dateReturn: ""};
  $scope.dateReturn = "";
  $scope.minRating = 1;
  $scope.priceRange = { low: 0, high: 500 };
  $scope.tagList = CommonData.getTags();
  $scope.tags = [];
  
  getListings($scope.city);

  function getListings(city){
      if (city === undefined || city === ""){
        Listings.getListings().success(function(data){
          console.log(data);
          $scope.ads = data.data;
        }).error(function(err){
          console.log(err);
        });
      } else {
        Listings.getListingsByCity($scope.city).success(function(data){
          console.log(data);
          $scope.ads = data.data;
        }).error(function(err){
          console.log(err);
        });
      }
  }
  
  $scope.changeCity = function (city) {
    CommonData.setCity(city);
    console.log("city changed: " + city);
    getListings(city);
  }

  $scope.filterAds = function(){
    var tags = [];
    for (var i = 0; i < $scope.tags.length; i++){
      tags.push($scope.tags[i].name);
    }
    console.log(tags);
    Listings.filterListings($scope.city, $scope.roomType.name, $scope.dates.dateDepart, $scope.dates.dateReturn,
      $scope.priceRange.low, $scope.priceRange.high, tags).success(function(data){
        console.log(data);
        $scope.ads = data.data;
      }).error(function(err){
        console.log(err);
      });
  } 
}]);

appControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    console.log("base url: " +$scope.url);
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
  };

}]);


appControllers.controller('CreateHostAdController', ['$scope' , '$window' , 'CommonData', 'Listings', function($scope, $window, CommonData, Listings) {
  $scope.roomTypes = CommonData.getRoomTypes();
  $scope.img = CommonData.getProfileImg();
  $scope.roomImg = CommonData.getRoomImg();
  $scope.listing = {address: "", city: "", bio: "", roomType: $scope.roomTypes[0], price: 0, dateStart: "", dateEnd: "", tags: []};
  $scope.submitForm = function(){
    console.log("create host ad");
    Listings.postListing($scope.listing).success(function(data){
      console.log(data);
    }).error(function(err){
      console.log(err);
    });
  }
}]);

appControllers.controller('MatchingController', ['$scope', '$window', function($scope, $window){

}]);

appControllers.controller('HostBioController', ['$scope', '$window', 'CommonData', '$routeParams', 'User', 'Listing', function($scope, $window, CommonData, $routeParams, User, Listing){
  var loremIpsum = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
  $scope.data = {name: 'Sample Host', address: '123 S Main St', bio: 'My name is Sample Host. '+loremIpsum, roomType: 'Private Room', tags: ['Dancing', 'Vegetarian'], dates:['tomorrow']};
  var hostID = $routeParams.hostID;
  console.log(hostID);
  User.getFromId(hostID).success(function(data){
    //console.log(data);
    var user = data.data;
    $scope.listings = [];
    var ads = user.postedHostAds;
    for (var i=0; i<ads.length;i++){
      Listing.getFromId(ads[i]).success(function(data){
        //console.log(data.data);
        $scope.listings.push(data.data);
        $scope.data = data.data;
        console.log($scope.listings);
      }).error(function(err){
        console.log(err);
      });
    }
    console.log(user);
    
  }).error(function(err){
    console.log(err);
  });

  $scope.roomImg = CommonData.getRoomImg();
  $scope.img = CommonData.getProfileImg();
}]);

appControllers.controller('ListingDetailsController', ['$scope', '$window', '$routeParams', function($scope,
                          $window, $routeParams) {
  console.log('listing detail controller created');
  $scope.user = {name: "Isaac Clerencia", location: "Mountain View, CA, United States", occupation: "Software Engineer", age: "23", gender: "male", bio: "I am curious about everything and a bit of a computer nerd, but still socially capable :P In fact I love meeting new people, going out and I am usually up for anything ... I will enjoy as much a visit to a local bookshop, a BBQ in the park, discussing about whatever, some adventure sport, a good hike or a crazy night out until dawn."};
  $scope.listing = {description: "Interaction with Guests We want to meet interesting people so we are open to interact with the guests, if they want to, but the garden house is separate, so they can decide! The Neighborhood It's in the center of the Silicon Valley. It's closed to University Avenue, where all the restaurants and stores like the Palo Alto Apple Store are located. So it's the best place to start a journey through the Valley. Getting Around Palo Alto Public Transportation is great! You can get to many places in the Bay Area with the CalTrain or Uber. Other Things to Note There is no kitchen in the garden house, just a sink, but if you are here, you want to eat out and go to events anyway ;-)"}
}]);
