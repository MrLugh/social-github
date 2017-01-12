angular.module("socialGithub.controllers", [])

.controller("AppCtrl",["$scope", "$state", "$timeout", "$ionicHistory", "AppSv", 
function($scope, $state, $timeout, $ionicHistory, AppSv) {

	$scope.AppSv = AppSv;

}])

.controller("StartCtrl",["$scope", "$state", "$timeout", "AppSv", 
function($scope, $state, $timeout, AppSv) {


	$scope.AppSv = AppSv;

	$scope.loading = true;
	$scope.hasError = false;

	$timeout(function(){
		$scope.AppSv.checkApi().then(
			function(response){
				$scope.loading = false;
				$scope.hasError = false;
				$state.go("app.users");
			},
			function(response){
				$scope.loading = false;
				$scope.hasError = true;
				$state.go("app.settings");
			}
		);
	},500);

}])

.controller("SettingsCtrl",["$scope", "$state", "$timeout", "AppSv", 
function($scope, $state, $timeout, AppSv) {

	console.log("SettingsCtrl");

	$scope.AppSv = AppSv;

	$scope.binding = {
		"token":$scope.AppSv.getToken()
	};

	$scope.loading = true;
	$scope.hasError = false;

	$scope.checkApi = function() {
		$scope.AppSv.setToken($scope.binding.token);
		$timeout(function(){
			$scope.AppSv.checkApi().then(
				function(response){
					$scope.loading = false;
					$scope.hasError = false;
					$state.go("app.users");
				},
				function(response){
					$scope.loading = false;
					$scope.hasError = true;
				}
			);
		},500);
	}

}])

.controller("UsersCtrl",["$scope", "$state", "$timeout", "$stateParams", "AppSv", 
function($scope, $state, $timeout, $stateParams, AppSv) {


	$scope.AppSv = AppSv;

	$scope.binding = {
		"search": $stateParams.username || ""
	};

	$scope.searchResponse = null;
	$scope.timer = -1;

	$scope.users = function() {
		$timeout.cancel($scope.timer);
		$scope.searchResponse = null;
		if ($scope.binding.search.length<4) {
			return;
		}
		$scope.timer = $timeout(function(){
			$scope.AppSv.searchUsers($scope.binding.search).then(
				function(response){
					response.data.items.forEach(function(user){
						$scope.AppSv.searchFollowers(user.login).then(
							function(response){
								user.followers = response.data.splice(0,3);
							},
							function(response){
								$state.go("app.settings");
							}							
						)
					});
					$scope.searchResponse = response.data;
				},
				function(response){
					$state.go("app.settings");
				}
			);
		},500);
	}

	if ($stateParams.username && $stateParams.username.length) {
		$scope.users();
	}

}])

.controller("RepositoryCtrl",["$scope", "$state", "$stateParams", "AppSv", 
function($scope, $state, $stateParams, AppSv) {


	$scope.AppSv = AppSv;
	$scope.user = $stateParams.username;

	$scope.binding = {
		"search":""
	};

	$scope.searchResponse = null;

	$scope.repos = function() {
		$scope.AppSv.searchRepos($scope.user).then(
			function(response){
				response.data.forEach(function(repo){
					$scope.AppSv.searchCommits($scope.user,repo.name).then(
						function(response){
							repo.commits = response.data.splice(0,3);
						},
						function(response){
							$state.go("app.settings");
						}
					)
				});
				$scope.searchResponse = response.data;
			},
			function(response){
				$state.go("app.settings");
			}
		);
	}
	$scope.repos();

}])