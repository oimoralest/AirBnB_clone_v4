$(document).ready(function () {
  const amenitiesIds = [];
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
      amenitiesIds.push($(this).attr('data-id'));
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
      amenitiesIds.splice(amenitiesIds.indexOf($(this).attr('data-id')), 1);
    }
    if (amenities.length === 0) {
      $('.amenities h4').text(function () {
        if (this.innerHTML === '') {
          this.innerHTML = '&nbsp;';
        }
      });
      postApi();
    }
  });
  $
    .get('http://0.0.0.0:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('DIV#api_status').addClass('available');
      } else {
        $('DIV#api_status').removeClass('available');
      }
    });
  function postApi () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({ amenities: amenitiesIds }),
      contentType: 'application/json',
      success: function (response) {
        if ($('article')) {
          $('article').remove();
        }
        for (const place of response) {
          $ // Posiblemente haya que cambiar esto!
            .get(`http://0.0.0.0:5001/api/v1/users/${place.user_id}`, function (data) {
              $(`<article>
                  <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">${place.price_by_night}</div>
                  </div>
                  <div class="information">
                    <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? 's' : ''}</div>
                    <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? 's' : ''}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? 's' : ''}</div>
                  </div>
                  <div class="user">
                    <b>Owner:</b> ${data.first_name} ${data.last_name}
                  </div>
                  <div class="description">
                    ${place.description}
                  </div>
                </article>`).appendTo('section.places');
            });
        }
      }
    });
  }
  postApi();
  $('section.filters button').click(function () {
    if (amenities.length) {
      postApi();
    }
  });
});
