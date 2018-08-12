'use strict';

appModule.factory('$global', ['$http', '$rootScope', function($http, $rootScope) {

    var ib = {};

    ib.convertSecondtoEstimateHours = function(seconds, cb) {

        var countHours = 24;
        if($rootScope.g.configDailyHours) {
            countHours = (parseInt($rootScope.g.configDailyHours) / 3600);
        }

        var cDays = 5;
        if($rootScope.g.configWeekDays) {
            cDays = parseInt($rootScope.g.configWeekDays);
        }

        var perDaySecond = (countHours * 3600);

        if(!seconds) {
            seconds = 0;
        }

        var currWeek = '';
        var currDay = '';
        var currHour = '';
        var currMinute = '';
        var currSecond = '';
        var totalWorkingHours = '';

        if (seconds >= (perDaySecond * cDays)) {
            var weekD = seconds / (perDaySecond * 5);

            if (Math.floor(weekD) === weekD) {
                currWeek = weekD.toString().split(".")[0];
                totalWorkingHours += currWeek + 'w';
                seconds = 0;
            } else {
                currWeek = weekD.toString().split(".")[0];
                seconds = seconds - (perDaySecond * cDays) * parseInt(currWeek);
                totalWorkingHours += currWeek + 'w ';
            }
        }

        if (seconds >= perDaySecond) {

            var dayD = seconds / perDaySecond;

            if (Math.floor(dayD) === dayD) {
                currDay = dayD.toString().split(".")[0];
                totalWorkingHours += currDay + 'd';
                seconds = 0;
            } else {
                currDay = dayD.toString().split(".")[0];
                seconds = seconds - (perDaySecond * parseInt(currDay));
                totalWorkingHours += currDay + 'd ';
            }
        }

        if (seconds >= 3600) {

            var hourD = seconds / 3600;

            if (Math.floor(hourD) === hourD) {
                currHour = hourD.toString().split(".")[0];
                totalWorkingHours += currHour + 'h';
                seconds = 0;
            } else {
                currHour = hourD.toString().split(".")[0];
                seconds = seconds - 3600 * parseInt(currHour);
                totalWorkingHours += currHour + 'h ';
            }
        }

        if (seconds >= 60) {

            var minuteD = seconds / 60;

            if (Math.floor(minuteD) === minuteD) {
                currMinute = minuteD.toString().split(".")[0];
                totalWorkingHours += currMinute + 'm';
                seconds = 0;
            } else {
                currMinute = minuteD.toString().split(".")[0];
                currSecond = seconds - 60 * parseInt(currMinute);
                totalWorkingHours += currMinute + 'm';
            }
        }

        if (!cb) {
            return totalWorkingHours;
        }

        cb(totalWorkingHours);
    }

    ib.timestampAr = [{
        'key': 'today',
        'value': 'Today'
    }, {
        'key': 'yesterday',
        'value': 'Yesterday'
    }, {
        'key': 'thisWeek',
        'value': 'This Week'
    }, {
        'key': 'lastWeek',
        'value': 'Last Week'
    }, {
        'key': 'thisMonth',
        'value': 'This Month'
    }, {
        'key': 'lastMonth',
        'value': 'Last Month'
    }, {
        'key': 'last3Months',
        'value': 'Last 3 Months'
    }, {
        'key': 'customRange',
        'value': 'Custom Range'
    }];

    return ib;
}]);
