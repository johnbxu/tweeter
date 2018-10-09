/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
const charLimit = 140;
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

$(document).ready(() => {
  console.log('dom is ready to go');
  $('textarea').keyup(changeLength);
});


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

const renderTweets = (data) => {
  let $tweets = $('#tweets');
  for (const tweet in data) {
    $tweets.append(createTweetElement(data[tweet]));
  }
};

const renderOneTweet = (data) => {
  $('#tweets').prepend(createTweetElement(data));
};

$(function() {
  const loadTweets = function(){
    $.ajax('/tweets', { method: 'GET' })
      .then(function (tweets) {
        renderTweets(tweets);
      });
  }();
});

$(function() {
  $('#newTweet').click(function(event) {
    if ($('#tweetText').val().length > 140) {
      alert('Your tweet must be less than 140 characters long');
      event.preventDefault();
    } else if ($('#tweetText').val().length < 1) {
      alert('Your tweet must not be empty');
      event.preventDefault();
    } else {
      $.ajax({
        type: 'POST',
        url: '/tweets/',
        data: $('#tweetText').serialize(),
        success: function() {
          $.ajax('/tweets', { method: 'GET' })
            .then(function (tweets) {
              renderOneTweet(tweets[0]);
            });
          $('.counter').text('140'); //refactor this
          $('#tweetText').val('');
        },
        error: function(error, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }
    return false;
  });
});

$(function() {
  $('#compose').click(function(){
    let $newTweet = $(".new-tweet");
    $newTweet.slideToggle('slow', function() {
      $('#tweetText').focus();
    });
  });
});