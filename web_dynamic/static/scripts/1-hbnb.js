$(document).ready(function () {
  const amenitiesIds = {};
  const amenities = [];
  function updateList () {
    let text = '';
    for (const string of amenities) {
      if (text === '') {
        text = string;
      } else {
        text = text + ', ' + string;
      }
    }
    return text;
  }
  $('.popover input[type=checkbox]').click(function () {
    if (this.checked) {
      amenitiesIds[$(this).attr('data-name')] = $(this).attr('data-id');
      amenities.push($(this).attr('data-name'));
      $('.amenities h4').text(function () {
        const text = updateList();
        return text;
      });
    } else {
      $('.amenities h4').text(() => {
        amenities.splice(amenities.indexOf($(this).attr('data-name')), 1);
        const text = updateList();
        return text;
      });
      delete amenitiesIds[$(this).attr('data-name')];
    }
    if (amenities.length === 0) {
      $('.amenities h4').text(function () {
        if (this.innerHTML === '') {
          this.innerHTML = '&nbsp;';
        }
      });
    }
  });
});
