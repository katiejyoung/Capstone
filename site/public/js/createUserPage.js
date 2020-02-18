//Function checks the form for appropriate data
        //Async as function uses testUsername which involves an AJAX call and thus must wait for AJAX to finish
async function createAccount() {
    let uName = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let pword = document.getElementById('password').value;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var valid;

    //Check for data presence
    if (uName != '' && email != '' && pword != '') {
        document.getElementById('required-field').style.display="none";
    }
    else {
        document.getElementById('required-field').style.display="inline";
    }

    //Validate email format
    if (!email.match(mailformat)) {
        document.getElementById('invalid-email').style.display="inline";
    }
    else {
        document.getElementById('invalid-email').style.display="none";
    }

    //Send password to another function to validate
    valid = isValidPassword(pword);
    //Send username to testUsername and wait for response
    const res = await testUsername(uName);
    //testUsername saves response on DOM, get value
    var nameCheck = document.getElementById('invalid-username').value;

    //Change the DOM via the returned check values
    if (valid != 0 || nameCheck != 0) {
        if (valid == 1) {
            document.getElementById('invalid-password-upper').style.display="inline";
            document.getElementById('invalid-password-lower').style.display="none";
            document.getElementById('invalid-password-special').style.display="none";
            document.getElementById('invalid-password-number').style.display="none";
            document.getElementById('invalid-password-length').style.display="none";
            document.getElementById('createUser').style.display="none";
        }
        else if (valid == 2) {
            document.getElementById('invalid-password-upper').style.display="none";
            document.getElementById('invalid-password-lower').style.display="inline";
            document.getElementById('invalid-password-special').style.display="none";
            document.getElementById('invalid-password-number').style.display="none";
            document.getElementById('invalid-password-length').style.display="none";
            document.getElementById('createUser').style.display="none";
        }
        else if (valid == 3) {
            document.getElementById('invalid-password-upper').style.display="none";
            document.getElementById('invalid-password-lower').style.display="none";
            document.getElementById('invalid-password-special').style.display="inline";
            document.getElementById('invalid-password-number').style.display="none";
            document.getElementById('invalid-password-length').style.display="none";
            document.getElementById('createUser').style.display="none";
        }
        else if (valid == 4) {
            document.getElementById('invalid-password-upper').style.display="none";
            document.getElementById('invalid-password-lower').style.display="none";
            document.getElementById('invalid-password-special').style.display="none";
            document.getElementById('invalid-password-number').style.display="inline";
            document.getElementById('invalid-password-length').style.display="none";
            document.getElementById('createUser').style.display="none";
        }
        else if (valid == 5) {
            document.getElementById('invalid-password-upper').style.display="none";
            document.getElementById('invalid-password-lower').style.display="none";
            document.getElementById('invalid-password-special').style.display="none";
            document.getElementById('invalid-password-number').style.display="none";
            document.getElementById('invalid-password-length').style.display="inline";
            document.getElementById('createUser').style.display="none";
        }
    }
    else {
        document.getElementById('invalid-password-upper').style.display="none";
        document.getElementById('invalid-password-lower').style.display="none";
        document.getElementById('invalid-password-special').style.display="none";
        document.getElementById('invalid-password-number').style.display="none";
        document.getElementById('invalid-password-length').style.display="none";
        document.getElementById('createUser').style.display="inline";
    }
};

//Function takes a passed password and checks for predetermined criteria 
    //Function returns an int which corresponds to a check potentially failed
function isValidPassword(password) {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var specialCharacters = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    var numbers = /[0-9]/g;
    var i;
    var str;

    //Password must have at least one uppercase letter
    i = 0;
    while (i < password.length) {
        if (password[i].match(upperCaseLetters)) {
            break;
        }
        else if (i == (password.length - 1)) {
            return 1;
        }
        i++;
    }
    //Password must have at least one lowercase letter
    i = 0;
    while (i < password.length) {
        if (password[i].match(lowerCaseLetters)) {
            break;
        }
        else if (i == (password.length - 1)) {
            return 2;
        }
        i++;
    }
    //Password must have at least one special char
    //COMMENTED OUT UNTIL CHAR CAUSING SQL ERRORS ARE FOUND
    /*
    i = 0;
    while (i < password.length) {
        if (password[i].match(specialCharacters)) {
            break;
        }
        else if (i == (password.length - 1)) {
            return 3;
        }
        i++;
    }
    */
    //Password must have at least one number
    i = 0;
    while (i < password.length) {
        if (password[i].match(numbers)) {
            break;
        }
        else if (i == (password.length - 1)) {
            return 4;
        }
        i++;
    }
    //Password must be between 12 and 30 characters long
    if ((password.length < 12) || (password.length > 30)) {
        return 5;
    }
    return 0;
    
}

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
    