function drivelist() {
  traverse = new Array() ;
  var scale = 1.88/4 ;
  $.ajax({
     type: "GET",
     url: "http://curiosityrover.com/tracking/ajax/drivelist.php",
     dataType: "html",
     success: function(data) {
       $('#drivelist').html(data) ;
      },
     error: function(xhr, status, error) {
       alert(status);
     }
  });
}

function lastreport() {
  $.ajax({
     type: "GET",
     url: "http://curiosityrover.com/tracking/ajax/lastreport.php",
     dataType: "html",
     success: function(data) {
       $('#lastreport').html(data) ;
      },
     error: function(xhr, status, error) {
       alert(status);
     }
  });
}
