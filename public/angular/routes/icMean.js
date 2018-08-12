'use strict';


// var guid = (function() {
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000)
//             .toString(16)
//             .substring(1);
//     }
//     return function() {
//         return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//             s4() + '-' + s4() + s4() + s4();
//     };
// })();


// var checkUserIsLoggedOrNot = function($q, $timeout, $http, $location, $rootScope, $state, status) {

//     var deferred = $q.defer();

//     $http.get('/users/me').success(function(user) {

//         $rootScope.g.loggedUser = user;

//         $rootScope.co.manageLoggedUserImage();

//         if (user == null || user == 'null') {
//             user = false;
//         }

//         var locationUrl = $location.path().split('/');

//         if (!user && locationUrl[1] == 'board' && locationUrl.length > 2) {

//             $timeout(deferred.resolve);

//             $state.go('idea-board',{
//                 slugName: locationUrl[2],
//                 subtitle: locationUrl[3] || '',
//             });

//             return;
//         }

//         if (status && !user) {
//             $timeout(deferred.resolve);
//             $state.go('login');
//             return;
//         }

//         if (user && user._id && $location.path().split('/').length && $location.path().split('/').length > 2) {

//             $http.get('/api/v1/user/'+ user._id +'/board/status/'+ $location.path().split('/')[2]).success(function(response) {

//                 if (response.status == 0) {
//                     $state.go('boards');
//                 }

//                 if (response.status == 10) {
//                     $state.go('idea-board',{
//                         slugName: locationUrl[2],
//                         subtitle: locationUrl[3] || '',
//                     });
//                 }

//                 $timeout(deferred.resolve);
//             });
//         } else {

//             if (status == false && user && user._id) {
//                 $state.go('boards');
//                 $timeout(deferred.resolve);
//             } else {
//                 $timeout(deferred.resolve);
//             }
//         }

//     }).error(function() {
//         $timeout(deferred.resolve);
//     });

//     return deferred.promise;
// }


// var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope, $state) {
//     return checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, $state, true);
// };


// var checkLoggedOut = function($q, $timeout, $http, $location, $rootScope, $state) {
//     return checkUserIsLoggedOrNot($q, $timeout, $http, $location, $rootScope, $state, false);
// };


// var checkLoginUser = function($http, $rootScope) {
//     $http.get('/users/me').success(function(user) {
//         $rootScope.g.loggedUser = user;
//     });
// };








var appModule = angular.module('tm', ['ngRoute', 'ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'toastr', 'ngAnimate']);

appModule.run(function($rootScope, $timeout) {

    $rootScope.g = {};
});




appModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',

    function($stateProvider, $urlRouterProvider, $locationProvider) {


        $locationProvider.html5Mode({
            enabled: false,
            requireBase: true
        }).hashPrefix('!');


        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/angular/views/index.html'
        });

        $stateProvider.state('aboutus', {
            url: '/aboutus',
            templateUrl: '/angular/views/about-us.html'
        });

        $stateProvider.state('category', {
            url: '/category',
            templateUrl: '/angular/views/category.html'
        });

        $stateProvider.state('prices', {
            url: '/prices',
            templateUrl: '/angular/views/price.html'
        });

        $stateProvider.state('blogs', {
            url: '/blogs',
            templateUrl: '/angular/views/blog-home.html'
        });

        $stateProvider.state('contact', {
            url: '/contact',
            templateUrl: '/angular/views/contact.html'
        });

        $stateProvider.state('search', {
            url: '/search',
            templateUrl: '/angular/views/search.html'
        });

        $stateProvider.state('detail-page', {
            url: '/detail-page',
            templateUrl: '/angular/views/single.html'
        });

        // $stateProvider.state('login', {
        //     url: '/login',
        //     templateUrl: 'angular/views/users/login.html',
        //     resolve: {
        //         loggedin: checkLoggedOut
        //     }
        // });

        // $stateProvider.state('forgot-password', {
        //     url: '/forgot-password',
        //     templateUrl: '/angular/views/users/forgot-password.html',
        //     resolve: {
        //         loggedin: checkLoggedOut
        //     }
        // });

        // $stateProvider.state('my-profile', {
        //     url: '/profile',
        //     templateUrl: '/angular/views/users/profile-edit.html',
        //     resolve: {
        //         loggedin: checkLoggedIn
        //     }
        // });

        // $stateProvider.state('change-password', {
        //     url: '/change-password',
        //     templateUrl: '/angular/views/users/change-password.html',
        //     resolve: {
        //         loggedin: checkLoggedIn
        //     }
        // });

        // $stateProvider.state('dashboard', {
        //     url: '/dashboard',
        //     templateUrl: '/angular/views/dashboard.html',
        //     resolve: {
        //         loggedin: checkLoggedIn
        //     }
        // });

        // $stateProvider.state('reset-password', {
        //     url: '/reset/:token',
        //     templateUrl: '/angular/views/users/reset-password.html'
        // });

        // $stateProvider.state('boards', {
        //     url: '/boards',
        //     templateUrl: '/angular/views/ib/boards.html',
        //     resolve: {
        //         loggedin: checkLoggedIn
        //     }
        // });

        // $stateProvider.state('board', {
        //     url: '/board/:slugName/:subtitle',
        //     templateUrl: '/angular/views/ib/board.html',
        //     params: {
        //         slugName: { squash: true, value: null },
        //         subtitle: { squash: true, value: null },
        //     },
        //     resolve: {
        //         loggedin: checkLoggedIn
        //     }
        // });

        // $stateProvider.state('idea-board', {
        //     url: '/idea-board/:slugName/:subtitle',
        //     templateUrl: '/angular/views/ib/idea-board.html',
        //     params: {
        //         slugName: { squash: true, value: null },
        //         subtitle: { squash: true, value: null },
        //     },
        //     resolve: {
        //         loggedin: checkLoginUser
        //     }
        // });

        // $stateProvider.state('change-profile', {
        //     url: '/change-profile',
        //     templateUrl: 'angular/views/users/change-profile.html',
        //     resolve: {
        //         loggedin: checkLoggedIn
        //     }
        // });

        // $stateProvider.state('accept', {
        //     url: '/p/:token',
        //     templateUrl: '/angular/views/ib/accept-invite.html',
        // });

        // $stateProvider.state('signup', {
        //     url: '/signup/:token/:type',
        //     templateUrl: '/angular/views/users/signup.html',
        // });

        // $stateProvider.state('terms-condition', {
        //     url: '/terms-and-condition',
        //     templateUrl: '/angular/views/includes/terms-and-conditions.html',
        // });

        // $stateProvider.state('privacy-policy', {
        //     url: '/privacy-policy',
        //     templateUrl: '/angular/views/includes/privacy-policy.html',
        // });


        $urlRouterProvider.otherwise('/home');
    }
]);
