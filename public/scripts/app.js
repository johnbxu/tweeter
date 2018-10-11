// Creates tweets DOM element
const createTweetElement = (tweetData) => {
  const {user, content, created_at, likes, liked} = tweetData;
  const {avatars, handle, name} = user;
  const time = minutesAgo(created_at);

  let $avatar = $("<img>").addClass("avatar").attr('src', avatars.small);
  let $hashTag = $("<span>").addClass("hashTag").text(handle);
  let $userName = $("<span>").addClass("userName").text(name);
  let $tweetContent = $("<p>").addClass("tweetContent").text(content.text);
  let $timeStamp = $("<p>").addClass("timeStamp").text(time);
  let $like = $("<i>").addClass("fas fa-heart").addClass('like').data('likes', likes).data('liked', liked);
  let $div = $("<div>").addClass("headerText").append($userName).append($hashTag);
  let $header = $("<header>").append($avatar).append($div);
  let $likesCounter = $('<span>').addClass('likesCounter').text(likes);
  let $footer = $("<footer>").append($timeStamp).append($like).append($likesCounter);
  let $tweet = $("<article>").addClass("tweet").append($header).append($tweetContent).append($footer);
  return $tweet;
};

// This calculates how much time has past since tweet creation
const minutesAgo = (tweetTime) => {
  const date = new Date();
  const diff = date.getTime() - tweetTime;
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

$(function(){
  const loadTweets = function(){
    $.get('/tweets').done(function (tweets) {
      renderTweets(tweets);
    }).done(function (){
      $('.like').each(function(){
        $(this).attr('data-liked', $(this).data('liked'));
        console.log($(this).data('liked'));
      });
    });
  }();




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

  // PROBLEM: data-liked on DOM is reset on page refresh. This causes problems1
  $('.tweets').on('click', '.like', (function(event) {
    if ($(this).attr('data-liked') === 'true') {
      $(this).attr('data-liked', 'false');
      $(this).data('liked', false);
      $(this).data().likes--;
    } else {
      $(this).attr('data-liked', 'true');
      $(this).data('liked', true);
      $(this).data().likes++;
    }
    $(this).siblings('.likesCounter').text($(this).data('likes'));
    $.ajax({
      url: '/tweets/like/',
      method: 'POST',
      data: {
        likes: $(this).data('likes'),
        liked: $(this).data('liked'),
        user: $(this).parents('.tweet').find('.userName').text(),
      }
    });

    // need to figure out dynamic updating of the counter

    console.log($(this).data('likes'));
    console.log($(this).data('liked'));
  }));

  // Compose button - toggles Compose Tweet section
  $('#compose').click(function(){
    $('.new-tweet').slideToggle('slow', function() {
      $('#tweetText').focus();
    });
  });
});