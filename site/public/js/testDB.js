function testDB(){
    $.ajax({
        url: '/test',
        type: 'GET',
        success: function(result){
            console.log("Successful Ajax call");
            window.location.reload(true);
        }
    })
};