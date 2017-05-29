// CONSTANTS
//sanjay time
// var date1= new date();
// getDBDate(d;
// var CERTURL="https://c20uatweb100.saas.talismaonline.com/CandidateVerificationWebAPI";
var CERTURL = "http://apisdk.nsdcindia.org/QRCode";
function showSpinner() {
    $("#loadingSpinner").show()
}

function hideSpinner() {
    $("#loadingSpinner").hide()
}
function scan() {
    console.log("inside");
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (!result.cancelled) {
                if (result.format != "QR_CODE") {
                } else {
                    console.log(result);
                    localStorage.setItem['token'];
                    console.log(result.text);
                    var normal = result.text;
                    var token = normal.split(";");
                    console.log(token);
                    console.log(token[1]);
                    showSpinner();
                    $.ajax({
                        url: CERTURL + "/Candidate/GetToken?CandCertificateNumber=" + token[1]//Enrollid, Certifacateno)
                        , type: 'GET'
                        , traditional: true
                        , timeout: 10000
                        , headers: {}
                        , statusCode: {
                            200: function (result) {
                                hideSpinner();
                                // alert(result);
                                console.log(result);
                                // localStorage['token'] = result;
                                // var keytoken = localStorage.getItem('token');
                                var keytoken = result;
                                // console.log("keytoken:", localStorage.getItem('token'));
                                var key = CryptoJS.enc.Utf8.parse(keytoken);
                                var iv = CryptoJS.enc.Utf8.parse('7061737323313233');
                                var value1 = token[0];
                                try {
                                    var decrypted = CryptoJS.AES.decrypt(value1, key, {
                                        keySize: 128 / 8,
                                        iv: iv,
                                        mode: CryptoJS.mode.CBC,
                                        padding: CryptoJS.pad.Pkcs7
                                    });
                                    var value = decrypted.toString(CryptoJS.enc.Utf8);
                                    console.log('data:', value);
                                } catch (ex) {
                                    navigator.notification.alert("Key is not matched", alertDismissed);
                                    function alertDismissed() {
                                        scan();
                                    }
                                }
                                console.log(value);
                                var s1 = value.split("^:");
                                console.log(s1[1]);
                                var s2 = value.split(",");
                                console.log('data with split:', s2);
                                var name = s2[0].slice(0);
                                var sector = s2[1].slice(2);
                                var qp = s2[2].slice(2);
                                var job = s2[3].slice(2);
                                var nsqf = s2[4].slice(2);
                                var grade = s2[5].slice(2);
                                var date1 = s2[6].slice(2);
                                var date = date1.concat(s2[7]);
                                console.log(name);
                                console.log(sector);
                                console.log(qp);
                                console.log(job);
                                console.log(nsqf);
                                console.log(grade);
                                console.log(date);
                                var Certifacateno1 = s1[1];
                                console.log(Certifacateno1);
                                showSpinner();
                                $.ajax({
                                    url: CERTURL + "/Candidate/CandidateDetails?CandCertificateNumber=" + Certifacateno1//Enrollid, Certifacateno)
                                    , type: 'GET'
                                    , traditional: true
                                    , timeout: 10000
                                    , headers: {}
                                    , statusCode: {
                                        200: function (result) {
                                            hideSpinner();
                                            console.log("data from server:", result);
                                            var resultname = result.Salutation + " " + result.CandidateName;
                                            var resultnameup = resultname.toUpperCase();
                                            var nameup = name.toUpperCase();
                                            if (result.Grade === grade && result.SectorName === sector && resultnameup === nameup && result.JobRole.toUpperCase() === job.toUpperCase() && result.NSQF.toUpperCase() === nsqf.toUpperCase()) {
                                                //  navigator.notification.alert("Certificate Found");
                                                document.querySelector('#myNavigator').pushPage('html/Certificate.html', {
                                                    data: result
                                                });

                                            } else {
                                                navigator.notification.alert("Candidate details are not available for the QR Code that you have scanned. If there is PB secure link below the QR Code in the certificate then you might have to use the same to verify the certificate.", alertDismissed);
                                                function alertDismissed() {
                                                    scan();
                                                }
                                            }

                                        }

                                        , 0: function (response) {
                                            navigator.notification.alert('connection problem. check your connectivity', alertDismissed);
                                            function alertDismissed() {
                                                scan();
                                            }
                                        }
                                    }
                                });
                            }
                            , 0: function (response) {
                                navigator.notification.alert('connection problem check your connectivity', alertDismissed);
                                function alertDismissed() {
                                    scan();
                                }
                            }
                        }
                    });


                }
            }
        },
        function (error) {
            // navigator.notification.alert("Scanning failed: " + error);
            navigator.notification.alert("INVALID DATA FORMAT");
            scan();
            console.log(error);
        }
    );

}
/**
 * Created by Sanjay on 1/31/2017.
 */

