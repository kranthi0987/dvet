/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/
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
        $("#check").click(function () {
            document.querySelector('#myNavigator').pushPage('html/statuspage.html');
        });
    },
    //////////////////////////
    // status Controller //
    //////////////////////////
    statuspage: function (page) {
        $(".ion-ios-close-empty").click(function () {
            document.querySelector('#myNavigator').popPage();
        });
    }

};