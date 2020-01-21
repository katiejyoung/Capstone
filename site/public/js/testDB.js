function testDB(){
    $.ajax({
        url: '/test',
        type: 'GET',
        success: function(result){
            console.log("Connected to the DB!!!");
            window.location.reload(true);
        }
    })
};