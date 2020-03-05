//Function sends AJAX PUT message to own URL 
        //Count refers to the presence of the username and password combo, 1 = present
        //If the username and password match a user, load the user page with credentials
async function testAccount(user_name,user_pass){
    document.getElementById('invalid-combo').style.display="none";
    user = user_name;
    user_name = aMask([... user_name]);   //Add mask to values to pass
    user_pass = aMask([... user_pass]);
    const result = await $.ajax({
        url: '/',
        data: {user_name: user_name, user_pass: user_pass},
        type: 'PUT',
        success: function(result) {
            count = result[0].total;
            if (count == 0) {
                document.getElementById('invalid-combo').style.display="inline";
            }
            else if (count==1){
                if (user == "Admin") {
                    window.location.href = '/user/'+user_name+'&'+user_pass;
                }
                else {
                    window.location.href = '/2FA/'+user_name+'&'+user_pass;
                }
            }
            else {
            }
        }
    });
    return;
}

//Function gets the username and password via the DOM
    //passes data to the testAccount function
async function startLogin() {
    document.getElementById('login').disabled=true;
    try {
        try {
            let uName = document.getElementById('username').value;
            let pword = document.getElementById('password').value;
            await testAccount(uName, pword);
        } catch (ex) {
        }
        } finally {
        document.getElementById('login').disabled=false;
     }
}
