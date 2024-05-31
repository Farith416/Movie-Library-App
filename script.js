document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const password = document.getElementById('loginPassword').value;
            const email = document.getElementById('loginEmail').value;
            const loginError = document.getElementById('loginError');
            const passwordPattern = /^(?=.*[A-Za-z]{5,})(?=.*\d).{7,}$/;

            if (!passwordPattern.test(password)) {
                loginError.textContent = 'Password must be at least 7 characters long, contain at least 5 letters and some numbers.';
                loginError.style.color = 'red';
            } else {
                window.location.href = 'Homepage.html';
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const signupError = document.getElementById('signupError');
            const passwordPattern = /^(?=.*[A-Za-z]{5,})(?=.*\d).{7,}$/;

            signupError.textContent = '';

            if (password !== confirmPassword) {
                signupError.textContent = "Passwords don't match!";
                signupError.style.color = 'red';
            } else if (!passwordPattern.test(password)) {
                signupError.textContent = 'Password must be at least 7 characters long, contain at least 5 letters and some numbers.';
                signupError.style.color = 'red';
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const omdbApiKey = '337cc659'; // My OMDB API key
    

    searchButton.addEventListener('click', () => {
        searchMovies(searchInput.value);
    });

    searchInput.addEventListener('keyup', () => {
        searchMovies(searchInput.value);
    });

    const searchMovies = (query) => {
        searchResults.innerHTML = '';
        if (query.trim() === '') return;
        fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.Response === 'True') {
                    const movies = data.Search;
                    movies.forEach(movie => {
                        const movieElement = document.createElement('div');
                        movieElement.textContent = movie.Title;
                        movieElement.classList.add('search-result');
                        movieElement.addEventListener('click', () => {
                            fetchAndDisplayMovieDetails(movie.imdbID);
                        });
                        searchResults.appendChild(movieElement);
                    });
                } else {
                    const noResultsMessage = document.createElement('div');
                    noResultsMessage.textContent = 'No movies found';
                    searchResults.appendChild(noResultsMessage);
                }
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                alert('An error occurred while fetching movie details.');
            });
    };

    const fetchAndDisplayMovieDetails = (imdbID) => {
        fetch(`https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${imdbID}`)
            .then(response => response.json())
            .then(data => {
                const movieDetails = `
                    <h2>${data.Title}</h2>
                    <p><strong>Year:</strong> ${data.Year}</p>
                    <p><strong>Genre:</strong> ${data.Genre}</p>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actors:</strong> ${data.Actors}</p>
                    <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
                    <p><strong>Metascore:</strong> ${data.Metascore}</p>
                    <p><strong>Plot:</strong> ${data.Plot}</p>
                    <img src="${data.Poster}" alt="${data.Title} Poster">
                    <button onclick="openAddToListModal('${data.Title}')">Add to List</button>
                `;
                searchResults.innerHTML = movieDetails;
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
                alert('An error occurred while fetching movie details.');
            });
    };

    const signOutButton = document.getElementById('signOutButton');
    const confirmSignOutButton = document.getElementById('confirmSignOutButton');
    const cancelSignOutButton = document.getElementById('cancelSignOutButton');
    const signOutModal = document.getElementById('signOutModal');

    const createListButton = document.getElementById('createListButton');
    const listNameInput = document.getElementById('listNameInput');
    const listVisibility = document.getElementById('listVisibility');
    const userLists = document.getElementById('userLists');

    const deleteConfirmationModal = document.getElementById('deleteConfirmationModal');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    const currentUser = 'user123'; 

    let movieLists = JSON.parse(localStorage.getItem('movieLists')) || [];

    const renderUserLists = () => {
        userLists.innerHTML = '';
        movieLists.forEach((list, index) => {
            if (list.owner === currentUser || list.visibility === 'public') {
                const listDiv = document.createElement('div');
                listDiv.className = 'list';
                listDiv.innerHTML = `
                    <h3>${list.name} (${list.visibility})</h3>
                    <ul>
                        ${list.movies.map((movie, movieIndex) => `
                            <li>
                                ${movie}
                                <button onclick="confirmDeleteMovie(${index}, ${movieIndex})">Delete</button>
                            </li>`).join('')}
                    </ul>
                    ${list.owner === currentUser ? `<button onclick="deleteList(${index})">Delete List</button>` : ''}
                `;
                userLists.appendChild(listDiv);
            }
        });
    };

    const saveLists = () => {
        localStorage.setItem('movieLists', JSON.stringify(movieLists));
        renderUserLists();
    };

    createListButton.addEventListener('click', () => {
        const listName = listNameInput.value;
        const visibility = listVisibility.value;
        if (listName.trim() === '') {
            alert('Please enter a list name.');
        } else {
            movieLists.push({ name: listName, visibility, movies: [], owner: currentUser });
            saveLists();
            listNameInput.value = '';
            listVisibility.value = 'public';
        }
    });

    window.openAddToListModal = (movie) => {
        document.getElementById('listNameToAddInput').value = '';
        document.getElementById('addToListModal').style.display = 'block';
        document.getElementById('searchResults').dataset.movieToAdd = movie;
    };

    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    cancelSignOutButton.addEventListener('click', () => {
        signOutModal.style.display = 'none';
    });

    signOutButton.addEventListener('click', () => {
        signOutModal.style.display = 'block';
    });

    confirmSignOutButton.addEventListener('click', () => {
        window.location.href = 'index.html'; 
    });

    document.getElementById('addToSelectedListButton').addEventListener('click', () => {
        const movie = searchResults.dataset.movieToAdd;
        const listName = listNameToAddInput.value;
        const list = movieLists.find(list => list.name === listName && list.owner === currentUser);
        if (list) {
            if (list.movies.includes(movie)) {
                alert('This movie is already in the list.');
            } else {
                list.movies.push(movie);
                saveLists();
                document.getElementById('addToListModal').style.display = 'none';
            }
        } else {
            alert('List not found');
        }
    });

    document.getElementById('cancelAddToListButton').addEventListener('click', () => {
        document.getElementById('addToListModal').style.display = 'none';
    });

    window.deleteList = (index) => {
        const listToDelete = movieLists[index];
        if (listToDelete.owner === currentUser) {
            deleteListModal.style.display = 'block';
    
            confirmDeleteButton2.onclick = () => {
                deleteListModal.style.display = 'none';
                movieLists.splice(index, 1);
                saveLists();
                renderUserLists(); 
            };
    
            cancelDeleteButton2.onclick = () => {
                deleteListModal.style.display = 'none';
            };
        } else {
            alert('You do not have permission to delete this list.');
        }
    };

    window.confirmDeleteMovie = (listIndex, movieIndex) => {
        deleteConfirmationModal.style.display = 'block';

        confirmDeleteButton.onclick = () => {
            deleteConfirmationModal.style.display = 'none';
            movieLists[listIndex].movies.splice(movieIndex, 1);
            saveLists();
        };

        cancelDeleteButton.onclick = () => {
            deleteConfirmationModal.style.display = 'none';
        };
    };

    renderUserLists();
    
});
