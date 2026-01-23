const Movie = require('../models/movie');

exports.getMovies = async (req, res) => {
  try {
    const { search, sort, genre } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 4; 
    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    let sortOption = {};
    if (sort === 'title') sortOption.title = 1;
    if (sort === 'rating') sortOption.rating = -1;
    if (sort === 'year') sortOption.releaseYear = -1;

    const categories = await Movie.distinct('genre');
    
    const totalMovies = await Movie.countDocuments(query);
    const totalPages = Math.ceil(totalMovies / limit);

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.render('index', {
      movies,
      search: search || '',
      sort: sort || '',
      genre: genre || 'All',
      categories,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error("Error in getMovies:", error);
    res.status(500).send("Server Error");
  }
};

exports.addMoviePage = (req, res) => {
  res.render('add');
};

exports.addMovie = async (req, res) => {
  try {
    const { title, genre, rating, releaseYear } = req.body;

    await Movie.create({
      title,
      genre,
      rating,
      releaseYear,
      img: req.file ? req.file.filename : 'default.jpg' 
    });

    res.redirect('/');
  } catch (error) {
    console.error("Error in addMovie:", error);
    res.redirect('/add');
  }
};

exports.editMoviePage = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.redirect('/');
    res.render('edit', { movie });
  } catch (error) {
    res.redirect('/');
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { title, genre, rating, releaseYear } = req.body;

    let updatedData = {
      title,
      genre,
      rating,
      releaseYear
    };

    if (req.file) {
      updatedData.img = req.file.filename;
    }

    await Movie.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect('/');
  } catch (error) {
    console.error("Error in updateMovie:", error);
    res.redirect('/');
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error("Error in deleteMovie:", error);
    res.redirect('/');
  }
};