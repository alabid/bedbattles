
/*
 * 
 * Some meta-stuff on facebook registration and on
 * facebook and twitter sharing of posts and other stuff.
 */

/*
 * registerInDatabase registers the currently loggedin user if
 * he hasn't been already registered.
 * 
 * mapping:
 * currentUser -> currentUsers
 * currentUserEmail -> currentUsersEmail
 * currentUserName -> currentUsersName
 * 
 * mapping is just to prevent confusion in the making of the dataToSend
 * object.
 * 
 */

function registerInDatabase(currentUsers, currentUsersEmail, currentUsersName) {
	if (currentUsers && currentUsersEmail) {
		
		var dataToSend = {
			"currentUser" : currentUsers,
			"currentUserEmail" : currentUsersEmail,
			"currentUserName" : currentUsersName
		};
		
		// now make an ajax call to the registrar
		$.post("http://freezing-day-7773.herokuapp.com/register_facebook_user.py", dataToSend , function (data) {
				if (typeof data != "undefined") {
									
					switch (data)
					{
					    case "created": 
					      console.log("Successfully created");
					      break;
					    case "error":
					      console.log("An error occured");
					      break;
					}
				}
			});
	    
	         // reload page but now without the login with 
	        // facebook stuff and now with enough
	        // details
		
	}
	else {
	    log("dude, something went wrong!");
	}
}


function fb_loads() {
	window.fbAsyncInit = function() {
		// real app id here 
  FB.init({ appId: '480811538600121',
	    status: true, 
	    cookie: true,
	    xfbml: true,
	    oauth: true});


	    function updateButton(response) {
		// change login status here
		/*
		var loginStatus = $("#login-status").html("");
		var statusLink = $("<a />");
		 */

		if (response.authResponse) {

      		    FB.api('/me', function(response) {    		
      			       currentUser = response.username || "none";
      			       currentUserEmail = response.email;
      			       currentUserName = response.name;
      		
      			       registerInDatabase(currentUser, currentUserEmail, currentUserName);
      			       // reload page here
      			       // $("div.VideosAccordion").loadPlaylist();
      		
      		statusLink.html("Logout").attr("href", "#")
      							 .attr("class", "logout-link");
      		loginStatus.html($("<span/>").attr("class", "welcome-message")
    										.html("Welcome, " + response.name))					
.append(statusLink);							
      	    statusLink.click(function () {
      		  FB.logout(function(response) {
      		  	currentUser = "";
      		  	currentUserEmail = "";
      		  	$("div.VideosAccordion").loadPlaylist();
				updateButton(response);
				//loginStatus.html(statusButton);		
			  });
      	   });
      	});
    } else {
    	currentUser = "";
    	currentUserEmail = "";

	// load stuff here

    	// $("div.VideosAccordion").loadPlaylist();
      //user is not connected to your app or logged out
        statusLink.html("Login With Facebook")
        			.attr("href", "#")
        			.attr("class", "login-button");
        statusLink.click(function () {
        	FB.login(function(response) {
	  	      if (response.authResponse) {
	  	      	 currentUser = response.username || "none";
	  	      	 currentUserEmail = response.email;
	  	      	 currentUserName = response.name;
	  	      	 
	  	      	 registerInDatabase(currentUser, currentUserEmail, currentUserName);
	  	      	 
	  	      	 $("div.VideosAccordion").loadPlaylist();
	  	      	 
                 updateButton(response);
      			 //loginStatus.append($("<span/>").attr("class", "welcome-message")
    				//							.html("Welcome, " + response.name))	
			   } else {
			   			  	// user canceled login or did not grant authorization
			   }
			}, {scope:'email'});
			return false;
		});
       loginStatus.html(statusLink);
  	 }
  }
  // run once with current status and whenever the status change
  FB.getLoginStatus(updateButton);
  FB.Event.subscribe('auth.statusChange', updateButton);	
};
	
(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol 
    + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
	
}



/*
 * 
 * facebook share
 * 
 */

function facebookShare(tr, isPlaylist) {

	var videoName = tr.find(".video-title").text();
	var videoImage = tr.find(".video-thumb img").attr("src");
	var videoCat = tr.find(".video-category").text(); 
	var playlistName = $(".active").attr("title");
	
	FB.ui({
        method:"feed",
        name: videoName,
        link:"http://vidmuster.com/videos/"+ encodeURIComponent(videoName) ,
        picture: videoImage, // change this unknown to your own thing
        caption:"I'm sharing a video in my Vidmuster Playlist, " + playlistName.toTitleCase(),
        description: "Check out this Video at Vidmuster",
        properties:{
        	"Playlist Name": playlistName,
        	"Category" : videoCat
        },
        actions:{name:"Create new playlist",link:"http://vidmuster.com/"}}, function(e){
                                                                            if(e && e.post_id){
                                                                                console.log("Post was published.");
                                                                            }
                                                                            else{
                                                                                console.log("Post was not published.");
                                                                                }
                                                                          }
    );
    
    $("div.share-drop-down").remove();
    return false;
}



/*
 * 
 * Twitter share
 */


function twitterShare(tr, isPlaylist) {
    /*
     * 
     * get all the information from everywhere that you want to post.
     */
	var videoName = tr.find(".video-title").text();
	var videoImage = tr.find(".video-thumb img").attr("src");
	var videoCat = tr.find(".video-category").text(); 
	var videoUrl = "http://vidmuster.com/videos/" + encodeURIComponent(videoName);
	
    /*
     * encode the message here.
     */
	var b = encodeURIComponent("#NowPlaying I'm listening to "+ videoName + "at ") + videoUrl;
    var a="http://twitter.com/share?url=" + videoUrl +
    		   "&text="+b+"&via=vidmusterDOTcom";
    
    showPop(a,"Vidmuster Share on Twitter");
	// $("div.share-drop-down").remove();
	return false;
}

/*
 * 
 * Google buzz if we want.
 */

function buzzShare(tr, isPlaylist) {
	var videoName = tr.find(".video-title").text();
	var videoImage = tr.find(".video-thumb img").attr("src");
	var videoCat = tr.find(".video-category").text(); 
	// put code logic here
	var a="http://www.google.com/buzz/post?url=http://vidmuster.com/videos/"+
	 	encodeURIComponent(videoName);
    showPop(a,"Vidmuster Share on Buzz",700, 420);
	
	$("div.share-drop-down").remove(); 
	return false;
}


/*
 * helper function to show pop up window
 */

function showPop(url, nameAssoc, awidth, aheight) {    
    var d = nameAssoc || "Helper Window";
    var height = aheight || 450;
    var width = awidth || 550;

    var h = window.open(url, d, "height=" + height + ", width=" + width);
    if (window.focus) {
      h.focus();	
    }
}


/*
 * BedBattles:
 * App ID: 	480811538600121
 * App Secret:    	e21f41d7507ce843b8150ef73ce53df6
 */

/*
 * TODO: remember to put this into the html file of the home page or the
 * page where you will be logging into facebook.
 * <body>
 * <div id="fb-root"></div>
 * 
 * // remember to put it immediately after the "body" tag
 */