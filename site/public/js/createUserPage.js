//Function checks the form for appropriate data
//Async as function uses testUsername which involves an AJAX call and thus must wait for AJAX to finish
async function createAccount() {
    let uName = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let pword = document.getElementById('password').value;
    let allFields = 0;
    var valid;

    //Set default display for password validation messages
    document.getElementById('invalid-password-upper').style.display="none";
    document.getElementById('invalid-password-lower').style.display="none";
    document.getElementById('invalid-password-special').style.display="none";
    document.getElementById('invalid-password-number').style.display="none";
    document.getElementById('invalid-password-length').style.display="none";

    //Send username to testUsername and wait for response
    const res = await testUsername(uName);
    //testUsername saves response on DOM, get value
    var nameCheck = document.getElementById('invalid-username').value;  

    //Check for data presence
    if (uName != '' && email != '' && pword != '') {
        document.getElementById('required-field').style.display="none";
        allFields = 1;
    }
    else {
        document.getElementById('required-field').style.display="inline";
        allFields = 0;
    }

    if (!isValidEmail(email) || ((valid = isValidPassword(pword)) != 0) || allFields === 0 || nameCheck != 0) {
        document.getElementById('createUser').style.display="none";

        //Validate email format
        if (!isValidEmail(email)) {
            if (email == '') {
                document.getElementById('invalid-email').style.display="none";
            }
            else {
                document.getElementById('invalid-email').style.display="inline";
            }
        }
        else {
            document.getElementById('invalid-email').style.display="none";
        }

        //Change the DOM via the returned check values
        if (valid != 0) {
            if (pword != '') {
                if (valid == 1) {
                    document.getElementById('invalid-password-upper').style.display="inline";
                }
                else if (valid == 2) {
                    document.getElementById('invalid-password-lower').style.display="inline";
                }
                else if (valid == 3) {
                    document.getElementById('invalid-password-special').style.display="inline";
                }
                else if (valid == 4) {
                    document.getElementById('invalid-password-number').style.display="inline";
                }
                else if (valid == 5) {
                    document.getElementById('invalid-password-length').style.display="inline";
                }
            }
        }
    }
    else {
        document.getElementById('invalid-email').style.display="none";
        document.getElementById('createUser').style.display="inline";
    }
};

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
    