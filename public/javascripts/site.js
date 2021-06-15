/*var onSignIn = function(loggedIn){
    if(loggedIn){
        console.log("Logged In");
        $("#signedIn").show();
        $("#notSignedIn").hide();
       // $("#welcomeUser").html("Welcome "+ userObject.getCurrentUser());
    }
    else{
        console.log("Not Logged In");
        $("#notSignedIn").show();
        $("#signedIn").hide();
    }
}*/
$("#lnkSignout").on('click',function(){
    $.post( "/api/logout")
    .done(function( data ) {
        //signOut();
        //console.log("signed out");
        //onSignIn(false);
        if(data.success==false){
            $("#notSignedIn").show();
            $("#signedIn").hide();
            signOut();
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
})
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  function getPayload(){
    $.post( "/loggedin")
    .done(function( data ) {
        //signOut();
        //console.log("signed out");
        //onSignIn(false);
        //console.log(data);
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
  }
function onSignIn(googleUser) {
    //console.log("signin");
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
        xhr.open('POST', '/loggedin');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            //console.log(payload);
        console.log('Signed in as: ' + xhr.responseText);
        //console.log(xhr.responseText.given_name);
        if(xhr.responseText=='success'){
            //signOut();
            //getPayload();
            //$("#notSignedIn").show();
            $("#signedIn").show();
        $("#notSignedIn").hide();
        $("#lnkLogout").hide();
        $("#lnkSignout").show();
            //onSignIn(true);
        }
        };
        xhr.send(JSON.stringify({token: id_token}));
}
$(document).ready(function(){
    var onSignIn = function(loggedIn){
        if(loggedIn){
            console.log("Logged In");
            $("#signedIn").show();
            $("#notSignedIn").hide();
           // $("#welcomeUser").html("Welcome "+ userObject.getCurrentUser());
        }
        else{
            console.log("Not Logged In");
            $("#notSignedIn").show();
            $("#signedIn").hide();
        }
    }
    var userObject = {
        saveUserInLocalStorage : function(userJson){
            window.localStorage.setItem('currentUser', JSON.stringify(userJson));
        },
        removeCurrentUser: function(){
            window.localStorage.removeItem('currentUser');
        },
        getCurrentUser : function(){
            return window.localStorage.getItem('currentUser');
        },
        getCurrentUserName : function(){
            var curUserString = this.getCurrentUser();
            if(curUserString){
                var json = JSON.parse(curUserString);
                if(json && json.username)
                    return json.username;
                return "";
            }
            return "";
        },
        isUserLoggedIn : function(){
            if(this.getCurrentUser()==null)
                return false;
            return true;
        }
    };

    console.log("jquery running");
$("#notSignedIn").show();
$("#signedIn").hide();
$("#lnkLogout").click(function(){
    $.post( "/api/loggedout")
    .done(function( data ) {

        //console.log(JSON.stringify(data));
        console.log("signed out");
        onSignIn(false);
        if(data.success){
            userObject.removeCurrentUser();
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });

})
$("#btnLogin").on('click', function(e){
    e.preventDefault();
    e.stopPropagation(); 
    $("#lnkLogout").show();
    $("#lnkSignout").hide();
    var userObj = {username: '', password:''};
    userObj.username = $("#txtUsername").val();
    userObj.password = $("#txtPassword").val();
    console.log(userObj);
    $.post( "/api/login", userObj)
    .done(function( data ) {

        console.log(JSON.stringify(data));
        
        if(data.success){
            toastr.success(data.message, 'Successful');
            $("#welcomeUser").html("Welcome "+ JSON.stringify(data.user.username));
            userObject.saveUserInLocalStorage(data.user);
            onSignIn(true);
        }
        else{
            toastr.error(data.message, 'Failed');
        }
    })
    .fail(function() {
        //alert( "error" );
    })
    .always(function() {
        //alert( "finished" );
    });
})
})