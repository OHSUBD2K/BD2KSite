$(function () {
	//setting up the bg color for the lists of topics
	$( '.ready .listoftopics > ul > li:odd' ).addClass('oddList');
	//$( '.stillDev .listoftopics .topicDescription ul li:odd' ).addClass('oddList');
	//basic variables
	var $clickedTopic,$activeTopic, $fileSize, $currentTopic;
	var $modalflag=false,
		$overlay = $('.overlay'),
		$modal = $('.modal'),
		$content = $('<div id="content"></div>'),
		$close = $('<a class="close" href="#">close</a>'),
		ipinfo={};
	//get ip information from visitors
	$.getJSON('http://ipinfo.io', function(data){
		ipinfo = data;
		});
	//variables to reuse
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
					$modal.css({
							width: settings.width || 'auto', 
							height: settings.height || 'auto'
						})

					method.center();
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
						$(window).unbind('resize.modal');
					});
					$modalflag=false;
				};
				
				return method;
			}());
	function fileSize() {
			$.ajax({
						url: 'module_size.php',
						type: "GET",
						dataType: "JSON",
						success: function (data) {
							$fileSize = data;
						}
			})
		}
	fileSize();
	//function for email validation
	function validateEmail($email) {
		var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		return emailReg.test( $email );
	  }
	//function for the getting the various cookie data used for the site
	function surveyCookie(){
		str = document.cookie.split('; ');
		var result = {};
		for (var i = 0; i < str.length; i++) {
			var cur = str[i].split('=');
			result[cur[0]] = cur[1];
		}
		if (result['survey']==='true') {
            //code
			return true;
        }else{
			return false;
		}
	}
	// setting up the clean-up of the displayed topic
	//adding the functioning for the clicking of the "viewing the topic"
	$('.topicDescription', '.ready').on('click.mainList','a', function(e){
		e.preventDefault();
		
		$clickedTopic = $(this);
		console.log($clickedTopic.hasClass('outside'));
		if ($modalflag) {
			closeModal()
		}
		if ($clickedTopic.hasClass('outside')) {
			//code
			window.open($clickedTopic.attr('href'), '_BLANK');
			
		}else{
			buildInfo($clickedTopic);
		}
		
	});
	
	function buildInfo($placement) {
		var $this = $placement;
			//console.log("starting the build");
			var $location = $this.attr('href');
			var $parent = $this.parent().parent().parent();
			
			var $topicID = $location.match(/([BDK])\w+/g)[0];
			$currentTopic = $topicID;
			console.log($topicID);
			var $sizeInsert;
			//fileSize($topicID);
			
			jQuery.each($fileSize, function (k,v){
				if (k==$topicID) {
					//code
					$sizeInsert = '<span class="filesize">('+v+')</span>';
					if (v.match(/GB/g)) {
						//code
						$sizeInsert = '<span class="filesize sizeWarning">('+v+')</span>';
					}
				}
			})
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
						var topicButtons = $('<div class="viewButton"><a href="'+$topicID+'.html" target="_BLANK">View Module Content</a></div></div><div class="downloadButton"><a href="module_zip.php?mod='+$topicID+'">Download Entire Module '+$sizeInsert+'</a></div><div class="seClear">');
						//console.log("adding the topic info");
						var $contentAreaStart =$topicID+' - '+div.find('div.main div.topicArea section.header h1').text();
						var $contentArea = div.find('div.main div.topicArea section.header div.topic_info').append(topicButtons).prepend('<h2>'+$contentAreaStart+'</h2>');

						modal.open({content : $contentArea, top : $parent.offset().top, width : (.85*($(window).attr('screen').width))});
						//$('html, body').animate({ scrollTop: $parent.offset().top }, { duration: 'slow', easing: 'swing'});($(window).attr('screen').height/6)
						$contentArea.find('.downloadButton').on('click.downloadWhole', 'a',function(e){
									e.preventDefault();
									var $this = $(this);
									console.log($this);
									$dlLocation = $this.attr('href');
									console.log(document.cookie);
									var surveyCheck = surveyCookie();
									console.log('surveyCheck: '+surveyCheck);
									
									if (surveyCheck === true) {
										//code
										window.location=$dlLocation;
									}else{
										signUpSetUp();
									}
									
								});
					}
				});
			

		};
	$modal.on('click.closemodal', 'a.close', function (evt) {
			evt.preventDefault();
			closeModal();
	});

	function closeModal(){		
				modal.close();
	}
		
	function signUpSetUp() {
			//code
			$.ajax({
						url: 'form.php',
						type: "GET",
						dataType: "html",
						success: function (data) {
							var $newForm = $('<div>')
							$newForm.html(data);
							modal.open({content : $newForm});
							$('input[type="submit"]', '#oer_usage').on('click.sendInfo',function(e){
								e.preventDefault();
								$('#oer_usage').find('input[type="text"]').each(function(e){
									console.log($(this).attr('name'),$(this).val().trim())
									})
								console.log(validateEmail($('#userEmail', '#oer_usage').val()));
								if ($('#userName', '#oer_usage').val().trim() && $('#userPosition', '#oer_usage').val().trim() && validateEmail($('#userEmail', '#oer_usage').val().trim())) {
									//code
									
									var serializedData = $('#oer_usage').serialize();
									console.log(serializedData);
									
									$.ajax({
							            url: "https://script.google.com/macros/s/AKfycbybcUKgDseo6YkWHSvt2azZYoRxPmUrjARucYHUTJBXPTRjnLk/exec",
							            type: "post",
							            data: serializedData+"&userPage="+window.location.pathname+"&userPackage="+$currentTopic+" fullPackage&userIP="+JSON.stringify(ipinfo),
										success: function(data){
											document.cookie = "survey=true";
											closeModal(e);
											window.location=$dlLocation;
										}
								   });
								}else{
									if ($('#userName', '#oer_usage').val()=='') {
										$('#userName', '#oer_usage').addClass('giveanswer')
									}else{
										$('#userName', '#oer_usage').removeClass('giveanswer')
									}
									if ($('#userPosition', '#oer_usage').val()=='') {
										$('#userPosition', '#oer_usage').addClass('giveanswer')
									}else{
										$('#userPosition', '#oer_usage').removeClass('giveanswer')
									}
									if (!validateEmail($('#userEmail', '#oer_usage').val()) || $('#userEmail', '#oer_usage').val()=='') {
										$('#userEmail', '#oer_usage').addClass('giveanswer')
									}else{
										$('#userEmail', '#oer_usage').removeClass('giveanswer')
									}
								}
								
							})
							$('.signupButton', '#oer_usage').on('click.dontsendInfo','a',function(e){
									e.preventDefault();
									//closeModal(e);
									//window.location=$dlLocation;
									$.ajax({
							            url: "https://script.google.com/macros/s/AKfycbybcUKgDseo6YkWHSvt2azZYoRxPmUrjARucYHUTJBXPTRjnLk/exec",
							            type: "post",
							            data: "userName=directFullModuleDownloadMapping&userEmail=noneGiven&userPosition=noneGiven&userSurvey=no&userPage="+window.location.pathname+"&userPackage="+$currentTopic+" fullPackage&userIP="+JSON.stringify(ipinfo),
										success: function(data){
											closeModal(e);
											window.location=$dlLocation;
										}
								});
									
							});
							
							$('input[type="checkbox"]', '#oer_usage').on('click.surveyAnswer',function(e){
								console.log($(this).is(':checked'));
								if ($(this).is(':checked'))
								{
                                    //code
									$('#userInfo').slideDown(550);
									$('input[type="submit"]', '#oer_usage').fadeIn(500);
                                }else{
									$('#userInfo').slideUp(550);
									$('input[type="submit"]', '#oer_usage').fadeOut(500);
								}
								})
							
						}
			});
			
		}
});
