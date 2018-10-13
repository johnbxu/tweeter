// Creates tweets DOM element
const createTweetElement = (tweetData) => {
  const {id, user, content, created_at, likes, liked} = tweetData;
  const {avatars, handle, name} = user;
  const time = minutesAgo(created_at);
  let $avatar = $("<img>").addClass("avatar").attr('src', avatars.small);
  let $hashTag = $("<span>").addClass("hashTag").text(handle);
  let $userName = $("<span>").addClass("userName").text(id);
  let $tweetContent = $("<p>").addClass("tweetContent").text(content.text);
  let $timeStamp = $("<p>").addClass("timeStamp").text(time);
  let $like = $("<i>").addClass("fas fa-heart like").data('likes', likes).data('liked', liked).data('id', id);
  let $flag = $("<i>").addClass("fas fa-flag");
  let $retweet = $("<i>").addClass("fas fa-retweet");
  let $likesCounter = $('<span>').addClass('likesCounter').text(likes);
  let $icons = $("<div>").addClass("icons").append($flag).append($retweet).append($like).append($likesCounter);
  let $div = $("<div>").addClass("headerText").append($userName).append($hashTag);
  let $header = $("<header>").append($avatar).append($div);
  let $footer = $("<footer>").append($timeStamp).append($icons);
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
    (diffInHours > 0) ? (time = diffInHours + ' hours ago') :
      (diffInMinutes > 0) ? (time = diffInMinutes + ' minutes ago') :
        (time = 'A few seconds ago');
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
  if (Cookies.get('auth')) {
    console.log(Cookies.get('auth'));
    $.post({
      url: '/tweets/',
      data: {
        text: $('.newTweetForm').serialize().slice(5),
        token: Cookies.get('auth'),
      }
    }).done(function(response) {
      $('.tweets').prepend(createTweetElement(response));
    });
  } else {
    console.log('log in first!');
  }
};

// Renders tweets currently in database
$(function(){
  const loadTweets = function(){
    $.get('/tweets/').done(function (tweets) {
      renderTweets(tweets);
    }).done(function (){
      $('.like').each(function(){
        $(this).attr('data-liked', $(this).data('liked'));
      });
    });
  }();

  // Tracks how many characters are in tweet text area
  $('textarea').keyup(changeLength);

  // On click of tweet button
  $('.newTweetForm').submit(function(event) {
    event.preventDefault();
    if (!displayError($(this).children('textarea').val().length)) {
      ajaxMakeNewTweet();
      $(this).children('textarea').val('');
      $(this).children('.counter').text(140);
      $(this).siblings('.error').slideUp('fast');
    }
  });

  // Client side tracking for likes and liked state
  $('.tweets').on('click', '.like', (function() {
    if (Cookies.get('auth')) {
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
          id: $(this).data('id'),
          token: Cookies.get('auth'),
        }
      });
    } else {
      alert('log in first!');
    }
  }));

  // Compose button - toggles Compose Tweet section
  $('#compose').click(function(){
    $('.new-tweet').slideToggle('slow', function() {
      $('#tweetText').focus();
    });
  });

  $('.close').click(function(){
    $('#myModal').css('display', 'none');
  });
  $('#logIn').click(function(){
    $('#myModal').css('display', 'block');
  });

  // registration form
  $('.register').click(function(event){
    // event.preventDefault();
    $.post('/register', $('.authentication').serialize())
      .done(function(response) {
        if (!response) {
          alert('Email already Exists');
        } else {
          alert('User registered. Please login now.');
        }
      });
  });

  // login form
  $('.login').click(function(event){
    // event.preventDefault();
    $.post('/login', $('.authentication').serialize())
      .success(function (response) {
        $('#myModal').css('display', 'none');
        Cookies.set('auth', response.token);
        toggleLoginDisplay(Cookies.get('auth'));
      });
  });
  $('#logOut').click(function(event) {
    event.preventDefault();
    $.post('/logout', Cookies.get('auth'))
      .success(function () {
        Cookies.remove('auth');
        toggleLoginDisplay(Cookies.get('auth'));
      });
  });
  toggleLoginDisplay(Cookies.get('auth'));
});

const toggleLoginDisplay = (logInStatus) => {
  if (logInStatus) {
    $('#logIn').css('display', 'none');
    $('#compose').css('display', 'block');
    $('#logOut').css('display', 'block');
  } else {
    $('#logIn').css('display', 'block');
    $('#compose').css('display', 'none');
    $('#logOut').css('display', 'none');
  }
}