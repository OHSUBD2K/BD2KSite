$(function () {
	//setting up the bg color for the lists of topics
	$( '.ready .listoftopics ul li:odd' ).addClass('oddList');
	$( '.stillDev .listoftopics ul li:odd' ).addClass('oddList');

	//variables to reuse
	var $interactionBox = $('<div id="boxy"><a href="#" class="close-topic">X</a></div>');


	// setting up the clean-up of the displayed topic
	function killBoxy(){
		$interactionBox.slideUp(350, function(){
			var $parent = $(this).parent();
			$('div.viewButton a', $parent).removeClass('hidden current');
			$interactionBox.detach();
			});
	}
	//adding the functioning for the clicking of the "viewing the topic"
	$('.viewButton', '.listoftopics').on('click.mainList','a', function(e){
		e.preventDefault();
		var $this = $(this);
		var $location = $this.attr('href');
		$parent = $this.parent().parent();
		$parent.animate({ scrollTop: $parent.scrollTop() + $this.offset().top - $parent.offset().top }, { duration: 'slow', easing: 'swing'});
		$('html,body').animate({ scrollTop: $parent.offset().top }, { duration: 1000, easing: 'swing'});
		console.log($parent.html());
		$this.addClass('current');
		killBoxy();

		$.ajax({
				url: $location,
				type: "get",
				dataType: "html",
				success: function (data) {
					//pulls in the page from the $location.
					var div = $('<div>');
					//wrap in div for DOM readability
					div.html(data);
					// find the main div for the module
					var content = div.find('div.main');
					content.find('.header h1').hide();
					$interactionBox.append(content.html()).hide();
					$interactionBox.find('.close-topic').on('click.interactionBox', function(e){
							e.preventDefault();
							killBoxy();
						});
					$this.addClass('hidden');
					$interactionBox.appendTo($this.parent().parent()).slideDown(500, function(){

					});
				}
			});

		});

});
