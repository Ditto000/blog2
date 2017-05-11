var express  = require('express');
var pg       = require('pg');

var router   = express.Router();
var database = new pg.Pool({database: 'blog_with_database'});

// Index.
router.get('/', function(request, response) {
	database.query('SELECT * FROM posts', function(error, result) {
		response.render('blog/index', {posts: result.rows});
	});
});

// Create.
router.post('/', function(request, response) {
	database.query('INSERT INTO posts (title, body, slug) VALUES ($1, $2, $3)', [request.body.title, request.body.body, request.body.slug], function(error, result) {
		response.redirect(`/blog/${request.body.slug}`);
	});
});

// New.
router.get('/new', function(request, response) {
	response.render('blog/new');
});

// Show.
router.get('/:slug', function(request, response) {
	database.query('SELECT * FROM posts WHERE slug = $1', [request.params.slug], function(error, result) {
		response.render('blog/show', {post: result.rows[0]});
	});
});

module.exports = router;
