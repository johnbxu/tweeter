// Creates tweets DOM element
const createTweetElement = (tweetData) => {
  const {user, content, created_at} = tweetData;
  const {avatars, handle, name} = user;
  const time = minutesAgo(created_at);

  let $avatar = $("<img>").addClass("avatar").attr('src', avatars.small);
  let $hashTag = $("<span>").addClass("hashTag").text(handle);
  let $userName = $("<span>").addClass("userName").text(name);
  let $tweetContent = $("<p>").addClass("tweetContent").text(content.text);
  let $timeStamp = $("<p>").addClass("timeStamp").text(time);
  let $div = $("<div>").addClass("headerText").append($userName).append($hashTag);
  let $header = $("<header>").append($avatar).append($div);
  let $footer = $("<footer>").append($timeStamp);
  let $tweet = $("<article>").addClass("tweet").append($header).append($tweetContent).append($footer);
  return $tweet;
};

// This calculates how much time has past since tweet creation
const minutesAgo = (tweetTime) => {
  const date = new Date();
  const diff = date.getTime() - tweetTime - 600000;
  const diffInDays = Math.floor(diff/86400000);
  const diffInHours = Math.floor(diff/3600000);
  const diffInMinutes = Math.floor(diff/60000);
  let time;
  (diffInDays > 0) ? (time = diffInDays + ' days ago') :
    (diffInHours > 0) ? (time = diffInHours + ' hours ago') : (time = diffInMinutes + ' minutes ago');
  return time;
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
    $('.error').text('Your tweet must be less than 140 characters long');
    $('.error').slideDown('fast');
    return true;
  } else if (length < 1) {
    $('.error').text('Your tweet must not be empty');
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