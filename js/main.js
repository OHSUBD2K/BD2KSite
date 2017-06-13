$(function () {
	//setting up the bg color for the lists of topics
	$( '.ready .listoftopics ul li:even' ).addClass('oddList');
	$( '.stillDev .listoftopics ul li:even' ).addClass('oddList');
	$('.content_mapping ul li:even').addClass('oddList');
	//basic variables
	var $clickedTopic,$activeTopic, $fileSize, $currentTopic;
	//variables to reuse
	var $interactionBox = $('<div id="boxy"><a href="#" class="close-topic">X</a></div>');
	//modal vars
	var $modalflag=false,
		$signupflag=false,
		$overlay = $('.overlay'),
		$modal = $('.modal'),
		$content = $('<div id="content"></div>'),
		$close = $('<a class="close" href="#">close</a>'),
		$dlLocation,
		ipinfo={};
	//get ip information from visitors
	//$.getJSON('http://ipinfo.io', function(data){
	//	ipinfo = data;
	//	});
	//modal function
	var modal = (function(){
				var method = {};			
				// Open the modal
				method.open = function (settings) {
					
					if($modalflag){
						$close.remove();
						$content.empty().remove();
						$overlay.hide();
						$modal.hide();
						$modalflag=false;
					}
					
					$content.empty().append(settings.content);
					$modal.append($content, $close);
					//console.log($modal.height)
					$modal.css({
							width: settings.width || 'auto', 
							height: settings.height || 'auto'
						})

					method.center();
					 //$("html, body").animate({ scrollTop: 0 }, { duration: 'slow', easing: 'swing'}); 
					$modalflag=true;
					$overlay.fadeIn();
					$modal.fadeIn();
				};
				method.center = function () {
							var top, left;
						
							top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
							left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;
						
							$modal.css({
								top:top + $(window).scrollTop(), 
								left:left + $(window).scrollLeft()
							});
				};
				// Close the modal
				method.close = function () {
					
					$overlay.fadeOut(400);
					
					$modal.fadeOut(400, function (){
						$close.remove();
						$content.empty().remove();
						$overlay.hide();
						$modal.hide('400');
						
					});
					$modalflag=false;
				};
				
				return method;
			}());
	//close modal with "x"
	$modal.on('click.closemodal', 'a.close', function (evt) {
				evt.preventDefault();
				closeModal(evt);
	});
	//modal close function
	function closeModal(e){
				modal.close();
		};
	//function for getting the file size of the assets
	//function fileSize() {
	//		$.ajax({
	//					url: 'module_size.php',
	//					type: "GET",
	//					dataType: "JSON",
	//					success: function (data) {
	//						$fileSize = data;
	//					}
	//		})
	//	}
	//fileSize();
	//function for email validation
	function validatehtml($htmlPage) {
		var emailReg = /(BDK)\d+/;
		var match = emailReg.exec($htmlPage);

		return match[0]+'.html';
	  }
	//function for the getting the various cookie data used for the site
//	function surveyCookie(){
//		str = document.cookie.split('; ');
//		var result = {};
//		for (var i = 0; i < str.length; i++) {
//			var cur = str[i].split('=');
//			result[cur[0]] = cur[1];
//		}
//		if (result['survey']==='true') {
//            //code
//			return true;
//        }else{
//			return false;
//		}
//	}
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
		var $htmlPage=validatehtml($(this).attr('href'));
		console.log($htmlPage, $activeTopic)
		if ($htmlPage != $activeTopic) {
			//code
			killBoxy($clickedTopic);
		}else{
			$activeTopic = null;
			killBoxy();
		}
		//var killCheck = killBoxy($clickedTopic);
		//console.log (killCheck);
		//buildInfo($clickedTopic)
	});
	
	function buildInfo($placement) {
		$activeTopic = validatehtml($placement.attr('href'));
		var $this = $placement;
		if ($this.hasClass('current')!==true){
				//console.log("starting the build");
				var $location = validatehtml($this.attr('href'));
				//console.log($location);
				var $parent = $this.parent().parent();
				$parent.animate({ scrollTop: $parent.scrollTop() + $this.offset().top - $parent.offset().top }, { duration: 'slow', easing: 'swing'});
				$('html,body').animate({ scrollTop: $parent.offset().top }, { duration: 1000, easing: 'swing'});
				
				var $topicID = $parent.find('.topicID').text().trim();
				$currentTopic = $topicID ;
				//var $sizeInsert;
				//fileSize($topicID);
				$this.addClass('current');
				
				
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
							var topicButtons = $('<div></div>');
							//console.log("adding the topic info");
							var content = div.find('div.main div.topicArea section.header div.topic_info').append(topicButtons).wrapInner('<div class="boxyContent"></div>');

							$interactionBox.append(content.html());
							$interactionBox.find('.close-topic').on('click.interactionBox', function(e){
									e.preventDefault();
									$activeTopic = null;
									killBoxy();
								});
							//console.log("starting the slide");
							//$interactionBox.find('.downloadButton').on('click.downloadWhole', 'a',function(e){
							//		e.preventDefault();
							//		var $this = $(this);
							//		console.log($this);
							//		$dlLocation = $this.attr('href');
							//		//console.log(document.cookie);
							//		//var surveyCheck = surveyCookie();
							//		//console.log('surveyCheck: '+surveyCheck);
							//		//
							//		//if (surveyCheck === true) {
							//		//	//code
							//		//	window.location=$dlLocation;
							//		//}else{
							//		//	signUpSetUp();
							//		//}
							//		
							//	});
							$interactionBox.appendTo($parent.find('.topic_details .topic_info_placement'));
							$interactionBox.delay(30).slideDown(500);
						}
					});
			}

		};
		
		//function signUpSetUp() {
		//	//code
		//	$.ajax({
		//				url: 'form.php',
		//				type: "GET",
		//				dataType: "html",
		//				success: function (data) {
		//					var $newForm = $('<div>')
		//					$newForm.html(data);
		//					modal.open({content : $newForm});
							//$('input[type="submit"]', '#oer_usage').on('click.sendInfo',function(e){
							//	e.preventDefault();
							//	closeModal(e);
							//	window.location=$dlLocation;
							//	$('#oer_usage').find('input[type="text"]').each(function(e){
							//		console.log($(this).attr('name'),$(this).val().trim())
							//		})
							//	console.log(validateEmail($('#userEmail', '#oer_usage').val()));
							//	if ($('#userName', '#oer_usage').val().trim() && $('#userPosition', '#oer_usage').val().trim() && validateEmail($('#userEmail', '#oer_usage').val().trim())) {
							//		//code
							//		
							//		var serializedData = $('#oer_usage').serialize();
							//		console.log(serializedData);
							//		
							//		$.ajax({
							//            url: "https://script.google.com/macros/s/AKfycbybcUKgDseo6YkWHSvt2azZYoRxPmUrjARucYHUTJBXPTRjnLk/exec",
							//            type: "post",
							//            data: serializedData+"&userPage="+window.location.pathname+"&userPackage="+$currentTopic+" fullPackage&userIP="+JSON.stringify(ipinfo),
							//			success: function(data){
							//				document.cookie = "survey=true";
							//				
							//			}
							//	   });
								//}else{
								//	if ($('#userName', '#oer_usage').val()=='') {
								//		$('#userName', '#oer_usage').addClass('giveanswer')
								//	}else{
								//		$('#userName', '#oer_usage').removeClass('giveanswer')
								//	}
								//	if ($('#userPosition', '#oer_usage').val()=='') {
								//		$('#userPosition', '#oer_usage').addClass('giveanswer')
								//	}else{
								//		$('#userPosition', '#oer_usage').removeClass('giveanswer')
								//	}
								//	if (!validateEmail($('#userEmail', '#oer_usage').val()) || $('#userEmail', '#oer_usage').val()=='') {
								//		$('#userEmail', '#oer_usage').addClass('giveanswer')
								//	}else{
								//		$('#userEmail', '#oer_usage').removeClass('giveanswer')
								//	}
								//}
								
							//})
							//$('.signupButton', '#oer_usage').on('click.dontsendInfo','a',function(e){
							//		e.preventDefault();
							//		closeModal(e);
							//		window.location=$dlLocation;
							//		$.ajax({
							//            url: "https://script.google.com/macros/s/AKfycbybcUKgDseo6YkWHSvt2azZYoRxPmUrjARucYHUTJBXPTRjnLk/exec",
							//            type: "post",
							//            data: "userName=directFullModuleDownload&userEmail=noneGiven&userPosition=noneGiven&userSurvey=no&userPage="+window.location.pathname+"&userPackage="+$currentTopic+" fullPackage&userIP="+JSON.stringify(ipinfo),
							//			success: function(data){
							//				closeModal(e);
							//				window.location=$dlLocation;
							//			}
							//	});
									
							//});
							
//							$('input[type="checkbox"]', '#oer_usage').on('click.surveyAnswer',function(e){
//								console.log($(this).is(':checked'));
//								if ($(this).is(':checked'))
//								{
//                                    //code
//									$('#userInfo').slideDown(550);
//									$('input[type="submit"]', '#oer_usage').fadeIn(500);
//                                }else{
//									$('#userInfo').slideUp(550);
//									$('input[type="submit"]', '#oer_usage').fadeOut(500);
//								}
//								})
							
				//		}
			//});
			
		

});
