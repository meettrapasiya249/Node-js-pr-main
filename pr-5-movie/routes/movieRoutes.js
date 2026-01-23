const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', movieController.getMovies);

router.get('/add', movieController.addMoviePage);
router.post('/add', upload.single('img'), movieController.addMovie);

router.get('/edit/:id', movieController.editMoviePage);
router.post('/edit/:id', upload.single('img'), movieController.updateMovie);

router.get('/delete/:id', movieController.deleteMovie);

module.exports = router;
