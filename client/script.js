var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');
var $userSelector = $('#user-selector');

$chirpField.on('input', function() {
    var isEmpty = $chirpField.val().length === 0;
    $chirpButton.prop('disabled', isEmpty);
});
$chirpButton.click(postChirp);

function postChirp() {
    var chirp = {
        message: $chirpField.val(),
        userId: $userSelector.val(),
        //time is added in MySQL using DEFAULT NOW()
        //no need to insert a timestamp
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
            addChirpDiv(chirps[i]);
        }
    }, function(err) {
        console.log(err);
    });
}

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE',
        url: '/api/chirps/' + id
    }).then(function() {
        getChirps();
    }, function(err) {
        console.log(err);
    });
}

function populateUsers() {
    $.ajax({
        method: 'GET',
        url: '/api/users'
    }).then(function(users) {
        for (var i = 0; i < users.length; i++) {
            var $userOption = $('<option value="' + users[i].id + '">' + users[i].name + '</option>');
            $userSelector.append($userOption);
        }
    }, function(err) {
        console.log(err);
    });
}

function addChirpDiv(chirp) {
    var $chirpDiv = $('<div class="chirp"></div>');
    var $message = $('<p></p>');
    var $user = $('<h4></h4>');
    var $timestamp = $('<h5></h5>');
    var $deletebtn = $('<button class="delete-button">Delete Chirp</button>');
    
    $deletebtn.click(function() {
        deleteChirp(chirp.id);
    });

    $message.text(chirp.message);
    $user.text(chirp.userName);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());

    $message.appendTo($chirpDiv);
    $user.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $deletebtn.appendTo($chirpDiv);

    $chirpDiv.appendTo($chirpList);
}

populateUsers();
getChirps();