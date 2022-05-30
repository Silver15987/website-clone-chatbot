var enctriptedKey;
$(function () {
    var _clientConsumerLanding;

    if (!isStaticJsonTesting) {

        // #region client
        // var _clientConsumerLanding;
        _clientConsumerLanding = new Paho.MQTT.Client(
            _wsbroker,
            _wsport,
            "/ws",
            "myclientid_" +
            Math.random()
                .toString(36)
                .substr(2, 9)
        );
        _clientConsumerLanding.onConnectionLost = onConnectionLostCs;
        _clientConsumerLanding.onMessageArrived = onMessageArrivedCsLan;

        _clientLiveMonitoringState = new Paho.MQTT.Client(
            _wsbroker,
            _wsport,
            "/ws",
            "myclientid_" + Math.random().toString(36).substr(2, 9)
        );
        _clientLiveMonitoringState.onConnectionLost = onConnectionLostCsState;
        _clientLiveMonitoringState.onMessageArrived = onMessageArrivedCsState;

        function connectClientCsState() {
            var type = "b";
            var userNm = "cmp" + type.toLowerCase() + "_live:" + _unm;
            if (!_clientLiveMonitoringState.isConnected()) {
                try {
                    _clientLiveMonitoringState.connect({
                        userName: userNm,
                        password: _pwd,
                        useSSL: useSLL,
                        cleanSession: true,
                        onSuccess: onConnectCB,
                        onFailure: function (message) {
                            console.log("CONNECTION FAILURE - " + message.errorMessage);
                        },
                    });
                } catch (msg) {
                    console.log(msg);
                }
            }
        }

        function onConnectCB(e, level, levelName) {
            console.log(
                "Client is successfully connected :" + new Date().toLocaleTimeString()
            );
            if (_clientLiveMonitoringState.isConnected()) {
                try {
                    // level = stateCode;
                    // stateCode="58";
                    var type = "b";
                    var topic = "CMP-B/INDIA";

                    _clientLiveMonitoringState.subscribe(topic, {
                        qos: 0,
                        timeout: 60,
                        onSuccess: function () {
                            console.log("Client Subscription Config Successful..!!");
                        },
                        onFailure: function () {
                            console.log("client Subscribtion Config Failed...!!");
                        },
                    });
                    console.log("Group Subscribed : " + topic);
                } catch (msg) {
                    console.log(msg);
                }
            }
        }
        //connection Lost
        function onConnectionLostCsState(responseObject) {
            console.log("connection lost: " + responseObject.errorMessage);
            setTimeout(connectClientCsState, 3000);
            // if (
            //     $(location)
            //     .attr("href")
            //     .indexOf("monitoringb.html") != -1
            // ) {
            //     setTimeout(connectClientCsState, 5000);
            // }
        };

        function connectClientLan() {
            var type = "b";
            //var userNm = "cmp" + type.toLowerCase() + "_schemeprogress:" + _unm;
            if (!_clientConsumerLanding.isConnected()) {
                try {
                    _clientConsumerLanding.connect({
                        userName: _unm,
                        password: _pwd,
                        useSSL: useSLL,
                        cleanSession: true,
                        onSuccess: onConnectLan,
                        onFailure: function (message) {
                            console.log("CONNECTION FAILURE - " + message.errorMessage);
                        }
                    });
                } catch (msg) {

                    console.log(msg);
                }
            }

        }

        function onConnectLan(e, level) {
            console.log(
                "Client is successfully connected :" + new Date().toLocaleTimeString()
            );
            if (_clientConsumerLanding.isConnected()) {
                try {
                    var topic = "national/landingsummary";
                    _clientConsumerLanding.subscribe(
                        topic, {
                        qos: 0,
                        timeout: 60,
                        onSuccess: function () {
                            console.log("Client Subscription Config Successful..!!");
                        },
                        onFailure: function () {
                            console.log("client Subscribtion Config Failed...!!");
                        }
                    }
                    );
                    console.log("Group Subscribed : " + topic);



                } catch (msg) {
                    console.log(msg);
                }
            }
        };


        function onConnectionLostCs(params) {

        }

        function onMessageArrivedCsLan(message) {
            debugger
            console.log("Message Arrived");
            var topicArray = message.destinationName.split("/");
            var data = JSON.parse(message.payloadString);
            console.log(data);
            setTopComponentValues(data);
            // var totalFarmmer = data.a_Farmer + data.b_Farmer + data.c_Farmer;
            // var totalHP = data.a_hpc2s + data.b_hpc2s + data.c_hpc2s;
            // var totalSolar = data.a_solar + data.b_solar + data.c_solar;
            // $("#count1").html(abbrNum(totalFarmmer, 2));
            // $("#count2").html(abbrNum(totalHP, 2));
            // $("#count3").html(abbrNum(totalSolar, 2));
        }

        function getSumOfTag(data, Tag) {
            return data
                .map(el => el[Tag])
                .join(",")
                // .replaceAll(",,",",")
                .split(",")
                .reduce((m, e) => Number(m) + Number(e), 0)
        }
        function onMessageArrivedCsState(message) {
            debugger;
            console.log("Live monitoring Message");
            $("body").LoadingOverlay("hide");
            var topicArray = message.destinationName.split("/");
            var data = JSON.parse(message.payloadString);
            var messageData = Object.values(data.msg.data);
            var totalStandAlonePump = getSumOfTag(messageData, "TTLConsumers");
            var totalPumpCap = getSumOfTag(messageData, "TTLPUMPHP");
            var totalSolarGen = getSumOfTag(messageData, "SPTOTKWH1");
            var totalSolarCap = getSumOfTag(messageData, "TTLSolarCAP");
            var co2Reduction = (totalSolarGen / 1000000) * 800;
            //Component B
            // $("#cmpbTSAPI").html(getSumOfTag(messageData,"TTLConsumers"));
            // $("#cmpbTSC").html((totalPumpCap/1000).toFixed(2));
            $("#TCFRTable tr:eq(15)>td:eq(2)").html(co2Reduction.toFixed(2));
            $("#TSGTable tr:eq(15)>td:eq(2)").html((totalSolarGen / 1000).toFixed(2));
            // $("#cmpbTable tr:eq(15)>td:eq(1)").html(totalStandAlonePump);
            // $("#cmpbTable tr:eq(15)>td:eq(2)").html((totalSolarCap / 1000).toFixed(2));
            // $("#cmpbTable tr:eq(16)>td:eq(2)").html(19.38);
            $("#cmpbTCFR").html(co2Reduction.toFixed(2));
            $("#cmpbTSG").html((totalSolarGen / 1000).toFixed(2));
        }
        connectClientLan();
        connectClientCsState();
        // #endregion

    }

    function setTopComponentValues(data) {
        debugger;
        // data[0].STWData = data[0].STWData.filter(function (el) {
        //     return statesSelectedArrayTmp.indexOf(Number(el.STCode)) != -1;
        // });
        // data[1].STWData = data[1].STWData.filter(function (el) {
        //     return statesSelectedArrayTmp.indexOf(Number(el.STCode)) != -1;
        // });
        // data[2].STWData = data[2].STWData.filter(function (el) {
        //     return statesSelectedArrayTmp.indexOf(Number(el.STCode)) != -1;
        // });
        // data[1].STWData.forEach(el => {
        // if(el.STCode=="6"){
        //     el.TSC=35.49;
        // }
        // if(el.STCode=="8"){
        //     el.TSC=19.38;
        // }
        // });
        // Component A
        var cmpaTSPI = _.reduce(data[0].STWData, function (num, el) {
            return num + el.TSPI
        }, 0);
        var cmpaTSC = _.reduce(data[0].STWData, function (num, el) {
            return num + el.TSC
        }, 0);

        var cmpaTCFR = _.reduce(data[0].STWData, function (num, el) {
            return num + el.TCFR
        }, 0);
        var cmpaTSG = _.reduce(data[0].STWData, function (num, el) {
            return num + el.TSG
        }, 0);

        //Component B
        var cmpbTSAPI = _.reduce(data[1].STWData, function (num, el) {
            return num + el.TSAPI
        }, 0);
        var cmpbTSC = _.reduce(data[1].STWData, function (num, el) {
            return num + el.TSC
        }, 0);
        var cmpbTCFR = _.reduce(data[1].STWData, function (num, el) {
            return num + el.TCFR
        }, 0);
        var cmpbTSG = _.reduce(data[1].STWData, function (num, el) {
            return num + el.TSG
        }, 0);

        //Component C
        var cmpcTGCPS = _.reduce(data[2].STWData, function (num, el) {
            return num + el.TGCPS
        }, 0);
        var cmpcTSC = _.reduce(data[2].STWData, function (num, el) {
            return num + el.TSC
        }, 0);
        var cmpcTCFR = _.reduce(data[2].STWData, function (num, el) {
            return num + el.TCFR
        }, 0);
        var cmpcTSG = _.reduce(data[2].STWData, function (num, el) {
            return num + el.TSG
        }, 0);

        //Component A
        $("#cmpaTSPI").html(cmpaTSPI);
        $("#cmpaTSC").html(cmpaTSC);
        $("#cmpaTCFR").html(cmpaTCFR);
        $("#cmpaTSG").html(cmpaTSG);

        //Component B
        $("#cmpbTSAPI").html(cmpbTSAPI);
        $("#cmpbTSC").html((cmpbTSC / 1000).toFixed(2));
        // $("#cmpbTCFR").html(cmpbTCFR);
        // $("#cmpbTSG").html(cmpbTSG);

        //Component C
        $("#cmpcTGCPS").html(cmpcTGCPS);
        $("#cmpcTSC").html(cmpcTSC);
        $("#cmpcTCFR").html(cmpcTCFR);
        $("#cmpcTSG").html(cmpcTSG);
        debugger
        //Component A State Wise Table
        var compaTableHtml = '';
        data[0].STWData.forEach(element => {
            compaTableHtml += `	
						<tr>
							<td>${element.ST || ""}</td>
							<td>${element.TSPI || 0}</td>
							<td>${element.TSC || 0}</td>
						</tr>`;
        });

        //Component B State Wise Table
        var compbTableHtml = '';
        data[1].STWData.forEach(element => {
            compbTableHtml += `	
						<tr>
							<td>${element.ST || ""}</td>
							<td>${element.TSAPI || 0}</td>
							<td>${Number(element.TSC).toFixed(2)/1000 || 0}</td>
						</tr>`;
        });

        //Component C State Wise Table
        var compcTableHtml = '';
        data[2].STWData.forEach(element => {
            compcTableHtml += `	
						<tr>
							<td>${element.ST || ""}</td>
							<td>${element.TGCPS || 0}</td>
							<td>${element.TSC || 0}</td>
						</tr>`;
        });

        //TSG State Wise Table
        var TSGTableHtml = '';
        data[0].STWData.forEach(element => {
            var compbStateData = data[1].STWData.filter(function (el) {
                return el.ST == element.ST
            });
            var compcStateData = data[2].STWData.filter(function (el) {
                return el.ST == element.ST
            });
            TSGTableHtml += `	
						<tr>
							<td>${element.ST || ""}</td>
							<td>${element.TSG || 0}</td>
							<td>${compbStateData.length != 0 ? (compbStateData[0].TSG || 0) : ""}</td>
							<td>${compcStateData.length != 0 ? (compcStateData[0].TSG || 0) : ""}</td>
						</tr>`;
        });

        //TCFR State Wise Table
        var TCFRTableHtml = '';
        data[0].STWData.forEach(element => {
            var compbStateData = data[1].STWData.filter(function (el) {
                return el.ST == element.ST
            });
            var compcStateData = data[2].STWData.filter(function (el) {
                return el.ST == element.ST
            });
            TCFRTableHtml += `	
						<tr>
							<td>${element.ST || ""}</td>
							<td>${element.TCFR || 0}</td>
							<td>${compbStateData.length != 0 ? (compbStateData[0].TCFR || 0) : ""}</td>
							<td>${compcStateData.length != 0 ? (compcStateData[0].TCFR || 0) : ""}</td>
						</tr>`;
        });


        $("#cmpaTable").find("tbody").html(compaTableHtml);
        $("#cmpbTable").find("tbody").html(compbTableHtml);
        $("#cmpcTable").find("tbody").html(compcTableHtml);
        $("#TSGTable").find("tbody").html(TSGTableHtml);
        $("#TCFRTable").find("tbody").html(TCFRTableHtml);


    }

    function loginMethod(url, param, type, callback) {
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
                callback(response);
            },
            error: function (response) {
                $("#capCode").val("");
                getCaptcha();
                $.LoadingOverlay("hide", true);
                $.smallBox({
                    title: "Warning",
                    content: response.responseJSON.Message,
                    color: "#dfb56c",
                    iconSmall: "fa fa-exclamation-triangle  fa-2x fadeInRight animated",
                    timeout: 5000
                });
            }
        });
    };

    $(document).ready(function () {
        $("#refCaptcha").click(function () {
            getCaptcha();
        });

        $("#loginPop").click(function (e) {
            $("#myModal").modal("show");
        });
        sessionStorage.clear();
        if (navigator.onLine) {
            try {
                $("#btnlogIn").click(function (e) {
                    $.LoadingOverlay("show");
                    e.preventDefault();
                    if ($("#login-form").valid()) {
                        sessionStorage.setItem("_token", "");
                        if (document.getElementById("username").value != "" && document
                            .getElementById(
                                "password").value != "" && $("#capCode").val() != "") {
                            var captchaCode = $("#capCode").val();
                            loginMethod("Token/Login?Captchacode=" + captchaCode +
                                "&Key=" + enctriptedKey, {
                                "username": $("#username").val(),
                                "password": $("#password").val(),
                            }, "POST",
                                function (data) {
                                    debugger;
                                    // if (debugState) {
                                    // 	root.console.log(
                                    // 		"? Call Login Selfhost Method");
                                    // }
                                    // // if (data.Result.Flag == true) {
                                    // if (debugState) {
                                    // 	root.console.log(
                                    // 		"? Redirect To Index Page..");
                                    // }
                                    console.log(data);
                                    //  //
                                    var myToken = data.token_type + " " + data
                                        .access_token;
                                    sessionStorage.setItem("_token", myToken);
                                    // sessionStorage.setItem("oList", JSON.stringify(data
                                    //     .orgL));
                                    // sessionStorage.setItem("DepartmetnId", data.token
                                    //     .Department);
                                    // if (data.orgL && data.orgL.length > 0) {

                                        sessionStorage.setItem("_mqttUid", data.mqttId ?data.mqttId : "");
                                        sessionStorage.setItem("_mqttpwd", data.mqttPwd?data.mqttPwd:"");
                                    //     sessionStorage.setItem("_mqttport", data.orgL[0]
                                    //         .mqttport);
                                    //     sessionStorage.setItem("_mqttbroker", data.orgL[0]
                                    //         .mqttserver);
                                    // }
                                    //assetManagement

                                    sessionStorage.setItem("OrganizationId", data
                                        .Organization);
                                    // sessionStorage.setItem("SiteId", data.Site);
                                    sessionStorage.setItem("UserId", data.UserId);
                                    sessionStorage.setItem("_refresh_token", data.refresh_token);
                                    sessionStorage.setItem("Role", data.Role);
									 sessionStorage.setItem("DepartmentName", data.DepartmentName);
                                    sessionStorage.setItem("State", data.State);
                                    sessionStorage.setItem("UserName", data
                                        .UserName);
                                    sessionStorage.setItem("expires", data[
                                        ".expires"]);
                                    sessionStorage.setItem("issued", data[
                                        ".issued"]);

                                    //                                    localStorage.setItem("OrganizationId", data.token.Organization);
                                    //                                    localStorage.setItem("SiteId", data.token.Site);
                                    //                                    localStorage.setItem("UserId", data.token.UserId);
                                    //                                    localStorage.setItem("Role", data.token.Role);
                                    //                                    localStorage.setItem("UserName", data.token.UserName);
                                    $("#myModal").modal("hide");
                                    window.location.href =
                                        "selectionscheme.html";
                                    // } else {
                                    //     if (debugState) {
                                    //         root.console.log("? Login Failed..");
                                    //     }
                                    //     $.LoadingOverlay("hide", true);
                                    //     $.smallBox({
                                    //         title: "Warning",
                                    //         content: data.Result.Message,
                                    //         color: "#dfb56c",
                                    //         iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    //         timeout: 5000
                                    //     });
                                    // }

                                });

                        } else {
                            // if (debugState) {
                            // 	root.console.log(
                            // 		"? Username or Password enter Wrong or null ..");
                            // }
                            getCaptcha();
                            $.LoadingOverlay("hide", true);
                            $.smallBox({
                                title: "Warning",
                                content: " Please enter valid username, password and Captcha Code!",
                                color: "#dfb56c",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 5000
                            });
                        }
                    } else {
                        getCaptcha();
                        $.LoadingOverlay("hide", true);
                        $.smallBox({
                            title: "Warning",
                            content: " Please enter username, password and Captcha Code!",
                            color: "#dfb56c",
                            iconSmall: "fa fa-check fa-2x fadeInRight animated",
                            timeout: 5000
                        });
                    }

                });
            } catch (err) {
                $.LoadingOverlay("hide", true);
            }
        } else {
            // if (debugState) {
            // 	root.console.log("? Internet Connection Lost ..");
            // }
            $.smallBox({
                title: "Warning",
                content: "Check Your Connection...",
                color: "#dfb56c",
                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                timeout: 5000
            });
        }
        if (isStaticJsonTesting) {
            setTopComponentValues(finaljson);
        }
    });
    var firstTime = true;

    function hLink_OnClick(cmpType) {

        switch (cmpType) {
            case 'A':
                sessionStorage.setItem("first", firstTime);
                sessionStorage.setItem("type", "A");
                break;
            case 'B':
                sessionStorage.setItem("first", firstTime);
                sessionStorage.setItem("type", "B");
                break;
            case 'C':
                sessionStorage.setItem("first", firstTime);
                sessionStorage.setItem("type", "C");
                break;
            default:
        }
        window.location.href = "index.html#ajax/consumer/consumer.html";
        //this.href = "index.html#ajax/consumer/consumer.html";
        return false;
    }


    $("body").LoadingOverlay("show");

    function getCaptcha() {
        var type = 'GET';
        var param = "";
        $("#capCode").html("");
        AjaxFunction(
            "Get_Captcha/GetCaptcha",
            type,
            param,
            function (data) {
                // if (data.Flag == true) {
                //debugger
                $("body").LoadingOverlay("hide");
                enctriptedKey = data.ECC;
                var image = new Image();
                image.src = 'data:image/png;base64,' + data.imgstring;
                // image.src = 'data:image/png;base64/' + data.imgstring;
                $("#captcha").html(image);
                // } else {

                //     $("body").LoadingOverlay("hide");
                //     $.smallBox({
                //         title: "Warning",
                //         content: data.Message,
                //         color: "#dfb56c",
                //         iconSmall: "fa  fa-2x fadeInRight animated",
                //         timeout: 5000
                //     });
                // }
            },
            function (data) {
                $("body").LoadingOverlay("hide");
                $.smallBox({
                    title: "Warning",
                    content: data.Message,
                    color: "#00b300",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 5000
                });

            }
        );
    }
    getCaptcha();

});
var finaljson = [{
    "CMP": "A",
    "STWData": [{
        "ST": "Andhra Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Andaman and Nicobar Islands",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Arunachal Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Assam",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Bihar",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Chandigarh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Chattisgarh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Daman and Diu",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Delhi",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Dadra and Nagar Haveli",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Goa",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Gujarat",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Himachal Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Haryana",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Jharkhand",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Jammu and Kashmir",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Karnataka",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Kerala",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Lakshadweep Islands",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Meghalaya",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Maharashtra",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Mizoram",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Manipur",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Madhya Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Nagaland",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Odisha",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Punjab",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Pondicherry",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Rajasthan",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Sikkim",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Tamil Nadu",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Tripura",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Telangana",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Uttar Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Uttarakhand",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "West Bengal",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 10,
        "TSC": 10,
        "TSG": 10,
        "TCFR": 10
    }
    ]
},
{
    "CMP": "B",
    "STWData": [{
        "ST": "Andhra Pradesh",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Andaman and Nicobar Islands",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Arunachal Pradesh",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Assam",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Bihar",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Chandigarh",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Chattisgarh",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Daman and Diu",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Delhi",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Dadra and Nagar Haveli",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Goa",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Gujarat",
        "TSPI": 10,
        "TSAPI": 100,
        "TGCPS": 10,
        "TSC": 4876.2,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Himachal Pradesh",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Haryana",
        "TSPI": 10,
        "TSAPI": 100,
        "TGCPS": 10,
        "TSC": 4876.2,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Jharkhand",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Jammu and Kashmir",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Karnataka",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Kerala",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Lakshadweep Islands",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Meghalaya",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Maharashtra",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Mizoram",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Manipur",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Madhya Pradesh",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Nagaland",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Odisha",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Punjab",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Pondicherry",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Rajasthan",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Sikkim",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Tamil Nadu",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Tripura",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Telangana",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Uttar Pradesh",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Uttarakhand",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "West Bengal",
        "TSPI": 10,
        "TSAPI": 0,
        "TGCPS": 10,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    }
    ]
},
{
    "CMP": "C",
    "STWData": [{
        "ST": "Andhra Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Andaman and Nicobar Islands",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Arunachal Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Assam",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Bihar",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Chandigarh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Chattisgarh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Daman and Diu",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Delhi",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Dadra and Nagar Haveli",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Goa",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Gujarat",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 100,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Himachal Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Haryana",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 100,
        "TSC": 4876.2,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Jharkhand",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Jammu and Kashmir",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Karnataka",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Kerala",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Lakshadweep Islands",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Meghalaya",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Maharashtra",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Mizoram",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Manipur",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Madhya Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Nagaland",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Odisha",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Punjab",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Pondicherry",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Rajasthan",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Sikkim",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Tamil Nadu",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Tripura",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Telangana",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Uttar Pradesh",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "Uttarakhand",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    },
    {
        "ST": "West Bengal",
        "TSPI": 10,
        "TSAPI": 10,
        "TGCPS": 0,
        "TSC": 0.0,
        "TSG": 10,
        "TCFR": 10
    }
    ]
}
];

jQuery(document).ready(function ($) {
    $(".scroll").click(function (event) {
        event.preventDefault();
        $('html,body').animate({
            scrollTop: $(this.hash).offset().top
        }, 1200);
    });

});