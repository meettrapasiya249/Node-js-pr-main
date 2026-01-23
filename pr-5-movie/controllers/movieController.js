const Movie = require('../models/movie');

// 1. Get all movies with Search, Sort, Category Filter, and Pagination
exports.getMovies = async (req, res) => {
  try {
    const { search, sort, genre } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 4; // Ek page par 4 movies
    const skip = (page - 1) * limit;

    let query = {};

    // Search Logic (Title ya Genre mein search)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    // Category (Genre) Filter Logic
    // Agar genre 'All' nahi hai aur query mein hai, toh filter apply karo
    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    // Sorting Logic
    let sortOption = {};
    if (sort === 'title') sortOption.title = 1;
    if (sort === 'rating') sortOption.rating = -1;
    if (sort === 'year') sortOption.releaseYear = -1;

    // Database se unique categories (genres) nikalna header ke liye
    const categories = await Movie.distinct('genre');
    
    // Pagination calculation
    const totalMovies = await Movie.countDocuments(query);
    const totalPages = Math.ceil(totalMovies / limit);

    // Final Data Fetching
    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Index page render karna saare data ke sath
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

// 2. Render Add Movie Page
exports.addMoviePage = (req, res) => {
  res.render('add');
};

// 3. Create New Movie
exports.addMovie = async (req, res) => {
  try {
    const { title, genre, rating, releaseYear } = req.body;

    await Movie.create({
      title,
      genre,
      rating,
      releaseYear,
      img: req.file ? req.file.filename : 'default.jpg' // Image handle karna
    });

    res.redirect('/');
  } catch (error) {
    console.error("Error in addMovie:", error);
    res.redirect('/add');
  }
};

// 4. Render Edit Movie Page
exports.editMoviePage = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.redirect('/');
    res.render('edit', { movie });
  } catch (error) {
    res.redirect('/');
  }
};

// 5. Update Movie Details
exports.updateMovie = async (req, res) => {
  try {
    const { title, genre, rating, releaseYear } = req.body;

    let updatedData = {
      title,
      genre,
      rating,
      releaseYear
    };

    // Agar nayi image upload hui hai toh hi update karein
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

// 6. Delete Movie
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (error) {
    console.error("Error in deleteMovie:", error);
    res.redirect('/');
  }
};