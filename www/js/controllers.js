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
                    document.querySelector('#myNavigator').pushPage('html/checkpage.html');
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
                , timeout: 10000
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
                            $("#CandidateName").html(result.CandidateName);
                            $("#HomeTalukaName").html(result.HomeTalukaName);
                            $("#CandidateCategory").html(result.CandidateCategory);

                            if (result.ApplicationConfirmationStatus.ApplicationFilledupandSubmitted !== null || result.ApplicationConfirmationStatus.ApplicationFilledupandSubmitted !== "NA") {
                                var color = "w3-green";
                                datacontent += '<div style="float:right" id="applicationstatus" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="applicationstatus">Application Status</label>';
                                $("#admissionstatuscolor").html(datacontent);
                                console.log("red");
                                console.log(datacontent);
                            } else {
                                var color = "w3-red";
                                datacontent += '<div style="float:right" id="applicationstatus" class="col s6 w3-container ' + color + '">Pending</div>' +
                                    ' <label class="col s6" for="applicationstatus">Application Status</label>';
                                $("#admissionstatuscolor").html(datacontent);
                                console.log("green");
                            }
                            div.style.display = '';
                            //application confirmation status
                            $("#applicatinfilledup").val(result.ApplicationConfirmationStatus.ApplicationFilledupandSubmitted);
                            $("#appilcationconfirmed").val(result.ApplicationConfirmationStatus.ApplicationConfirmed);
                            $("#nameofitiwhere").html(result.ApplicationConfirmationStatus.NameofITIConfirmed);
                            $("#applicationfeepaid").val(result.ApplicationConfirmationStatus.ApplicationFeePaid);
                            $("#applicationconfirmationdate").val(result.ApplicationConfirmationStatus.ApplicationConfirmatioDate);
                            if (result.ApplicationMeritNumber.StateMeritNumber !== "null" || result.ApplicationMeritNumber.StateMeritNumber !== "NA" || result.ApplicationMeritNumber.StateMeritNumber !== undefined) {
                                var color = "w3-green";
                                datacontent1 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Declared</div>' +
                                    ' <label class="col s6" for="">Merit Status</label>';
                                $("#meritstatus").html(datacontent1);
                                console.log("red");
                                console.log(datacontent1);
                            } else {
                                var color = "w3-red";
                                datacontent1 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Yet to Declare</div>' +
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
                            var divallot = document.getElementById('allotlabel');
                            // divdivallot.style.display = 'none';
                            var arr = {
                                "AllotmentList": [
                                    {
                                        "NameofAllotedITI": "GOVERNMENT INDUSTRIAL TRAINING INSTITUTE, (WOMAN), AURANGABAD, TAL: AURANGABAD, DIST: AURANGABAD",
                                        "NameofAllotedTrade": "Electrician",
                                        "AllotmentCategory": "ADIVASI",
                                        "RoundName": "First Round"
                                    },
                                    {
                                        "NameofAllotedITI": "GOVERNMENT INDUSTRIAL TRAINING INSTITUTE, (ADIVASI), SHAHAPUR, TAL: SHAHAPUR, DIST: THANE",
                                        "NameofAllotedTrade": "Instrument Mechanic",
                                        "AllotmentCategory": "DEFENSE",
                                        "RoundName": "Second Round"
                                    },
                                    {
                                        "NameofAllotedITI": "GOVERNMENT INDUSTRIAL TRAINING INSTITUTE, (ADIVASI), SHAHAPUR, TAL: SHAHAPUR, DIST: THANE",
                                        "NameofAllotedTrade": "Surveyor",
                                        "AllotmentCategory": "GENERAL",
                                        "RoundName": "Third Round"
                                    },
                                    {
                                        "NameofAllotedITI": "GOVERNMENT INDUSTRIAL TRAINING INSTITUTE, (ADIVASI), SHAHAPUR, TAL: SHAHAPUR, DIST: THANE",
                                        "NameofAllotedTrade": "Surveyor",
                                        "AllotmentCategory": "GENERAL",
                                        "RoundName": "Fourth Round"
                                    },
                                    {
                                        "NameofAllotedITI": "GOVERNMENT INDUSTRIAL TRAINING INSTITUTE, (ADIVASI), SHAHAPUR, TAL: SHAHAPUR, DIST: THANE",
                                        "NameofAllotedTrade": "Surveyor",
                                        "AllotmentCategory": "GENERAL",
                                        "RoundName": "Fifth Round"
                                    }
                                ]
                            };
                            //for testing
                            if (result.AllotmentList.length <= 0) {
                                var color = "w3-red";
                                datacontent2 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Not Allotted </div>' +
                                    ' <label class="col s6" for="">Allotment Status</label>';
                                $("#allotmentstatus").html(datacontent2);
                                console.log("red");
                                // console.log(datacontent2);
                                divallot.style.display = 'none';
                            } else {
                                var color = "w3-green";
                                datacontent2 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Allotted</div>' +
                                    ' <label class="col s6" for="">Allotment Status</label>';
                                $("#allotmentstatus").html(datacontent2);
                                console.log("green");
                                divallot.style.display = '';
                            }
                            //dynamic allotment list

                            var arrallo = result.AllotmentList;
                            var datacontentallot = '';
                            for (var i in arrallo) {
                                var id = arrallo[i].NameofAllotedITI;
                                var name = arrallo[i].NameofAllotedTrade;
                                var allotmentcat = arrallo[i].AllotmentCategory;
                                var roundname = arrallo[i].RoundName;
                                console.log(id + name + allotmentcat + roundname);
                                datacontentallot += '<ul class="collapsible" data-collapsible="accordion">' +
                                    '                   <li>' +
                                    '                      <div class="collapsible-header">' +
                                    '                         <div class="row">' +
                                    '                            <label class="col s12 center-align fontsizelabel labeldesign"><strong>' + roundname + ' ALLOTMENT STATUS</strong> </label>' +
                                    '                     </div>' +
                                    '                </div>' +
                                    '               <div class="collapsible-body">' +
                                    '                  <div class="row">' +
                                    '                     <p style="float:right;font-size: 12px;word-break: break-all;" class="col s6 flow-text" id="" type="text" value="" readonly>' + id + '</p>' +
                                    '                    <label class="col s6">NAME OF ALLOTED ITI </label>' +
                                    '               </div>' +
                                    '              <div class="row">' +
                                    '                 <input style="float:right" class="col s6" id="" type="text" value="' + name + '" readonly/>' +
                                    '          <label class="col s6">NAME OF ALLOTED TRADE </label>' +
                                    '     </div>' +
                                    '    <div class="row">' +
                                    '       <input style="float:right" class="col s6" id="" type="text" value="' + allotmentcat + '" readonly/>' +
                                    '      <label class="col s6">ALLOTMENT CATEGORY </label>' +
                                    ' </div>' +
                                    ' </div>' +
                                    '</li>' +
                                    '</ul>';
                                console.log(datacontent);
                                $("#allotmentdynamiclist").html(datacontentallot);
                                $(document).ready(function () {
                                    $('.collapsible').collapsible();
                                });
                            }
                            // $("#1nameofallotediti").val(result.FirstAllotmentDetails.NameofAllotedITI);
                            // $("#1nameofallotedtrade").val(result.FirstAllotmentDetails.NameofAllotedTrade);
                            // $("#1allotmentcategory").val(result.FirstAllotmentDetails.AllotmentCategory);
                            //
                            // $("#2nameofallotediti").val(result.SecondAllotmentDetails.NameofAllotedITI);
                            // $("#2nameofallotedtrade").val(result.SecondAllotmentDetails.NameofAllotedTrade);
                            // $("#2allotmentcategory").val(result.SecondAllotmentDetails.AllotmentCategory);
                            //
                            // $("#3nameofallotediti").val(result.ThirdAllotmentDetails.NameofAllotedITI);
                            // $("#3nameofallotedtrade").val(result.ThirdAllotmentDetails.NameofAllotedTrade);
                            // $("#3allotmentcategory").val(result.ThirdAllotmentDetails.AllotmentCategory);
                            //
                            // $("#4nameofallotediti").val(result.FourthAllotmentDetails.NameofAllotedITI);
                            // $("#4nameofallotedtrade").val(result.FourthAllotmentDetails.NameofAllotedTrade);
                            // $("#4allotmentcategory").val(result.FourthAllotmentDetails.AllotmentCategory);
                            //
                            // $("#5nameofallotediti").val(result.FifthAllotmentDetails.NameofAllotedITI);
                            // $("#5nameofallotedtrade").val(result.FifthAllotmentDetails.NameofAllotedTrade);
                            // $("#5allotmentcategory").val(result.FifthAllotmentDetails.AllotmentCategory);
                            // //admission status
                            //admissin reject status
                            if (result.AdmissionStatus.NameofITIAdmiitedIn !== null || result.AdmissionStatus.NameofTradeAdmiitedIn !== null && result.AdmissionStatus.NameofITIAdmiitedIn !== "-" && result.AdmissionStatus.NameofTradeAdmiitedIn !== "-" && result.AdmissionStatus.NameofITIAdmiitedIn !== "NA" && result.AdmissionStatus.NameofTradeAdmiitedIn !== "NA") {
                                var color = "w3-green";
                                datacontent3 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Confirmed</div>' +
                                    ' <label class="col s6" for="">Admission Status</label>';
                                $("#admissionstatus").html(datacontent3);
                                console.log("red");
                                console.log(datacontent3);
                            } else if (result.AdmissionRejectionStatus.NameofITIInwhichAllottedButAdmissionRejected !== null && result.AdmissionRejectionStatus.NameofTradeInwhichAllottedButAdmissionRejected !== null && result.AdmissionRejectionStatus.NameofITIInwhichAllottedButAdmissionRejected !== "-" && result.AdmissionRejectionStatus.NameofTradeInwhichAllottedButAdmissionRejected !== "-" && result.AdmissionRejectionStatus.NameofITIInwhichAllottedButAdmissionRejected !== "NA" && result.AdmissionRejectionStatus.NameofTradeInwhichAllottedButAdmissionRejected !== "NA") {
                                var color = "w3-red";
                                datacontent3 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Rejected</div>' +
                                    ' <label class="col s6" for="">Admission Status</label>';
                                $("#admissionstatus").html(datacontent3);
                                console.log("green");
                            }
                            else {
                                var color = "w3-yellow";
                                datacontent3 += '<div style="float:right" id="" class="col s6 w3-container ' + color + '">Cancelled</div>' +
                                    ' <label class="col s6" for="">Admission Status</label>';
                                $("#admissionstatus").html(datacontent3);
                                console.log("yellow");
                            }
                            if (result.AdmissionStatus.NameofITIAdmiitedIn == null || result.AdmissionStatus.NameofTradeAdmiitedIn == null) {
                                $("#nameofitiadmittedin").html("NA");
                                $("#nameoftradeadmittedin").val("NA");
                                $("#admittedcategory").val("NA");
                                $("#admittedinround").val("NA");
                                $("#dateofadmission").val("NA");

                            }
                            else {
                                $("#nameofitiadmittedin").html(result.AdmissionStatus.NameofITIAdmiitedIn);
                                $("#nameoftradeadmittedin").val(result.AdmissionStatus.NameofTradeAdmiitedIn);
                                $("#admittedcategory").val(result.AdmissionStatus.AdmittedCategory);
                                $("#admittedinround").val(result.AdmissionStatus.AdmittedInRound);
                                $("#dateofadmission").val(result.AdmissionStatus.DateofAdmission);

                            }

                            if (result.AdmissionRejectionStatus.NameofITIInwhichAllottedButAdmissionRejected == null || result.AdmissionRejectionStatus.NameofTradeInwhichAllottedButAdmissionRejected == null) {
                                $("#nameofitiinwhichallotedbutadmisionrejected").html("NA");
                                $("#nameofthetradeinwhichrejected").val("NA");
                                $("#dateofadmissionrejected").val("NA");
                                $("#reasonofrejected").val("NA");

                            }
                            else {
                                $("#nameofitiinwhichallotedbutadmisionrejected").html(result.AdmissionRejectionStatus.NameofITIInwhichAllottedButAdmissionRejected);
                                $("#nameofthetradeinwhichrejected").val(result.AdmissionRejectionStatus.NameofTradeInwhichAllottedButAdmissionRejected);
                                $("#dateofadmissionrejected").val(result.AdmissionRejectionStatus.DateofAdmissionRejection);
                                $("#reasonofrejected").val(result.AdmissionRejectionStatus.ReasonofAdmissionRejection);

                            }

                            if (result.AdmissionCancellationStatus.NameofITIAdmittedInAndCancelledAdmission == null || result.AdmissionCancellationStatus.NameofTradeAdmittedInAndCancelledAdmission == null) {
                                //admission cancell status
                                $("#nameofiticancelled").html("NA");
                                $("#nameoftradecancelled").val("NA");
                                $("#dateofadmissioncancelled").val("NA");

                            }
                            else {
                                //admission cancell status
                                $("#nameofiticancelled").html(result.AdmissionCancellationStatus.NameofITIAdmittedInAndCancelledAdmission);
                                $("#nameoftradecancelled").val(result.AdmissionCancellationStatus.NameofTradeAdmittedInAndCancelledAdmission);
                                $("#dateofadmissioncancelled").val(result.AdmissionCancellationStatus.DateofAdmissionCancellation);

                            }




                            //document.querySelector('#myNavigator').pushPage('html/splitter.html');
                        } else {
                            div.style.display = 'none';
                            navigator.notification.alert("Merit Number is applicable only for the candidate with confirmed Application. Candidate has not confirmed his/her application.");
                        }
                    }
                    , 400: function (response) {
                        hideSpinner();
                        // console.log(e);
                        navigator.notification.alert("Registration or Password Wrong");
                    }
                    , 0: function (response) {
                        hideSpinner();
                        navigator.notification.alert('Check your Internet Connectivity');
                    }
                }
            });
        }

    }

};