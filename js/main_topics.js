$(function () {
	
	//create vars
	var $modalflag=false,
		$downloadflag=false,
		$signupflag=false,
		$overlay = $('.overlay'),
		$modal = $('.modal'),
		$content = $('<div id="content"></div>'),
		$close = $('<a class="close" href="#">close</a>'),
		$hiddenForm = $('<form id="hiddenForm" action="zip.php" method="post"></form>'),
		downloadCollection = {},
		selectionsSerialize,
		ipinfo={};
	//get ip information from visitors
	$.getJSON('http://ipinfo.io', function(data){
		ipinfo = data;
		});
	
	$('.main').find('form').each(function(i){
		var $this = $(this);
		$this.attr('id', i);
	});
	
	$('.main').find('.part h2').each(function(i){
		var name = $(this).html();
		//console.log(name);
		downloadCollection[name]=[];
	});
	
	$('input[type="checkbox"]', 'form').on('click.SelectFiles',function(e){
		$this = $(this);
		var $form = $this.parent().parent().parent().parent();
		var $count = $('input[type="checkbox"]:checked',$form).length;
		$form.find('.total_files span').html($count);
	});
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
					$downloadflag=false;
					$signupflag=false;
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
	
	function downloadCheckGet(arr){
			var i = 0;
			for (var prop in arr) {
					if (arr.hasOwnProperty(prop)&&arr[prop].length>0) {
						i++;
					}
				}
				return i
		};
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
	$('input[type="submit"]', '.topicArea').on('click',function(e){
		e.preventDefault();
		var $checkingForm="";
		$('.main').find('input[type="checkbox"]:checked').each(function(i){
			var $this = $(this);
			var $form = $this.parent().parent().parent().parent();
			var areaLoc = $form.parent().parent().find('h2').html();
			
			var item = {};
				item[$this.next("label").text()] = $this.val();
				downloadCollection[areaLoc].push(item);
			})
		//useModal({arr:downloadCollection});
		var downloadChecking = downloadCheckGet(downloadCollection);
		//console.log("download length check: "+downloadChecking);
		
		if (downloadChecking) {
			//code
		
			$checkingForm +="<fieldset><legend>Confirm the items you would like to download. Click on the &ldquo;download&rdquo; button to receive your custom package.</legend><form id='confirmDl' enctype='multipart/form-data' action='zip.php' method='POST'>";
	
			jQuery.each(downloadCollection, function (k,v){
				var $topicSelection = v;
				if ($topicSelection.length>0) {
					var topicDef = k;
					$checkingForm +='<div class="topicCode">'+topicDef+'<ul>';
					jQuery.each($topicSelection, function(k,v){
						console.log(Object.keys(v));
						var indexNum = jQuery.inArray(v,$topicSelection)+'_'+topicDef;
						$checkingForm +='<li><input type="checkbox" name="listItem_'+indexNum+'" id="listItem_'+indexNum+'" value="'+v[Object.keys(v)]+'" checked/><label for="listItem_'+indexNum+'">'+Object.keys(v)+'</label></li>'
						});
					$checkingForm +='</ul></div>';
				}
			})
			$checkingForm +='<div class="downloadButton"><a href="#">Download Selected Files</a></div></form></fieldset>';
		}else{
			$checkingForm +='There are no files selected';
		}
		//console.log($(window).attr('screen').height);
		modal.open({content : $checkingForm, top : ($(window).attr('screen').height/6), width : (.85*($(window).attr('screen').width))});
		//$('html, body').animate({ scrollTop: 0 }, { duration: 'slow', easing: 'swing'});
	})
	$modal.on('click.dl', '#content .downloadButton a', function (evt) {
				evt.preventDefault();
				var $this = $(this);
				$downloadflag=true;
				//console.log($downloadflag);
				//$('#confirmDl').submit();
				console.log(document.cookie);
				var surveyCheck = surveyCookie();
				console.log('surveyCheck: '+surveyCheck);
				
				if (surveyCheck === true) {
					//code
					$('#confirmDl').submit();
					closeModal();
				}else{
					selectionsSerialize = $('#confirmDl').serializeArray();
					signUpSetUp();
				}
				
		})
	$modal.on('click.closemodal', 'a.close', function (evt) {
				evt.preventDefault();
				closeModal();
	});
	
	function closeModal(){		
				modal.close();
				console.log('download flag: '+$downloadflag);
				if ($downloadflag) {
					//code
					$('.main').find('input[type="checkbox"]:checked').each(function(i){
						//if($(this).is(':checked')){
							$('input[type="checkbox"]').prop('checked', false)
						//}
					});
					$('.main').find('.total_files span').html('0');
				}
				for (var prop in downloadCollection) {
					if (downloadCollection.hasOwnProperty(prop)) {
						delete downloadCollection[prop];
					}
				}
				//downloadCollection = {};
				$('.main').find('.part h2').each(function(i){
					var name = $(this).text();
					downloadCollection[name]=[];
				});
		};
	var myRedirect = function(arg) {
			//$hiddenForm.empty().remove();
			var form ='';
			for (var i = 0; i < arg.length; i++) {
				var cur = arg[i];
				form+='<input type="hidden" name="'+ cur.name +'" value="' + cur.value + '"></input>';
			}
			$hiddenForm.append(form);
			$('body').append($hiddenForm);
			$hiddenForm.submit().empty().remove();
		  };
	function signUpSetUp() {
			//code
			$.ajax({
						url: 'form.php',
						type: "GET",
						dataType: "html",
						success: function (data) {
							var $newForm = $('<div>');
							$newForm.html(data);
							modal.open({content : $newForm});
							$('.signupButton a', '#oer_usage').html('Continue to Download').on('click.DirectDownload', function(e){
								e.preventDefault();
								$.ajax({
							            url: "https://script.google.com/macros/s/AKfycbybcUKgDseo6YkWHSvt2azZYoRxPmUrjARucYHUTJBXPTRjnLk/exec",
							            type: "post",
							            data: "userName=directModuleDownload&userEmail=noneGiven&userPosition=noneGiven&userSurvey=no&userPage="+window.location.pathname+"&userPackage="+JSON.stringify(selectionsSerialize)+"&userIP="+JSON.stringify(ipinfo),
										success: function(data){
											
											$downloadflag=true;
											myRedirect(selectionsSerialize);
											closeModal();
										}
								});
							})
							
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
							            data: serializedData+"&userPage="+window.location.pathname+"&userPackage="+JSON.stringify(selectionsSerialize)+"&userIP="+JSON.stringify(ipinfo),
										success: function(data){
											document.cookie = "survey=true";
											$downloadflag=true;
											myRedirect(selectionsSerialize);
											closeModal();
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
									closeModal();
									
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
