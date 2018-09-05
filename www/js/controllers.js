/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicHistory, $state, $ionicModal, $ionicPopover, $ionicPopup, $timeout, $localstorage, allService) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    $scope.reloginFungsi = function(username, password) {
        allService.tokenAuth({
            username,
            password
        }).success(function(response) {
            if (!$scope.authstorage) {
                $scope.authstorage = {};
            }
            $scope.authstorage.username = username;
            $scope.authstorage.password = password;
            $scope.authstorage.token = response.token;
            $scope.authstorage.user_email = response.user_email;
            $scope.authstorage.user_nicename = response.user_nicename;
            $scope.authstorage.user_display_name = response.user_display_name;
            allService.getCookies({
                username,
                password
            }).success(function(__response) {
                $scope.authstorage.cookie = __response.cookie;
                $scope.authstorage.cookie_name = __response.cookie_name;
                $scope.authstorage.user = __response.user;
                if (__response.user.description) {
                    $scope.authstorage.user.description = JSON.parse(__response.user.description);
                }
                $localstorage.setObject("_auth_data", $scope.authstorage);
            })
        }).catch(function(error) {
            console.log(error);
        });
    }

    $scope.refreshMenu = function() {
        $scope.authstorage = $localstorage.getObject("_auth_data");
    };
    $scope.signout = function() {
        $localstorage.remove("_auth_data");
        var _name = $scope.authstorage.user_nicename;
        // $scope.authstorage.username = '';
        // $scope.authstorage.password = '';
        $scope.authstorage.token = null;
        $scope.authstorage.user_email = null;
        $scope.authstorage.user_nicename = null;
        $scope.authstorage.user_display_name = null;
        var alertPopup = $ionicPopup.alert({
            title: 'Info',
            template: 'Anda berhasil keluar, terimakasih atas kepercayaannya.'
        });
        $ionicHistory.clearHistory();
        $state.go("app.login").then(function() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $scope.refreshMenu();
        });
    };


    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;


        // .fromTemplate() method
        var template = '<ion-popover-view>' +
            '   <ion-header-bar>' +
            '       <h1 class="title" style="color:black">My Popover Title</h1>' +
            '   </ion-header-bar>' +
            '   <ion-content class="padding">' +
            '       My Popover Contents' +
            '   </ion-content>' +
            '</ion-popover-view>';

        $scope.popover = $ionicPopover.fromTemplate(template, {
            scope: $scope
        });
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    $scope.gosomewhere = function(param) {
        $state.go(param);
    }

    $scope.addpasien = function() {
        $state.go('app.formpasien');
    }

    $scope.authstorage = $localstorage.getObject("_auth_data");
    if ($scope.authstorage.username) {
        $scope.reloginFungsi($scope.authstorage.username, $scope.authstorage.password);
        $state.go("app.profile").then(function() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $scope.refreshMenu();
        });
    } else {
        // $state.go("app.login").then(function() {
        //     $ionicHistory.clearCache();
        //     $ionicHistory.clearHistory();
        //     $scope.refreshMenu();
        // });
    }
})

.controller('LoginCtrl', function($scope, $ionicHistory, $timeout, $state, $ionicPopup, $stateParams, $ionicLoading, ionicMaterialInk, allService, $localstorage, $cordovaSQLite) {
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    $scope.lupapassword = function() {
        $state.go("app.loginlupapassword");
    }

    ionicMaterialInk.displayEffect();
    $scope.signin = function(username, password) {
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        allService.tokenAuth({
            username,
            password
        }).success(function(response) {
            $scope.$parent.authstorage.username = username;
            $scope.$parent.authstorage.password = password;
            $scope.$parent.authstorage.token = response.token;
            $scope.$parent.authstorage.user_email = response.user_email;
            $scope.$parent.authstorage.user_nicename = response.user_nicename;
            $scope.$parent.authstorage.user_display_name = response.user_display_name;
            allService.getCookies({
                username,
                password
            }).success(function(__response) {
                $scope.$parent.authstorage.cookie = __response.cookie;
                $scope.$parent.authstorage.cookie_name = __response.cookie_name;
                $scope.$parent.authstorage.user = __response.user;
                if (__response.user.description) {
                    $scope.$parent.authstorage.user.description = JSON.parse(__response.user.description);
                }
                $localstorage.setObject("_auth_data", $scope.$parent.authstorage);
                $ionicLoading.hide();
                $ionicHistory.clearHistory();
                $state.go("app.profile").then(function() {
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $scope.$parent.refreshMenu();
                });
            })
        }).catch(function(error) {
            $scope.showPopup();
            $ionicLoading.hide();
        });
    }
    allService.getPoli().then(function(result) {
        if (result.data) {
            $localstorage.setObject("_data_poli", result.data);
        }
    });
    $scope.showPopup = function() {
        //debugger;
        var alertPopup = $ionicPopup.alert({
            title: 'Problem',
            template: 'Username dan password salah.'
        });

        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    };
    allService.getDokter().then(function(result) {
        if (result.data) {
            $localstorage.setObject("_data_dokter", result.data);
        }
    });
})

.controller('LoginlupapasswordCtrl', function($scope, $ionicHistory, $timeout, $state, $ionicPopup, $stateParams, $ionicLoading, ionicMaterialInk, allService, $localstorage, $cordovaSQLite) {
    if ($scope.$parent.authstorage.token) {
        //$state.go("app.profile");
        $state.go("app.profile").then(function() {
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $scope.$parent.refreshMenu();
        });
        return;
    }
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
    $scope.resetpass = function(username) {
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        allService.resetpassword({
            username
        }).success(function(response) {

            $state.go("app.login");
            $ionicLoading.hide();
            $scope.showPopupSukses();
        }).catch(function(error) {
            $scope.showError('Error', error.data.error);
            $ionicLoading.hide();
        });
    }
    allService.getPoli().then(function(result) {
        if (result.data) {
            $localstorage.setObject("_data_poli", result.data);
        }
    });
    $scope.showPopupSukses = function() {
        //debugger;
        var alertPopup = $ionicPopup.alert({
            title: 'Berhasil',
            template: 'Silahkan cek email anda untuk untuk mengatur ulang password anda.'
        });

        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    };
    $scope.showError = function(title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    }
    $scope.showPopup = function() {
        //debugger;
        var alertPopup = $ionicPopup.alert({
            title: 'Problem',
            template: 'Username dan password salah.'
        });

        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    };
    allService.getDokter().then(function(result) {
        if (result.data) {
            $localstorage.setObject("_data_dokter", result.data);
        }
    });
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.profile = angular.copy($scope.$parent.authstorage);

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})


.controller('AboutCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });
})

.controller('PoliCtrl', function($scope, $state, $stateParams, $timeout, allService, ionicMaterialInk, ionicMaterialMotion, $localstorage) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $scope._listpoli = $localstorage.getObject("_data_poli");
    $scope.listpoli = angular.copy($scope._listpoli);
    $scope.openListDokter = function(params, deskripsi, namapoli) {
        $state.go("app.dokter", {
            listdokter: params,
            descriptionpoli: deskripsi,
            namapoli: namapoli
        });
        //debugger;
    }
    allService.getPoli().then(function(result) {
        if (result.data) {
            $localstorage.setObject("_data_poli", result.data);
        }
    });

    $scope.getDescription = function(deskripsi) {
        var lenmax = 35;
        if (deskripsi.length > lenmax) {
            return deskripsi.substring(0, lenmax - 3) + '...';
        } else {
            return deskripsi;
        }
    };

    $scope.search = {};
    var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };
    $scope.fadeSlideInRight = function() {
        if ($scope.search.nama_poli) {
            $scope.listpoli = $scope._listpoli.filter(function(el) {
                return el.nama_poli.toLowerCase().includes($scope.search.nama_poli.toLowerCase());
            });
        } else {
            $scope.listpoli = angular.copy($scope._listpoli);
        }
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function() {
            ionicMaterialMotion.ripple();
        }, 500);
    };
    $scope.fadeSlideInRight();
})

.controller('DokterCtrl', function($scope, $state, $stateParams, $timeout, allService, ionicMaterialInk, ionicMaterialMotion, $localstorage) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.title = "Dokter";
    //debugger;
    if ($stateParams.descriptionpoli) {
        $scope.descriptionpoli = $stateParams.descriptionpoli;
        $scope.title = $stateParams.namapoli;
    }
    if ($stateParams.listdokter) {
        $scope._listdokter = $stateParams.listdokter;
        $scope.listdokter = angular.copy($scope._listdokter);
        //debugger;
    } else if ($stateParams.listdokter == null) {
        $scope._listdokter = $localstorage.getObject("_data_dokter");
        $scope.listdokter = angular.copy($scope._listdokter);
    }
    $scope.openProfileDokter = function(params) {
            $state.go("app.profiledokter", {
                datadokter: params
            });
        }
        // Set Motion

    $scope.search = {};
    var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };
    $scope.fadeSlideInRight = function() {
        if ($scope.search.nama_dokter) {
            $scope.listdokter = $scope._listdokter.filter(function(el) {
                return el.nama_dokter.toLowerCase().includes($scope.search.nama_dokter.toLowerCase());
            });
        } else {
            $scope.listdokter = angular.copy($scope._listdokter);
        }
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function() {
            ionicMaterialMotion.ripple();
        }, 500);
    };
    $scope.fadeSlideInRight();
    allService.getDokter().then(function(result) {
        if (result.data) {
            $localstorage.setObject("_data_dokter", result.data);
        }
    });

    $scope.getFoto = function(foto) {
        if (foto) {
            return foto.guid;
        } else {
            return 'img/user-profile.png';
        }
    };
    $scope.getDescription = function(deskripsi) {
        if (deskripsi.length > 28) {
            return deskripsi.substring(0, 25) + '...';
        } else {
            return deskripsi;
        }
    };

})

.controller('ListpasienCtrl', function($scope, $state, $ionicLoading, $stateParams, $timeout, allService, ionicMaterialInk, ionicMaterialMotion, $localstorage) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.user = $scope.$parent.authstorage.user;
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });
    $scope.search = {};
    $scope.openProfilePasien = function(params) {
        $state.go("app.profilepasien", {
            datapasien: params
        });
    }
    allService.getPasien($scope.user.id).success(function(response) {
        $scope._listpasien = response;
        $scope.listpasien = angular.copy($scope._listpasien);
        $scope.fadeSlideInRight();
        $ionicLoading.hide();
    }).catch(function(error) {
        $scope.showPopup('Error', error);
        $ionicLoading.hide();
    });
    $scope.showPopup = function(title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    }
    $scope.addpasien = function() {
        //debugger;
        $state.go('app.formpasien');
    }
    $scope.getFoto = function(foto) {
        // if (foto) {
        //     return foto.guid;
        // } else {
        return 'img/user-profile.png';
        //}
    };
    $scope.getDescription = function(deskripsi) {
        if (deskripsi.length > 28) {
            return deskripsi.substring(0, 25) + '...';
        } else {
            return deskripsi;
        }
    };

    var reset = function() {
        var inClass = document.querySelectorAll('.in');
        for (var i = 0; i < inClass.length; i++) {
            inClass[i].classList.remove('in');
            inClass[i].removeAttribute('style');
        }
        var done = document.querySelectorAll('.done');
        for (var i = 0; i < done.length; i++) {
            done[i].classList.remove('done');
            done[i].removeAttribute('style');
        }
        var ionList = document.getElementsByTagName('ion-list');
        for (var i = 0; i < ionList.length; i++) {
            var toRemove = ionList[i].className;
            if (/animate-/.test(toRemove)) {
                ionList[i].className = ionList[i].className.replace(/(?:^|\s)animate-\S*(?:$|\s)/, '');
            }
        }
    };
    $scope.fadeSlideInRight = function() {
        if ($scope.search.nama_pasien) {
            $scope.listpasien = $scope._listpasien.filter(function(el) {
                return el.nama_pasien.toLowerCase().includes($scope.search.nama_pasien.toLowerCase());
            });
        } else {
            $scope.listpasien = angular.copy($scope._listpasien);
        }
        reset();
        document.getElementsByTagName('ion-list')[0].className += ' animate-ripple';
        setTimeout(function() {
            ionicMaterialMotion.ripple();
        }, 500);
    };

})

.controller('ProfileDokterCtrl', function($scope, $state, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    if ($stateParams.datadokter) {
        $scope.datadokter = $stateParams.datadokter;
    } else {
        $state.go("app.dokter", {
            listdokter: null
        });
    }
    $scope.hariarray = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    $scope.tab_about = 'active';
    $scope.moveto = function(params) {
        $scope.tab_about = params == 1 ? 'active' : '';
        $scope.tab_jadwal = params == 2 ? 'active' : '';
        $scope.tab_contact = params == 3 ? 'active' : '';
        // Set Ink  
    }
    $scope.getFoto = function(foto) {
        if (foto) {
            return foto.guid;
        } else {
            return 'img/user-profile.png';
        }
    };
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    ionicMaterialInk.displayEffect();
})

.controller('KonsultasiCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('RegisterCtrl', function($scope, $localstorage, $ionicLoading, $timeout, $state, $stateParams, ionicMaterialInk, $ionicPopup, allService) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.nonce = $localstorage.getObject("_nonce");
    if ($scope.nonce) {
        allService.getNonce().then(function(result) {
            $localstorage.setObject("_nonce", result.data);
            $scope.nonce = $localstorage.getObject("_nonce");
        });
    }
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    $scope.regiser = function(params) {
        var user_ = angular.copy(params);
        if (user_.password != user_.repassword) {
            $scope.showError('Sorry', 'Password tidak sama!');
            return;
        }
        user_.description = JSON.stringify(user_.description);
        user_.nonce = $scope.nonce.nonce;
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        allService.getRegister(user_).success(function(result) {
            $scope.showError('Success', 'Silahkan cek email anda untuk mengkonfirmasi akun!');
            $ionicLoading.hide();
            $state.go("app.login");
        }).catch(function(error) {
            $scope.showError('Error', error.data.error);
            $ionicLoading.hide();
        });
    }
    $scope.showError = function(title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    }
    ionicMaterialInk.displayEffect();
})

.controller('FormpasienCtrl', function($scope, $localstorage, ionicMaterialMotion, $ionicLoading, $timeout, $state, $stateParams, ionicMaterialInk, $ionicPopup, allService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $scope.typepasien = { lama: false }
        // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
    $scope.user = angular.copy($scope.$parent.authstorage.user);
    $scope.modeluser = {};
    $scope.setuju = {};
    $scope.simpan = function(passModel) {
        if (!$scope.setuju.persetujuan1 || !$scope.setuju.persetujuan2 || !$scope.setuju.persetujuan3) {
            $scope.showError('Validasi', 'Mohon untuk men-check semua persetujuan umum.');
            return;
        }
        var model = angular.copy(passModel);
        model.jenis_kelamin = $scope.optionsjeniskelamin.selected.name;
        model.status_kawin = $scope.optionsstatuskawin.selected.name;
        model.pendidikan = $scope.optionspendidikan.selected.name;
        model.tanggal_lahir = formatDate(model.tanggal_lahir);
        model.status = "publish";
        model.title = model.nama_pasien;
        model.pasien_user = $scope.user.id;
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        allService.savePasien(model).success(function(result) {
            $ionicLoading.hide();
            $scope.showError('Success', 'Data Pasien berhasil di simpan.');
            $state.go("app.listpasien");
        }).catch(function(error) {
            $ionicLoading.hide();
            $scope.showError('Error', error.data.error);
        });
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    $scope.showError = function(title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    }
    $scope.gunakandatasaya = function(gunakandata) {
        if (gunakandata) {
            $scope.modeluser.pj_nama = $scope.user.displayname;
            $scope.modeluser.pj_alamat = $scope.user.description.phone;
            $scope.modeluser.pj_telepon = $scope.user.description.alamat;
            $scope.modeluser.pj_bahasa = '';
        } else {
            $scope.modeluser.pj_nama = '';
            $scope.modeluser.pj_alamat = '';
            $scope.modeluser.pj_telepon = '';
            $scope.modeluser.pj_bahasa = '';
        }
    }
    $scope.optionsjeniskelamin = {
        list: [{
                id: 1,
                name: "Laki-laki",
                selected: true
            },
            {
                id: 2,
                name: "Perempuan",
                selected: false
            },
        ],
        selected: {}
    }

    $scope.optionsstatuskawin = {
        list: [{
                id: 1,
                name: "belum Kawin",
                selected: true
            },
            {
                id: 2,
                name: "Kawin",
                selected: false
            },
            {
                id: 3,
                name: "Janda",
                selected: false
            },
            {
                id: 4,
                name: "Duda",
                selected: false
            }
        ],
        selected: {}
    }
    $scope.optionspendidikan = {
        list: [{
                id: 1,
                name: "Tidak Sekolah",
                selected: true
            }, {
                id: 2,
                name: "SD",
                selected: true
            },
            {
                id: 3,
                name: "SMP",
                selected: false
            },
            {
                id: 4,
                name: "SMP",
                selected: false
            },
            {
                id: 5,
                name: "SMA",
                selected: false
            },
            {
                id: 6,
                name: "D3",
                selected: false
            },
            {
                id: 7,
                name: "S1",
                selected: false
            },
            {
                id: 8,
                name: "S2",
                selected: false
            },
            {
                id: 9,
                name: "S3",
                selected: false
            }
        ],
        selected: {}
    }
})

.controller('FormtransaksiCtrl', function($scope, $localstorage, ionicMaterialMotion, $ionicLoading, $timeout, $state, $stateParams, ionicMaterialInk, $ionicPopup, allService) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    if ($stateParams.datapasien) {
        $scope.datapasien = $stateParams.datapasien;
    } else {
        $state.go("app.listpasien", {
            listdokter: null
        });
    }
    $scope.pasien = {
            lama: true,
            baru: false
        }
        // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    $scope.optionspolitujuan = {
            list: [],
            selected: {},
            selectedokter: {}
        }
        //$scope.listpoli = $localstorage.getObject("_data_poli");
    $scope.listpoli = [{
        id: 0,
        nama_poli: "Poliklinik Jiwa Dewasa"
    }, {
        id: 1,
        nama_poli: "Poliklinik Jiwa Anak dan Remaja (Tumbuh Kembang Anak)"
    }, {
        id: 2,
        nama_poli: "Poliklinik Geriatri"
    }, {
        id: 3,
        nama_poli: "Poliklinik Mediko Legal"
    }, {
        id: 4,
        nama_poli: "Poliklinik Napza"
    }, {
        id: 5,
        nama_poli: "Poliklinik Saraf"
    }, {
        id: 6,
        nama_poli: "Poliklinik Penyakit Dalam"
    }, {
        id: 7,
        nama_poli: "Poliklinik Kulit & Kelamin"
    }, {
        id: 8,
        nama_poli: "Poliklinik Anak Spesialis"
    }, {
        id: 9,
        nama_poli: "Poliklinik Rehabilitasi Medik"
    }];
    for (var i = 0; i < $scope.listpoli.length; i++) {
        var element = $scope.listpoli[i];
        var temppoli = {
            id: element.id,
            name: element.nama_poli,
            selected: false,
            optionsdokter: []
        };
        if (element.daftar_dokter) {
            for (var u = 0; u < element.daftar_dokter.length; u++) {
                var _element = element.daftar_dokter[u];
                var tempdokter = {
                    id: _element.id,
                    name: _element.nama_dokter,
                    selected: false
                }
                temppoli.optionsdokter.push(tempdokter);
            }
        }
        $scope.optionspolitujuan.list.push(temppoli);
    }

    function formatDate(date, plus) {
        date.setDate(date.getDate() + plus);
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    // Set Ink
    ionicMaterialInk.displayEffect();
    $scope.user = angular.copy($scope.$parent.authstorage.user);
    $scope.modeluser = {};
    $scope.mintgldaftar = formatDate(new Date(), 1);
    $scope.maxtgldaftar = formatDate(new Date(), 3);
    var datenow = new Date();
    datenow.setDate(datenow.getDate() + 1);
    //$scope.modeluser.tanggal_periksa = new Date(datenow);
    $scope.modeluser.tanggal_periksa = formatDate(new Date(), 1);
    $scope.simpan = function(passModel) {
        //debugger;
        var model = angular.copy(passModel);
        model.id_poli = $scope.optionspolitujuan.selected.name;
        model.id_dokter = $scope.optionspolitujuan.selectedokter.id;
        model.cara_bayar = $scope.optionscarabayar.selected.name;
        //model.tanggal_periksa = formatDate(model.tanggal_periksa);
        model.status = "publish";
        model.pasien_id = $scope.datapasien.id;
        model.title = $scope.datapasien.nama_pasien + '-' + model.tanggal_periksa;
        model.user_id = $scope.user.id;
        $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
        });
        allService.saveTransaksi(model).success(function(result) {
            $ionicLoading.hide();
            $scope.showError('Success', 'Data transaksi berhasil di simpan.');
            $state.go("app.profilepasien", {
                datapasien: $scope.datapasien
            });
        }).catch(function(error) {
            $ionicLoading.hide();
            $scope.showError('Error', error.data.error);
        });
    }


    $scope.showError = function(title, message) {
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
        $timeout(function() {
            //ionic.material.ink.displayEffect();
            ionicMaterialInk.displayEffect();
        }, 0);
    }

    // $scope.optionsdokter = {
    //     list: [],
    //     selected: {}
    // }

    $scope.optionscarabayar = {
        list: [{
                id: 1,
                name: "Umum - Bayar Sendiri",
                selected: true
            },
            {
                id: 2,
                name: "BPJS Penerima Bantuan Iur",
                selected: false
            },
            {
                id: 3,
                name: "BPJS Mandiri",
                selected: false
            },
            {
                id: 4,
                name: "Jamkesda",
                selected: false
            },
            {
                id: 4,
                name: "Jamkesda Provinsi",
                selected: false
            }
        ],
        selected: {}
    }
})

.controller('ProfilePasienCtrl', function($scope, $state, allService, $ionicLoading, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    if ($stateParams.datapasien) {
        $scope.profile = $stateParams.datapasien;
    } else {
        $state.go("app.listpasien", {
            listdokter: null
        });
        return;
    }
    $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    });

    allService.getTransaksiByPasien($scope.profile.id).success(function(response) {
        $scope.datatransaksi = response;

        $ionicLoading.hide();
    }).catch(function(error) {
        $scope.showPopup('Error', error);
        $ionicLoading.hide();
    });

    $scope.openFormTransaksi = function(params) {
        $state.go("app.formtransaksi", {
            datapasien: params
        });
    }
    $scope.tab_about = 'active';
    $scope.moveto = function(params) {
        $scope.tab_about = params == 1 ? 'active' : '';
        $scope.tab_transaksi = params == 2 ? 'active' : '';
        // Set Ink  
    }
    $scope.getFoto = function(foto) {
        if (foto) {
            return foto.guid;
        } else {
            return 'img/user-profile.png';
        }
    };
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    ionicMaterialInk.displayEffect();
});