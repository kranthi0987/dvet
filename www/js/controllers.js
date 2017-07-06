/*****************************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 *****************************************************************************/
myApp.controllers = {
    //////////////////////////
    // splash Page Controller //
    //////////////////////////
    splashPage: function (page) {
        var isLoggedIn = true;
        var splashTime = 1000;

        function onDeviceReady() {
            document.addEventListener("backbutton", function () {
                var currentPage = "";
                $("ons-page").each(function () {
                    if ($(this).css("display") == "block") currentPage = $(this).attr("id")
                });
                if (currentPage == "splashPage" || currentPage == "loginpage") {
                    navigator.home.home()
                }
                else {
                    document.querySelector('#myNavigator').popPage();
                }
            }, false);
        }

        var splashTimeCompleted = false;
        setTimeout(function () {
            splashTimeCompleted = true;
            if (isLoggedIn) {
                document.querySelector('#myNavigator').pushPage('html/checkpage.html');

            }
            else {
                document.querySelector('#myNavigator').pushPage('html/checkpage.html');
            }
        }, splashTime);
        initOperatingSystem();
        document.addEventListener('deviceready', function () {
        });

        function initOperatingSystem() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            // Windows Phone must come first because its UA also contains "Android"
            if (/windows phone/i.test(userAgent)) {
                $("body").addClass("platform-windows");
                return "Windows Phone";
            }
            if (/android/i.test(userAgent)) {
                $("body").addClass("platform-android");
                return "Android";
            }
            // iOS detection from: http://stackoverflow.com/a/9039885/177710
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                $("body").addClass("platform-ios");
                return "iOS";
            }
            return "unknown";
        }
    }, //////////////////////////
    // checkpage Controller //
    //////////////////////////
    checkpage: function (page) {
        document.addEventListener("deviceready", deviceisready, false);
        var currentPage = "";
        $("ons-page").each(function () {
            if ($(this).css("display") == "block") currentPage = $(this).attr("id")
        });
        console.log(currentPage);

        function deviceisready() {
            // alert("Device Ready is called");
            document.addEventListener("backbutton", function (e) {
                if (currentPage == 'checkpage') {
                    //window.location = "#exitDialog";
                    exitAppPopup();
                } else {
                    history.back();
                }
            });
        }

        function exitAppPopup() {
            navigator.notification.confirm(
                "Do you really want to close this app?",
                function (buttonIndex) {
                    ConfirmExit(buttonIndex);
                },
                "Confirmation",
                "Yes,No"
            );
            // alert("Outside Notification");
            //return false;
        }

        function ConfirmExit(stat) {
            // alert("Inside ConfirmExit");
            if (stat == "1") {
                navigator.app.exitApp();
            } else {

            }
        }
        $("#check").click(function () {
            document.querySelector('#myNavigator').pushPage('html/statuspage.html');
        });
        $('#username').keyup(function () {
            var str = document.getElementById("username").value;
            str = str.toUpperCase();
            this.value = str;
// alert(str)
        });
        $("#exit").click(function () {
            navigator.app.exitApp();
        });
    },
    //////////////////////////
    // status Controller //
    //////////////////////////
    statuspage: function (page) {
        $(document).ready(function () {
            $('.collapsible').collapsible();
        });

        var div = document.getElementById('datapart');
        div.style.display = 'none';
        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
        });
        $('#REGNUMBER').keyup(function () {
            var str = document.getElementById("REGNUMBER").value;
            str = str.toUpperCase();
            this.value = str;
        });
        $('#reset').click(function () {
            $("#myform").trigger('reset');
            div.style.display = 'none';
        });
        $('#submitforstatus').click(function () {
            tryToLogin();
        });


        function tryToLogin() {

            var username = $("#regnumber").val();
            var password = $("#password").val();
            if (validateLoginCLick(username, password)) {
                checkstatus(username, password);
            }
            return true;

        }


        function checkstatus(username, password) {
            showSpinner();
            $.ajax({
                url: urllogin(username, password)
                , type: 'GET'
                , traditional: true
                , timeout: 1000
                , headers: {}
                , statusCode: {
                    200: function (result) {
                        hideSpinner();
                        //  console.log(url);
                        var datacontent = '';
                        var datacontent1 = '';
                        var datacontent2 = '';
                        var datacontent3 = '';

                        if (result.IsDocumentVerified == true) {
                            console.log(result);
                            console.log(result.ApplicationConfirmationStatus);

                            if (result.ApplicationConfirmationStatus.ApplicationFilledupandSubmitted !== "null") {
                                var color = "w3-green";
                                datacontent += '<div style="float:right" id="applicationstatus" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="applicationstatus">Application Status</label>';
                                $("#admissionstatuscolor").html(datacontent);
                                console.log("red");
                                console.log(datacontent);
                            } else {
                                var color = "w3-red";
                                datacontent += '<div style="float:right" id="applicationstatus" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="applicationstatus">Application Status</label>';
                                $("#admissionstatuscolor").html(datacontent);
                                console.log("green");
                            }
                            div.style.display = '';
                            //application confirmation status
                            $("#applicatinfilledup").val(result.ApplicationConfirmationStatus.ApplicationFilledupandSubmitted);
                            $("#appilcationconfirmed").val(result.ApplicationConfirmationStatus.ApplicationConfirmed);
                            $("#nameofitiwhere").val(result.ApplicationConfirmationStatus.NameofITIConfirmed);
                            $("#applicationfeepaid").val(result.ApplicationConfirmationStatus.ApplicationFeePaid);
                            $("#applicationconfirmationdate").val(result.ApplicationConfirmationStatus.ApplicationConfirmatioDate);
                            if (result.ApplicationMeritNumber.StateMeritNumber !== "null") {
                                var color = "w3-green";
                                datacontent1 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="">Merit Status</label>';
                                $("#meritstatus").html(datacontent1);
                                console.log("red");
                                console.log(datacontent1);
                            } else {
                                var color = "w3-red";
                                datacontent1 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="">Merit Status</label>';
                                $("#meritstatus").html(datacontent1);
                                console.log("green");
                            }
                            //application merit number
                            $("#statelevelgeneralmeritnumber").val(result.ApplicationMeritNumber.StateMeritNumber);
                            $("#statelevelgeneralmeritnumberasapplicable").val(result.ApplicationMeritNumber.StateCategoryMeritNumber);
                            $("#homedistrictgenralmeritnumber").val(result.ApplicationMeritNumber.HomeTalukaMeritNumber);
                            $("#homedistrictgenralmeritnumberasapplicable").val(result.ApplicationMeritNumber.HomeTalukaCategoryMeritNumber);
                            //allotment status
                            if (result.FirstAllotmentDetails.NameofAllotedITI !== "null") {
                                var color = "w3-green";
                                datacontent2 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="">Allotment Status</label>';
                                $("#allotmentstatus").html(datacontent2);
                                console.log("red");
                                console.log(datacontent2);
                            } else {
                                var color = "w3-red";
                                datacontent2 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="">Allotment Status</label>';
                                $("#allotmentstatus").html(datacontent2);
                                console.log("green");
                            }
                            $("#1nameofallotediti").val(result.FirstAllotmentDetails.NameofAllotedITI);
                            $("#1nameofallotedtrade").val(result.FirstAllotmentDetails.NameofAllotedTrade);
                            $("#1allotmentcategory").val(result.FirstAllotmentDetails.AllotmentCategory);

                            $("#2nameofallotediti").val(result.SecondAllotmentDetails.NameofAllotedITI);
                            $("#2nameofallotedtrade").val(result.SecondAllotmentDetails.NameofAllotedTrade);
                            $("#2allotmentcategory").val(result.SecondAllotmentDetails.AllotmentCategory);

                            $("#3nameofallotediti").val(result.ThirdAllotmentDetails.NameofAllotedITI);
                            $("#3nameofallotedtrade").val(result.ThirdAllotmentDetails.NameofAllotedTrade);
                            $("#3allotmentcategory").val(result.ThirdAllotmentDetails.AllotmentCategory);

                            $("#4nameofallotediti").val(result.FourthAllotmentDetails.NameofAllotedITI);
                            $("#4nameofallotedtrade").val(result.FourthAllotmentDetails.NameofAllotedTrade);
                            $("#4allotmentcategory").val(result.FourthAllotmentDetails.AllotmentCategory);

                            $("#5nameofallotediti").val(result.FifthAllotmentDetails.NameofAllotedITI);
                            $("#5nameofallotedtrade").val(result.FifthAllotmentDetails.NameofAllotedTrade);
                            $("#5allotmentcategory").val(result.FifthAllotmentDetails.AllotmentCategory);
                            //admission status
                            $("#nameofitiadmittedin").val(result.AdmissionStatus.NameofITIAdmiitedIn);
                            $("#nameoftradeadmittedin").val(result.AdmissionStatus.NameofTradeAdmiitedIn);
                            $("#admittedcategory").val(result.AdmissionStatus.AdmittedCategory);
                            $("#admittedinround").val(result.AdmissionStatus.AdmittedInRound);
                            $("#dateofadmission").val(result.AdmissionStatus.DateofAdmission);
                            //admissin reject status
                            if (result.AdmissionStatus.NameofITIAdmiitedIn !== "null") {
                                var color = "w3-green";
                                datacontent3 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="">Admission Status</label>';
                                $("#admissionstatus").html(datacontent3);
                                console.log("red");
                                console.log(datacontent3);
                            } else {
                                var color = "w3-red";
                                datacontent3 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="">Admission Status</label>';
                                $("#admissionstatus").html(datacontent3);
                                console.log("green");
                            }
                            $("#nameofitiinwhichallotedbutadmisionrejected").val(result.AdmissionRejectionStatus.NameofITIInwhichAllottedButAdmissionRejected);
                            $("#nameofthetradeinwhichrejected").val(result.AdmissionRejectionStatus.NameofTradeInwhichAllottedButAdmissionRejected);
                            $("#dateofadmissionrejected").val(result.AdmissionRejectionStatus.DateofAdmissionRejection);
                            $("#reasonofrejected").val(result.AdmissionRejectionStatus.ReasonofAdmissionRejection);

                            //cadmission cancell status
                            $("#nameofiticancelled").val(result.AdmissionCancellationStatus.NameofITIAdmittedInAndCancelledAdmission);
                            $("#nameoftradecancelled").val(result.AdmissionCancellationStatus.NameofTradeAdmittedInAndCancelledAdmission);
                            $("#dateofadmissioncancelled").val(result.AdmissionCancellationStatus.DateofAdmissionCancellation);

                            //document.querySelector('#myNavigator').pushPage('html/splitter.html');
                        } else {
                            div.style.display = 'none';
                            navigator.notification.alert("Allotment Letter is applicable only for the candidate with confirmed Application.");
                        }
                    }
                    , 400: function (response) {
                        hideSpinner();
                        console.log(e);
                        navigator.notification.alert("username Or password wrong");
                    }
                    , 0: function (response) {
                        hideSpinner();
                        navigator.notification.alert('Some thing went wrong');
                    }
                }
            });
        }

    }

};