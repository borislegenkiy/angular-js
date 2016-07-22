$(document).ready(function(){ 
  $("#myTab a").click(function(e){
    e.preventDefault();
    $(this).tab('show');
	$(".info").show();
	$(".danger").show();
	$(".none").show();
  });
  
  $("#myTab a[href='#panel2']").click(function(e){
    e.preventDefault();
    $(this).tab('show');	
	$(".danger").hide();
	$(".info").show();
	$(".none").hide();
  });
  
  $("#myTab a[href='#panel3']").click(function(e){
    e.preventDefault();
    $(this).tab('show');
	$(".info").hide();
	$(".none").hide();
	$(".danger").show();
  });
});
