const charLimit = 140;

// Updates character counter element
const changeLength = function(event) {
  let counter = charLimit - $(this).val().length;
  const $sibling = $(this).siblings('.counter');
  if (counter < 0) {
    $sibling.css('color', 'red');
  } else {
    $sibling.css('color', '#244751');
  }
  $sibling.text(counter);
};

// Creates tweets DOM element
const createTweetElement = (tweetData) => {
  const time = new Date(tweetData.created_at).toString().slice(0,24);
  let $avatar = $("<img>").addClass("avatar").attr('src', tweetData.user.avatars.small);
  let $hashTag = $("<span>").addClass("hashTag").text(tweetData.user.handle);
  let $userName = $("<span>").addClass("userName").text(tweetData.user.name);
  let $tweetText = $("<p>").addClass("tweetText").text(tweetData.content.text);
  let $timeStamp = $("<p>").addClass("timeStamp").text(time);
  let $div = $("<div>").addClass("headerText").append($userName).append($hashTag);
  let $header = $("<header>").append($avatar).append($div);
  let $footer = $("<footer>").append($timeStamp);
  let $tweet = $("<article>").addClass("tweet").append($header).append($tweetText).append($footer);
  return $tweet;
};

// Renders all tweets passed into function
const renderTweets = (data) => {
  let $tweets = $('.tweets');
  for (const tweet in data) {
    $tweets.append(createTweetElement(data[tweet]));
  }
};

// Changes text of error box based on length of tweet
const displayError = (length) => {
  if (length > 140) {
    $('.errorMessage').text('Your tweet must be less than 140 characters long');
    $('.error').slideDown('fast');
    return true;
  } else if (length < 1) {
    $('.errorMessage').text('Your tweet must not be empty');
    $('.error').slideDown('fast');
    return true;
  }
};

// Creates an AJAX request for making a new tweet, and updates page to show new tweet
const ajaxMakeNewTweet = () => {
  $.post('/tweets/', $('.newTweetForm').serialize())
    .done(function(response) {
      $('.tweets').prepend(createTweetElement(response));
    });
};

// Renders tweets currently in database
const loadTweets = function(){
  $.get('/tweets').done(function (tweets) {
    renderTweets(tweets);
  });
}();

$(function(){
  // Tracks how many characters are in tweet text area
  $('textarea').keyup(changeLength);

  // On click of tweet button
  $('form').submit(function(event) {
    event.preventDefault();
    if (!displayError($(this).children('textarea').val().length)) {
      ajaxMakeNewTweet();
      $(this).children('textarea').val('');
      $(this).children('.counter').text(140);
      $(this).siblings('.error').slideUp('fast');
    }
  });

  // Compose button - toggles Compose Tweet section
  $('#compose').click(function(){
    $('.new-tweet').slideToggle('slow', function() {
      $('#tweetText').focus();
    });
  });
});