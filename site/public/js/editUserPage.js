//Function sends AJAX PUT to its own URL with changes to user profile
    //!! There are currently no checks for the new password !!
function updateUser(user_name, user_password, user_email)
{
    $.ajax({
        url: '/editUser/' + user_name+'&'+user_password,
        data: {user_password: user_password, user_email: user_email},
        type: 'PUT',
        success: function(result) {
            location.href = "/editUser/" + user_name + '&' + user_password;
        }
    })
}