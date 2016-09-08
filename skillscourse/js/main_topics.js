$(function () {
	
	//create vars
	var $modalflag=false,
		$downloadflag=false,
		$overlay = $('.overlay'),
		$modal = $('.modal'),
		$content = $('<div id="content"></div>'),
		$close = $('<a class="close" href="#">close</a>'),
		downloadCollection = {};
	
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
					//use these for later
					//$overlay = $('<div id="overlay"></div>'),
					//$modal = $('<div id="modal"></div>'),
					//$content = $('<div id="content"></div>'),
					//$close = $('<a id="close" href="#">close</a>');
					// position the modal in the viewport
					//method.position = function () {};
			
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
						left: ($(window).width)-($(window).width*.85), 
						top: settings.top
					});
					 //$("html, body").animate({ scrollTop: 0 }, { duration: 'slow', easing: 'swing'}); 
					$modalflag=true;
					$downloadflag=false;
					$overlay.fadeIn();
					$modal.fadeIn();
				};
			
				// Close the modal
				method.close = function () {
					
					$overlay.fadeOut(400);
					
					$modal.fadeOut(400, function (){
						$close.remove();
						$content.empty().remove();
						$overlay.hide();
						$modal.hide();
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
		modal.open({content : $checkingForm, top : ($(window).attr('screen').height/6)});
		$('html, body').animate({ scrollTop: 0 }, { duration: 'slow', easing: 'swing'});
	})
	$modal.on('click.dl', '#content .downloadButton a', function (evt) {
				evt.preventDefault();
				$downloadflag=true;
				//console.log($downloadflag);
				$('#confirmDl').submit();
		})
	$modal.on('click.closemodal', 'a.close', function (evt) {
				evt.preventDefault();
				modal.close();
				//console.log($downloadflag);
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
		});
});
