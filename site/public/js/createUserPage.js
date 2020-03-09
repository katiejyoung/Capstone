//Function checks the form for appropriate data
        //Async as function uses testUsername which involves an AJAX call and thus must wait for AJAX to finish
async function createAccount() {
    let uName = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let pword = document.getElementById('password').value;

    //Send username to testUsername and wait for response
    const res = await testUsername(uName);
    //testUsername saves response on DOM, get value
    var nameCheck = document.getElementById('invalid-username').value;

    //Check for data presence
    if (uName == '' || email == '' || pword == '') {
        document.getElementById('required-field').style.display="inline";
        document.getElementById('button').style.display="inline";
    }
    else if (nameCheck != 1) {
        document.getElementById('createUser').style.display="inline";
        document.getElementById('button').style.display="none";
    }
    else {
        document.getElementById('required-field').style.display="none";
        document.getElementById('createUser').style.display="none";
        document.getElementById('button').style.display="inline";
        document.getElementById('invalid-username').style.display="inline";
    }

};

//Function sends a PUT message to its own URL with the username to check in the db
    //returned value refers to the presence of the username in the db, 1 = present
    //function calls testCount to apply results
    function testUsername(username) {
    return $.ajax({
        url: '/createUser',
        data: {username: username},
        type: 'PUT',
        success: function(result) {
            testCount(result[0].total);
        }
    })
}

//Function takes in the passed count and changes the DOM accordingly
    //count is also stored by value in the DOM to later be used in the createAccout function
function testCount(count) {
    if (count == 0) {
        document.getElementById('invalid-username').style.display="none";
        document.getElementById('invalid-username').value=0;
    }
    else if (count==1){
        document.getElementById('invalid-username').style.display="inline";
        document.getElementById('invalid-username').value=1;
    }
    else {
    }
}
    