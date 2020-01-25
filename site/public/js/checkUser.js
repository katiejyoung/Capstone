function checkUser(id, s){
    var check;
    if (id != NULL) {
        if (s = 1) {
            check = "Administrative User"
            document.getElementById("profile").innerHTML = check;
            return;
        }
        check = "User"
        document.getElementById("profile").innerHTML = check;
        return;
    }
    check = "No Profile"
    document.getElementById("profile").innerHTML = check;
    return;
}