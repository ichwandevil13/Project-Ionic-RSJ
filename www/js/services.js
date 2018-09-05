/* global angular, document, window */
'use strict';

angular.module('starter.services', [])
    // .constant('authstorage', {
    //     username: '',
    //     password: '',
    //     token: null,
    //     user_email: '',
    //     user_nicename: '',
    //     user_display_name: ''
    // })
    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            remove: function(key) {
                $window.localStorage.removeItem(key);
            }
        }
    }])
    .factory('allService', ['$http', '$localstorage', function($http, $localstorage) {

        var urlBase = 'http://api.rsjd-arifzainudin.co.id/apps/';
        //var urlBase = '/api';
        //var urlBase = 'https://wp-rsjd.ich-one.com/wordpress/';
        var _allService = {};
        // var _getnoonce = function () {
        //     $http.get(urlBase + 'api/get_nonce/?controller=user&method=register').then(function (result) {
        //         $localstorage.setObject("nonce", result);
        //     })
        // }
        _allService.tokenAuth = function(param) {
            return $http({
                method: 'POST',
                url: urlBase + '/wp-json/jwt-auth/v1/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'username=' + param.username + '&password=' + param.password + '&insecure=cool'
            });
        };


        _allService.resetpassword = function(param) {
            return $http({
                method: 'POST',
                url: urlBase + '/index.php/reset-password/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: 'user_login=' + param.username + '&password_reset_submit=Reset+Password'
            });
        };

        _allService.getCookies = function(param) {
            return $http({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: urlBase + 'api/user/generate_auth_cookie/?username=' + param.username + '&password=' + param.password + '&insecure=cool'
            });
        };
        _allService.getRegister = function(param) {
            var _uri = encodeURI(urlBase + '/api/user/register/?username=' + param.username +
                '&email=' + param.email +
                '&display_name=' + param.display_name +
                '&nonce=' + param.nonce +
                '&user_pass=' + param.password +
                '&description=' + param.description +
                '&notify=both&insecure=cool');
            return $http({
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: _uri
            });
        };
        _allService.getNonce = function() {
            return $http.get(urlBase + 'api/get_nonce/?controller=user&method=register');
        };
        _allService.getPoli = function() {
            return $http.get(urlBase + '/wp-json/wp/v2/daftarpoli/?per_page=100');
        };
        _allService.getDokter = function() {
            return $http.get(urlBase + '/wp-json/wp/v2/daftardokter/?per_page=100');
        };
        _allService.getDokter = function() {
            return $http.get(urlBase + '/wp-json/wp/v2/daftardokter/?per_page=100');
        };
        _allService.getPasien = function(iduser) {
            return $http.get(urlBase + '/wp-json/wp/v2/daftarpasien/?per_page=100&filter[meta_key]=pasien_user&filter[meta_value]=' + iduser);
        };
        _allService.getTransaksiByPasien = function(idpasien) {
            return $http.get(urlBase + '/wp-json/wp/v2/daftartransaksi?filter[meta_key]=pasien_id&filter[meta_value]=' + idpasien);
        };
        // _allService.getTransaksiByUser = function(iduser) {
        //     return $http.get(urlBase + '/wp-json/wp/v2/daftartransaksi?filter[meta_key]=pasien_id&filter[meta_value]='+iduser);
        // };

        _allService.savePasien = function(param) {
            var _auth = $localstorage.getObject("_auth_data");
            var _token = _auth.token;
            var _dataxform = '';
            for (var key in param) {
                if (_dataxform != '') {
                    _dataxform += '&';
                }
                if (param.hasOwnProperty(key)) {
                    _dataxform += encodeURI(key + '=' + param[key]);
                }
            }
            return $http({
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer ' + _token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                xhrFields: {
                    withCredentials: true
                },
                url: urlBase + 'wp-json/wp/v2/daftarpasien',
                data: _dataxform
            });
        };

        _allService.saveTransaksi = function(param) {
            var _auth = $localstorage.getObject("_auth_data");
            var _token = _auth.token;
            var _dataxform = '';
            for (var key in param) {
                if (_dataxform != '') {
                    _dataxform += '&';
                }
                if (param.hasOwnProperty(key)) {
                    _dataxform += encodeURI(key + '=' + param[key]);
                }
            }
            return $http({
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer ' + _token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                xhrFields: {
                    withCredentials: true
                },
                url: urlBase + 'wp-json/wp/v2/daftartransaksi/?per_page=100',
                data: _dataxform
            });
        };

        return _allService;

    }]);