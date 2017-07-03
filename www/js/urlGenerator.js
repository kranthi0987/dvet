function urllogin(username, password) {
    return SERVER_URL_HEAD + "/login/?assessorId=" + username + "&password=" + password + "&deviceuuid=" + device.uuid;
}
