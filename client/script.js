var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');

$chirpField.on('input', function() {
    var isEmpty = $chirpField.val().length === 0;
    $chirpButton.prop('disabled', isEmpty);
});
$chirpButton.click(postChirp);

function postChirp() {
    var chirp = {
        message: $chirpField.val(),
        user: 'Will',
        //timestamp: new Date().toISOString()
    };
    $.ajax({
        method: 'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success) {
        //successfully POSTed new data to the server
        $chirpField.val('');
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err) {
        //an error occurred
        console.log(err);
    });
}

function getChirps() {
    $.ajax({
        method: 'GET',
        url: '/api/chirps'
    }).then(function(chirps) {
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++) {
            var $chirpDiv = $('<div class="chirp"></div>');
            var $message = $('<p></p>');
            var $user = $('<h4></h4>');
            var $timestamp = $('<h5></h5>');
            // var $deletebtn = $('<button>Delete Chirp</button>');
            var $deletebtn = $('<button id=' + chirps[i].id + '>Delete Chirp</button>');
            
            $message.text(chirps[i].message);
            $user.text(chirps[i].user);
            $timestamp.text(new Date(chirps[i].timestamp).toLocaleString());

            $message.appendTo($chirpDiv);
            $user.appendTo($chirpDiv);
            $timestamp.appendTo($chirpDiv);
            $deletebtn.appendTo($chirpDiv);

            $chirpDiv.appendTo($chirpList);
        }
    }, function(err) {
        console.log(err);
    });
}
getChirps();