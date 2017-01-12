angular.module("socialGithub.services", [])

.service("AppSv",["$http", "$q", "$interval" , "apiOauth",
  function($http, $q, $interval, apiOauth) {

    var apiConfig = null;
    var apiUrl = "https://api.github.com";
    var token = apiOauth.access_token;

    var getApiConfig = function() {
      return apiConfig;
    }

    var getToken = function() {
      return token;
    }

    var setToken = function(tkn) {
      token = tkn;
    }

    var get = function(url) {
      var deferred = $q.defer();
      $http.get(url)
      .then(function(response){
        apiConfig = response.data;
        deferred.resolve(response);
      },function(response){
        deferred.reject(response);
      })

      return deferred.promise;      
    }

    var checkApi = function() {
      return get(apiUrl+"?access_token="+token);
    }

    var searchUsers = function(text) {
      return get(apiUrl+"/search/users?access_token="+token+"&q="+text);
    }

    var searchFollowers = function(username) {
      return get(apiUrl+"/users/"+username+"/followers?access_token="+token);
    }

    var searchRepos = function(username) {
      return get(apiUrl+"/users/"+username+"/repos?sort=updated&access_token="+token);
    }

    var searchCommits = function(username,repo) {
      return get(apiUrl+"/repos/"+username+"/"+repo+"/commits?access_token="+token);
    }

    return {
      checkApi:checkApi,
      getApiConfig:getApiConfig,
      getToken:getToken,
      setToken:setToken,
      searchUsers:searchUsers,
      searchFollowers:searchFollowers,
      searchRepos:searchRepos,
      searchCommits:searchCommits
	 }
}])

.factory('customInterceptor',['$timeout','$injector', '$q',function($timeout, $injector, $q) {
  
  var requestInitiated;

  function showLoadingText() {
    $injector.get("$ionicLoading").show({
      template: '<ion-spinner class="spinner-enerminds" icon="dots"></ion-spinner>',
      animation: 'fade-in',
      showBackdrop: true
    });
  };
  
  function hideLoadingText(){
    $injector.get("$ionicLoading").hide();
  };

  return {
    request : function(config) {
      requestInitiated = true;
      showLoadingText();
      return config;
    },
    response : function(response) {
      requestInitiated = false;
        
      // Show delay of 300ms so the popup will not appear for multiple http request
      $timeout(function() {

        if(requestInitiated) return;
        hideLoadingText();

      },500);
      
      return response;
    },
    requestError : function (err) {
      hideLoadingText();
      return err;
    },
    responseError : function (err) {
      hideLoadingText();
      return $q.reject(err);
    }
  }
}]);