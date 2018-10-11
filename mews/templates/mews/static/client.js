(function($)
{
	function isGoodUsername($usernameField)
	{
		return ($usernameField.val().length > 3 && $usernameField.val().length <= 42 ? true : false);
	};
	function isGoodContent($contentField)
	{
		return ($contentField.val().length > 5 && $contentField.val().length <= 400 ? true : false);
	};
	function correctUsername($username,buttonPressed)
	{
		var username = $username.val().replace(/\s+/g,' ').trim();
			if (username.length <= 3 && (username.length > 0 || buttonPressed))
			{
				$username.parent().addClass('has-error');
				$username.siblings().filter('span').text('Your username must be more than 3 characters long !');
			}
			else if (username.length > 42)
			{
				$username.parent().addClass('has-error');
				$username.siblings().filter('span').text('Your username musn\'t exceed 42 characters !');	
			}
			else
			{
				$username.parent().removeClass('has-error');
				$username.siblings().filter('span').text('');
			}
	};
	function correctContent($content,buttonPressed)
	{
		var content = $content.val().replace(/\s+/g,' ').trim();
			if (content.length <= 5 && (content.length > 0 || buttonPressed))
			{
				$content.parent().addClass('has-error');
				$content.siblings().filter('span').text('Content must be at least 5 characters long !');
			}
			else if (content.length > 400)
			{
				$content.parent().addClass('has-error');
				$content.siblings().filter('span').text('Content musn\'t exceed 400 characters !');	
			}
			else
			{
				$content.parent().removeClass('has-error');
				$content.siblings().filter('span').text('');
			}
	};

	$(document).ready(function()
	{
		// Form Error handling
		var $username = $('#username'),
			$content = $('#content'),
			$submit = $('#submit'),
			$form = $('#form'),
			$loading = $('#loading'),
			$error = $('#error'),
			$mews = $('#mews'),
			$pagination = $('#pagination');

		var currentNumberOfMews = 5

		$form.submit(function(e)
		{
			e.preventDefault();
		});
		// Username handling
		$username.change(function()
		{
			correctUsername($username,false);
		});
		// Content Handling
		$content.change(function()
		{
			correctContent($content,false);
		});
		// SUBMIT BUTTON
		$submit.click(function(e)
		{
			e.preventDefault();
			if (isGoodContent($content) && isGoodUsername($username))
			{
				console.log('Sending !!');
				// On cache le formulaire et affiche le loading
				$mews.slideUp(100,function()
				{
					$form.fadeOut(function()
					{
						$loading.css('display','block');
						$loading.fadeTo(0,1)
					});
				});
				

				$.ajaxSetup({ 
				     beforeSend: function(xhr, settings) {
				         function getCookie(name) {
				             var cookieValue = null;
				             if (document.cookie && document.cookie != '') {
				                 var cookies = document.cookie.split(';');
				                 for (var i = 0; i < cookies.length; i++) {
				                     var cookie = jQuery.trim(cookies[i]);
				                     // Does this cookie string begin with the name we want?
				                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
				                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				                         break;
				                     }
				                 }
				             }
				             return cookieValue;
				         }
				         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
				             // Only send the token to relative URLs i.e. locally.
				             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
				         }
				     } 
				});

					$.post(
						'mews/add/',
						{
							username : $username.val().replace(/\s+/g,' ').trim(),
							content : $content.val().replace(/\s+/g,' ').trim()
						},

						function(data)
						{
							$.get(
								'mews/get/0-' + currentNumberOfMews,
								function(data,textStatus,jqXHR)
								{
									// data = le html a remplacer
									$username.val('');
									$content.val('');
									setTimeout(function()
									{
										$loading.fadeTo(0,0)
										$loading.slideUp(function()
										{
											$loading.css('display','none');
											$form.slideDown('slow',function()
											{
												$mews.replaceWith($(data));
												$mews = $('#mews');
												$mews.hide(0,function()
												{
													$(this).slideDown(800);
												});
											});
										});
									},200);
								}
							);

						},
					)
					.fail(function(post,textStatus,error)
					{
						$error.css('display','block');

						if (post.status == 422)
						{
							$error.html('Received error : ' + error + '<br/><small>Form content must be invalid</small>');
						}
						else
						{
							$error.text('Received error : ' + error );
						}

						setTimeout(function()
						{
							$loading.fadeTo(0,0)
							$loading.slideUp(function()
							{
								$loading.css('display','none');
								$form.slideDown('slow',function()
								{
									$mews.slideDown();
								});
							});
						},2000);


						setTimeout(function()
						{
							$error.slideUp();
						},5000);
					});




			}
			else
			{
				correctUsername($username,true);
				correctContent($content,true);
			}
		});

		// PAGINATION
		$pagination.click(function(e)
		{
			e.preventDefault();
			currentNumberOfMews += 5;
			$.get(
				'mews/get/0-' + currentNumberOfMews,
				function(data,textStatus,jqXHR)
				{
					if($mews.html() === $(data).html())
					{
						alert('No more mews to show !');
					}
					else
					{
						$mews.replaceWith($(data));
						$mews = $('#mews');
						$mews.show();		
					}	
				}
			);
		});



	});
})(jQuery);