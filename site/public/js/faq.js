//Function sends a AJAX PUT to it's own URL with the record info to be updated
//Success reloads the current page, with new record info
function addQuestion(){
    let comment = document.getElementById('question-content');
    $.ajax({
        url: '/faq',
        data: {comment: comment},
        type: 'POST',
        success: function() {
            location.href = "/faqSent";
        }
    })
}

function displayComment(comment) {
    $("#question-content").html(comment);
}

//<td id="question-content" class="faq-header" onload="displayComment('{{question_content}}')"><strong>{{question_content}}</strong></td><br>