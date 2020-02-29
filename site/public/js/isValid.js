
//Function takes a passed password and checks for predetermined criteria 
//Function returns an int which corresponds to a check potentially failed
function isValidPassword(password) {
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
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
    //Password must have only alpha-numeric characters
    i = 0;
    while (i < password.length) {
        if (!password[i].match(lowerCaseLetters) && !password[i].match(upperCaseLetters) && !password[i].match(numbers)) {
            return 3;
        }
        i++;
    }
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

//Function takes a passed email and checks for predetermined criteria 
//Function returns an int indicating true/false
function isValidEmail(email) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    //Validate email format
    if (!email.match(mailformat)) {
        return 0;
    }
    else {
        return 1;
    }
}

//Function sends a PUT message to its own URL with the username to check in the db
//returned value refers to the presence of the username in the db, 1 = present
//function calls testCount to apply results
async function testUsername(username) {
    username = aMask([... username]);
    return $.ajax({
        url: '/createUser',
        data: {user_name: username},
        type: 'PUT',
        success: function(result) {
            testCount(result[0].total);
        }
    })
}