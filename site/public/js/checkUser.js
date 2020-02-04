function checkUser(id, s){
    var check;
    if (id != 0) {
        if (s == 1) {
            check = "Administrative User";
            console.log(check);
            document.getElementById("banner").innerHTML = check;
            return;
        }
        check = "Welcome, "+id;
        console.log(check);
        document.getElementById("banner").innerHTML = check;
        return;
    }
    check = "No Profile";
    console.log(check);
    document.getElementById("banner").innerHTML = check;
    return;
}