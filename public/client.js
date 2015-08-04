$(function(){

  $.get('/blocks', appendToList); 

  function appendToList(blocks) {
    var list = [];
    var content, block;
    for(var i in blocks){

    	block = blocks[i];
    	//console.log(" ******************** block="+block);
    	content = '<a href="/blocks/'+block+'">'+block+'</a>'+'<a href="#" data-block="'+block+'"><img src="./images/del.jpg"></a>';
      list.push($('<li>', { html: content }));
      console.log(" ******************** ");
    }
    $('.block-list').append(list);
  }



  $('form').on('submit', function(event){
  	event.preventDefault();
  	var form = $(this);
  	var blockData = form.serialize();
  	$.ajax({
  		type:'POST', url:'/blocks', data:blockData
  	}).done(function(blockName){
  		console.log(" ******************** blockName="+blockName);
  		appendToList([blockName]);
  		//console.log(" ******************** list="+list);

  		form.trigger('reset');
  	});
  });

  $('.block-list').on('click', 'a[data-block]', function(event){
  	if(!confirm('Are u sure?')){
  		return false;
  	}
  	var target = $(event.currentTarget);
  	$.ajax({
  		type:'DELETE', url:'/blocks/'+target.data('block')
  	}).done(function(){
  		target.parents('li').remove();
  	});
  });

});

