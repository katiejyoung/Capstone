//Function takes the passed data and adds it to the DOM
//Function displays the record table
function displayRecord(id, name, data, URL) {
    $("#record-id").html(id);
    $("#record-name").html(name);
    $("#record-URL").html(URL);
    $("#record-pass").html(data);

    document.getElementById('record-display').style.display="inline";
    document.getElementById('edit-record').style.display="none";
    document.getElementById('add-record').style.display="none";
    document.getElementById('required-field').style.display="none";
    document.getElementById('update-account').style.display="none";
}

//Functions displays the add record form
function newRecord() {
    document.getElementById('record-display').style.display="none";
    document.getElementById('edit-record').style.display="none";
    document.getElementById('add-record').style.display="inline";
    document.getElementById('required-field').style.display="none";
    document.getElementById('update-account').style.display="none";
}

//Function displays the update account form
function updateAccount() {
    document.getElementById('record-display').style.display="none";
    document.getElementById('edit-record').style.display="none";
    document.getElementById('add-record').style.display="none";
    document.getElementById('required-field').style.display="none";
    document.getElementById('update-account').style.display="inline";
}

//Function takes the passed data and adds it to the DOM
    //Function displays the edit record form
function editRecord(id, name, URL, pass) {
    document.getElementById('record-display').style.display="none";
    document.getElementById('add-record').style.display="none";
    document.getElementById('edit-record').style.display="inline";
    document.getElementById('required-field').style.display="none";
    document.getElementById('update-account').style.display="none";
    
    document.getElementById('edit_record_id').value = id;
    document.getElementById('edit_record_name').value = name;
    document.getElementById('edit_record_URL').value = URL;
    document.getElementById('edit_record_password').value = pass;
}

//Function sends a AJAX DELETE to it's own URL with the record id to be deleted
    //Success reloads the current page, sans record
function deleteRecord(user_name,user_pass, record_id){
    $.ajax({
        url: '/user/' + user_name+'&'+user_pass,
        data: {record_id: record_id},
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
}

//Function sends a AJAX PUT to it's own URL with the record info to be updated
    //Success reloads the current page, with new record info
function updateRecord(user_name,user_pass, record_name, record_password, record_URL, record_id){
    $.ajax({
        url: '/user/' + user_name+'&'+user_pass,
        data: {record_id: record_id, record_name: record_name, record_URL: record_URL, record_password: record_password},
        type: 'PUT',
        success: function(result) {
            window.location.reload(true);
        }
    })
}

function updateUser(user_name, user_password, user_email){
    $.ajax({
        url: '/editUser/' + user_name+'&'+user_password,
        data: {user_password: user_password, user_email: user_email},
        type: 'PUT',
        success: function(result) {
            location.href = "/user/" + user_name + '&' + user_password;
        }
    })
}

function deleteUser(user_name, user_password){
    $.ajax({
        url: '/editUser/' + user_name+'&'+user_password,
        data: {user_password: user_password, user_name: user_name},
        type: 'DELETE',
        success: function(result) {
            location.href = "/user/Admin&password";
        }
    })
}

function deleteQuestion(question_content){
    $.ajax({
        url: '/faq',
        data: {question_content: question_content},
        type: 'DELETE',
        success: function(result) {
            location.href = "/user/Admin&password";
        }
    })
}

function respondQuestion(question_content, response){
    $.ajax({
        url: '/faq',
        data: {question_content: question_content, question_response: response},
        type: 'PUT',
        success: function(result) {
            location.href = "/user/Admin&password";
        }
    })
}

function logOut()
{
    document.location.href="/";
}
        
function displayAdmin(user_name, user_password) {
    if (  user_name == 'Admin' && user_password == 'password' ) {
        document.getElementById('admin-record').style.display="inline";
        document.getElementById('admin_name').style.display="inline";
        document.getElementById('admin_password').style.display="inline";
    }
}