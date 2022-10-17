const highlight = document.querySelector('.highlight');

async function create_highlight() {
  
  const movie = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')).json();
  const genres = []
  movie.genres.forEach(({name})=>{
    genres.push(name)
  })
  
  const trailer_highlight = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')).json();
  
  highlight.innerHTML = `        
  <a class="highlight__video-link" href="https://www.youtube.com/watch?v=${trailer_highlight.results[0].key}" target="_blank">
  <div class="highlight__video" style ="background-image: url('${movie.backdrop_path}')">
  <img src="./assets/play.svg" alt="Play">
  </div>
  </a>
  <div class="highlight__info">
  <div class="highlight__title-rating">
  <h3 class="highlight__title">${movie.title}</h3>
  <span class="highlight__rating">${movie.vote_average.toFixed(1)}</span>
  </div>
  <div class="highlight__genre-launch">
  <span class="highlight__genres">${genres.join(', ')}</span>
  /
  <span class="highlight__launch">${movie.release_date}</span>
  </div>
  <p class="highlight__description">
  ${movie.overview}
  </p>
  </div>`
}
create_highlight();

const movies = document.querySelector('.movies')

let array_movies = [];

async function visualize_movies() {
  const { results } = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')).json();

  while (results.length > 1){
    let movies_list = results.splice(0,5)
    array_movies.push(movies_list)
  }
  populate_movies(array_movies[0])
}

visualize_movies()


function populate_movies (array) {
  movies.innerHTML = ''

  array.forEach(video => {
    const movie = document.createElement('div');
    movie.classList.add('movie');
    movie.style.backgroundImage = `url(${video.poster_path})`;
    movie.id = video.id;

    movie.addEventListener('click', (event) => {
      open_modal(event.target.id)
    })

    const movie__info = document.createElement('div')
    movie__info.classList.add('movie__info')

    const movie__title = document.createElement('span')
    movie__title.classList.add('movie__title')
    movie__title.textContent = video.title

    const movie__rating = document.createElement('span')
    movie__rating.classList.add('movie__rating')
    movie__rating.textContent = video.vote_average

    const image = document.createElement('img')
    image.src = "./assets/estrela.svg"

    movie__rating.append(image)
    movie__info.append(movie__title, movie__rating)
    movie.append(movie__info)
    movies.append(movie)
  })
}

let current_position = 0
let btn_next = document.querySelector('.btn-next')

btn_next.addEventListener('click', move_right)

function move_right () {
  current_position += 1;
  if(current_position >= array_movies.length){
    current_position = 0
  }
  populate_movies(array_movies[current_position])
}

let btn_prev = document.querySelector('.btn-prev')
btn_prev.addEventListener('click', move_left)


function move_left () {
  current_position -= 1;
  if(current_position < 0){
    current_position = array_movies.length -1
  }
  populate_movies(array_movies[current_position])
}

const input = document.querySelector('.input');

input.addEventListener('keydown', (key) => {
  if(key.key === 'Enter'){
    search_movies();
  }
})

async function search_movies () {
  array_movies = []
  const { results } = await (await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=' + input.value)).json();

  if(!input.value){
    return visualize_movies();
  }
  while (results.length > 1){
    let movies_list = results.splice(0,5)
    array_movies.push(movies_list)
  }
  populate_movies(array_movies[0])
}

const close_modal = document.querySelector('.modal')

close_modal.addEventListener('click', () => {
  document.querySelector('.modal').classList.add('hidden')
})

async function open_modal (id_movie) {
  const movie = await (await fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id_movie}?language=pt-BR`)).json();
  document.querySelector('.modal').classList.remove('hidden')
  document.querySelector('.modal__title').textContent = movie.title
  document.querySelector('.modal__img').src = movie.backdrop_path
  document.querySelector('.modal__description').textContent = movie.overview
  document.querySelector('.modal__average').textContent = movie.vote_average.toFixed(1)

  let genres = []
  movie.genres.forEach(({name})=>{
    genres.push(name)
  })
  
  if(genres[2]){
    document.querySelector('.modal__genres').innerHTML =`
    <span class="modal__genre">${genres[0]}</span>
    <span class="modal__genre">${genres[1]}</span>
    <span class="modal__genre">${genres[2]}</span>`
    return
  }

  if(genres[1]){
    document.querySelector('.modal__genres').innerHTML =`
    <span class="modal__genre">${genres[0]}</span>
    <span class="modal__genre">${genres[1]}</span>`
    return
  }

  if(genres[0]){
    document.querySelector('.modal__genres').innerHTML =`
    <span class="modal__genre">${genres[0]}</span>`
  }

}

