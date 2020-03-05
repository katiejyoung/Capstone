async function startAuthentication(uname, pword, email) {
    try {
        try {
            await sendEmail(uname, pword, email);
        } catch (ex) {
        }
        } finally {

    }
}

async function sendEmail(user_name, user_pass, user_email) {
    user_name = aMask([... user_name]);   //Add mask to values to pass
    user_pass = aMask([... user_pass]);
    const result = await $.ajax({
        url: '/2FA',
        data: {user_name: user_name, user_pass: user_pass, user_email: user_email},
        type: 'PUT',
        success: function(result) {
            var returnedPin = result;
            $('#otp-value').text(returnedPin);
            document.getElementById('validate-code').style.display="inline";
            document.getElementById('invalid-otp').style.display="none";
            document.getElementById('two-factor-button').style.display="none";
            localStorage.setItem('otp', returnedPin);
        }
    });
    return;
}

function compareOTP(user_name, user_pass) {
    user_name = aMask([... user_name]);   //Add mask to values to pass
    user_pass = aMask([... user_pass]);
    let localOTP = document.getElementById('OTP').value;
    let generatedOTP = localStorage.getItem('otp');
    
    if (localOTP == generatedOTP) {
        window.location.href = '/user/'+user_name+'&'+user_pass;
    }
    else {
        document.getElementById('validate-code').style.display="none";
        document.getElementById('two-factor-button').style.display="inline";
        document.getElementById('invalid-otp').style.display="inline";
    }
}