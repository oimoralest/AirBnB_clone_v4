$(document).ready(function () {
  const amenitiesIds = {};
  const statesIds = {};
  const citiesIds = {};
  const amenities = [];
  const states = [];
  const cities = [];

  // Actualiza el texto del tag h4 en la seccion filters
  function updateList (list) {
    let text = '';
    for (const string of list) {
      if (text === '') {
        text = string;
      } else {
        text = text + ' ' + string;
      }
    }
    return text;
  }
  // Agrega un evento a cada input en la seccion filters
  $('input').click(function () {
    const name = $(this).attr('data-class');
    if (this.checked) {
      console.log($(this).attr('data-class'));
      if (name === ':amenity_name') {
        amenitiesIds[$(this).attr('data-name')] = $(this).attr('data-id');
        amenities.push(this.parentElement.textContent);
        $('.amenities h4').text(function () {
          return updateList(amenities);
        });
      } else if (name === ':state_name' || name === ':city_name') {
        if (name === ':state_name') {
          statesIds[$(this).attr('data-name')] = $(this).attr('data-id');
          states.push(this.parentElement.textContent);
        } else {
          console.log(this.parentElement.parentElement.previousElementSibling.innerText);
          citiesIds[$(this).attr('data-name')] = $(this).attr('data-id');
          cities.push(this.parentElement.textContent);
        }
        $('.locations h4').text(function () {
          return updateList(states.concat(cities));
        });
      }
    } else {
      if (name === ':amenity_name') {
        $('.amenities h4').text(() => {
          amenities.splice(amenities.indexOf(this.parentElement.textContent), 1);
          const text = updateList(amenities);
          return text;
        });
        if (amenities.length === 0) {
          $('.amenities h4').text(function () {
            if (this.innerHTML === '') {
              this.innerHTML = '&nbsp;';
            }
          });
          postApi();
        }
        delete amenitiesIds[$(this).attr('data-name')];
      } else if (name === ':state_name' || name === ':city_name') {
        $('.locations h4').text(() => {
          if (name === ':state_name') {
            states.splice(states.indexOf(this.parentElement.textContent), 1);
          } else {
            cities.splice(cities.indexOf(this.parentElement.textContent), 1);
          }
          const text = updateList(states.concat(cities));
          return text;
        });
        if (states.length === 0 || cities.length === 0) {
          $('.locations h4').text(function () {
            if (this.innerHTML === '') {
              this.innerHTML = '&nbsp;';
            }
          });
        }
      }
    }
  });
  // Verifica el estado de la api
  $
    .get('http://localhost:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('DIV#api_status').addClass('available');
      } else {
        $('DIV#api_status').removeClass('available');
      }
    });
  // Actualiza la informacion de la seccion places
  function postApi () {
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search/',
      data: JSON.stringify({ amenities: amenities }),
      contentType: 'application/json',
      success: function (response) {
        if ($('article')) {
          $('article').remove();
        }
        for (const place of response) {
          $ // Posiblemente haya que cambiar esto para borrar el owner!
            .get(`http://localhost:5001/api/v1/users/${place.user_id}`, function (data) {
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
  // Agrega un evento al boton search
  $('section.filters button').click(function () {
    if (amenities.length) {
      postApi();
    }
  });
});
