/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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

// Tracks how many characters are in tweet text area
$(document).ready(() => {
  $('textarea').keyup(changeLength);
});

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
  let $tweets = $('#tweets');
  for (const tweet in data) {
    $tweets.append(createTweetElement(data[tweet]));
  }
};

// Renders only one tweet and prepends it to #tweets section
const renderOneTweet = (data) => {
  $('#tweets').prepend(createTweetElement(data));
};

// Changes text of error box based on length of tweet
const displayError = (length) => {
  if (length > 140) {
    $('.errorMessage').text('Your tweet must be less than 140 characters long');
    $('.error').slideDown('fast');
  } else {
    $('.errorMessage').text('Your tweet must not be empty');
    $('.error').slideDown('fast');
  }
};

// Creates an AJAX request for making a new tweet, and updates page to show new tweet
const ajaxMakeNewTweet = () => {
  $.ajax({
    type: 'POST',
    url: '/tweets/',
    data: $('#tweetText').serialize(),
  }).done(function(response) {
    $('#tweets').prepend(createTweetElement(response));
  });
};

// Renders tweets currently in database
$(function() {
  const loadTweets = function(){
    $.ajax('/tweets', { method: 'GET' })
      .then(function (tweets) {
        renderTweets(tweets);
      });
  }();
});

// On click of tweet button
$(function() {
  $('#newTweet').click(function(event) {
    const length = $('#tweetText').val().length;
    event.preventDefault();
    if (length > 140 || length < 1) {
      displayError(length);
    } else {
      ajaxMakeNewTweet();
    }
  });
});

// Compose button - toggles Compose Tweet section
$(function() {
  $('#compose').click(function(){
    let $newTweet = $(".new-tweet");
    $newTweet.slideToggle('slow', function() {
      $('#tweetText').focus();
    });
  });
});