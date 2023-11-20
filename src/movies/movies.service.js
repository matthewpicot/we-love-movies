const knex = require("../db/connection");

function readTheaters(movieId) {
    return knex("movies")
      .join("movies_theaters", "movies_theaters.movie_id", "movies.movie_id")
      .join("theaters", "movies_theaters.theater_id", "theaters.theater_id")
      .select("theaters.*")
      .where({ "movies.movie_id": movieId });
  }

  function readReviews(movieId){
    return knex("movies")
        .select("reviews.*", "critics.*")    
        .join("reviews", "movies.movie_id", "reviews.movie_id")
        .join("critics", "reviews.critic_id", "critics.critic_id")
        .where({ "movies.movie_id": movieId });
    }

function list(isShowing) {
	if(isShowing) {
		return knex("movies")
			.join("movies_theaters", "movies.movie_id", "movies_theaters.movie_id")
			.distinct("movies_theaters.movie_id")
			.select("movies.*")
			.where({ is_showing: true });
	}

	return knex("movies")
		.select("*");
}

function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ movie_id: movieId })
        .first();
}

module.exports = {
    list,
    read,
    readTheaters,
    readReviews,
}