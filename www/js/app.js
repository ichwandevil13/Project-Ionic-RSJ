// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-material', 'ionMdInput', 'ngCordova'])

.run(function($rootScope, $ionicPlatform, $ionicHistory, $ionicPopup) {
    $ionicPlatform.registerBackButtonAction(function(e) {
        var previousView = $ionicHistory.backView();
        if (!previousView) {
            $ionicPopup.confirm({
                title: 'Konfirmasi Keluar',
                template: 'Apakah anda yakin ingin keluar.?'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            });
        } else {
            $ionicHistory.goBack();
        }
        e.preventDefault();
        return false;
    }, 101);
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.directive('ionMdSelect', [function() {
    return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        template: '<label class="item item-input item-md-label">' +
            '<select>' +
            '<option class="md-select default-option" value=""></option>' +
            '</select>' +
            '<span class="input-label"></span>' +
            '<div class="highlight"></div>' +
            '</label>',
        compile: function(element, attr) {

            var highlight = element[0].querySelector('.highlight');
            var highlightColor;
            if (!attr.highlightColor) {
                highlightColor = 'calm';
            } else {
                highlightColor = attr.highlightColor;
            }
            highlight.className += ' highlight-' + highlightColor;

            var label = element[0].querySelector('.input-label');
            if (attr.placeholder) {
                label.innerHTML = attr.placeholder;
            }
            var defaultOption = element[0].querySelector('.default-option');
            if (attr.defaultOption) {
                defaultOption.innerHTML = attr.defaultOption;
            }

            /*Start From here*/
            var input = element.find('select');
            angular.forEach({
                'name': attr.name,
                'type': attr.type,
                'ng-value': attr.ngValue,
                'ng-model': attr.ngModel,
                'required': attr.required,
                'ng-required': attr.ngRequired,
                'ng-minlength': attr.ngMinlength,
                'ng-maxlength': attr.ngMaxlength,
                'ng-pattern': attr.ngPattern,
                'ng-change': attr.ngChange,
                'ng-trim': attr.trim,
                'ng-blur': attr.ngBlur,
                'ng-focus': attr.ngFocus,
                'ng-options': attr.options
            }, function(value, name) {
                if (angular.isDefined(value)) {
                    input.attr(name, value);
                }
            });

            var cleanUp = function() {
                ionic.off('$destroy', cleanUp, element[0]);
            };
            // add listener
            ionic.on('$destroy', cleanUp, element[0]);

            return function LinkingFunction($scope, $element) {

                var mdSelect = $element[0].querySelector('.md-select');

                var dirtyClass = 'used';

                var reg = new RegExp('(\\s|^)' + dirtyClass + '(\\s|$)');

                //Here is our toggle function
                var toggleClass = function() {
                    if (this.value === '') {
                        this.className = mdSelect.className.replace(reg, ' ');
                    } else {
                        this.classList.add(dirtyClass);
                    }
                };

                //Lets check if there is a value on load
                ionic.DomUtil.ready(function() {
                    if (mdSelect && mdSelect.value === '') {
                        mdSelect.className = mdSelect.className.replace(reg, ' ');
                    } else {
                        mdSelect.classList.add(dirtyClass);
                    }
                });
                // Here we are saying, on 'blur', call toggleClass, on mdInput
                ionic.on('blur', toggleClass, mdSelect);

            };

        }
    };
}])


.directive('ionSearchSelect', ['$ionicModal', '$ionicGesture', function($ionicModal, $ionicGesture) {
    return {
        restrict: 'E',
        scope: {
            options: "=",
            optionSelected: "="
        },
        controller: function($scope, $element, $attrs) {
            $scope.searchSelect = {
                title: $attrs.title || "Search",
                keyProperty: $attrs.keyProperty,
                valueProperty: $attrs.valueProperty,
                templateUrl: $attrs.templateUrl || 'templates/searchSelect.html',
                animation: $attrs.animation || 'slide-in-up',
                option: null,
                searchvalue: "",
                enableSearch: $attrs.enableSearch ? $attrs.enableSearch == "true" : true
            };

            $ionicGesture.on('tap', function(e) {

                if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
                    if ($scope.optionSelected) {
                        $scope.searchSelect.option = $scope.optionSelected[$scope.searchSelect.keyProperty];
                    }
                } else {
                    $scope.searchSelect.option = $scope.optionSelected;
                }
                $scope.OpenModalFromTemplate($scope.searchSelect.templateUrl);
            }, $element);

            $scope.saveOption = function() {
                if (!!$scope.searchSelect.keyProperty && !!$scope.searchSelect.valueProperty) {
                    for (var i = 0; i < $scope.options.length; i++) {
                        var currentOption = $scope.options[i];
                        if (currentOption[$scope.searchSelect.keyProperty] == $scope.searchSelect.option) {
                            $scope.optionSelected = currentOption;
                            break;
                        }
                    }
                } else {
                    $scope.optionSelected = $scope.searchSelect.option;
                }
                $scope.searchSelect.searchvalue = "";
                $scope.modal.remove();
            };

            $scope.clearSearch = function() {
                $scope.searchSelect.searchvalue = "";
            };

            $scope.closeModal = function() {
                $scope.modal.remove();
            };
            $scope.$on('$destroy', function() {
                if ($scope.modal) {
                    $scope.modal.remove();
                }
            });

            $scope.OpenModalFromTemplate = function(templateUrl) {
                $ionicModal.fromTemplateUrl(templateUrl, {
                    scope: $scope,
                    animation: $scope.searchSelect.animation
                }).then(function(modal) {
                    $scope.modal = modal;
                    $scope.modal.show();
                });
            };
        }
    };
}])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-bottom-right button-balanced-900"><i class="icon ion-paper-airplane"></i></button>',
                controller: function($timeout) {
                        /*$timeout(function () {
                            document.getElementById('fab-profile').classList.toggle('on');
                        }, 800);*/
                    }
                    // template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-balanced-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                    // controller: function($timeout) {
                    //     $timeout(function() {
                    //         document.getElementById('fab-activity').classList.toggle('on');
                    //     }, 200);
                    // }
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-right expanded button-balanced-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function($timeout) {
                    $timeout(function() {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-balanced-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function($timeout) {
                    $timeout(function() {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.loginlupapassword', {
        url: '/loginlupapassword',
        views: {
            'menuContent': {
                templateUrl: 'templates/loginlupapassword.html',
                controller: 'LoginlupapasswordCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '',
                controller: function($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

    .state('app.profiledokter', {
        url: '/profiledokter',
        views: {
            'menuContent': {
                templateUrl: 'templates/profiledokter.html',
                controller: 'ProfileDokterCtrl'
            },
            'fabContent': {
                template: '',
                controller: function($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        },
        params: {
            datadokter: null
        }
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })

    .state('app.poli', {
        url: '/poli',
        views: {
            'menuContent': {
                templateUrl: 'templates/poli.html',
                controller: 'PoliCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.dokter', {
        url: '/dokter',
        views: {
            'menuContent': {
                templateUrl: 'templates/dokter.html',
                controller: 'DokterCtrl'
            },
            'fabContent': {
                template: ''
            }
        },
        params: {
            listdokter: null,
            descriptionpoli: null,
            namapoli: null
        }
    })

    .state('app.konsultasi', {
        url: '/konsultasi',
        views: {
            'menuContent': {
                templateUrl: 'templates/konsultasi.html',
                controller: 'KonsultasiCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-bottom-right button-balanced-900"><i class="icon ion-paper-airplane"></i></button>',
                controller: function($timeout) {}
            }
        }
    })

    .state('app.listpasien', {
        url: '/listpasien',
        views: {
            'menuContent': {
                templateUrl: 'templates/listpasien.html',
                controller: 'ListpasienCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" ng-click="addpasien()" class="button button-fab button-fab-bottom-right button-balanced-900"><i class="icon ion-plus"></i></button>',
                controller: function($timeout) {}
            }
        }
    })

    .state('app.register', {
        url: '/register',
        views: {
            'menuContent': {
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.formpasien', {
        url: '/formpasien',
        views: {
            'menuContent': {
                templateUrl: 'templates/formpasien.html',
                controller: 'FormpasienCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })

    .state('app.profilepasien', {
        url: '/profilepasien',
        views: {
            'menuContent': {
                templateUrl: 'templates/profilepasien.html',
                controller: 'ProfilePasienCtrl'
            },
            'fabContent': {
                template: '',
                controller: function($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        },
        params: {
            datapasien: null
        }
    })

    .state('app.formtransaksi', {
        url: '/formtransaksi',
        views: {
            'menuContent': {
                templateUrl: 'templates/formtransaksi.html',
                controller: 'FormtransaksiCtrl'
            },
            'fabContent': {
                template: '',
                controller: function($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        },
        params: {
            datapasien: null
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/about');
});