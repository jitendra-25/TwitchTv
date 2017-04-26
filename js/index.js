$(document).ready(function() {
  $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
    e.preventDefault();  
      $(this).siblings('a.active').removeClass("active");
    
    $(this).addClass("active");
    var index = $(this).index();
    //$("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
    //$("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    
    //var id = $(this).attr('id');
  });
  
  // Call Twitch.Tv API  
  var image, url, name, status;
   var obj = {};
  
  var twitchArr = ["ESL_SC2" ,"freecodecamp", "GeoffStorbeck", "terakilobyte", "habathcx","RobotCaleb","brunofin","thomasballinger", "comster404"];
  
  LoadData();

  // Loop the array and get data from Twitch API
  function LoadData() {
    $(".contentList").empty();
    for(var i=0; i<twitchArr.length;i++) {
        fetchData(twitchArr[i]);
    }
  }
 
  function fetchData(username) {
    $.ajax({
      url: "https://wind-bow.gomix.me/twitch-api/streams/" + username + "?callback=?",
      dataType: "jsonp",
      data: { format: "json" },
      success: function(data) {
          getData(data, username);
      },      
      error: function() {
        //alert('An Error occurred while making stream API call');
        console.log('An Error occurred while making stream API call- ' + username);
      }
    });
  }  
  
  function getData(data, username) {
    //console.log(data.stream);
    //alert('getData');
    var html;
      // get user details 
    $.ajax({
      url: "https://wind-bow.gomix.me/twitch-api/users/" + username + "?callback=?",
      dataType: "jsonp",
      data: { format: "json" },
      success: function(r) {
          obj.name = r.display_name;
          obj.logo = r.logo;
          obj.userStatus = r.status;
   },
   error: function() {
        //alert('An Error occurred while making user API call')
      console.log('An Error occurred while making user API call- ' + username);
      }
    });
    
    if(data.stream === null) {
        obj.url = data._links.channel;
        obj.statusIcon= "red fa fa-exclamation";
        obj.username = username;
        obj.streamTitle = '';

      if(obj.userStatus === 422 || obj.userStatus === 404) {
          obj.status = "Unavailable";
        }
        else {
          obj.status = "Offline";
        }
    }
    else if(data.stream != undefined) {
      //console.log('data is present');
        obj.url = data._links.channel;
        obj.statusIcon = "green fa fa-check";
        obj.streamTitle = data.stream.channel.status;
        obj.username = username;
        obj.status = "Online";
    }
  
    if(obj.status === "Online") {
       //console.log('online');
      html = "<div class='row online'><div class='col-lg-2 col-md-2 col-xs-2 image-holder'></div>";

      html += "<div class='col-lg-6 col-md-6 col-xs-5'><a target='_blank' href=" + obj.url + "><h5>" + obj.username + "</h5></a>";
      html += "<p>Streaming - <strong>" + obj.streamTitle + "</p></div>";
      
      html += "<div class='col-lg-2 col-md-2 col-xs-3 vcenter'> Online </div>";
      
      html+= "</div>";

   } else if(obj.status === "Offline") {
      //console.log('offline');
      html = "<div class='row offline'><div class='col-lg-2 col-md-2 col-xs-2 image-holder'></div>";

      html += "<div class='col-lg-6 col-md-6 col-xs-5'><a target='_blank' href=" + obj.url + "><h5>" + obj.username + "</h5></a>";
      html += "<p>Not Streaming Currently</p></div>";
      
      html += "<div class='col-lg-2 col-md-2 col-xs-3 vcenter'> Offline </div>";
      
      html+= "</div>";
    }
    else if(obj.status === "Unavailable") {
      html = "<div class='row offline'><div class='col-lg-2 col-md-2 col-xs-2 image-holder'></div>";

      html += "<div class='col-lg-6 col-md-6 col-xs-5'><a target='_blank' href=" + obj.url + "><h5>" + obj.username + "</h5></a>";
      html += "<p>User is not available</p></div>";
      
      html += "<div class='col-lg-2 col-md-2 col-xs-3 vcenter'> Unavailable </div>";
      
      html+= "</div>";
    }

    /*if(obj.logo !== null && obj.logo !== undefined) {      
      $('.image-holder').css('background', 'url("' + obj.logo + '")');
    }
    else {
      $('.image-holder').css('background','url("https://cdn.rawgit.com/ayoisaiah/freeCodeCamp/master/twitch/images/placeholder-2.jpg")')
    }*/
    
    $('.contentList').append(html);
  } // getData End
  
  $("#listAll").click(function() {
    $('.online, .offline').removeClass('hide-row');
  });
  
  $("#listOnline").click(function() {
    $('.online').removeClass('hide-row');
    $('.offline').addClass('hide-row');
  });
  
  $("#listOffline").click(function() {
    $('.online').addClass('hide-row');
    $('.offline').removeClass('hide-row');
  });
  
  // Refresh button click
  $("#refresh").click(function() {
      LoadData();
  });
  
  $("#search").keyup(function() {
    var input, filter, divs, allRows, element, elementText;
    
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    divs = document.getElementById("twitchList");
    allRows = $(".online, .offline");
    
    for(var i=0;i<allRows.length;i++) {
      element = allRows[i].getElementsByTagName("h5")[0];
      elementText = $(element).text();
      
      if(elementText.toUpperCase().indexOf(filter) > -1) {
        allRows[i].style.display = "";
      } else {
        allRows[i].style.display = "none";
      }      
    }      
  });  
}); // document ready End