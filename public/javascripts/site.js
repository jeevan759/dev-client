$(document).ready(function(){
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
var onSignIn = function(loggedIn){
    if(loggedIn){
        console.log("Logged In");
        $("#signedIn").show();
        $("#notSignedIn").hide();
        $("#welcomeUser").html("Welcome "+ userObject.getCurrentUserName());
    }
    else{
        console.log("Not Logged In");
        $("#notSignedIn").show();
        $("#signedIn").hide();
    }
}
$("#notSignedIn").show();
$("#signedIn").hide();
$("#lnkLogout").click(function(){


    userObject.removeCurrentUser();
    onSignIn(false);
})
$("#btnLogin").on('click', function(e){
    e.preventDefault();
    e.stopPropagation(); 
    var userObj = {username: '', password:''};
    userObj.username = $("#txtUsername").val();
    userObj.password = $("#txtPassword").val();
    console.log(userObj);
    $.post( "/api/login", userObj)
    .done(function( data ) {

        console.log(JSON.stringify(data));
        
        if(data.success){
            toastr.success(data.message, 'Successful');
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