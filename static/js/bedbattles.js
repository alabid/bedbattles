function bedbattles() {
    /*
      * private variables for user here
      */
   var currentUser = "",
       currentUserEmail = "",
      currentUserName = "";
     

  var registerInDatabase =  function(currentU, currentUEmail, currentUName) {
      if (currentU && currentUEmail) {
         var data = {"currentUser": currentU,
		     "currentUserEmail": currentUEmail,
		     "currentUserName": currentUName};
	  
	  $.post("/register/",
		 data,
		 function(data) {
		     console.log("received data: ");
		     console.log(data);
		     if (typeof data != undefined) {
			 switch (data)  {
			 case "success":
			     break;
			 case "failure":
			     break;
			 case "duplicate":
			     break;
			 }		      
		     }
		     reloadPageDetails();
		 }
	  );
       }
  };
     
     
/*
* Reloads the page using ajax.
* loads the new facebook user's name and other stuff
*  if the user is logged in.
*/
var reloadPageDetails = function() {
     // first reload the header by checking if the user is logged in
      

      // then reload other parts of the page too.

}; 

/*
 * loads in facebook authentication details
 */
function fb_loads() {
    window.fbAsyncInit = function() {
	
	FB.init({ appId: '480811538600121',
		  status: true, 
		  cookie: true,
		  xfbml: true,
		  oauth: true});
    
    // facebook updateButton function
	function updateButton(response) {
	    var loginStatus = $("#login-status").html("");
	    var statusLink = $("<a/>"); // status link is a new link

	    console.log("in updateButton");

	    if (response.authResponse) {
		FB.api("/me", function(response) {
			   currentUser = response.username || "none";
			   currentUserEmail = response.email;
			   currentUserName = response.name;
			   console.log("response received: ");
			   
			   console.log(response);
			   
			   registerInDatabase(currentUser, currentUserEmail, currentUserName);
			   
			   reloadPageDetails();
			   
			   statusLink.html("Logout").attr("href", "javascript:void(0)");
			   
			   loginStatus.html($("<span/>").attr("class", "welcome-message")
					    .html("Welcome, " + response.name + " "))
			       .append(statusLink);
			   
			   statusLink.click(function() {
						FB.logout(function(response) {
							      currentUser = "";
							      currentUserEmail = "";
							      
							      // reload page details here
							      reloadPageDetails();
							      
							      updateButton(response);
							  });
					    });
		       });
	    } else {
		currentUser = "";
		currentUserEmail = "";
		
		statusLink.html("Login With Facebook")
	            .attr("href", "javascript:void(0)")
	            .attr("class", "login-button");
		
		statusLink.click(function() {
				     FB.login(function(response) {
	  					  if (response.authResponse) {
	  	      				      currentUser = response.username || "none";
	  	      				      currentUserEmail = response.email;
	  	      				      currentUserName = response.name;
	  	      				      
	  	      				      registerInDatabase(currentUser,
									 currentUserEmail,
									 currentUserName);
	  	      				      
						      // reload page details here
						      reloadPageDetails();
	  	      				      
						      updateButton(response);
						  } else {
						      
			   			      // user canceled login
						      // or didn't grant authorization
						      // don't have to do anything specific here
						      // just reload the page again
						      reloadPageDetails();
						  }
					      }, {scope:'email, read_friendlists'});
				     return false;  
				 });
		loginStatus.html(statusLink);
	    }
	}
	// run once with current status and whenever the staus changes
	FB.getLoginStatus(updateButton);
	FB.Event.subscribe('auth.statusChange', updateButton);
    };
    
    (function() {
	 var e = document.createElement("script"); e.async = true;
	 e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
	 document.getElementById('fb-root').appendChild(e);
     }());
} // end of fb_loads function



this.run = function() {
    $(document).ready(function() {
			  fb_loads();

			  // testing facebok sharing
			  facebookShare("this is some sample text for the hackathon hacknjill");			  
		      });

};

    /*
     * public functions here
     */
    
    function facebookShare(walltext) {
	var fbuidata = {
	    method: "feed",
	    name: "Sleepy sleepy wakeee wakeeeee",
	    link: "http://freezing-day-7773.herokuapp.com/register/",
	    picture: "/static/img/sleepy.jpg",
	    caption: "I'm challging whoever to bed battle at 9:05am " + walltext, // fill in this later
	    description: "Check out my challenge on bed battle",
	    properties: { "Name": currentUserName},
	    actions: {name: "Add me to challenge", link: "http://freezing-day-773.herokuapp.com/register/"}
	};
	
	FB.ui(fbuidata, function(e) {
		  if (e && e.post_id) {
		      console.log("post was published");
		  } else {
		      console.log("post wasn't published");
		  }
	      });    
	
	return false;
    }    
}

window["bed_battles"] = new bedbattles();

bed_battles.run(); // main method entry to application