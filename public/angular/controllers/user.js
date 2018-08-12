'use strict';
appModule.controller('UserController', ['$scope', 'Global', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', '$state',
    function($scope, Global, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, $state) {


        $scope.global = Global;
        $scope.uo = {};



        // ------------------- Common section -----------------

        $scope.uo.init = function() {
            $('body').addClass('body-wide body-auth');
        }





        // ------------------- Login section -----------------

        $scope.uo.lo = {};
        $scope.uo.lo.model = {};
        $scope.uo.lo.isSubmited = false;
        $scope.uo.lo.isSentReq = false;

        $scope.uo.lo.submit = function() {

            // Check form is valid or not, if not than return
            if (!$scope.loginForm.$valid) {
                $scope.uo.lo.isSubmited = true;
                return;
            }

            $scope.uo.lo.isSubmited = false;
            $scope.uo.lo.isSentReq = true;


            $http.post('/login', {
                email: $scope.uo.lo.model.email,
                password: $scope.uo.lo.model.password
            }).success(function(response) {

                $rootScope.g.loggedUser = response.user;
                $rootScope.co.manageLoggedUserImage();
                alertService.flash('success', 'User has been successfully logged in', true);

                $state.go('boards');
                $rootScope.$emit('loggedin');

            }).error(function(data, header, status, config) {

                if (!data.isActivate && data !== 'Unauthorized') {
                    $scope.uo.ri.model = data
                    alertService.flash('error', data.msg, true);
                }

                if (data == 'Unauthorized') {
                    alertService.flash('error', 'User not found.', true);
                    $location.path('login');
                }

                $scope.uo.lo.model = {};
                $scope.uo.lo.isSubmited = false;
                $scope.uo.lo.isSentReq = false;
            });
        }





        // ------------------- Resend activation -----------------

        $scope.uo.ri = {};
        $scope.uo.ri.model = {};

        /**
         *  User Resend Email
         */
        $scope.uo.ri.submit = function(user) {

            $http.post('/resendActivision', {
                id: user.loginid,
            }).success(function(response) {
                alertService.flash('success', response.message , true);
                $scope.uo.ri.model = {};
            });
        }




        // ------------------- Register activation -----------------

        $scope.uo.add = {};
        $scope.uo.add.model = {};
        $scope.uo.add.isSubmited = false;
        $scope.uo.add.isSentReq = false;

        /*
         * User Register
         */
        $scope.uo.add.submit = function() {

            if (!$scope.registerForm.$valid) {
                $scope.uo.add.isSubmited = true;
                return;
            }

            $scope.uo.add.isSubmited = false;
            $scope.uo.add.isSentReq = true;

            var memberId = '';
            if ($stateParams.token) {
                memberId = $stateParams.token;
            }


            $http.post('/register', {
                first_name: $scope.uo.add.model.first_name,
                last_name: $scope.uo.add.model.last_name,
                email: $scope.uo.add.model.email,
                password: $scope.uo.add.model.password,
                memberId: memberId,
                type: $stateParams.type
            }).success(function() {

                setTimeout(function() {
                    $('body').removeClass('body-wide body-auth');
                }, 500);

                alertService.flash('success', 'User has been registered successfully, Please check your email to activate your account.', true);

                if (memberId) {
                    $timeout(function() {
                        alertService.flash('success', 'Invitation has been accepted successfully ', true);
                    }, 1000);
                }

                setTimeout(function() {
                    window.location = '#!login';
                }, 500);

            }).error(function(error) {

                $scope.uo.add.isSentReq = false;

                if (error[0].msg === 'Username already taken') {
                    alertService.flash('error', 'Username already taken', true);
                } else if (error[0].param === 'email' && error[0].msg === 'E-mail address is already in-use') {
                    alertService.flash('error', 'Email address is already in-use', true);
                }
            });
        }


























        // ----------------------------------------------------------------------
        // Forgot password section
        // ----------------------------------------------------------------------

        $scope.uo.fp = {};
        $scope.uo.fp.model = {};
        $scope.uo.fp.isSubmited = false;
        $scope.uo.fp.isSentReq = false;

        /*
         * User forgot password
         */
        $scope.uo.fp.submit = function() {

            // Check form is valid or not, if not than return
            if (!$scope.forgotPasswordForm.$valid) {
                $scope.uo.fp.isSubmited = true;
                return;
            }

            $scope.uo.fp.isSubmited = false;
            $scope.uo.fp.isSentReq = true;


            $http.post('/forgot-password', {
                text: $scope.uo.fp.model.email
            }).success(function(response) {

                if (response.status == 'danger') {
                    alertService.flash('error', response.message, true);
                    $location.url('forgot-password');
                    return;
                }

                alertService.flash('success', 'Reset password instruction details has been sent to your email.', true);
                $location.url('login');

                $scope.uo.fp.model = {};
                $scope.uo.fp.isSubmited = false;
                $scope.uo.fp.isSentReq = false;
            }).error(function(error) {
                $scope.uo.fp.model = {};
                $scope.uo.fp.isSubmited = false;
                $scope.uo.fp.isSentReq = false;
            });
        }





        // ----------------------------------------------------------------------
        // Common image upload section
        // ----------------------------------------------------------------------


        // Upload Entity Avatar common action DZ
        var uploadAvatarDZCtrl = false;

        /**
         *
         */
        var uploadAvatarDZ = function(key, actionVar, callback) {

            if (uploadAvatarDZCtrl) {
                return;
            }

            uploadAvatarDZCtrl = true;
            $("#common-upload-avatar-dz").html('');
            $("#common-upload-avatar-dz").html($("#upload-avatar-dz-cn").html());

            var isUserHasSelectedFile = false;

            setTimeout(function() {

                $("#common-upload-avatar-dz .common-upload-avtar-dz").dropzone({
                    url: "/api/common/" + key + "/file-uploads",
                    maxFilesize: 500,
                    maxFiles: 1000,
                    acceptedFiles: 'image/*',
                    addRemoveLinks: true,
                    dictRemoveFile: 'Remove',
                    uploadMultiple: false,
                    init: function() {
                        $scope.$apply(function() {
                            actionVar.uploadingAvatar = true;
                        });
                        $timeout(function() {
                            if (!isUserHasSelectedFile) {
                                actionVar.uploadingAvatar = false;
                            }
                        }, 3000);
                    },
                    processing: function(file) {
                        isUserHasSelectedFile = true;
                        $scope.$apply(function() {
                            actionVar.uploadingAvatar = true;
                        });
                    },
                    success: function(data, resData) {
                        callback(resData);
                    },
                    canceled: function() {
                        $scope.$apply(function() {
                            actionVar.uploadingAvatar = false;
                        });
                    }
                });
            }, 500);

            setTimeout(function() {
                $("#common-upload-avatar-dz .common-upload-avtar-dz").click();
                uploadAvatarDZCtrl = false;
            }, 1000);
        }


        /**
         * update image in DB
         */
        var updateImageInDB = function(actionVar, image, model, id) {

            // Update in render area
            $scope.$apply(function() {
                actionVar.image = image;
                actionVar.uploadingAvatar = false;
            });


            $http.post('/api/common/edit-data', {
                image: image,
                model: model,
                userUpdate: 'profile',
                _id: id
            }).success(function(data) {}).error(function(err) {});
        }


        /**
         * common Upload Avatar
         */
        $rootScope.uploadAvatar = function(key, actionVar, callback) {
            switch (key) {
                case 1:
                    uploadAvatarDZ(key, actionVar, function(cb) {
                        // Update in DB
                        updateImageInDB(actionVar, cb.image, 'User', actionVar._id);
                    });
                    break;
                case 2:
                    uploadAvatarDZ(key, actionVar, function(cb) {
                        actionVar.image = cb.image;
                        actionVar.uploadingAvatar = false;
                        callback(cb);
                    });
                case 3:
                    uploadAvatarDZ(key, actionVar, function(cb) {
                        updateImageInDB(actionVar, cb.image, 'Tours', actionVar._id);
                    });
                    break;
                case 4:
                    uploadAvatarDZ(key, actionVar, function(cb) {
                        updateImageInDB(actionVar, cb.image, 'Tours', actionVar._id);
                    });
                    break;
                case 5:
                    uploadAvatarDZ(key, actionVar, function(cb) {
                        updateImageInDB(actionVar, cb.image, 'Tours', actionVar._id);
                    });
                    break;
            }
        }








        // ----------------------------------------------------------------------
        // Update profile section
        // ----------------------------------------------------------------------

        $scope.uo.pf = {};
        $scope.uo.pf.model = {};
        $scope.uo.pf.isSubmited = false;
        $scope.uo.pf.isSentReq = false;
        $scope.uo.pf.isUplaoding = false;
        $scope.uo.pf.isUplaodReq = false;


        /**
         * Init user profile
         */
        $scope.uo.pf.init = function() {

            $scope.uo.pf.model = angular.copy($rootScope.g.loggedUser);
            $scope.uo.pf.isSubmited = false;
            $scope.uo.pf.isSentReq = false;
            $scope.uo.pf.model._profileImage = '';

            if($scope.uo.pf.model.isImageSynced != 0 && $scope.uo.pf.model.syncedImages && $scope.uo.pf.model.syncedImages.avatarSmall200x150) {
                $scope.uo.pf.model._profileImage = assetURL + 'user-profiles/' + $scope.uo.pf.model.syncedImages.avatarSmall200x150;
            }

            if (!$scope.uo.pf.model._profileImage && $scope.uo.pf.model.image) {
                $scope.uo.pf.model._profileImage = imgThumb('/uploads/user-profiles/' + $scope.uo.pf.model.image, '200x150', true);
            }


            /**
             *
             */
            $scope.uo.pf.submit = function(form, userData) {

                if (!form.$valid) {
                    $scope.uo.pf.isSubmited = true;
                    return;
                }

                $scope.uo.pf.isSubmited = false;
                $scope.uo.pf.isSentReq = true;

                if (!$scope.uo.pf.model.image || ($scope.uo.pf.model.image != $rootScope.g.loggedUser.image)) {
                    userData.isImageSynced = 0;
                    userData.syncedImages = { 'a': '' };
                }


                $http.post('/edit/' + $rootScope.g.loggedUser._id + '/user', userData).success(function(response) {

                    if ($('#toast-container').length == 0) {
                        alertService.flash('success', response.message, true);
                    }

                    $scope.uo.pf.model.first_name = userData.first_name;
                    $scope.uo.pf.model.last_name = userData.last_name;
                    $scope.uo.pf.model.image = userData.image;

                    $rootScope.g.loggedUser.first_name = response.user.first_name;
                    $rootScope.g.loggedUser.last_name = response.user.last_name;
                    $rootScope.g.loggedUser.image = response.user.image;
                    $rootScope.g.loggedUser.isImageSynced = 0;

                    $scope.uo.pf.isSubmited = false;
                    $scope.uo.pf.isSentReq = false;

                    $rootScope.co.manageLoggedUserImage();
                });
            }


            /**
             *
             */
            $scope.uo.pf.initDropzone = function() {

                setTimeout(function() {

                    $("#uuser-profile-dz").dropzone({
                        url: '/api/v1/common/' + 2 + '/file-uploads',
                        maxFilesize: 150, // MB
                        maxFiles: 1,
                        addRemoveLinks: true,
                        dictRemoveFile: 'Remove',
                        uploadMultiple: false,
                        init: function() {
                            this.on("complete", function(file) {
                                if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {}
                            });
                        },
                        accept: function(file, done) {
                            $scope.uo.pf.isUplaoding = false;
                            $scope.uo.pf.isUplaodReq = false;

                            var fileType = file.type;
                            $timeout(function() {
                                if (file.name) {

                                    var fileT = file.name.split('.');
                                    var IcExtension = fileT[fileT.length - 1];
                                    var unsupportedExtensions = getUnsupportedFileExtension();

                                    if (jQuery.inArray(IcExtension.toLowerCase(), unsupportedExtensions) == -1) {
                                        done();
                                    } else {
                                        alertService.flash('error', ['Selected file is invalid, Please choose valid file.'], true);
                                        return false;
                                    }
                                }
                            }, 10);
                        },
                        success: function(data, resData) {

                            if (resData) {
                                $scope.uo.pf.isUplaoding = true;
                                $scope.uo.pf.model.image = resData.image;
                                $scope.uo.pf.model._profileImage = imgThumb('/uploads/user-profiles/' + resData.image, '200x150', true);
                            }

                            $timeout(function() {
                                userProfileAttachmentFile.push(resData);
                            }, 100);
                        },
                        removedfile: function(file, data) {
                            $timeout(function() {

                                if (userProfileAttachmentFile) {
                                    for (var iRow in userProfileAttachmentFile) {
                                        if (file.name == userProfileAttachmentFile[iRow].fileONm) {
                                            userProfileAttachmentFile.splice(iRow, 1);
                                        }
                                    }
                                }
                            }, 100);
                            var _ref;
                            if (file && file.previewElement && file.previewElement.parentNode) {
                                return (_ref = file.previewElement) != null ? _ref.parentNode.removeChild(file.previewElement) : void 0;
                            }
                        }
                    });
                }, 1200);
            }

            $scope.uo.pf.isUplaoding = true;
            $scope.uo.pf.isUplaodReq = false;
            var userProfileAttachmentFile = [];
        }



        /**
         *
         */
        $scope.uo.pf.openDropzone = function() {

            $scope.uo.pf.isUplaodReq = false;
            $('#uuser-profile-dz').click();

            var _job_dropzone = $('#uuser-profile-dz');

            if (_job_dropzone.length && _job_dropzone[0] && _job_dropzone[0].dropzone) {
                _job_dropzone[0].dropzone.removeAllFiles(true);
            }
        }


























        // ----------------------------------------------------------------------
        // Change password section
        // ----------------------------------------------------------------------

        $scope.uo.cp = {};
        $scope.uo.cp.model = {};
        $scope.uo.cp.isSubmited = false;
        $scope.uo.cp.isSentReq = false;

        /*
         * Change user password
         */
        $scope.uo.cp.submit = function(form) {

            if (!form.$valid) {
                $scope.uo.cp.isSubmited = true;
                return false;
            }

            if ($scope.uo.cp.model.userNewPassword != $scope.uo.cp.model.userConfirmPassword) {
                alertService.flash('error', 'Confirm password should be match with new password', true);
                return;
            }

            $scope.uo.cp.isSubmited = false;
            $scope.uo.cp.isSentReq = true;

            var passDate = {
                userOldPassword: $scope.uo.cp.model.userOldPassword,
                userNewPassword: $scope.uo.cp.model.userNewPassword,
                userConfirmPassword: $scope.uo.cp.model.userConfirmPassword
            }


            $http.post('/api/user/change-password', passDate).success(function(response) {

                $scope.uo.cp.model = {};
                $scope.uo.cp.isSubmited = false;
                $scope.uo.cp.isSentReq = false;

                if (response) {
                    alertService.flash('success', 'Your password has been successfully changed ', true);
                    $location.path('/change-profile');
                }
            }).error(function(error) {

                $scope.uo.cp.model = {};
                $scope.uo.cp.isSubmited = false;
                $scope.uo.cp.isSentReq = false;

                alertService.flash('error', error.msg, true);
            });
        }



















        // ----------------------------------------------------------------------
        // Reset password section
        // ----------------------------------------------------------------------

        $scope.uo.rp = {};
        $scope.uo.rp.model = {};
        $scope.uo.rp.isSubmited = false;
        $scope.uo.rp.isSentReq = false;


        /*
         * Reset password
         */
        $scope.uo.rp.submit = function(form) {

            if (!form.$valid) {
                $scope.uo.rp.isSubmited = true;
                return;
            }

            $scope.uo.rp.isSubmited = false;
            $scope.uo.rp.isSentReq = true;


            $http.post('/reset/' + $stateParams.token, {
                password: $scope.uo.rp.model.password,
                confirmPassword: $scope.uo.rp.model.confirmPassword
            }).success(function(response) {

                $rootScope.g.loggedUser = response.user;

                if ($rootScope.g.loggedUser.image) {
                    $rootScope.g.loggedUser.userImg40x40 = imgThumb("/uploads/user-profiles/" + $rootScope.g.loggedUser.image, '40x40', true);
                }

                $scope.uo.rp.model = {};
                $scope.uo.rp.isSubmited = false;
                $scope.uo.rp.isSentReq = false;

                alertService.flash('success', 'Your password has been successfully changed', true);
                $rootScope.$emit('loggedin');

                if (response.redirect) {
                    if (window.location.href === response.redirect) {
                        window.location.reload();
                    } else {
                        window.location = response.redirect;
                    }
                } else {
                    $location.url('/');
                }
            }).error(function(error) {

                $scope.uo.rp.model = {};
                $scope.uo.rp.isSubmited = false;
                $scope.uo.rp.isSentReq = false;

                if (error.msg === 'Token invalid or expired') {
                    alertService.flash('error', 'Could not update password as token is invalid or may have expired', true);
                } else {

                    for(var err in error) {
                        alertService.flash('error', error[err].msg, true);
                    }
                }
            });
        }



























        // ----------------------------------------------------------------------
        // Get invitaion section
        // ----------------------------------------------------------------------

        $scope.uo.ui = {};

        /**
         * Get invitation accept request data
         */
        $scope.uo.ui.getInvAcceptReq = function() {

            $timeout(function() {

                if ($location.search().isInvitationSuccess == '0') {

                    var queryData = angular.copy($location.search());

                    if (queryData.isUser == 'false') {
                        $location.path('/signup/' + queryData.boardMemberId +'/' + queryData.type);
                    } else {
                        $timeout(function() {
                            alertService.flash('success', 'Invitation has been accepted successfully.', true);
                        }, 500);
                        $timeout(function() {
                            $location.path('login');
                        }, 1000);
                    }

                    $location.search('isInvitationSuccess', null);
                    $location.search('isUser', null);
                    $location.search('boardMemberId', null);
                }

                if ($location.search().isInvitationSuccess == '1') {
                    alertService.flash('error', 'Sorry, Seems like you had already accepted this invitation.', true);
                    $location.search('isInvitationSuccess', null);
                }

                if ($location.search().isInvitationSuccess == '3') {
                    alertService.flash('error', 'Sorry, Seems like you had already rejected this invitation.', true);
                    $location.search('isInvitationSuccess', null);
                }

                if ($location.search().isInvitationSuccess == '4') {
                    alertService.flash('error', 'Sorry, Seems like the invitation is no longer available.', true);
                    $location.search('isInvitationSuccess', null);
                }
            }, 500);
        }























        // ----------------------------------------------------------------------
        // Load data from slug
        // ----------------------------------------------------------------------


        try {
            if (window.location.href.indexOf('activated=1') != -1) {
                if (!$('#toast-container').length) {

                    //
                    alertService.flash('error', 'User already activated!', true);

                    $timeout(function() {
                        if ($rootScope.g.loggedUser && $rootScope.g.loggedUser._id) {
                            window.location.href = window.location.origin + '/' + window.location.hash;
                        }

                        if (!$rootScope.g.loggedUser) {
                            window.location.href = window.location.origin + '/' + window.location.hash;
                        }
                    }, 500);
                }
            }

            if (window.location.href.indexOf('activated=2') != -1) {
                if (!$('#toast-container').length) {

                    //
                    alertService.flash('success', 'User has been activated successfully.', true);

                    $timeout(function() {
                        if ($rootScope.g.loggedUser && $rootScope.g.loggedUser._id) {
                            window.location.href = window.location.origin + '/' + window.location.hash;
                        }

                        if (!$rootScope.g.loggedUser) {
                            window.location.href = window.location.origin + '/' + window.location.hash;
                        }
                    }, 500);
                }
            }
        } catch(err) {}

    }
]);
