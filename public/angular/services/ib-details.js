'use strict';

appModule.factory('$projectIdeaBoardService', ['$http', '$global', function($http, $global) {

	var ib = {};


	ib.createBoard = function(data, cb) {
		$http.post('/board-create', data).success(function(res) {
			cb(res);
		}).error(function(err) {
			cb({
				status: false,
				error: err
			});
		});
	};


	ib.getBoards = function(projectId, userToken, cb) {
		$http.get('/api/user/' + userToken + '/boards/' + projectId).success(function(boards) {
			if (boards.length) {
				cb({
					status: true,
					result: boards
				});
			} else {
				cb({
					status: false,
					result: boards
				});
			}
		}).error(function(err) {
			cb({
				status: false,
				error: err
			});
		});
	}


	ib.createColumn = function(data, cb) {

		$http.post('/column-create', data).success(function(res) {
			cb(res);
		}).error(function(err) {
			cb({
				status: false,
				error: err
			});
		});
	};


    ib.createInitiativeColumn = function(data, cb) {
        $http.post('/initiative/column-create', data).success(function(res) {
            cb(res);
        }).error(function(err) {
            cb({
                status: false,
                error: err
            });
        });
    };


	ib.getColumns = function(boardId, cb) {
		$http.get('/api/board/' + boardId + '/columns').success(function(res) {
			cb({
				status: true,
				result: res
			});
		}).error(function(err) {
			cb({
				status: false,
				error: err
			});
		});
	};


	ib.getBoardsNotLogin = function(projectId, cb) {
		$http.get('/api/public/boards/' + projectId).success(function(boards) {
			cb({
				status: true,
				result: boards
			});
		}).error(function(err) {
			cb({
				status: false,
				error: err
			});
		});
	}


	ib.convertEstimateTimeInSeconds = function(workingHour, workDays, cb) {

        if (!workingHour) {
            cb({
                status: false,
            });

            return;
        }

        var totalSeconds = 0;
        var lastChar = '';

        var convertToSec = function(splitTime, char) {

            switch(char) {

                case 'w':

                    splitTime = splitTime.split(char);
                    totalSeconds += parseInt(splitTime) * parseInt(workDays) * 24 * 60 * 60;

                    break;

                case 'd':

                    splitTime = splitTime.split(char);
                    totalSeconds += parseInt(splitTime) * 24 * 60 * 60;

                    break;

                case 'h':

                    splitTime = splitTime.split(char);
                    totalSeconds += parseInt(splitTime) * 60 * 60;

                    break;

                case 'm':

                    splitTime = splitTime.split(char);
                    totalSeconds += parseInt(splitTime) * 60;

                    break;

                case 's':

                    splitTime = splitTime.split(char);
                    totalSeconds += parseInt(splitTime);

                    break;

                default:

                    cb({
                        status: false,
                    });
            }

        }

        if (workingHour.indexOf(' ') === -1) {

            lastChar = workingHour[workingHour.length -1];
            convertToSec(workingHour, lastChar);

            cb({
                status: true,
                totalSeconds: totalSeconds
            });

        } else {

            workingHour = workingHour.split(' ');

            for (var tRow in workingHour) {
                lastChar = workingHour[tRow][workingHour[tRow].length -1];
                convertToSec(workingHour[tRow], lastChar);
            }

            cb({
                status: true,
                totalSeconds: totalSeconds
            });
        }
	}


	ib.convertSecondtoEstimateHours = $global.convertSecondtoEstimateHours;


    ib.convertSecondsToDisplayTime = function(totalSeconds, cb) {

        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        // round seconds
        seconds = Math.round(seconds * 100) / 100;

        var result = (hours < 10 ? "0" + hours : hours);
        result += ":" + (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);

        cb(result);
    }


    ib.filterMember = function(item, memberIds) {

    	if(!(memberIds && memberIds.length)) {
    		return true;
    	}

        var isUserFound = false;

        if (memberIds && memberIds.length) {
            if (item.tempUser && item.tempUser.length) {
                for (var tRow in item.tempUser) {
                    if (memberIds.indexOf(item.tempUser[tRow].id) == -1) {
                        isUserFound = false;
                    } else {
                        isUserFound = true;
                        break;
                    }
                }
            }
        }

        return isUserFound;
    };


    ib.filterInitiative = function(item, initiativeIds, status) {

        if(!(initiativeIds && initiativeIds.length)) {
            return true;
        }

        var initiativeId = item.initiative_id;
        if (status === '1') {
            initiativeId = item.ideaboard_columns_id;
        }

        if (initiativeIds && initiativeIds.length) {
            if (initiativeId) {
                if (initiativeIds.indexOf(initiativeId) == -1) {
                    return false;
                }
            }
        }

        return true;
    }


    ib.filterTaskType = function(item, taskTypeIds) {

        if(!(taskTypeIds && taskTypeIds.length)) {
            return true;
        }

        if (taskTypeIds && taskTypeIds.length) {
            if (taskTypeIds.indexOf(item.card_type) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterAlertType = function(item, alertTypeIds) {

        if(!(alertTypeIds && alertTypeIds.length)) {
            return true;
        }

        if (alertTypeIds && alertTypeIds.length) {
            if (alertTypeIds.indexOf(parseInt(item.alertType)) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterRiskType = function(item, riskTypeIds) {

        if(!(riskTypeIds && riskTypeIds.length)) {
            return true;
        }

        if (riskTypeIds && riskTypeIds.length) {
            if (item.card_type == '2' && riskTypeIds.indexOf(parseInt(item.riRisk)) == -1) {
                return false;
            }

            if(item.card_type == '4' && riskTypeIds.indexOf(parseInt(item.inRisk)) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterRegionType = function(item, regionTypelbl) {

        if(!(regionTypelbl && regionTypelbl.length)) {
            return true;
        }

        if (regionTypelbl && regionTypelbl.length) {
            if(item.card_type == '4' && regionTypelbl.indexOf(item.inRegion.toLowerCase()) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterCountryType = function(item, countryTypelbl) {

        if(!(countryTypelbl && countryTypelbl.length)) {
            return true;
        }

        if (countryTypelbl && countryTypelbl.length) {
            if(item.card_type == '4' && countryTypelbl.indexOf(item.inCountry.toLowerCase()) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterDepartmentType = function(item, departmentTypelbl) {

        if(!(departmentTypelbl && departmentTypelbl.length)) {
            return true;
        }

        if (departmentTypelbl && departmentTypelbl.length) {
            if(item.card_type == '4' && departmentTypelbl.indexOf(item.inDepartment.toLowerCase()) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterTrendType = function(item, trendTypeIds) {

        if(!(trendTypeIds && trendTypeIds.length)) {
            return true;
        }

        if (trendTypeIds && trendTypeIds.length) {
            if(item.card_type == '4' && trendTypeIds.indexOf(parseInt(item.inTrend)) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterBenifitType = function(item, benifitTypelbl) {

        if(!(benifitTypelbl && benifitTypelbl.length)) {
            return true;
        }

        if (benifitTypelbl && benifitTypelbl.length) {
            if(item.card_type == '4' && benifitTypelbl.indexOf(item.inBenefits.toLowerCase()) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterColumnType = function(item, columnTypeId) {

        if(!(columnTypeId && columnTypeId.length)) {
            return true;
        }

        if (columnTypeId && columnTypeId.length) {
            if(columnTypeId.indexOf(item.ideaboard_columns_id) == -1) {
                return false;
            }
        }

        return true;
    }


    ib.filterLabelType = function(item, labelTypeId) {

        if(!(labelTypeId && labelTypeId.length)) {
            return true;
        }

        if (labelTypeId && labelTypeId.length) {

            var isFindout = false;

            for(var vbRow in labelTypeId) {
                if(item.labels.indexOf(labelTypeId[vbRow]) == -1) {
                    isFindout = true;
                }
            }

            if(isFindout) {
                return false;
            }
        }

        return true;
    }


    ib.convertSecondtoEstimateHoursOnlySetting = function(seconds, cb) {

       var currHour = '';
       var currMinute = '';
       var currSecond = '';
       var totalWorkingHours = '';

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


    ib.processFilter = function(data, filters, status) {

    	var finalRes = [];

    	for(var d in data) {
    		var filterCards = [];
    		if(data && data[d]) {
    			for(var c in data[d]) {

    				if(
    					ib.filterMember(data[d][c], filters.filterMemberType, status) &&
    					ib.filterInitiative(data[d][c], filters.filterInitiativeType, status) &&
    					ib.filterTaskType(data[d][c], filters.filterTypeType, status) &&
                        ib.filterAlertType(data[d][c], filters.filterAlertType, status) &&
                        ib.filterRiskType(data[d][c], filters.filterRiskType, status) &&
                        ib.filterRegionType(data[d][c], filters.filterRegionType, status) &&
                        ib.filterCountryType(data[d][c], filters.filterCountryType, status) &&
                        ib.filterDepartmentType(data[d][c], filters.filterDepartmentType, status) &&
                        ib.filterTrendType(data[d][c], filters.filterTrendType, status) &&
                        ib.filterBenifitType(data[d][c], filters.benifitType, status) &&
                        ib.filterColumnType(data[d][c], filters.filterBenifitType, status) &&
    					ib.filterLabelType(data[d][c], filters.filterLabelType, status)
    				) {

    					filterCards.push(data[d][c]);
    				}
    			}
    		}

    		if(filterCards && filterCards.length) {
    			finalRes[d] = filterCards;
    		}
    	}

    	return finalRes;
    };

	return ib;
}]);
