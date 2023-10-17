// api key 40085171-b4834c19132777055d535b782
//https://pixabay.com/api/?key=40085171-b4834c19132777055d535b782&q=yellow+flowers&image_type=photo
import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
searchForm.elements.subBtn.setAttribute('disabled', 'true');
const page = 1;

async function servicePhotos(request) {
  request.split(' ').join('+');
  const response = await axios.get(
    `https://pixabay.com/api/?key=40085171-b4834c19132777055d535b782&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
  );
  console.log(response);
  return response;
}

function handleInput() {
  if (searchForm.elements.searchQuery.value.length !== 0) {
    return searchForm.elements.subBtn.removeAttribute('disabled');
  }
  searchForm.elements.subBtn.setAttribute('disabled', 'true');
}

function handleSubmit(event) {
  event.preventDefault();
  galleryContainer.innerHTML = '';
  loadBtn.style.visibility = 'hidden';
  servicePhotos(searchForm.elements.searchQuery.value)
    .then(response => {
      if (response.data.hits.length === 0) {
        throw new Error('Empty response');
      }
      galleryContainer.insertAdjacentHTML(
        'afterbegin',
        galleryMarkup(response)
      );
      loadBtn.style.visibility = 'visible';
      console.log(1);
    })
    .catch(error => {
      if (error.message === 'Empty response') {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.warning(
          'Oops! Something went wrong! Try reloading the page!'
        );
      }
    });
}

searchForm.addEventListener('submit', handleSubmit);

searchForm.elements.searchQuery.addEventListener('input', handleInput);

function galleryMarkup(dataObj) {
  const {
    data: { hits },
  } = dataObj;
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" style="width:100%"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`
    )
    .join('');
}
