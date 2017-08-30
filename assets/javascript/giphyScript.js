$(document).ready(function() 
{

/*	var imgEffects = function()
	{
		$("img").hover(function()
		{
		    $(this).animate({'width':'210px'}, 100);
		}, 

			function()
			{
			    $(this).css({'width':'200px'});
		    }
		);

		$('search-results-row').hover(function()
		{
			$('img').css({'width':'200px'});
		})
	}*/

	var resultNumber;
	var trending = false;
	var searchButtons = $('.search-buttons')
	var searchResults = $('.search-results')
	var searchedBefore = []

	var userSearches = function()
	{
		var userInput = $('#search').val().toLowerCase().trim()
		console.log(searchedBefore)
		var searchHappened = false

		for (var i=0; i<searchedBefore.length; i++)
		{
			if (userInput === searchedBefore[i])
			{
				resultNumber = $('#result-number').val()
			getSearchResults(userInput, false)
					searchHappened = true
				break;
			}
		}
			
		if (!searchHappened && userInput !== "")
		{
			searchedBefore.push(userInput)
			resultNumber = $('#result-number').val()
			getNewButton(userInput)
			getSearchResults(userInput, false)
		}
	}

	var getNewButton = function(string)
	{
		var newButton = $("<button type='button' class='btn btn-default'>"+string+"</button>")
		searchButtons.append(newButton)
	}

	var getSearchResults = function(searchString, trending)
	{
		searchResults.empty()

		if (trending)
		{
			var queryURL = "http://api.giphy.com/v1/gifs/trending?&api_key=dc6zaTOxFJmzC&limit="+resultNumber;
		}

		else
		{
			var queryURL = "http://api.giphy.com/v1/gifs/search?q="+searchString+"&api_key=dc6zaTOxFJmzC&limit="+resultNumber;
		}

	    $.ajax(
	    {
		    url: queryURL,
		    method: 'GET'

	    }).done(function(response) 
	    {
		    for (var i=0; i<response.data.length; i++)
		    {
				var newImg = $('<img>')
				var stillImg = response.data[i].images.original_still.url
				var moveImg = response.data[i].images.downsized.url
				newImg.attr('class', i)
				newImg.attr('src', stillImg)
				newImg.css('width', '200px')
				newImg.data('stop', stillImg)
				newImg.data('move', moveImg)
				newImg.data('moving', false)
				searchResults.append(newImg)	    		
			}
	    });
	}

	$('#search-button').on('click', function()
	{
		userSearches()
	})

	$('#trending-button').on('click', function()
	{
		resultNumber = $('#result-number').val()
		getSearchResults("", true)
		console.log(resultNumber)
	})

	searchButtons.on('click', function(event)
	{
		var searchString = event.target.textContent
		console.log(event)
		console.log(searchString)

		if (event.target.tabIndex>-1)
		{
			resultNumber = $('#result-number').val()
			getSearchResults(searchString, false)
		}
	})

	searchResults.on('click', function(event)
	{
		clickedID = event.target.className
		imgClicked = $('.'+clickedID)
		console.log('clickedId is '+clickedID)

		for (var i=0; i<resultNumber; i++)
		{
			if (clickedID==i && event.target.tagName === 'IMG')
			{
				if (!imgClicked.data('moving'))
				{
					var moveData = imgClicked.data('move')
					imgClicked.attr('src', moveData)
					imgClicked.data('moving', true)
					imgClicked.animate({'width':'300px'}, 100);
					imgClicked.css({'border':'4px solid #5cf442'});
				}

				else
				{
					var stopData = imgClicked.data('stop')
					imgClicked.attr('src', stopData)
					imgClicked.data('moving', false)
					imgClicked.animate({'width':'200px'}, 100);
					imgClicked.css({'border':'0px solid #5cf442'});
				}
			}
		}
	})

	$('#search').keyup(function(event)
	{
		if (event.which === 13)
		{
			userSearches()
		}
	})

	$('#result-number').keyup(function(event)
	{
		if (event.which === 13)
		{
			userSearches()
		}
	})
});