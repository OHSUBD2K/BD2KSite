$(function () {
	//setting up the bg color for the lists of topics
	$( '.ready .listoftopics ul li:odd' ).addClass('oddList');
	$( '.stillDev .listoftopics ul li:odd' ).addClass('oddList');
	//$( '.team section:odd' ).addClass('oddList');
	//$('.topic_details').hide();
	var $clickedTopic,$activeTopic;
	//variables to reuse
	var $interactionBox = $('<div id="boxy"><a href="#" class="close-topic">X</a></div>');


	// setting up the clean-up of the displayed topic
	function killBoxy($nextPlace){
		//console.log("checking the kill");
		if ($('.ready .listoftopics ul li .topicTitle a').hasClass('current')){
			//console.log("starting the kill");
			$interactionBox.slideUp(350, function(){
				//var $parent = $(this).parent().parent();
				//console.log($parent.html());
				//$('div.topicTitle a').removeClass('current');
				$('.ready .listoftopics ul li .topicTitle a').removeClass('current');
				$interactionBox.find('.boxyContent').empty().remove();
				$interactionBox.detach();
				if (typeof $nextPlace != 'undefined') {
					//code
					buildInfo($nextPlace);
				}
				
				});
			return "killed";
		}else{
			//console.log("no kill");
			buildInfo($nextPlace)
			return "no kill";
		}
	}
	//adding the functioning for the clicking of the "viewing the topic"
	$('.topicTitle', '.ready').on('click.mainList','a', function(e){
		e.preventDefault();
		$clickedTopic = $(this);
		if ($clickedTopic !== $activeTopic) {
			//code
			killBoxy($clickedTopic);
		}else{
			killBoxy();
		}
		//var killCheck = killBoxy($clickedTopic);
		//console.log (killCheck);
		//buildInfo($clickedTopic)
	});
	
	function buildInfo($placement) {
		$activeTopic = $placement;
		var $this = $placement;
		if ($this.hasClass('current')!==true){
				//console.log("starting the build");
				var $location = $this.attr('href');
				var $parent = $this.parent().parent();
				$parent.animate({ scrollTop: $parent.scrollTop() + $this.offset().top - $parent.offset().top }, { duration: 'slow', easing: 'swing'});
				$('html,body').animate({ scrollTop: $parent.offset().top }, { duration: 1000, easing: 'swing'});
				
				var $topicID = $parent.find('.topicID').text().trim();
				$this.addClass('current');
				//console.log($parent.html());

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
							//console.log("adding the buttons");
							var topicButtons = $('<div class="viewButton"><a href="'+$topicID+'.html" target="_BLANK">View Module Content</a></div><div class="seClear"></div>');
//							<div class="downloadButton"><a href="asset/'+$topicID+'.zip">Download whole topic</a></div> --- return to active when all are complete or mass download is automated.
							//console.log("adding the topic info");
							var content = div.find('div.main div.topicArea section.header div.topic_info').append(topicButtons).wrapInner('<div class="boxyContent"></div>');

							$interactionBox.append(content.html());
							$interactionBox.find('.close-topic').on('click.interactionBox', function(e){
									e.preventDefault();
									$activeTopic = null;
									killBoxy();
								});
							//console.log("starting the slide");
							$interactionBox.appendTo($parent.find('.topic_details .topic_info_placement'));
							$interactionBox.delay(30).slideDown(500);
						}
					});
			}

		};

});
