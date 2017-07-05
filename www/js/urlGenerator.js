function urllogin(username, password) {
    return SERVER_URL_HEAD + "/api/AppApplication/AdmissionStatus?RegistrationNo=" + username + "&Password=" + password;
}
