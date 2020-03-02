async function startAuthentication(uname, pword, email) {
    try {
        try {
            console.log(email);
            await sendEmail(uname, pword, email);
        } catch (ex) {
        }
        } finally {

    }
}

async function sendEmail(user_name, user_pass, user_email) {
    console.log(user_email);

    user_name = aMask([... user_name]);   //Add mask to values to pass
    user_pass = aMask([... user_pass]);
    const result = await $.ajax({
        url: '/2FA',
        data: {user_name: user_name, user_pass: user_pass, user_email: user_email},
        type: 'PUT',
        success: function(result) {
            count = result[0].total;
            if (count == 0) {
            }
            else if (count==1){
                document.getElementById('validate-code').style.display="inline";
                document.getElementById('two-factor-button').style.display="none";
            }
            else {

            }
        }
    });
    return;
}