'use strict';

angular.module('tm').config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-bottom-full-width',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});


angular.element(document).ready(function() {
    if (window.location.hash === '#_=_') window.location.hash = '#!';
    angular.bootstrap(document, ['tm']);

    // setTimeout(function() {
    //     $("#front-spinner-bx").hide();
    //     $(".body-main-cn").show();
    // }, 500);
});
