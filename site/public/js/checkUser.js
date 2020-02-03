function checkUser(id, s){
    var check;
    if (id != 0) {
        if (s == 1) {
            check = "Administrative User";
            console.log(check);
            document.getElementById("profile").innerHTML = check;
            return;
        }
        check = "User";
        console.log(check);
        document.getElementById("profile").innerHTML = check;
        return;
    }
    check = "No Profile";
    console.log(check);
    document.getElementById("profile").innerHTML = check;
    return;
}