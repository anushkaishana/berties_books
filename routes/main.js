module.exports = function (app, shopData) {
    // Handle our routes
    app.get('/', function (req, res) {
        res.render('index.ejs', shopData);
    });

    app.get('/about', function (req, res) {
        res.render('about.ejs', shopData);
    });

    app.get('/search', function (req, res) {
        res.render('search.ejs', shopData);
    });

    app.get('/search-result', function (req, res) {
        // Searching in the database
        res.send("You searched for: " + req.query.keyword);
    });

    app.get('/register', function (req, res) {
        res.render('register.ejs', shopData);
    });

    app.post('/registered', function (req, res) {
        // Saving data in database
        res.send(
            'Hello ' +
                req.body.first +
                ' ' +
                req.body.last +
                ' you are now registered! We will send an email to you at ' +
                req.body.email
        );
    });

    app.get('/list', function (req, res) {
        let sqlquery = "SELECT * FROM books";
        db.query(sqlquery, (err, result) => {
            if (err) {
                console.error(err);
                return res.redirect('./');
            }

            let newData = Object.assign({}, shopData, { availableBooks: result });
            console.log(newData);
            res.render('list.ejs', newData);
        });
    });

    app.get('/addbook', (req, res) => {
        res.render('addbook.ejs', shopData);
    });

    app.post('/bookadded', function (req,res) {
        // saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
        // execute sql query
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result) => {
          if (err) {
            return console.error(err.message);
          }
          else {
            res.send(' This book is added to database, name: '
                      + req.body.name + ' price '+ req.body.price);
          }
        });
  }); 

    app.get('/bargainbooks', (req, res) => {
        let sqlquery = "SELECT name, price FROM books WHERE price < 20"; // Query for books under £20
        db.query(sqlquery, (err, result) => {
            if (err) {
                console.error(err.message);
                return res.redirect('/');
            }

            let newData = Object.assign({}, shopData, { bargainBooks: result });
            res.render('bargainbooks.ejs', newData); // Pass filtered data to the template
        });
    });

};
