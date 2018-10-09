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

