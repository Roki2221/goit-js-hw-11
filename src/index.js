// api key 40085171-b4834c19132777055d535b782
//https://pixabay.com/api/?key=40085171-b4834c19132777055d535b782&q=yellow+flowers&image_type=photo
import Notiflix from 'notiflix';
import { servicePhotos } from './js/photo-api';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
searchForm.elements.subBtn.setAttribute('disabled', 'true');
let page = 1;
let maxpage = 0;

function handleInput() {
  if (searchForm.elements.searchQuery.value.length !== 0) {
    return searchForm.elements.subBtn.removeAttribute('disabled');
  }
  searchForm.elements.subBtn.setAttribute('disabled', 'true');
}

function handleSubmit(event) {
  event.preventDefault();
  if (searchForm.elements.searchQuery.value.trim().length === 0) {
    Notiflix.Notify.warning('Sorry, uncorrect search query. Please try again.');
    return;
  }
  page = 1;
  maxpage = 0;
  galleryContainer.innerHTML = '';
  loadBtn.style.visibility = 'hidden';
  servicePhotos(searchForm.elements.searchQuery.value, page)
    .then(response => {
      if (response.data.hits.length === 0) {
        throw new Error('Empty response');
      }

      maxpage = Math.ceil(response.data.totalHits / 40);

      console.log('maxpage', maxpage);
      galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup(response));
      if (maxpage > 1) {
        loadBtn.style.visibility = 'visible';
      }
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
function loadMoreClick() {
  page += 1;
  if (maxpage === page) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    loadBtn.style.visibility = 'hidden';
  }

  servicePhotos(searchForm.elements.searchQuery.value, page)
    .then(response => {
      if (response.data.hits.length === 0) {
        throw new Error('Empty response');
      }
      console.log('maxpage', maxpage);
      galleryContainer.insertAdjacentHTML('beforeend', galleryMarkup(response));
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

loadBtn.addEventListener('click', loadMoreClick);
