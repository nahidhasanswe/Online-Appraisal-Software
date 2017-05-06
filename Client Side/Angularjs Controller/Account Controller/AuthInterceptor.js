'use strict';

var AuthApp = angular.module('AuthApp', ['LocalStorageModule']);


// Global Variable for base path
AuthApp.constant('serviceBasePath', 'http://nahidswe-001-site1.atempurl.com');

AuthApp.factory('AuthData', ['localStorageService', function (localStorageService) {
    var authServiceFactory = {};

    authServiceFactory.getRoleName = function () {

        var authData = localStorageService.get('authorizationData');

        var auth = {
            Role: 'Anonymous',
            Name: 'Anonymous User'
        }

        if (authData) {
            auth.Role = authData.Role;
            auth.Name = authData.userName
            return auth;
        } else
            return auth
    }
    
    return authServiceFactory;
}])

AuthApp.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', 'AuthData', function ($q, $injector, $location, localStorageService, AuthData) {

    var authInterceptorServiceFactory = {};

    authInterceptorServiceFactory.request = function (config) {

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    }

    authInterceptorServiceFactory.responseError = function (rejection) {
        if (rejection.status == 401) {
            var auth = AuthData.getRoleName();
            if (auth.Role == 'Department Head') {
                $location.path('/myEmployee')
            } else if (auth.Role == 'Employee') {
                $location.path('/jobDescription')
            }else if(auth.Role=='Super Admin')
                $location.path('/home');
            else
                $location.path('/login');
        } else if (rejection.status == 403) {
            $location.path('/login');
        }
        return $q.reject(rejection);
    };

    return authInterceptorServiceFactory;

}]);


AuthApp.factory('authService', ['$http', '$q', 'localStorageService', 'serviceBasePath', function ($http, $q, localStorageService, serviceBasePath) {
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: ""
    };

    authServiceFactory.getAuthInfo = function () {
        
        var authData = localStorageService.get('authorizationData');
        
        if (authData) {
             return true;
        } else
            throw new NotImplementedError('Unauthenticate');
    }

    authServiceFactory.getRoleName = function () {

        var authData = localStorageService.get('authorizationData');

        var auth = {
            Role: 'Anonymous',
            Name: 'Anonymous User'
        }

        if (authData) {
            auth.Role = authData.Role;
            auth.Name=authData.userName
            return auth;
        } else
            return auth
    }

    function NotImplementedError(message) {
        this.name = "Authentication and Authorization";
        this.message = (message || "");
    }
    NotImplementedError.prototype = Error.prototype;

    authServiceFactory.saveRegistration = function (registration) {

        authServiceFactory.logOut();

        return $http.post(serviceBasePath + '/api/account/register', registration)
    };

    authServiceFactory.login = function (loginData) {

        var obj = { 'username': loginData.userName, 'password': loginData.password, 'grant_type': 'password' };

        Object.toparams = function ObjectsToParams(obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        }

        var deferred = $q.defer();

        $http({
            method: 'post',
            url: serviceBasePath + "/token",
            data: Object.toparams(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(function (response) {
            var storage = {
                token: response.data.access_token,
                userName: response.data.userName,
                Role:response.data.Role
            }

            localStorageService.set('authorizationData', storage, 'localStorage');

            deferred.resolve(response);
        }, function (error) {
            deferred.reject(error.data);
        })
        return deferred.promise;
    }

    authServiceFactory.logOut = function () {

        localStorageService.remove('authorizationData');

    };

    authServiceFactory.fillAuthData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
        }
        else {
            _authentication.isAuth = false;
        }
    };

    authServiceFactory.changePassword = function (passwordData) {

        return $http.post(serviceBasePath + '/api/Account/ChangePassword', passwordData)
    };

    authServiceFactory.getData = function () {

        $http.get(serviceBasePath + '/api/Account/getUserInfo').then(function (response) {
            return response.data;
        });
    };

    authServiceFactory.ForgotPassword = function (data) {
        return $http.post(serviceBasePath + '/api/Account/ForgotPassword', data);
    };

    authServiceFactory.ResetPassword = function (data) {
        return $http.post(serviceBasePath + '/api/Account/ResetPassword', data);
    };

    return authServiceFactory;
}]);