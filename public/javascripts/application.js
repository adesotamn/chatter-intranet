// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// Every jQuery function you want to run at render time must be inside the jQuery call
jQuery(function() {

    // text areas should auto-expand
	$('textarea#post-text-area').TextAreaExpander(60, 1300);


   // submit form to qas#show when engine picker is changed
    $('select#engine_id').change( function() {
      $('form#engine_picker').submit();
    });


   // run search when search button clicked
    $('button#search-button').click( function() {
	  var text = $('input#search-field').val();
	  runSearch( text );
    });


   // run search when hastag topic clicked
   $('.hashtag').click( function(event) {
	
	  runSearch( $(this).html() );
    });


   // run search when return key is hit and focus is on the search bar
	$('#search-field').keydown(function(event) {
	  if (event.keyCode == '13') {  // user hit the return key
		 var text = $('input#search-field').val();
	     runSearch( text );
	   }
	});
	
	
	// User clicks login button and we drop a cookie identifying them
    // as "Demo User".  Not a real login, just gives current user the
    // ability to use the app as a real salesforce user even though they
    // don't have a login to the org.  User now can use the app and api
    // as "Demo User"
    $('#login').click( function() {
	  alert("Since you're not really a user in this Salesforce org, we're going to make you a user called Demo User.  If this was a real intranet app, you'd probably already be logged in via SSO.");
	  $.cookie("logged_in", "true");
	  $('#publisher').show();
	  $( "#login" ).callout("hide");
	  $('#login').replaceWith("<div class='span-3' style='font-weight: 600'>Demo User</div>");
	  showCallouts();
    });


    // display publisher if user is logged in (cooke is present)
    // and also show the user name instead of login button
    if ($.cookie('logged_in') == "true") {
	  $('#publisher').show();
	  $('#login').replaceWith("<div class='span-3' style='font-weight: 600'>Demo User</div>");
	}

  
    // show modal box with list of HR Benefits group members
    // when user clicks the team link.
    $('#hr-group-members').click( function() {
	  // get the list of team members
	  $.get("qas/team", function(data) { // put request thru server so we don't expose token
		// display modal box with member list	
		showMembers(data);
	  });	
    });
    

    //hashtab based searches
	$('.hashsearch').click(function(event) {
	     runSearch(this.id);
	});


 	// Styling calls
    $( "#tabs" ).tabs();  // inside the _header partial, top of page

    $( "#products-header" ).callout({
	    position: "bottom", 
	    msg:"This demo app illustrates how Chatter can be integrated into an intranet site. Login to start."
	});

});




// **************************************************
// lower level functions that don't run unless called
// **************************************************

// Ajax query that runs a search.
function runSearch(text) {
	var myParams = { search: text };	  
	$.getScript("/qas/search.js" + "?" + $.param(myParams) );
}	


// display modal box with list of group member names linked to their
// user profiles
function showMembers(data) {
	// use handlebars - put a template into the source, then render it with teh 
	// JSON as intput.
	
	var context = jQuery.parseJSON(data); // see QasController#team
	var source  = $("#dialog-template").html();
	var template = Handlebars.compile(source);
	var html = template(context);
	$('#group-members-dialog').html(html);
	$('#group-members-dialog').dialog();
}


function showCallouts() {
	
	$("#hr-group-members").callout({
	    position: "right", 
	    msg:"The Chatter api makes social data like users, followers, group members easily available. Click the link to see how it works."
	});
	
	$("#hr-group-members").click(function() {
      $(this).callout("hide");
    });

    $("#post-button").callout({
	    position: "right", 
	    msg:"Post into a group feed to ask questions or make requests."
	});
	
	$("#post-button").click(function() {
      $(this).callout("hide");
    });

    $("#search-button").callout({
	    position: "right", 
	    msg:"Search to see if your question was already answered."
	});
	
	$("#search-button").click(function() {
      $(this).callout("hide");
    });

    $("#faq").callout({
	    position: "bottom", 
	    msg:"Tie together intranet pages with community intelligence inside Chatter."
	});
	
	$("#faq").click(function() {
      $(this).callout("hide");
    });
}
