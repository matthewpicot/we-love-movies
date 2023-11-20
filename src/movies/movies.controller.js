const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function readTheaters(req, res){
    const { movieId } = req.params;
  res.json({ data: await service.readTheaters(Number(movieId)) });
}

async function readReviews(req, res){
    const { movieId } = req.params;
    let data = await service.readReviews(movieId);
    data = data.map( (review) =>{
        return {
            review_id: review.review_id,
            content: review.content,
            score: review.score,
            created_at: review.created_at,
            updated_at: review.updated_at,
            critic_id: review.critic_id,
            movie_id: review.movie_id,
            critic: {
                critic_id: review.critic_id,
                preferred_name: review.preferred_name,
                surname: review.surname,
                organization_name: review.organization_name,
                created_at: review.created_at,
                updated_at: review.updated_at,
            }
        }
    })
    res.json({ data });
}

async function list(req, res) {
	const { is_showing = false } = req.query;
	res.json({ data: await service.list(Boolean(is_showing)) });
}

async function read(req, res){
    res.json({ data: res.locals.movie });
}

async function validateMovieId(req, res, next){
    const { movieId } = req.params;
    const movie = await service.read(Number(movieId));
    
    if(movie) {
        res.locals.movie = movie;
        return next();
    }
    
    next({
        status: 404,
        message: "Movie cannot be found."
    });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(validateMovieId), read],
    readTheaters: [asyncErrorBoundary(validateMovieId), readTheaters],
    readReviews: [asyncErrorBoundary(validateMovieId), readReviews],
}