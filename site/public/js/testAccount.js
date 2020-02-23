    //Function sends AJAX PUT message to own URL 
        //Count refers to the presence of the username and password combo, 1 = present
        //If the username and password match a user, load the user page with credentials
function testAccount(user_name,user_pass){
    $.ajax({
        url: '/',
        data: {user_name: user_name, user_pass: user_pass},
        type: 'PUT',
        success: function(result) {
            count = result[0].total;
            if (count == 0) {

            }
            else if (count==1){
                window.location.href = '/user/'+user_name+'&'+user_pass;
            }
            else {
            }
        }
    })
}