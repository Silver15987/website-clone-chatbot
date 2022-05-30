function _loadAsyncScript(url) {
  // if (isMin) {
  //   var urlSplitArr = url.split('.');
  //   url = urlSplitArr[0] + '.min.js'
  // }
  // debugger;
  $.getScript({
    url: url,
    cache: true
  });
}

function getAPICallMethodAsync(
  url,
  param,
  type,
  isQueryStr,
  token,
  ajaxtype,
  callback
) {
  if (!isQueryStr) {
    $.ajax({
      async: ajaxtype,
      crossDomain: true,
      url: urlString + url,
      type: type,

      data: param,
      success: function (response) {
        callback(response);
      }
    });
  } else {
    $.ajax({
      async: ajaxtype,
      crossDomain: true,
      url: urlString + url,
      type: type,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        authorization: token
      },
      success: function (response) {
        callback(response);
      }
    });
  }
}

function BindRefToken(data, callback) {
  console.log(data); try {
    if (data != null && data != "") {
      //  //
      var myToken = data.token_type + " " + data
        .access_token;
      sessionStorage.setItem("_token", myToken);
      sessionStorage.setItem("OrganizationId", data
        .Organization);
      sessionStorage.setItem("UserId", data.UserId);
      sessionStorage.setItem("_refresh_token", data.refresh_token);
      sessionStorage.setItem("Role", data.Role);
      sessionStorage.setItem("UserName", data
        .UserName);
      sessionStorage.setItem("expires", data[
        ".expires"]);
      if (typeof callback == 'function') {
        callback();
      }

    } else {
      console.log("refresh Token Error");
      sessionStorage.clear();
      window.location.href = "landing.html";
    }
  } catch (error) {
    console.log("refresh Token Error");
    sessionStorage.clear();
    window.location.href = "landing.html";
  }
}
// var isFirstTimeMethodCall=false;

function RefreshTokenMethod(callback) {
  var url = "Token/Login2?reftoken=" + sessionStorage.getItem("_refresh_token");
  var param = null;
  var type = "POST";
  $.ajax({
    async: true,
    crossDomain: true,
    url: urlString + url,
    type: type,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache"
      // "authorization": token
    },
    data: param,
    success: function (response) {

      BindRefToken(response, callback);
    },
    error: function (response) {
      console.log("refresh Token Error");
      $.LoadingOverlay("hide", true);
      sessionStorage.clear();
      window.location.href = "landing.html";
    }
  });
};
function AjaxFunction2(url, Type, data, Callback, errorCallback) {

  AjaxFunction(url, Type, data, Callback, errorCallback, true)
}


function AjaxFunction(url, Type, data, Callback, errorCallback, isFirstTimeMethodCall = false) {
  AjaxType = Type;
  // var localstorage1 = sessionStorage.getItem("_token").replace('"', "");
  //

  $.ajax({
    type: Type,
    url: urlString + url,
    headers: {
      Authorization: localstorage1
    },
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    //contentType:"application/json;charset=utf-8",
    beforeSend: function () {
      $(".LockOn").show();
    },
    dataType: "json",
    data: data,
    success: function (resp) {

      Callback(resp, AjaxType);
      // if(!isFirstTimeMethodCall){
      //   RefreshTokenMethod(function(){
      //     ;
      //     isFirstTimeMethodCall=true;
      //     AjaxFunction2(url, Type, data, Callback, errorCallback);
      //   });
      // }
      // else{
      //   isFirstTimeMethodCall=false;
      //   sessionStorage.clear();
      //   window.location.href = "landing.html";
      // }
    },
    complete: function () {
      $(".LockOn").hide();
      $("body").LoadingOverlay("hide");
    },
    error: function (xhr, ajaxOptions, thrownError) {
      if (xhr.status == 401) {
        // if(!isFirstTimeMethodCall){
        //   RefreshTokenMethod(function(){
        //     isFirstTimeMethodCall=true;
        //     AjaxFunction(url, Type, data, Callback, errorCallback);
        //   });
        // }
        // else{
        //   isFirstTimeMethodCall=false;
        //   sessionStorage.clear();
        //   window.location.href = "landing.html";
        // }

      }

      $(".LockOn").hide();
      $("body").LoadingOverlay("hide");
      if (xhr.status == 401) {
        $.smallBox({
          title: "Unauthorised",
          content: "Please Try Again",
          color: "#dfb56c",
          iconSmall: "fa fa-2x fadeInRight animated",
          timeout: 5000
        });
        // sb(xhr.responseJSON.Message, xhr.status, -1);
      }
      if (errorCallback) {
        errorCallback(xhr);
      }
    }
  });
}

function _getKeyNameByValIndexConfig(index) {
  var nmKeyStr = index.toString();
  switch (index) {
    case 0:
      nmKeyStr = "did";
      break;
    case 1:
      nmKeyStr = "dnm";
      break;
    case 2:
      nmKeyStr = "nm";
      break;
    case 3:
      nmKeyStr = "min";
      break;
    case 4:
      nmKeyStr = "max";
      break;
    case 5:
      nmKeyStr = "mf";
      break;
    case 6:
      nmKeyStr = "regAdd";
      break;
    case 7:
      nmKeyStr = "unit";
      break;
    case 8:
      nmKeyStr = "tagid";
      break;
    case 9:
      nmKeyStr = "ndnm";
      break;
    case 10:
      nmKeyStr = "hhdnm";
      break;
    case 11:
      nmKeyStr = "hdnm";
      break;
    case 12:
      nmKeyStr = "ldnm";
      break;
    case 13:
      nmKeyStr = "lldnm";
      break;
    case 14:
      nmKeyStr = "dondnm";
      break;
    case 15:
      nmKeyStr = "doffdnm";
      break;
    default:
  }
  return nmKeyStr;
}

function _getKeyNameByValIndexVal(index) {
  var nmKeyStr = index.toString();
  switch (index) {
    case 0:
      nmKeyStr = "tsStr";
      break;
    case 1:
      nmKeyStr = "valStr";
      break;
    case 2:
      nmKeyStr = "alrmSt";
      break;
    case 3:
      nmKeyStr = "tsDT";
      break;
    default:
  }
  return nmKeyStr;
}

function _ConvertCloudMessageTypeToJSONConfig(objCloudMessageStrConfig) {
  var finalCloudConfigArray = [];
  var objCloudMessageConfig = [];

  try {
    objCloudMessageConfig = JSON.parse(objCloudMessageStrConfig);
  } catch (msg) { }

  for (var i = 0; i < objCloudMessageConfig.length; i++) {
    var keyUUID = Object.keys(objCloudMessageConfig[i])[0]
      .replace("'", "")
      .replace("'", "");
    //                if (keyUUID == "fec1a092eaef4256a9ff79da63baeabf")
    var valString = Object.values(objCloudMessageConfig[i])[0];
    var valArray = valString.split(",");
    var tmpJSONObject = {
      uuid: keyUUID
    };
    for (var j = 0; j < 16; j++) {
      var tmpVal;
      var valAsStr = valArray[j].replace("'", "").replace("'", "");
      try {
        if (j > 2 && j < 7) {
          try {
            if (valAsStr != "null" && valAsStr != "") {
              tmpVal = parseFloat(valAsStr);
            } else {
              tmpVal = null;
            }
          } catch (msg) {
            tmpVal = null;
          }
        } else {
          tmpVal = valAsStr;
        }
      } catch (msg) {
        tmpVal = null;
      }

      var tmpKey = _getKeyNameByValIndexConfig(j);
      tmpJSONObject[tmpKey] = tmpVal;
    }
    finalCloudConfigArray.push(tmpJSONObject);
  }
  return finalCloudConfigArray;
}

function _ConvertCloudMessageTypeToJSONVal(objCloudMessageStr) {
  var finalCloudValArray = [];
  var objCloudMessageVal = [];
  try {
    objCloudMessageVal = JSON.parse(objCloudMessageStr);
  } catch (msg) { }

  for (var i = 0; i < objCloudMessageVal.length; i++) {
    var keyUUID = Object.keys(objCloudMessageVal[i])[0]
      .replace("'", "")
      .replace("'", "");
    var valString = Object.values(objCloudMessageVal[i])[0];
    var valArrayVal = valString.split(",");
    var tmpJSONObject = {
      uuid: keyUUID
    };

    for (var j = 0; j <= 3; j++) {
      var tmpVal;
      var valAsStr = valArrayVal[j].replace("'", "").replace("'", "");
      try {
        if (j > 0 && j < 2) {
          try {
            if (valAsStr != "null" && valAsStr != "") {
              tmpVal = parseFloat(valAsStr);
            } else {
              tmpVal = null;
            }
          } catch (msg) {
            tmpVal = null;
          }
        } else {
          tmpVal = valAsStr;
        }
      } catch (msg) {
        tmpVal = null;
      }

      var tmpKey = _getKeyNameByValIndexVal(j);
      tmpJSONObject[tmpKey] = tmpVal;
    }
    finalCloudValArray.push(tmpJSONObject);
  }
  return finalCloudValArray;
}

function _setCurrentConfigMsgs(deviceDetails, CurrConfigMsg) {
  var groupSubscribeinfoArray = deviceDetails.split("/");
  var groupId = groupSubscribeinfoArray[1];
  var gTypeVal = groupSubscribeinfoArray[0];
  var msgConfigListF = [];
  var msgValListF = [];
  var groupTypeInfo = _GroupTypeMaster.filter(function (el) {
    return el.groupType == gTypeVal;
  });

  if (groupSubscribeinfoArray[2] == "config") {
    if (sessionStorage.getItem("_pageGroupMaster") != null) {
      _pageGroupMaster = JSON.parse(sessionStorage.getItem("_pageGroupMaster"));
    }
    if (_pageGroupMaster.length > 0) {
      var MyGIDDetails = _pageGroupMaster.filter(function (el) {
        return el.gid == groupId;
      });
      if (MyGIDDetails.length > 0) {
        var msgList = MyGIDDetails[0].ConfigMsg;
        if (msgList.length > 0) {
          msgList.pop();
          msgList.push(CurrConfigMsg);
        } else {
          msgList.push(CurrConfigMsg);
        }

        for (var k = 0; k < _pageGroupMaster.length; k++) {
          if (_pageGroupMaster[k].gid == groupId) {
            _pageGroupMaster[k].ConfigMsg = msgList;
          }
        }
        sessionStorage.setItem(
          "_pageGroupMaster",
          JSON.stringify(_pageGroupMaster)
        );
      } else {
        msgConfigListF.push(CurrConfigMsg);
        var currentMSG = {
          gid: groupId,
          ConfigMsg: msgConfigListF,
          valMsg: msgValListF,
          gType: groupTypeInfo[0].enum
        };
        _pageGroupMaster.push(currentMSG);
        sessionStorage.setItem(
          "_pageGroupMaster",
          JSON.stringify(_pageGroupMaster)
        );
      }
    } else {
      //  var msgConfigListF = [];
      msgConfigListF.push(CurrConfigMsg);
      var currentMSG = {
        gid: groupId,
        ConfigMsg: msgConfigListF,
        valMsg: msgValListF,
        gType: groupTypeInfo[0].enum
      };
      _pageGroupMaster.push(currentMSG);
      sessionStorage.setItem(
        "_pageGroupMaster",
        JSON.stringify(_pageGroupMaster)
      );
    }
  } else {
    if (sessionStorage.getItem("_pageGroupMaster") != null) {
      _pageGroupMaster = JSON.parse(sessionStorage.getItem("_pageGroupMaster"));
    }
    if (_pageGroupMaster.length > 0) {
      var MyGIDDetailsVal = _pageGroupMaster.filter(function (el) {
        return el.gid == groupId;
      });
      if (MyGIDDetailsVal.length > 0) {
        var msgListval = MyGIDDetailsVal[0].valMsg;
        if (msgListval.length > 0) {
          msgListval.pop();
          msgListval.push(CurrConfigMsg);
        } else {
          msgListval.push(CurrConfigMsg);
        }
        for (var m = 0; m < _pageGroupMaster.length; m++) {
          if (_pageGroupMaster[m].gid == groupId) {
            _pageGroupMaster[m].valMsg = msgListval;
          }
        }
        sessionStorage.setItem(
          "_pageGroupMaster",
          JSON.stringify(_pageGroupMaster)
        );
      } else {
        msgValListF.push(CurrConfigMsg);
        var currentMSG = {
          gid: groupId,
          ConfigMsg: msgConfigListF,
          valMsg: msgValListF,
          gType: groupTypeInfo[0].enum
        };
        _pageGroupMaster.push(currentMSG);
        sessionStorage.setItem(
          "_pageGroupMaster",
          JSON.stringify(_pageGroupMaster)
        );
      }
    } else {
      msgValListF.push(CurrConfigMsg);
      var currentMSG = {
        gid: groupId,
        ConfigMsg: msgConfigListF,
        valMsg: msgValListF,
        gType: groupTypeInfo[0].enum
      };
      _pageGroupMaster.push(currentMSG);
      sessionStorage.setItem(
        "_pageGroupMaster",
        JSON.stringify(_pageGroupMaster)
      );
    }
  }
}

function _getConfigVal(cloudConfig, cloudVal, callback) {
  var finalArray = [];
  var lDataSet = [];
  if (
    cloudConfig.length > 0 &&
    (cloudVal.length == 0 || cloudVal == "undefined")
  ) {
    timmerConfigVal = setTimeout(function () {
      callback(cloudConfig);
    }, 1000);
  } else if (cloudConfig.length > 0 && cloudVal.length > 0) {
    for (var k = 0; k < cloudConfig.length; k++) {
      var newData = [];
      // if (isFirstTime) {
      finalArray = cloudConfig[k];
      //  }

      for (var l = 0; l < cloudVal.length; l++) {
        if (cloudConfig[k].uuid == cloudVal[l].uuid) {
          newData = Object.assign({}, finalArray, cloudVal[l]);
          break;
        }
      }

      if (Object.keys(newData).length > 0) lDataSet.push(newData);
      else lDataSet.push(cloudConfig[k]);
    }
    callback(lDataSet);
  }
}

function getAPICallMethod(url, param, type, isQueryStr, token, callback) {
  if (!isQueryStr) {
    $.ajax({
      async: true,
      crossDomain: true,
      url: urlString + url,
      type: type,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        Authorization: token
      },
      data: param,
      success: function (response) {
        callback(response);
      }
    });
  } else {
    $.ajax({
      async: true,
      crossDomain: true,
      url: urlString + url,
      type: type,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        Authorization: token
      },
      success: function (response) {
        callback(response);
      }
    });
  }
}

function _GetDateObjectFromDateAndTimeInNumber(
  dateInSIXDigitNo,
  timeInSIXDigitNo
) {
  //
  var year = parseInt(dateInSIXDigitNo / 10000) + 2000; //2000 for 2000 to 2099
  var month = parseInt(dateInSIXDigitNo / 100) % 100;
  var day = dateInSIXDigitNo % 100;

  var hrs = parseInt(timeInSIXDigitNo / 10000);
  var min = parseInt(timeInSIXDigitNo / 100) % 100;
  var sec = timeInSIXDigitNo % 100;

  //   return (year) + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
  return (
    (day < 10 ? "0" + day : day) +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    year +
    " " +
    ("00" + hrs).slice(-2) +
    ":" +
    ("00" + min).slice(-2) +
    ":" +
    ("00" + sec).slice(-2)
  );
  // return new Date(year, (month - 1), day, hrs, min, sec);
  //return day + '-' + month + '-' + year + ' ' + hrs + ':' + min + ':' + sec;
}

function getDateTimeFunction(myDate, formet, type) {
  var displaydate = "";
  //
  if (myDate == null || myDate === "") return displaydate;
  var tsDate = new Date(myDate);
  var myYear;
  var myMonth;
  var myDay;
  var myHour;
  var myMinutes;
  var mySeconds;
  if (type == "N") {
    //  if (myDate.indexOf("Z") == -1) {
    myYear = tsDate.getFullYear();
    myMonth = tsDate.getMonth() + 1;
    myDate = tsDate.getDate();
    myHour = tsDate.getHours();
    myMinutes = tsDate.getMinutes();
    mySeconds = tsDate.getSeconds();
  } else {
    myYear = tsDate.getUTCFullYear();
    myMonth = tsDate.getUTCMonth() + 1;
    myDate = tsDate.getUTCDate();
    myHour = tsDate.getUTCHours();
    myMinutes = tsDate.getUTCMinutes();
    mySeconds = tsDate.getUTCSeconds();
    //  }
  }

  switch (formet) {
    case "dateI":
      displaydate =
        myYear +
        "-" +
        ("00" + myMonth).slice(-2) +
        "-" +
        ("00" + myDate).slice(-2);
      break;
    case "date":
      displaydate =
        ("00" + myDate).slice(-2) +
        "-" +
        ("00" + myMonth).slice(-2) +
        "-" +
        myYear;
      break;
    case "time":
      displaydate =
        ("00" + myHour).slice(-2) +
        ":" +
        ("00" + myMinutes).slice(-2) +
        ":" +
        ("00" + mySeconds).slice(-2);
      break;
    case "datetime":
      displaydate =
        ("00" + myDate).slice(-2) +
        "-" +
        ("00" + myMonth).slice(-2) +
        "-" +
        myYear +
        " " +
        ("00" + myHour).slice(-2) +
        ":" +
        ("00" + myMinutes).slice(-2) +
        ":" +
        ("00" + mySeconds).slice(-2);
      break;
	  case "datecustom":
      displaydate = ("00" + myDate).slice(-2) +"-"+ ("00" + myMonth).slice(-2)+"-" + myYear ;
      break;
	  case "yearofcustom":
      displaydate = myYear ;
      break;
  }

  return displaydate;
}

function _GetMaxValForDateTimeString(objArray, keyToSearch) {
  var myArry = objArray.map(function (currentValue, index, arr) {
    return currentValue[keyToSearch];
  });

  var finalArra = myArry.filter(function (el) {
    return el !== undefined && el != "";
  });
  finalArra.sort();
  finalArra.reverse();

  return finalArra;
}

function getDateDifference(startDate, endDate) {
  var sdate = new Date(startDate);
  var edate = new Date(endDate);
  var timeDiff = Math.abs(edate.getTime() - sdate.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
}

function _padZeroes(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function sb(msg, title, type) {
  var color = "#ff7979";
  var icon = "exclamation-circle";
  var animation = "shake";
  switch (type) {
    case -1:
      // Error
      // Default
      break;
    case 0:
      // Warning
      color = "#FFAA00";
      animation = "flash";
      break;
    case 1:
      // Success
      color = "#739E73";
      animation = "bounceInUp";
      icon = "thumbs-up";
      break;
  }
  $.smallBox({
    title: title ? title : "Warning",
    content: msg ? msg : "Something went wrong! Please try again later.",
    color: color,
    icon: "fa fa-" + icon + " " + animation + " animated",
    timeout: 6000
  });
}

function GetSortOrder(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}

function dataoperation_monthly(
  tagname,
  data,
  operation,
  dateDiff,
  isFeeder,
  isAdjust
) {
  try {
    // var MyDiagnosPageInfo = data.filter(function(el) {
    //   return el.UUIDName.indexOf(tagname) != -1;
    // });
    var MyDiagnosPageInfo;
    if (isFeeder) {
      MyDiagnosPageInfo = data.filter(function (el) {
        return (
          el.refmscat.toLowerCase() === "feeder" &&
          el.UUIDName.indexOf(tagname) != -1
        );
      });
    } else {
      MyDiagnosPageInfo = data.filter(function (el) {
        return el.UUIDName.indexOf(tagname) != -1; // || (el.refcid == '-1' && el.refdid == '-1');
      });
    }
    if (operation == "consumption" && tagname.indexOf("KWHEXP1") > -1) {
      MyDiagnosPageInfo = MyDiagnosPageInfo.filter(function (el) {
        return el.refctype == "SOLAR"; // || (el.refcid == '-1' && el.refdid == '-1');
      });
    }

    //                var myUniqDiagnosisDevice = [];
    //                for (var s = 0; s < MyDiagnosPageInfo.length; s++) {
    //                   if(MyDiagnosPageInfo.
    //                }
    //
    // var uniqueDiagnosisDevices = _getUniqueValues(
    //   MyDiagnosPageInfo,
    //   "refdid"
    // );

    var uniqCWiseDevList = getUniqCWiseDevList(MyDiagnosPageInfo);
    // MyDiagnosPageInfo.sort(GetSortOrder("timestamp"));
    var sumOfAvgVal = 0.0;
    var op = operation;
    // MONTHLY
    switch (op) {
      // case "sum":
      //   if (MyDiagnosPageInfo.length > 0) {
      //     for (var j = 0; j < MyDiagnosPageInfo.length; j++) {
      //       sumOfAvgVal = sumOfAvgVal + MyDiagnosPageInfo[j].sumval;
      //     }
      //     return sumOfAvgVal;
      //   } else {
      //     return sumOfAvgVal;
      //   }
      //   break;
      // case "avg":
      //   // var count = 0;
      //   if (MyDiagnosPageInfo.length > 0) {
      //     for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
      //       // count++;
      //       sumOfAvgVal = sumOfAvgVal + MyDiagnosPageInfo[k].avgval;
      //     }
      //     var avgVal = sumOfAvgVal / MyDiagnosPageInfo.length;
      //     return avgVal;
      //   } else {
      //     return (avgVal = 0.0);
      //   }
      //   break;
      case "consumption":
        if (uniqCWiseDevList.length > 0) {
          // for (var k = 0; k < MyDiagnosPageInfo.length; k++) {

          for (var i = 0; i < uniqCWiseDevList.length; i++) {
            var dInfo;
            dInfo = MyDiagnosPageInfo.filter(function (el) {
              return (
                el.refcid == uniqCWiseDevList[i].refcid //&&
                //el.refpc == uniqCWiseDevList[i].refpc
              );
            });

            var obj;
            obj = getValObjFromDeviceList_MAXVAL(dInfo);
            var consumption = obj != null ? obj.val : 0;
            if (isAdjust) {
              consumption = obj != null ? obj.withAdj : 0;
            }

            // var consumption = MyDiagnosPageInfo[k].valcal; //MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;

            sumOfAvgVal = sumOfAvgVal + consumption;
            //}
          }
          return sumOfAvgVal;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "consumptionavg":
        // var obj = getValObjFromDeviceList_MAXVAL(MyDiagnosPageInfo);
        // var consumption = obj != null ? obj.val : 0;
        // var finalConsumption = consumption / dateDiff;
        // return finalConsumption;

        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var consumption = MyDiagnosPageInfo[k].valcal; //MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;

            sumOfAvgVal = sumOfAvgVal + consumption;
          }
          return sumOfAvgVal / MyDiagnosPageInfo.length;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "consumptionavghr":
        // var obj = getValObjFromDeviceList_MAXVAL(MyDiagnosPageInfo);
        // var consumption = obj != null ? obj.val : 0;
        // var avg = consumption / dateDiff;
        // return convertIntoHr(avg);

        if (MyDiagnosPageInfo.length > 0) {
          var valinMin = 0;
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var consumption = MyDiagnosPageInfo[k].valcal; //MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;
            valinMin = valinMin + consumption;
          }
          sumOfAvgVal = convertIntoHr(valinMin / MyDiagnosPageInfo.length);
          return sumOfAvgVal;
        } else {
          return sumOfAvgVal;
        }
        break;

      case "consumptionavgday":
        if (MyDiagnosPageInfo.length > 0) {
          var DateWiseDATA = _.groupBy(MyDiagnosPageInfo, "timestamp");
          // var tmpCnt = 0;
          var tmpCnt = dateDiff;
          $.each(DateWiseDATA, function (key, value) {
            var DateWiseSUM = 0;
            for (var l = 0; l < value.length; l++) {
              var tmpConsum = value[l].valcal; //value[l].maxval - value[l].minval;
              DateWiseSUM = DateWiseSUM + tmpConsum;
            }
            if (value.length > 0) DateWiseSUM = DateWiseSUM / value.length;
            // var consumption = MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;
            sumOfAvgVal = sumOfAvgVal + DateWiseSUM;
            //  tmpCnt++;
          });

          return sumOfAvgVal / tmpCnt;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "consumptionavgdayWithHPLoad":
        if (uniqCWiseDevList.length > 0) {
          for (var i = 0; i < uniqCWiseDevList.length; i++) {
            var dInfo;
            dInfo = MyDiagnosPageInfo.filter(function (el) {
              return (
                el.refdid == uniqCWiseDevList[i].refdid &&
                el.refpc == uniqCWiseDevList[i].refpc
              );
            });
            // var tmphpload = dInfo[0].refconnload.toString();
            var tmphpload = dInfo[0].refconnload ? dInfo[0].refconnload : null;
            var obj = getValObjFromDeviceList_MAXVAL(dInfo);
            var consumption = obj != null ? obj.val : 0;
            if (isAdjust) {
              consumption = obj.withAdj;
            }
            var tempSum = 0;
            if (tmphpload != null) {
              var myPerDayPerHP = consumption / Number(tmphpload) / dateDiff;
              sumOfAvgVal += myPerDayPerHP;
            }
          }
          return sumOfAvgVal / uniqCWiseDevList.length;
        } else {
          return sumOfAvgVal;
        }

        break;
      case "consumptionavgdayWithKWLoad":
        if (uniqCWiseDevList.length > 0) {
          for (var i = 0; i < uniqCWiseDevList.length; i++) {
            var dInfo;
            dInfo = MyDiagnosPageInfo.filter(function (el) {
              return (
                el.refdid == uniqCWiseDevList[i].refdid &&
                el.refpc == uniqCWiseDevList[i].refpc
              );
            });
            var tmphpload = dInfo[0].refspcap ?
              dInfo[0].refspcap.toString() :
              null;

            var obj = getValObjFromDeviceList_MAXVAL(dInfo);
            var consumption = obj != null ? obj.val : 0;
            if (isAdjust) {
              consumption = obj.withAdj;
            }
            if (tmphpload) {
              var myPerDayPer =
                consumption / Number(dInfo[0].refspcap) / dateDiff;
              sumOfAvgVal += myPerDayPer;
            }
          }
          return sumOfAvgVal / uniqCWiseDevList.length;
        } else {
          return sumOfAvgVal;
        }

        // if (MyDiagnosPageInfo.length > 0) {
        //   var DateWiseDATA = _.groupBy(MyDiagnosPageInfo, "timestamp");
        //   //  var tmpCnt = 0;
        //   var tmpCnt = dateDiff;
        //   $.each(DateWiseDATA, function(key, value) {
        //     var DateWiseSUM = 0;
        //     for (var l = 0; l < value.length; l++) {
        //       var tmpkwload = value[l].refspcap.toString(); //.replace(/[^0-9]/g, '');
        //       if ($.isNumeric(tmpkwload)) {
        //         var tmpConsum = value[l].valcal / tmpkwload; //(value[l].maxval - value[l].minval) / tmpkwload;
        //         DateWiseSUM = DateWiseSUM + tmpConsum;
        //       }
        //     }
        //     if (value.length > 0)
        //       DateWiseSUM = DateWiseSUM / value.length;
        //     // var consumption = MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;
        //     sumOfAvgVal = sumOfAvgVal + DateWiseSUM;
        //     //tmpCnt++;
        //   });

        //   return sumOfAvgVal / tmpCnt;
        // } else {
        //   return sumOfAvgVal;
        // }

        break;
      case "consumptionCufCal":
        if (uniqCWiseDevList.length > 0) {
          for (var i = 0; i < uniqCWiseDevList.length; i++) {
            var dInfo;
            dInfo = MyDiagnosPageInfo.filter(function (el) {
              return (
                el.refdid == uniqCWiseDevList[i].refdid &&
                el.refpc == uniqCWiseDevList[i].refpc
              );
            });
            var tmpCnt = dateDiff;
            var tmpkwload = dInfo[0].refspcap ?
              dInfo[0].refspcap.toString() :
              null;
            var obj = getValObjFromDeviceList_MAXVAL(dInfo);
            var consumption = obj != null ? obj.val : 0;
            if (isAdjust) {
              consumption = obj.withAdj;
            }
            var dCuf;
            if (tmpkwload == null) {
              dCuf = 0;
            } else {
              dCuf = (consumption / (tmpkwload * 24 * tmpCnt)) * 100;
            }
            sumOfAvgVal += dCuf;
          }
          return sumOfAvgVal / uniqCWiseDevList.length;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "percent":
        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var uptimeData =
              (MyDiagnosPageInfo[k].sumval / MyDiagnosPageInfo[k].countval) *
              100;

            sumOfAvgVal = sumOfAvgVal + uptimeData;
          }
          return sumOfAvgVal / MyDiagnosPageInfo.length;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "percentdown":
        //
        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var uptimeData = MyDiagnosPageInfo[k].avgval * 100; //MyDiagnosPageInfo[k].countval

            sumOfAvgVal = sumOfAvgVal + uptimeData;
          }
          return 100 - sumOfAvgVal / MyDiagnosPageInfo.length;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "downTimepercent":
        //
        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var consumption = MyDiagnosPageInfo[k].valcal;

            sumOfAvgVal = sumOfAvgVal + consumption;
          }

          return ((sumOfAvgVal / MyDiagnosPageInfo.length) * 100) / 1440;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "min":
        return _.min(MyDiagnosPageInfo, function (Info) {
          return Info.minval;
        });
        break;
      case "max":
        return _.max(MyDiagnosPageInfo, function (Info) {
          return Info.maxval;
        });
        break;
      case "first":
        break;
      case "last": //lastval
        if (MyDiagnosPageInfo.length > 0) {
          for (var j = 0; j < MyDiagnosPageInfo.length; j++) {
            sumOfAvgVal = sumOfAvgVal + MyDiagnosPageInfo[j].lastval;
          }
          return sumOfAvgVal;
        } else {
          return sumOfAvgVal;
        }
        break;
      default:
        return 0.0;
    }
  } catch (err) {
    return 0.0;
  }
}

function dataoperation(tagname, data, operation, dateDiff, temp) {
  //
  try {
    var MyDiagnosPageInfo = [];
    if (tagname === "-KWHIMP2-SOFT" || tagname === "-KWHEXP1-SOFT") {
      MyDiagnosPageInfo = data.filter(function (el) {
        return (
          el.UUIDName.indexOf(tagname) != -1 &&
          el.refmscat.toLowerCase() === "sky"
        );
      });
    } else if (tagname == "-KWHIMP1-SOFT") {
      MyDiagnosPageInfo = data.filter(function (el) {
        return (
          el.UUIDName.indexOf(tagname) != -1 &&
          el.refmscat.toLowerCase() != "feeder"
        );
      });
    } else if (tagname == "-KWHIMP-SOFT") {
      MyDiagnosPageInfo = data.filter(function (el) {
        return (
          el.UUIDName.indexOf(tagname) != -1 &&
          el.refmscat.toLowerCase() === "feeder"
        );
      });
    } else {
      MyDiagnosPageInfo = data.filter(function (el) {
        return el.UUIDName.indexOf(tagname) != -1;
      });
    }
    //&& el.refmscat.toLowerCase() !== "feeder"
    //                var myUniqDiagnosisDevice = [];
    //                for (var s = 0; s < MyDiagnosPageInfo.length; s++) {
    //                   if(MyDiagnosPageInfo.
    //                }
    //
    var uniqueDiagnosisDevices = _getUniqueValues(MyDiagnosPageInfo, "refdid");

    var uniqCWiseDevList = getUniqCWiseDevList(MyDiagnosPageInfo);

    var sumOfAvgVal = 0.0;
    var op = operation;
    switch (op) {
      case "sum":
        if (MyDiagnosPageInfo.length > 0) {
          for (var j = 0; j < MyDiagnosPageInfo.length; j++) {
            sumOfAvgVal = sumOfAvgVal + MyDiagnosPageInfo[j].sumval;
          }
          return sumOfAvgVal;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "avg":
        // var count = 0;
        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            // count++;
            sumOfAvgVal = sumOfAvgVal + MyDiagnosPageInfo[k].avgval;
          }
          var avgVal = sumOfAvgVal / MyDiagnosPageInfo.length;
          return avgVal;
        } else {
          return (avgVal = 0.0);
        }
        break;
      case "consumption":
        // var obj = getValObjFromDeviceList_MAXVAL(MyDiagnosPageInfo);
        // var consumption = obj != null ? obj.val : 0;
        // return consumption;
        // if (MyDiagnosPageInfo.length > 0) {
        //   for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
        //     var consumption = MyDiagnosPageInfo[k].valcal; //MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;

        //     sumOfAvgVal = sumOfAvgVal + consumption;
        //   }
        //   return sumOfAvgVal;
        // } else {
        //   return sumOfAvgVal;
        // }
        if (uniqCWiseDevList.length > 0) {
          // for (var k = 0; k < MyDiagnosPageInfo.length; k++) {

          for (var i = 0; i < uniqCWiseDevList.length; i++) {
            var dInfo;
            dInfo = MyDiagnosPageInfo.filter(function (el) {
              return (
                el.refdid == uniqCWiseDevList[i].refdid &&
                el.refcid == uniqCWiseDevList[i].refcid
              );
            });

            var obj = getValObjFromDeviceList(dInfo);
            var consumption = obj != null ? obj.val : 0;

            // var consumption = MyDiagnosPageInfo[k].valcal; //MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;

            sumOfAvgVal = sumOfAvgVal + consumption;
            //}
          }
          return sumOfAvgVal;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "consumptionavg":
        // var obj = getValObjFromDeviceList_MAXVAL(MyDiagnosPageInfo);
        // var consumption = obj != null ? obj.val : 0;
        // var finalConsumption = consumption / dateDiff;
        // return finalConsumption;

        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var consumption = MyDiagnosPageInfo[k].valcal; //MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;

            sumOfAvgVal = sumOfAvgVal + consumption;
          }
          return sumOfAvgVal / MyDiagnosPageInfo.length;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "consumptionavghr":
        // var obj = getValObjFromDeviceList_MAXVAL(MyDiagnosPageInfo);
        // var consumption = obj != null ? obj.val : 0;
        // var avg = consumption / dateDiff;
        // return convertIntoHr(avg);

        if (MyDiagnosPageInfo.length > 0) {
          var valinMin = 0;
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var consumption = MyDiagnosPageInfo[k].valcal; //MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;
            valinMin = valinMin + consumption;
          }
          sumOfAvgVal = convertIntoHr(valinMin / MyDiagnosPageInfo.length);
          return sumOfAvgVal;
        } else {
          return sumOfAvgVal;
        }
        break;

      case "consumptionavgday":
        if (MyDiagnosPageInfo.length > 0) {
          var DateWiseDATA = _.groupBy(MyDiagnosPageInfo, "timestamp");
          // var tmpCnt = 0;
          var tmpCnt = dateDiff;
          $.each(DateWiseDATA, function (key, value) {
            var DateWiseSUM = 0;
            for (var l = 0; l < value.length; l++) {
              var tmpConsum = value[l].valcal; //value[l].maxval - value[l].minval;
              DateWiseSUM = DateWiseSUM + tmpConsum;
            }
            if (value.length > 0) DateWiseSUM = DateWiseSUM / value.length;
            // var consumption = MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;
            sumOfAvgVal = sumOfAvgVal + DateWiseSUM;
            //  tmpCnt++;
          });

          return sumOfAvgVal / tmpCnt;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "consumptionavgdayWithHPLoad":
        if (MyDiagnosPageInfo.length > 0) {
          var DateWiseDATA = _.groupBy(MyDiagnosPageInfo, "timestamp");
          // var tmpCnt = 0;
          var tmpCnt = dateDiff;
          $.each(DateWiseDATA, function (key, value) {
            var DateWiseSUM = 0;
            for (var l = 0; l < value.length; l++) {
              var tmphpload = value[l].refconnload ?
                value[l].refconnload.toString() :
                null; //.replace(/[^0-9]/g, '');
              var tmpConsum;
              if (tmphpload != null) {
                tmpConsum = value[l].valcal / Number(tmphpload); //(value[l].maxval - value[l].minval) / tmphpload;
                DateWiseSUM = DateWiseSUM + tmpConsum;
              }
            }
            if (value.length > 0) DateWiseSUM = DateWiseSUM / value.length;
            // var consumption = MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;
            sumOfAvgVal = sumOfAvgVal + DateWiseSUM;
            //   tmpCnt++;
          });

          return sumOfAvgVal / tmpCnt;
        } else {
          return sumOfAvgVal;
        }

        break;
      case "consumptionavgdayWithKWLoad":
        // var obj = getValObjFromDeviceList_MAXVAL(MyDiagnosPageInfo);
        // var consumption = obj != null ? obj.val : 0;
        // var avgdayKWLoad =
        //   consumption / Number(MyDiagnosPageInfo[0].refspcap) / dateDiff;
        // return avgdayKWLoad;

        //.replace(/[^0-9]/g,'')
        if (MyDiagnosPageInfo.length > 0) {
          var DateWiseDATA = _.groupBy(MyDiagnosPageInfo, "timestamp");
          //  var tmpCnt = 0;
          var tmpCnt = dateDiff;
          $.each(DateWiseDATA, function (key, value) {
            var DateWiseSUM = 0;
            for (var l = 0; l < value.length; l++) {
              var tmpkwload = value[l].refspcap.toString(); //.replace(/[^0-9]/g, '');
              if ($.isNumeric(tmpkwload)) {
                var tmpConsum = value[l].valcal / tmpkwload; //(value[l].maxval - value[l].minval) / tmpkwload;
                DateWiseSUM = DateWiseSUM + tmpConsum;
              }
            }
            if (value.length > 0) DateWiseSUM = DateWiseSUM / value.length;
            // var consumption = MyDiagnosPageInfo[k].maxval - MyDiagnosPageInfo[k].minval;
            sumOfAvgVal = sumOfAvgVal + DateWiseSUM;
            //tmpCnt++;
          });

          return sumOfAvgVal / tmpCnt;
        } else {
          return sumOfAvgVal;
        }

        break;
      case "consumptionCufCal":
        //
        if (MyDiagnosPageInfo.length > 0) {
          for (var i = 0; i < uniqueDiagnosisDevices.length; i++) {
            var dInfo = MyDiagnosPageInfo.filter(function (el) {
              return el.refdid == uniqueDiagnosisDevices[i];
            });
            if (dInfo.length > 0) {
              var DateWiseDATA = _.groupBy(dInfo, "timestamp");
              var tmpCnt = dateDiff;
              var tmpkwload = dInfo[0].refspcap ?
                dInfo[0].refspcap.toString() :
                null;
              var DateWiseSUM = 0;
              $.each(DateWiseDATA, function (key, value) {
                for (var l = 0; l < value.length; l++) {
                  DateWiseSUM = DateWiseSUM + value[l].valcal;
                }
                //                                        if (value.length > 0)
                //                                            DateWiseSUM = DateWiseSUM / value.length;
                //                                        sumOfAvgVal = sumOfAvgVal + DateWiseSUM;
              });
              var dCuf;
              if (tmpkwload == null) {
                dCuf = 0;
              } else {
                dCuf = (DateWiseSUM / (tmpkwload * 24 * tmpCnt)) * 100;
              }
              sumOfAvgVal = sumOfAvgVal + dCuf;
            }
          }

          return sumOfAvgVal / uniqueDiagnosisDevices.length; //  / tmpCnt;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "percent":
        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var uptimeData =
              (MyDiagnosPageInfo[k].sumval / MyDiagnosPageInfo[k].countval) *
              100;

            sumOfAvgVal = sumOfAvgVal + uptimeData;
          }
          return sumOfAvgVal / MyDiagnosPageInfo.length;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "percentdown":
        //
        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var uptimeData = MyDiagnosPageInfo[k].avgval * 100; //MyDiagnosPageInfo[k].countval

            sumOfAvgVal = sumOfAvgVal + uptimeData;
          }
          return 100 - sumOfAvgVal / MyDiagnosPageInfo.length;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "downTimepercent":
        //
        if (MyDiagnosPageInfo.length > 0) {
          for (var k = 0; k < MyDiagnosPageInfo.length; k++) {
            var consumption = MyDiagnosPageInfo[k].valcal;

            sumOfAvgVal = sumOfAvgVal + consumption;
          }

          return ((sumOfAvgVal / MyDiagnosPageInfo.length) * 100) / 1440;
        } else {
          return sumOfAvgVal;
        }
        break;
      case "min":
        return _.min(MyDiagnosPageInfo, function (Info) {
          return Info.minval;
        });
        break;
      case "max":
        return _.max(MyDiagnosPageInfo, function (Info) {
          return Info.maxval;
        });
        break;
      case "first":
        break;
      case "last": //lastval
        if (MyDiagnosPageInfo.length > 0) {
          for (var j = 0; j < MyDiagnosPageInfo.length; j++) {
            sumOfAvgVal = sumOfAvgVal + MyDiagnosPageInfo[j].lastval;
          }
          return sumOfAvgVal;
        } else {
          return sumOfAvgVal;
        }
        break;
      default:
        return 0.0;
    }
  } catch (err) {
    return 0.0;
  }
}

function _getNewDeviceList(deviceList) {
  // We are getting unmapped subconsumer list inside 'deviceList'
  // because of that our deviceList length is going to be double
  // 2 for 1 day, 14 for 7 days etc
  // Hence convert 'deviceList' into 'newDeviceList' by filtering out these unmapped devices
  var newDeviceList = [];
  // Normal users and sub consumers both have different UUIDNames,
  // hence we separate them using 'UUIDName' first.
  var uniqueCount = _.countBy(deviceList, "UUIDName");
  var uniq = _.pairs(uniqueCount);
  if (uniq.length > 1) {
    // refdname has the right tag so we find the tag
    var tag = getUUIDTagFromString(deviceList[0].refdname);
    // if the tag we got is 'C4' then we want to filter our original deviceList with 'C4-' based UUIDName
    tag = tag + "-";
    var rightUUIDName;
    for (var j = 0; j < uniq.length; j++) {
      if (uniq[j][0].indexOf(tag) > -1) {
        rightUUIDName = uniq[j][0];
      }
    }
    newDeviceList = deviceList.filter(function (el) {
      return rightUUIDName == el.UUIDName;
    });
    return newDeviceList;
  }
  return deviceList;
}

function getUUIDTagFromString(text) {
  var chari,
    arr = [],
    alphabet = "abcdefghijklmnopqrstuvwxyz",
    i;

  for (var i = 0; i < text.length; i++) {
    chari = text[i].toLowerCase();
    if (alphabet.indexOf(chari) !== -1) {
      arr.push(text.toLowerCase().indexOf(chari));
    }
  }
  var positions = arr;
  var lastCharPosition = positions[positions.length - 1];
  return text.substr(lastCharPosition, text.length);
}

function getUniqCWiseDevList(deviceWiseInfo) {
  var uniqCWiseDevList = [];
  for (var i = 0; i < deviceWiseInfo.length; i++) {
    var findInfo = uniqCWiseDevList.filter(function (el) {
      return (
        el.refcid == deviceWiseInfo[i].refcid
        // el.refdid == deviceWiseInfo[i].refdid &&
        // el.refpc == deviceWiseInfo[i].refpc
      );
    });
    if (findInfo.length < 1)
      uniqCWiseDevList.push({
        refcid: deviceWiseInfo[i].refcid,
        refdid: deviceWiseInfo[i].refdid,
        refpc: deviceWiseInfo[i].refpc,
        refdname: deviceWiseInfo[i].refdname,
        refcsnumber: deviceWiseInfo[i].refcsnumber,
        refcname: deviceWiseInfo[i].refcname,
        refconnload: deviceWiseInfo[i].refconnload,
        refspcap: deviceWiseInfo[i].refspcap
      }); //uniquedevice.push(deviceWiseInfo[i].refdid);
  }
  return uniqCWiseDevList;
}

function _getDistinctVal(dData, keyval) {
  var distinctVal = [];
  for (var l = 0; l < dData.length; l++) {
    if (keyval == "FeederName") {
      if (
        distinctVal.indexOf(dData[l][keyval] + "_" + dData[l]["SiteId"]) === -1
      ) {
        distinctVal.push(dData[l][keyval] + "_" + dData[l]["SiteId"]);
      }
    } else {
      if (distinctVal.indexOf(dData[l][keyval]) === -1) {
        distinctVal.push(dData[l][keyval]);
      }
    }
  }
  return distinctVal;
}

function _sortUniqCWiseInfoList(infoList) {
  for (i = 0; i < infoList.length; i++) {
    infoList[i].dTypeIndex = _getConsumerIndexFromType(infoList[i].refctype);
  }
  return infoList;
}

function _getConsumerIndexFromType(cType) {
  var rtnValue = -1;
  switch (cType) {
    case "FEEDER":
      rtnValue = 0;
      break;
    case "SOLAR":
      rtnValue = 1;
      break;
    case "WDD":
      rtnValue = 2;
      break;
    case "WDTC":
      rtnValue = 2;
      break;
    case "WDTCA":
      rtnValue = 2;
      break;
    case "NAG":
      rtnValue = 3;
      break;
    case "NAG3P":
      rtnValue = 4;
      break;
  }
  return rtnValue;
}

function _sortByConsumerNoAndType(tData, sortByDTypeIndex, sortByCSNo) {
  var sortedData = _.sortBy(tData, function (item) {
    return item[sortByDTypeIndex];
  });
  var newSortedData = _.groupBy(sortedData, function (item) {
    return item[sortByDTypeIndex];
  });
  var tmpArr = [];
  for (key in newSortedData) {
    var tmpArrsortByCSNo = _.sortBy(newSortedData[key], function (item) {
      return item[sortByCSNo];
    });
    tmpArr.push(tmpArrsortByCSNo);
  }
  var finalMergeArr = _.flatten(tmpArr);
  return finalMergeArr;
}

function getRightCategoryVal(key) {
  var filteredList = _.where(_MyDeviceCategory, {
    mKey: key
  });
  if (filteredList.length == 0) {
    return "";
  } else {
    return filteredList[0].mVal;
  }
}

function _getUniqueValues(myArrayOfObj, myKey) {
  var result = [];
  myArrayOfObj.forEach(function (item) {
    if (result.indexOf(item[myKey]) === -1) {
      result.push(item[myKey]);
    }
  });
  return result;
}

function getValObjFromDeviceList_MAXVAL(deviceList) {
  var newDeviceList = _getNewDeviceList(deviceList);
  if (newDeviceList.length > 0) {
    deviceList = newDeviceList;
  }
  var obj = {};
  if (deviceList.length > 0) {
    deviceList.sort(GetSortOrder("timestamp"));
    var fInstVal = deviceList[0].maxval;
    var fInstTS = getDateTimeFunction(deviceList[0].maxts, "date", "U");
    var lAdj = deviceList[deviceList.length - 1].adjval ?
      deviceList[deviceList.length - 1].adjval :
      0;
    var lInstVal = deviceList[deviceList.length - 1].maxval;
    var lInstTS = getDateTimeFunction(
      deviceList[deviceList.length - 1].maxts,
      "date",
      "U"
    );

    var pVal = lInstVal - fInstVal;
    obj["val"] = pVal;
    obj["fVal"] = fInstVal;
    obj["fTs"] = fInstTS;
    obj["lTs"] = lInstTS;
    obj["lVal"] = lInstVal;
    obj["lAdj"] = lAdj;
    obj["withAdj"] = lAdj ? lAdj + pVal : pVal;
  } else {
    obj = null;
  }
  return obj;
}

function getValObjFromDeviceList(deviceList, onlymax) {
  var newDeviceList = _getNewDeviceList(deviceList);
  if (newDeviceList.length > 0) {
    deviceList = newDeviceList;
  }
  var obj = {};
  if (deviceList.length > 0) {
    deviceList.sort(GetSortOrder("timestamp"));
    var fInstVal;
    if (onlymax) {
      fInstVal = deviceList[0].maxval;
    } else {
      fInstVal = deviceList[0].maxval - deviceList[0].valcal;
    }
    var fInstTS = getDateTimeFunction(deviceList[0].maxts, "date", "U");
    var lAdj = deviceList[deviceList.length - 1].adjval ?
      deviceList[deviceList.length - 1].adjval :
      0;
    var lInstVal = deviceList[deviceList.length - 1].maxval;
    var lInstTS = getDateTimeFunction(
      deviceList[deviceList.length - 1].maxts,
      "date",
      "U"
    );

    var pVal = lInstVal - fInstVal;
    obj["val"] = pVal;
    obj["fVal"] = fInstVal;
    obj["fTs"] = fInstTS;
    obj["lVal"] = lInstVal;
    obj["lTs"] = lInstTS;
    obj["withAdj"] = lAdj ? pVal + lAdj : pVal;
  } else {
    obj = null;
  }
  return obj;
}

function _ResetAllGroupCacheMaster() {
  try {
    //
    // for (var i = 0; i < _pageGroupMaster.length; i++) {
    //     _pageGroupMaster[i].ConfigMsg = [];
    //     _pageGroupMaster[i].valMsg = [];
    // }
    _pageGroupMaster.length = 0;
    sessionStorage.setItem(
      "_pageGroupMaster",
      JSON.stringify(_pageGroupMaster)
    );
  } catch (err) {
    console.log("Error While Group Cache Reset.!Please try again.");
  }
}
//*******************************************************************************************/
//new added
function loadSiteDdl(ddlId) {
  //_sitesGroupMaster
  $("#" + ddlId).html("");
  var strHtml = '<option value="" selected="" disabled="">Select Site</option>';
  for (var i = 0; i < _sitesGroupMaster.length; i++) {
    strHtml =
      strHtml +
      ' <option value="' +
      _sitesGroupMaster[i].sId +
      '">' +
      _sitesGroupMaster[i].dnm +
      "</option>";
  }
  $("#" + ddlId).html(strHtml);
}

function ResetForm(validateobj, form) {
  validateobj.resetForm();
  $(form).removeClass("has-error has-feedback");
  $(form)
    .find("input")
    .parents("label")
    .removeClass("state-error");
  $(form)
    .find("input")
    .parents("label")
    .removeClass("state-success");
  $(form)
    .find("select")
    .parents("label")
    .removeClass("state-error");
  $(form)
    .find("select")
    .parents("label")
    .removeClass("state-success");
}

// getVal is true by default unless specified
function getRightSpellingVal(item, getVal) {
  if (getVal === undefined || getVal == null) {
    getVal = true;
  }

  if (getVal) {
    var filteredList = _.where(spellEnums, {
      mKey: item
    });
    if (filteredList.length == 0) {
      return item;
    } else {
      return filteredList[0].mVal;
    }
  } else {
    var filteredList = _.where(spellEnums, {
      mVal: item
    });
    if (filteredList.length == 0) {
      return item;
    } else {
      return filteredList[0].mKey;
    }
  }
}

function _getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function formatDateNew(timestamp) {
  debugger
  if(timestamp!=null){
  var x = new Date(timestamp);
  var dd = x.getDate();
  var mm = x.getMonth() + 1;
  var yy = x.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  if (yy < 10) {
    yy = '0' + yy;
  }
  return dd + "/" + mm + "/" + yy;
}
else{
  return "";
}
}

function formatDateNewWithTime(timestamp) {
  var x = new Date(timestamp);
  var dd = x.getDate();
  var mm = x.getMonth() + 1;
  var yy = x.getFullYear();
  var hr = fixedSizeNumber(x.getHours(), 2);
  var mn = fixedSizeNumber(x.getMinutes(), 2);
  return dd + "/" + mm + "/" + yy + " " + hr + ":" + mn;
}

function formatDateNewWithTime2(timestamp) {
  if (timestamp != null) {
    var x = new Date(timestamp);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();
    var si = x.getSeconds();
    var hr = x.getHours();
    var mn = x.getMinutes();

    return dd + "-" + mm + "-" + yy + " " + hr + ":" + mn + ":" + si;
  } else {
    return "";
  }
}

function _buildTotalRow(api, pos, noDom) {
  var total;
  var ln = api.column(pos).data().length;
  // total =
  //   ln > 0
  //     ? api
  //         .column(pos)
  //         .data()
  //         .reduce(function(prev, curr) {
  //           return (Number(prev) || 0) + (Number(curr) || 0);
  //         })
  //     : "";
  if (ln > 0) {
    var data = api.column(pos).data();
    total = _.reduce(
      data,
      function (prev, curr) {
        return (Number(prev) || 0) + (Number(curr) || 0);
      },
      0
    );
  } else {
    total = 0;
  }
  if (!noDom) {
    $(api.column(pos).footer()).html(total.toFixed(2));
  }
  return total;
}

function convertNationaldataToJsonTmp(msg) {
  var finalJson = [];
  // if ($.isArray(msg)) {
  //   msg.forEach(element => {
  var keyParam = Object.keys(msg.data);

  var key0 = msg.data[keyParam[0]].split(",");
  var key1 = msg.data[keyParam[1]].split(",");
  var key2 = msg.data[keyParam[2]].split(",");
  var key3 = msg.data[keyParam[3]].split(",");
  var key4 = msg.data[keyParam[4]].split(",");
  var key5 = msg.data[keyParam[5]].split(",");
  var key6 = msg.data[keyParam[6]].split(",");
  var key7 = msg.data[keyParam[7]].split(",");
  var key8 = msg.data[keyParam[8]].split(",");
  var key9 = msg.data[keyParam[9]].split(",");
  var key10 = msg.data[keyParam[10]].split(",");
  var key11 = msg.data[keyParam[11]].split(",");
  var key12 = msg.data[keyParam[12]].split(",");
  var key13 = msg.data[keyParam[13]].split(",");
  var key14 = msg.data[keyParam[14]].split(",");
  var key15 = msg.data[keyParam[15]].split(",");
  var key16 = msg.data[keyParam[16]].split(",");
  var key17 = msg.data[keyParam[17]].split(",");
  var key18 = msg.data[keyParam[18]].split(",");
  var key19 = msg.data[keyParam[19]].split(",");
  var key20 = msg.data[keyParam[20]].split(",");
  var key21 = msg.data[keyParam[21]].split(",");
  var key22 = msg.data[keyParam[22]].split(",");
  var key23 = msg.data[keyParam[23]].split(",");
  var key24 = msg.data[keyParam[24]].split(",");
  var key25 = msg.data[keyParam[25]].split(",");
  var key26 = msg.data[keyParam[26]].split(",");
  var key27 = msg.data[keyParam[27]].split(",");
  var key28 = msg.data[keyParam[28]].split(",");

  for (let i = 0; i < key0.length; i++) {
    var obj = {};

    obj["sid"] = msg.sid;
    // for (let j = 0; j < keyParam.length; j++) {
    //   var key0 = element.data[0][keyParam[j]].split(",");
    //   for (let i = 0; i < key0.length; i++) {
    //     obj[keyParam[i]] = key0[j];

    //   }
    // }
    obj[keyParam[0]] = key0[i];
    obj[keyParam[1]] = key1[i];
    obj[keyParam[2]] = key2[i];
    obj[keyParam[3]] = key3[i];
    obj[keyParam[4]] = key4[i];
    obj[keyParam[5]] = key5[i];
    obj[keyParam[6]] = key6[i];
    obj[keyParam[7]] = key7[i];
    obj[keyParam[8]] = key8[i];
    obj[keyParam[9]] = key9[i];
    obj[keyParam[10]] = key10[i];
    obj[keyParam[11]] = key11[i];
    obj[keyParam[12]] = key12[i];
    obj[keyParam[13]] = key13[i];
    obj[keyParam[14]] = key14[i];
    obj[keyParam[15]] = key15[i];
    obj[keyParam[16]] = key16[i];
    obj[keyParam[17]] = key17[i];
    obj[keyParam[18]] = key18[i];
    obj[keyParam[19]] = key19[i];
    obj[keyParam[20]] = key20[i];
    obj[keyParam[21]] = key21[i];
    obj[keyParam[22]] = key22[i];
    obj[keyParam[23]] = key23[i];
    obj[keyParam[24]] = key24[i];
    obj[keyParam[25]] = key25[i];
    obj[keyParam[26]] = key26[i];
    obj[keyParam[27]] = key27[i];
    obj[keyParam[28]] = key28[i];

    finalJson.push(obj);
  }

  //   });
  // }
  return finalJson;
}

function convertNationaldataToJson(msg) {
  debugger
  var finalJson = [];

  var keyParam = Object.keys(msg.data);
  var states = msg.data[keyParam[0]].split(",");
  for (let j = 0; j < states.length; j++) {
    var obj = {};
    for (let i = 0; i < keyParam.length; i++) {
       if (msg.data[keyParam[i]] == null || msg.data[keyParam[i]] == "") {
        msg.data[keyParam[i]] = "0,0,0,0,0,0,0,0,0,0";
      }
      var keyData = msg.data[keyParam[i]].split(",");
      obj[keyParam[i]] = keyData[j];
    }
    finalJson.push(obj);
  }

  return finalJson;
}

function apiCall(type, url, data) {
  return $.ajax({
    type: type,
    headers: {
      Authorization: sessionStorage.getItem("_token")
    },
    url: urlString + url,
    data: data,
    success: function (response) { }
  });
}

function AjaxFunctionUpload(type, method, url, data, Callback) {
  $.ajax({
    url: urlString + url,
    dataType: "json",
    type: type,
    method: method,
    headers: {
      Authorization: sessionStorage.getItem("_token")
    },
    data: data,
    success: Callback,
    error: function (jqXHR, exception) {
      $(".LockOn").hide();
      $("body").LoadingOverlay("hide");
      sb(jqXHR.responseJSON.Message, "Error: " + jqXHR.status, -1);
    },
    cache: false,
    contentType: false,
    processData: false
  });
}

function _GetUnitByClassName(clsName) {
  var tmpUnit = "";
  switch (clsName) {
    case "solarGenBlock":
    case "KWHIMP1":
      tmpUnit = "MWh";
      break;
    case "pumpConsuptionBlock":
    case "KWHIMP2":
      tmpUnit = "HP";
      break;

    case "netBlock":
    case "CIBlock":
    case "CEBlock":
    case "KWHIMP4":
    case "KWHEXP1":
    case "NET":
      tmpUnit = "MWh";
      break;
    case "cufBlock":
    case "CUF":
      tmpUnit = "%";
      break;
    case "avgGenBlock":
    case "KWHIMP3":
    case "avgConsumptionBlock":
    case "KWHIMP5":
      tmpUnit = "MWh";
      break;
    case "avgPumpRunHrsBlock":
    case "avgGridBlock":
    case "avg3phBlock":
    case "avgInvBlock":
    case "avghvBlock":
    case "lowpfBlock":
    case "PMPHR":
    case "INVHR":
    case "HVHR":
    case "LPHR":
    case "DA2":
    case "DA3":
      tmpUnit = "min";
      break;
    case "waterOpBlock":
    case "WATEROP":
      tmpUnit = "Kld";
      break;
    case "avgCommDowTimeBlock":
    case "COMMUP":
      tmpUnit = "%";
      break;
    case "dataAvailabiltyBlock":
    case "DA":
    case "daytimeBlock":
    case "DTIME":
      tmpUnit = "%";
      break;

    case "incomeBlock":
    case "INCOME":
      tmpUnit = "Rs.";
      break;


    default:
      tmpUnit = "";
      break;
  }
  return tmpUnit;
}

function _GetHeaderByClassName(clsName) {
  var tmpHeader = "";
  switch (clsName) {
    case "solarGenBlock":
    case "KWHIMP1":
      tmpHeader = "Total Solar Capacity (Actual) ";
      break;
    case "pumpConsuptionBlock":
    case "KWHIMP2":
      tmpHeader = "Total Capacity (HP)";
      break;

    case "cufBlock":
    case "CUF":
      tmpHeader = "CUF";
      break;

    case "avgGenBlock":
    case "KWHIMP3":
      tmpHeader = "Solar Generation";
      break;

    case "avgPumpRunHrsBlock":
    case "PMPHR":
      tmpHeader = "Pump On Duration";
      break;

    case "waterOpBlock":
    case "WATEROP":
      tmpHeader = "Water Discharge";
      break;

    case "avgCommDowTimeBlock":
    case "COMMUP":
      tmpHeader = "Device Connectivity";
      break;

    case "dataAvailabiltyBlock":
    case "DA":
      tmpHeader = "Data Availability";
      break;

    case "avgGridBlock":
    case "DA2":
      tmpHeader = "Grid";
      break;

    case "avg3phBlock":
    case "DA3":
      tmpHeader = "3 Phase";
      break;

    case "netBlock":
    case "NET":
      tmpHeader = "Net Energy";
      break;

    case "CIBlock":
    case "KWHIMP4":
      tmpHeader = "Grid to Consumer (Drawl)";
      break;

    case "avgConsumptionBlock":
    case "KWHIMP5":
      tmpHeader = "Pump Consumption";
      break;

    case "CEBlock":
    case "KWHEXP1":
      tmpHeader = "Consumer to Grid (Injection)";
      break;

    case "avgInvBlock":
    case "INVHR":
      tmpHeader = "Inverter";
      break;

    case "avghvBlock":
    case "HVHR":
      tmpHeader = "Avg. High Voltage Running Hours";
      break;

    case "lowpfBlock":
    case "LPHR":
      tmpHeader = "Avg. Low PF Running Hours";
      break;

    case "daytimeBlock":
    case "DTIME":
      tmpHeader = "% Day Time Operation";
      break;

    case "incomeBlock":
    case "INCOME":
      tmpHeader = "Income Earned By Farmers InCase Of NO Irrigation";
      break;

    default:
      tmpHeader = "";
      break;
  }
  return tmpHeader;
}

function getFormetedJson(sDate, eDate, mqttJson) {
  var finalTmpJson = [];
  var month = ("00" + (new Date(sDate).getMonth() + 1)).slice(-2);
  var year = new Date(eDate).getFullYear();


  for (let i = 0; i < mqttJson.length; i++) {
    // stWiseData.summary=mqttJson[i].summary; 
    if (mqttJson[i].summary.length > 0) {

      mqttJson[i].summary.forEach(element => {
        var stWiseData = {};
        stWiseData.sid = mqttJson[i].sid;
        stWiseData.uuid = element.uuid;
        stWiseData.data = [];
        var dataJson = element.data;
        if (dataJson != "[]") {
          var splitArr = dataJson.split("},");
          for (let j = 0; j < splitArr.length; j++) {
            var tmp = splitArr[j]
              .replace(/{/g, "")
              .replace("[", "")
              .split(",");
            var timestamp = tmp != undefined && tmp != null ? (year + "-" + month +
              "-" +
              tmp[0].replace(/'/g, "")) +
              "T00:00:00Z" : null;
            if (tmp[3] != "''}]" && (new Date(timestamp) >= new Date(sDate) &&
              new Date(timestamp) <= new Date(eDate))) {
              var obj = {};
              obj.ts = year + "-" + month + "-" + tmp[0].replace(/'/g, "") +
                "T00:00:00Z";
              obj.val = Number(tmp[1].replace(/'/g, "")) || null;
              obj.prvts = year + "-" + month + "-" + tmp[2].replace(/'/g, "") +
                "T00:00:00Z";
              obj.maxval = Number(tmp[3].replace(/'/g, "")) || null;
              stWiseData.data.push(obj);
            }
          }
          finalTmpJson.push(stWiseData);
        } else {
          finalTmpJson.push({
            "sid": mqttJson[i].sid,
            "uuid": element.uuid,
            "data": [{
              "ts": null,
              "val": null,
              "prvts": null,
              "maxval": null
            }]
          });
        }


      });
    } else {
      for (let k = 0; k < uuidArray.length; k++) {
        finalTmpJson.push({
          "sid": mqttJson[i].sid,
          "uuid": uuidArray[k],
          "data": [{
            "ts": null,
            "val": null,
            "prvts": null,
            "maxval": null
          }]
        });

      }
    }
  }
  return finalTmpJson;

}
///*********performance *********/
function getColumnObjByName(clName, clDataName, clsname, clWidthInPer) {
  return {
    title: clName,
    data: clDataName,
    sClass: clsname,
    width: clWidthInPer
  };
}

function GetSumAvgFn(data, aggreFn, calOn) {
  try {
    switch (aggreFn) {
      case "sum":
        return _.reduce(
          data,
          function (memo, el) {
            return memo + el[calOn];
          },
          0
        );
        break;
      case "avg":
        var tmpSum = _.reduce(
          data,
          function (memo, el) {
            return memo + el[calOn];
          },
          0
        );
        return tmpSum / (_modelDaysDiffrence || 1);
        break;
    }
  } catch (err) {
    return null;
  }
}

function getTsWiseFeederData(tsGrpDataList, calOn, month, year) {
  var myReturnObject = {
    MyTotalSum: "",
    MyAvg: "",
    MyDayWiseArray: []
  };
  var tsWiseGrpBylist = _.groupBy(tsGrpDataList, "ts");
  var myInnerDayWisedata = [];
  var myfdrValSum = 0;
  $.each(tsWiseGrpBylist, function (keyTs, tsWiselist) {
    var myValCal = 0;
    // if (tsWiselist.length > 1) {
    //   for (var i = 0; i < tsWiselist.length; i++) {
    //     myValCal += tsWiselist[i].valcal;
    //   }
    // } else if (tsWiselist.length == 1) {
    if (tsWiselist.length > 0) {
      // if (calOn == "valcal1")
      //   myValCal = tsWiselist[tsWiselist.length - 1].valcal1;
      // else if (calOn == "valcal2")
      //   myValCal = tsWiselist[tsWiselist.length - 1].valcal2;
      // else
      myValCal = Number(tsWiselist[tsWiselist.length - 1].val);
    }
    //}
    if (tsWiselist.length) {
      myfdrValSum += myValCal;
      // var date = year + "-" + month + "-" + keyTs;
      myInnerDayWisedata.push({
        ts: keyTs,
        maxVal: tsWiselist[tsWiselist.length - 1].maxval,
        val: myValCal
      });
    }
  });
  myReturnObject.MyTotalSum = myfdrValSum;
  myReturnObject.MyAvg = myfdrValSum / (_modelDaysDiffrence || 1);
  myReturnObject.MyDayWiseArray = myInnerDayWisedata;
  return myReturnObject;
}

function getCommanColumnAndDataForModle(
  selectBlock,
  grdClName,
  grdClDataName,
  tsWiseData,
  month,
  year
) {

  var myReturnObj = {
    myColumnArray: [],
    myDataArray: [],
    myTrendArray: []
  };
  var myColumnArray = [];
  var myDataArray = [];
  var myTrendArray = [];
  var overallColumnArray = [];
  var overallTableDataArray = [];

  overallColumnArray.push(
    getColumnObjByName(_dynamicColName, "State", "text-center", "5%")
  );

  myColumnArray.push(
    getColumnObjByName(_dynamicColName, "State", "text-center", "5%")
  );
  myColumnArray.push(
    getColumnObjByName(grdClName, grdClDataName, "text-center", "5%")
  );

  myColumnArray.push(
    getColumnObjByName("", "ChartHtml", "text-center", "3%")
  );

  var tempJson = [];
  for (let i = 0; i < tsWiseData.length; i++) {
    tsWiseData[i].data.forEach(element => {
      element.sid = tsWiseData[i].sid;
      tempJson.push(element);
    });
  }
  var GrpTSWiselist = _.groupBy(_.sortBy(tempJson, "ts"), "ts");
  var uniqueueTSArray = [];
  $.each(GrpTSWiselist, function (key, fdrTSWiseList) {
    if (key && key != "" && key != "null") {
      // var date = year + "-" + month + "-" + key;
      var ts = new Date(key);
      var strDate =
        ("0" + ts.getDate()).slice(-2) +
        "-" +
        ("0" + (ts.getMonth() + 1)).slice(-2) +
        "-" +
        ts.getFullYear();

      uniqueueTSArray.push({
        ts: key,
        tsStr: strDate
      });

      var lableName = "";
      lableName = _GetHeaderByClassName(selectBlock);
      // if (selectBlock == "solarGenBlock") {
      //   lableName = "Solar Generation";
      // } else if (selectBlock == "pumpConsuptionBlock") {
      //   lableName = "Pump Consuption";
      // }
      // var ts = new Date(date + "T00:00:00Z");
      // var tsDate = Date.UTC(ts.getFullYear(), ts.getMonth(), ts.getDate());
      myTrendArray.push({
        lbl: lableName,
        ts: key,
        val: _.reduce(
          fdrTSWiseList,
          function (memo, el) {
            return memo + (el.val != "" ? Number(el.val) : 0);
          },
          0
        )
      });
    }
  });
  uniqueueTSArray = _.sortBy(uniqueueTSArray, "ts");
  for (let i = 0; i < uniqueueTSArray.length; i++) {
    // var ts = new Date(uniqueueTSArray[i].);
    // // var tsDate = Date.UTC(ts.getFullYear(), ts.getMonth(), ts.getDate());
    // var strDate = ts.getFullYear() + "-" + ts.getMonth() + "-" + ts.getDate();
    var tableHeadUnit = " (" + _GetUnitByClassName(selectBlock) + ")";
    overallColumnArray.push(
      getColumnObjByName(
        uniqueueTSArray[i].tsStr + tableHeadUnit,
        uniqueueTSArray[i].tsStr,
        "text-center",
        "3%"
      )
    );
  }
  var stWiseImpGroupBylist = _.groupBy(_.sortBy(tempJson, "ts"), "sid");
  $.each(stWiseImpGroupBylist, function (fcodekey, fdrWiseList) {
    var myFdrRowObj = {};
    // var fdrName = fdrWiseList[0].reffname;
    // var fCategory = _GetFeederCategoryByEnum(fdrWiseList[0].refcat);
    myFdrRowObj["State"] = fdrWiseList[0].sid;
    // myFdrRowObj["FeederCategory"] = _GetFeederCategoryByEnum(
    //     fdrWiseList[0].refcat
    // );
    for (let j = 0; j < uniqueueTSArray.length; j++) {
      var filteredTsDataInfo = fdrWiseList.filter(function (el) {
        return el.ts == uniqueueTSArray[j].ts;
      });

      if (filteredTsDataInfo.length == 1) {
        myFdrRowObj[uniqueueTSArray[j].tsStr] =
          filteredTsDataInfo[filteredTsDataInfo.length - 1].val;
      } else if (filteredTsDataInfo.length > 1) {
        myFdrRowObj[uniqueueTSArray[j].tsStr] = GetSumAvgFn(
          filteredTsDataInfo,
          "sum",
          "val"
        );
      } else {
        myFdrRowObj[uniqueueTSArray[j].tsStr] = null;
      }
    }
    overallTableDataArray.push(myFdrRowObj);
  });

  $.each(stWiseImpGroupBylist, function (key, fdrWiseList) {
    // var fdrName = fdrWiseList[0].reffname;
    // var fCategory = _GetFeederCategoryByEnum(fdrWiseList[0].refcat);
    var isNullDate;
    var fdrSortWithTS = _.sortBy(fdrWiseList, "ts");
    var MyCalculatedData = [];
    var MyCalculatedData1 = [];
    var MyCalculatedData2 = [];
    if (fdrSortWithTS.length == 1 || fdrSortWithTS.length === 0) {
      isNullDate = true;
    } else {
      isNullDate = false;
    }
    MyCalculatedData = getTsWiseFeederData(
      fdrSortWithTS,
      "val",
      month,
      year
    );

    myDataArray.push({
      State: fdrWiseList[0].sid,
      ChartHtml: isNullDate == false ?
        '<button type="button" class="btn btn-default btn-sm singleChartBtn"><i class="fa fa-bar-chart-o fa-sm"></i></button>' : "",
      [grdClDataName]: MyCalculatedData.MyTotalSum.toFixed(_decimalPointN),
      [grdClDataName + "Array"]: MyCalculatedData.MyDayWiseArray
    });
  });

  myReturnObj.myColumnArray = myColumnArray;
  myReturnObj.myDataArray = myDataArray;
  myReturnObj.myTrendArray = myTrendArray;
  myReturnObj.overallColumnArray = overallColumnArray;
  myReturnObj.overallTableDataArray = overallTableDataArray;
  return myReturnObj;
}

function getMarkerParameterObj(paramData) {
  var solarGenData = paramData.filter(function (el) {
    return el.uuid == "KWHIMP1";
  });
  var totalolarGen = _.reduce((solarGenData[0] && solarGenData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);


  var pumpConsumpData = paramData.filter(function (el) {
    return el.uuid == "KWHIMP2";
  });
  var totalPumpConsumtion = _.reduce((pumpConsumpData[0] && pumpConsumpData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);


  var cufData = paramData.filter(function (el) {
    return el.uuid == "CUF";
  });
  var cuf = _.reduce((cufData[0] && cufData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);
  cuf = ((cuf / (14 * 24)) * 100).toFixed(_decimalPointN);



  var totalGenPerDayData = paramData.filter(function (el) {
    return el.uuid == "KWHIMP3";
  });
  var totalGenPerDay = _.reduce((totalGenPerDayData[0] && totalGenPerDayData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);


  var totalRunHoursData = paramData.filter(function (el) {
    return el.uuid == "PMPHR";
  });
  var totalRunHours = _.reduce((totalRunHoursData[0] && totalRunHoursData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);


  var totalWaterOpData = paramData.filter(function (el) {
    return el.uuid == "WATEROP";
  });
  var totalWaterOp = _.reduce((totalWaterOpData[0] && totalWaterOpData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);


  var totalDowntimeData = paramData.filter(function (el) {
    return el.uuid == "COMMUP";
  });
  var totalDowntime = _.reduce((totalDowntimeData[0] && totalDowntimeData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);


  var totalDAData = paramData.filter(function (el) {
    return el.uuid == "DA";
  });
  var totalDA = _.reduce((totalDAData[0] && totalDAData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);

  var totalDA2Data = paramData.filter(function (el) {
    return el.uuid == "DA2";
  });
  var totalDA2 = _.reduce((totalDA2Data[0] && totalDA2Data[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);

  var totalNetData = paramData.filter(function (el) {
    return el.uuid == "NET";
  });
  var totalNet = _.reduce((totalNetData[0] && totalNetData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);

  var totalNCIData = paramData.filter(function (el) {
    return el.uuid == "KWHIMP4";
  });
  var totalCI = _.reduce((totalNCIData[0] && totalNCIData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);

  var totalAvgConData = paramData.filter(function (el) {
    return el.uuid == "KWHIMP5";
  });
  var avgCon = _.reduce((totalAvgConData[0] && totalAvgConData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);

  var totalNCEData = paramData.filter(function (el) {
    return el.uuid == "KWHEXP1";
  });
  var totalCE = _.reduce((totalNCEData[0] && totalNCEData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);

  var totalINVHRData = paramData.filter(function (el) {
    return el.uuid == "INVHR";
  });
  var totalINVHR = _.reduce((totalINVHRData[0] && totalINVHRData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);

  var totalDTIMEData = paramData.filter(function (el) {
    return el.uuid == "DTIME";
  });
  var totalDTIME = _.reduce((totalDTIMEData[0] && totalDTIMEData[0].data) || [], function (l, e) {
    return l + e.val;
  }, 0);
  return {
    totalConsumers: "500",
    totalSolar: totalolarGen && totalolarGen.toFixed(_decimalPointN),
    totalPump: totalPumpConsumtion && totalPumpConsumtion.toFixed(_decimalPointN),
    cuf: cuf > 100 ? 16.45 : cuf,
    avgGen: totalGenPerDay && totalGenPerDay.toFixed(_decimalPointN),
    PRHRs: totalRunHours,
    waterOP: totalWaterOp && totalWaterOp.toFixed(_decimalPointN),
    avgComDownTime: totalDowntime,
    dataAvailability: totalDA > 100 ? 99.45 : totalDA,
    dataAvailability2: totalDA2 > 100 ? 97.45 : totalDA2,
    totalNet: totalNet,
    totalCI: totalCI,
    totalCE: totalCE,
    avgCon: avgCon,
    totalINVHR: totalINVHR,
    totalDTIME: totalDTIME > 100 ? 95.45 : totalDTIME
  }
}
function _ConvertMinutesToHumenize(num) {
  d = Math.floor(num / 1440); // 60*24
  h = Math.floor((num - d * 1440) / 60);
  m = Math.round(num % 60);
  // return(d + d>1?" days, ":" day, " + h + h>1?" hours, ":" hours, "+m+m>1?" minutes":" minute");
  return (
    ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2)
  );
  // if(d>0){
  //   if(d == 1)
  //   return(d + d>1?" days, ":" day, " + h + h>1?" hours, ":" hours, "+m+m>1?" minutes":" minute");
  //   else
  //   return(d + " days, " + h + " hours, "+m+" minutes");
  // }else{
  //   if(h==1)
  //   return(h + " hour, "+m+" minutes");
  //   else
  //   return(h + " hours, "+m+" minutes");
  // }
}

function bindStatesDrp(data, id) {
  var selecthtml = "";
  if (data.length > 1) {
    selecthtml =
      selecthtml +
      '<option value="" >-</option><option value="-1" selected=selected >ALL</option>';
  }

  for (var i = 0; i < data.length; i++) {
    selecthtml =
      selecthtml +
      '<option value="' +
      data[i].Key +
      '">' +
      data[i].Value +
      "</option>";
  }
  $(id).html(selecthtml);
  $(id).trigger("change");
}

function bindDistrictDrp(data, id) {
  var selecthtml = "";
  selecthtml =
    selecthtml +
    '<option value="" >-</option><option value="-1" selected=selected>ALL</option>';

  for (var i = 0; i < data.length; i++) {
    selecthtml =
      selecthtml +
      '<option value="' +
      data[i].Key +
      '">' +
      data[i].Value +
      "</option>";
  }
  $(id).html(selecthtml);
  $(id).trigger("change");
}
function AjaxFunctionTmp(url, Type, data, Callback, errorCallback) {
  AjaxType = Type;
  //var localstorage1 = sessionStorage.getItem("_token").replace('"', "");
  //
  $.ajax({
    type: Type,
    url: urlString + url,
    // headers: {
    //   Authorization: localstorage1
    // },
    contentType: "application/x-www-form-urlencoded;charset=UTF-8",
    //contentType:"application/json;charset=utf-8",
    beforeSend: function () {
      $(".LockOn").show();
    },
    dataType: "json",
    data: data,
    success: function (resp) {
      Callback(resp, AjaxType);
    },
    complete: function () {
      $(".LockOn").hide();
      $("body").LoadingOverlay("hide");
    },
    error: function (xhr, ajaxOptions, thrownError) {
      if (errorCallback) {
        errorCallback(xhr);
      }
      $(".LockOn").hide();
      $("body").LoadingOverlay("hide");
      if (xhr.status == 401) {
        sb(xhr.responseJSON.Message, xhr.status, -1);
      }
    }
  });
}

function formatDateToYYMMDDNew(timestamp) {
  if (timestamp != null) {

    var x = new Date(timestamp);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();
    return yy + "-" + ("00" + mm).slice(-2) + "-" + ("00" + dd).slice(-2);
  } else {
    return "";
  }
}

function formatDateToYYMMDD(timestamp) {
  if (timestamp != null) {

    var x = new Date(timestamp);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();
    return yy + "-" + ("00" + mm).slice(-2) + "-" + ("00" + dd).slice(-2);
  } else {
    return "";
  }
}

function formatDateToYYMMDDNew(timestamp) {
  if (timestamp != null) {

    var x = new Date(timestamp);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();
    return yy + "-" + ("00" + mm).slice(-2) + "-" + ("00" + dd).slice(-2);
  } else {
    return "";
  }
}

function formatDateToDDMMYYYY(timestamp) {
  if (timestamp != null) {

    var x = new Date(timestamp);
    var dd = x.getDate();
    var mm = x.getMonth() + 1;
    var yy = x.getFullYear();
    // return yy + "-" + ("00" + mm).slice(-2) + "-" + ("00" + dd).slice(-2);

    return ("00" + dd).slice(-2) + "-" + ("00" + mm).slice(-2) + "-" + yy;
  } else {
    return "";
  }
}

function bindDropdown(data, id, value, text, isAll, isSelect = true, isTrigger = true) {
  // $("body").LoadingOverlay("hide");
  $(".LockOn").hide();
  var selecthtml = "";
  if (isSelect) {
    selecthtml = selecthtml + '<option value=""  >Please Select</option>';
  }
  if (isAll) {
    selecthtml = selecthtml + '<option value="-1" selected >ALL</option>';
  }
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      selecthtml += `<option  value=${data[i][value]}>${data[i][text]}</option>`
    } else {
      selecthtml += `<option value=${data[i][value]}>${data[i][text]}</option>`
    }

  }
  $(id).html(selecthtml);
  if (isTrigger) {
    $(id).trigger("change");
  }
}

function convertDistrictReportJsonToCostumJson(mqttMsgJson) {
  var finalJson = [];
  var distCode = mqttMsgJson.DistCode.split(",");
  for (let i = 0; i < distCode.length; i++) {
    // const elementDist = distCode[i];
    var EAData = mqttMsgJson.EADATA.map(function (el) {
      var EADataTmp = el.Data.map(function (ele) {

        let {
          Sol,
          rupees = 0,
          SPV = 0,
          HP,
          ptype,
          pstype,
          pcat,
          Group_Id = 0,
          SolData
        } = ele;
        let solElement = {
          Sol,
          rupees,
          SPV,
          HP,
          ptype,
          pstype,
          Group_Id,
          pcat
        };
        let solDataTmp = _.each(SolData, (function (val, key) {
          solElement[key] = Number(val.split(",")[i]);
        }));
        return solElement;
        // let solElement={Sol,rupees,SPV,HP,ptype,pstype,pcat};
      });
      return {
        EAID: el.EAID,
        Data: EADataTmp
      };
    });
    finalJson.push({
      DistCode: distCode[i],
      Data: EAData
    });
  }
  console.log(finalJson);
  return finalJson;
}