appModule.factory('$ibService', ['$http', '$global', function($http, $global) {

    var dataFactory = {};
    dataFactory.gg = $global;

    dataFactory.getBoards = function(callback) {
        $http.post('/api/common/add-data', data).success(function(result) {
            callback(result);
        });
    };

    dataFactory._em = {};

    dataFactory._em.getUserSpecificReport = function(input, callback) {
        $http.post('/api/v1/module/estimation/get-user-specific-report', input || {}).success(function(result) {

            if(result && result.length) {
                for(var r in result) {
                    result[r].workedTime = $global.convertSecondtoEstimateHours(result[r].totalWorkedSeconds);
                    result[r].estimateTimeH = $global.convertSecondtoEstimateHours(result[r].estTimeSeconds);
                }
            }

            callback(result);
        });
    };

    return dataFactory;

}]);
