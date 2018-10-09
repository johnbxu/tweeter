/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
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


const loadTweets = function(){
  $(document).ready(() => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function (tweets) {
        renderTweets(tweets);

      });
  });
}();

$(function() {
  var $button = $('#newTweet');
  $button.on('submit', function (event) {
    event.preventDefault();
    console.log('Button clicked, performing ajax call...');
    $.ajax({
      type: 'POST',
      data: $(this).serialize(),
      success: function(data, textStatus, error) {
        console.log(data);
      },
      error: function(error, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });
});
