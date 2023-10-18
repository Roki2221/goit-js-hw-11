import axios from 'axios';

async function servicePhotos(request, page) {
  request.split(' ').join('+');
  const response = await axios.get(
    `https://pixabay.com/api/?key=40085171-b4834c19132777055d535b782&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  console.log(response);
  return response;
}

export { servicePhotos };
