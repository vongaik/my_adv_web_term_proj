$(document).ready(function () {
    const API_KEY = '3ea3071b6202bebbf90063d8bf5245e3'; // Replaced with my TMDB API Key - needed to log in
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';


    // Function to sort movies by popularity
    function sortMoviesByPopularity() {
        const sortedMovies = [...loadedMovies].sort((a, b) => b.popularity - a.popularity);
        displayMovies(sortedMovies); // Re-render sorted movies
    }

    // Bind the sort functionality to the sort button
    $('#sort-popularity-btn').click(function () {
        if (loadedMovies.length === 0) {
            alert("Load movies before sorting!");
            return;
        }
        sortMoviesByPopularity();
    });

    let currentPage = 1; // Keep track of the current page
    const resultsPerPage = 10;
    let query = "";
    if (query) {
        alert("Please enter a search query!");
        return;
    }

    const sortPopularityButton = document.getElementById('sort-popularity-btn');
    
    // Function to fetch the current search results for movies (Already implemented earlier in your code).
    function fetchSearchResults(page = 1) {
    // Your existing code to fetch the search results.
    // Example structure:
        fetch(`https://api.example.com/movies?page=${page}`)
        .then(response => response.json())
        .then(data => {
            searchResults = data.results;  // Store the results.
            displaySearchResults(searchResults);  // Update the UI with the current search results.
        });
    }   

    // Function to display the current search results (paginated and sorted by popularity if needed).
    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results');
        searchResultsContainer.innerHTML = ''; // Clear the previous results.

        results.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <h3>${movie.title}</h3>
                <p>Popularity: ${movie.popularity}</p>
            `;
            searchResultsContainer.appendChild(movieElement);
        });

        // Handle pagination UI here if necessary (based on currentPage and resultsPerPage).
    }

    // Function to sort the search results by popularity.
    function sortByPopularity() {
        // Sort the current search results by popularity in descending order
        const sortedResults = [...searchResults].sort((a, b) => b.popularity - a.popularity);
        
        // Update the display with the sorted results.
        displaySearchResults(sortedResults);
    }

    // populate the cast column with top people -------------
    // Initial load
    $(document).ready(function () {
    loadTopPeople();
  });

  
  
    // When grid button or view button is clicked

    // GRID/LIST LAYOUT TOGGLE AND INLINE EXPANSION FOR MOVIE SEARCH
    //maybe it doesn't need to be in a function
        // Toggle between grid and list views
        $('#toggle-grid').click(function () {
            $('#searchMovieList').removeClass('list-view').addClass('grid-view');
        });

        $('#toggle-list').click(function () {
            $('#searchMovieList').removeClass('grid-view').addClass('list-view');
        });

        // Toggle search movie details inline expansion
        $(document).on('click', '.movie', function () {
            const $expandMovie = $(this).find('.expandMovie');
            const movieId = $(this).data('id'); // Get the movie ID from the clicked item

        
            // Check if the .expandMovie is visible
            if ($expandMovie.is(':visible')) {
                // If it's visible, slide it up (close it)
                $expandMovie.slideUp();
            } else {
                // If it's not visible, slide up all other expanded .expandMovie elements to squash them
                $('.expandMovie').slideUp();
        
                // Then slide down the current .expandMovie div (expand it)
                $expandMovie.slideDown();
        
                // Optionally load actor details if this is the first time the .expandMovie is being opened
                if ($expandMovie.is(':empty')) {
                    const movieId = $(this).data('id');
                    loadMovieDetails(movieId, $expandMovie);
                }

                // Update the cast-container with the cast for the selected movie
                loadMovieCast(movieId);
            }
        });

        // Load movie cast and details
        $(document).on('click', '.cast-item', function () {
            const $expandCast = $(this).find('.expandCast');  // Select the .expandCast div for that cast item
        
            // Check if the .expandCast is visible
            if ($expandCast.is(':visible')) {
                // If it's visible, slide it up (close it)
                $expandCast.slideUp();
            } else {
                // If it's not visible, slide up all other expanded .expandCast elements to squash them
                $('.expandCast').slideUp();
        
                // Then slide down the current .expandCast div (expand it)
                $expandCast.slideDown();
        
                // Optionally load actor details if this is the first time the .expandCast is being opened
                if ($expandCast.is(':empty')) {
                    const actorId = $(this).data('id');
                    loadActorDetails(actorId, $expandCast);
                }
            }
        });

    // Load popular movies
    function loadPopularMovies() {
        const popularUrl = `${BASE_URL}/movie/popular?api_key=${API_KEY}&append_to_response=credits,reviews`;
        

         // Hide pagination
        $(".pagination").hide();

        $.getJSON(popularUrl, function (data) {
            const headingHTML = `<h1 id="popular-title">Popular Movies Now</h1>`;


            // Ensure the data is fetched and displayed using my Mustache template
            const template = $('#movie-list-template').html();
            const html = Mustache.render(template, data);
            // Combine the heading and movie list and insert into the container
            $('#searchMovieList').html(headingHTML + html);


            
        });
    }

    //fetch top people - Fetch and display top people (cast)---------------------
    function loadTopPeople() {
        const url = `${BASE_URL}/person/popular?api_key=${API_KEY}`;
        
        $.getJSON(url, function (data) {
          const template = $('#cast-list-template').html();
          const html = Mustache.render(template, { cast: data.results, isTopPeople: true });
          $('#cast-container').html(html);

              // Hide the role (cast-role) for Top People
            $('.cast-role').hide();
        });
    }

    // fetch movie cast ----------------------
    function loadMovieCast(movieId) {
        const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&append_to_response=credits,reviews`;
        
        $.getJSON(url, function (data) {
          const template = $('#cast-list-template').html();
          const html = Mustache.render(template, { cast: data.cast, isTopPeople: false });
          $('#cast-container').html(html);

              // Show the role (cast-role) for movie's cast
            $('.cast-role').show();
        });
    }       

    // Load movie details
    function loadMovieDetails(movieId, $expandMovie) {
        //Movie details URL
        const detailsUrl = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,reviews`;

        // Release dates URL
        const releaseDatesUrl = `${BASE_URL}/movie/${movieId}/release_dates?api_key=${API_KEY}`;

        // Fetch movie details
        $.getJSON(detailsUrl, function (data) {

            // Fetch release dates
            $.getJSON(releaseDatesUrl, function (releaseDates) {
                 // Extract the US certification
                const certification = releaseDates.results.find(r => r.iso_3166_1 === 'US')?.release_dates[0]?.certification || 'Not Rated';

                // Add certification to movie details
                data.certification = certification;

                // Render Mustache template with updated movie details
                const template = $('#movie-details-template').html();
                const html = Mustache.render(template, data);
                $expandMovie.html(html).slideDown();

                // Add the rendered details into the correct expandMovie div
                $(`.movie[data-id="${movieId}"]`).find('.expandMovie').html(html).slideDown();
            });
        });
    }

    //load actor details
    function loadActorDetails(actorId, $expandCast) {
        const url = `${BASE_URL}/person/${actorId}?api_key=${API_KEY}&append_to_response=credits,reviews`;
        
        $.getJSON(url, function (data) {
            const template = $('#actor-details-template').html();
            const html = Mustache.render(template, data);
            $expandCast.html(html).slideDown();
        });
    }
    
    // When search is clicked
    $("#search-movies-btn").click(function() {
        query = $("#query").val();
        searchMovies(1); // Start on page 1
    });

    // Search movies
    function searchMovies(pageNumber) {
        currentPage = pageNumber;
        let url = `${BASE_URL}/search/movie?query=${query}&page=${currentPage}&api_key=${API_KEY}&append_to_response=credits,reviews`; //should page be there???? yes
        $("#searchMovieList").html("Searching ...<img src='https://vignette.wikia.nocookie.net/wikiality/images/7/70/ProgressBar.gif/revision/latest?cb=20070406024457'>");     

        // Show pagination
        $(".pagination").show();

        $.getJSON(url, function (data) {
            // Add a heading for the search query
            const headingHTML = `<h2 id="search-heading">Searched: "${query}"</h2>`;
            var template = $('#movie-list-template').html();
            var html = Mustache.render(template, data);
            
            // Combine heading and search results
            $('#searchMovieList').html(headingHTML + html);

            // Attach event listeners for movie titles
            $(document).on('click', '.movie-title', function () {
                const movieId = $(this).data('id');
                loadMovieDetails(movieId);
            });

            
            if (data.results.length === 0) {
                $("#searchMovieList").html("<p>No results found.</p>");
                return;
            }

            currentSearchResults = data.results; // Save results for sorting
            displayMovies(currentSearchResults);

            // Update pagination buttons
            updatePaginationButtons(Math.min(15, data.total_pages)); // Show only available pages
        });
    }

     // Function to display movies
    function displayMovies(movies) {
        const headingHTML = `<h2 id="search-heading">Searched: "${query}"</h2>`;
        const template = $('#movie-list-template').html();
        const html = Mustache.render(template, { results: movies });
        $('#searchMovieList').html(headingHTML + html);
    }

    // Create pagination buttons
    function updatePaginationButtons(totalPages) {
        let paginationHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<button class='pagination-btn ${i === currentPage ? "active-page" : "inactive-page"}' data-page='${i}'>${i}</button>`;
        }
        $(".pagination").html(paginationHTML);

        // Register click event for pagination buttons
        $(".pagination-btn").on('click', function() {
            let pageNumber = $(this).data("page");
            searchMovies(pageNumber);
        });
    }


    // Event listeners for buttons
    $('#popular-movies-btn').on('click', function () {
        loadPopularMovies();
    });

    // $('#search-movies-btn').on('click', function () {
    //     const query = prompt('Enter a movie name:');
    //     if (query) searchMovies(query);
    // });

    // Show cast container when "Popular Movies" button is clicked
    $('#popular-movies-btn').on('click', function () {
    $('#cast-container').show();
    loadTopPeople(); // Ensure it loads the top people
  });

  // Show cast container when "search Movies" button is clicked
  $('#search-movies-btn').on('click', function () {
    $('#cast-container').show();
    loadTopPeople(); // Ensure it loads the top people
  });
  
  // Show cast container when a movie is searched and clicked
  $(document).on('click', '.movie-title', function () {
    const movieId = $(this).data('id');
    $('#cast-container').show(); // Show cast container
    loadMovieDetails(movieId); // Fetch movie details
    loadMovieCast(movieId); // Fetch movie cast
  });
  

});

