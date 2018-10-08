const charLimit = 140;
const changeLength = function(event) {
  let counter = charLimit - $(this).val().length;
  if (counter < 0) {
    $(this).parent().children('.counter').css('color', 'red');
  } else {
    $(this).parent().children('.counter').css('color', '#244751');
  }
  $(this).parent().children('.counter').text(counter);
};

$(document).ready(() => {
  console.log('dom is ready to go');
  $('textarea').keyup(changeLength);
});

