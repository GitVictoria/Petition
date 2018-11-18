var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/petition`
);

exports.getEmail = email => {
    return db.query(
        `SELECT id, pass FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.getCitySigners = city => {
    return db.query(
        `SELECT first, last, age, city, url
        FROM signatures
        LEFT JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id
        WHERE LOWER(city) = LOWER($1)`,
        [city || null]
    );
};

exports.getSigners = () => {
    return db.query(
        `SELECT first, last, age, city, url
        FROM signatures
        LEFT JOIN user_profiles
        ON signatures.user_id = user_profiles.user_id`
    );
};

exports.createUsers = (first, last, email, pass) => {
    return db.query(
        `INSERT INTO users (first, last, email, pass)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *`,
        [first, last, email, pass]
    );
};

exports.updateUsersPass = (first, last, email, pass, user_id) => {
    return db.query(
        `UPDATE users SET first = $1, last = $2, email = $3, pass = $4 WHERE id = $5;`,
        [first, last, email, pass, user_id]
    );
};

exports.updateUsersNoPass = (first, last, email, user_id) => {
    return db.query(
        `UPDATE users SET first = $1, last = $2, email = $3 WHERE id = $4;`,
        [first, last, email, user_id]
    );
};

exports.deleteSig = user_id => {
    return db.query(`DELETE FROM signatures WHERE id = $1`, [user_id]);
};

exports.deleteProfile = () => {
    return db.query(`DELETE FROM user_profiles WHERE id = $1`);
};

exports.upsertUser_profiles = (age, city, url) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url)
VALUES ($5, $6, $7)
ON CONFLICT (user_id)
DO UPDATE SET age = $5, city = $6, url = $7;`,
        [age, city, url]
    );
};

exports.createSignatures = (first, last, sig, user_id) => {
    return db.query(
        `INSERT INTO signatures (first, last, sig, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
        [first, last, sig, user_id]
    );
};

exports.getSignature = id => {
    console.log(id);
    return db.query(`SELECT sig FROM signatures WHERE id = $1`, [id]);
};

exports.createProfile = (age, city, url, user_id) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [age, city, url, user_id]
    );
};
// NOTES
// in the GET route do the query to get all the info
// once have it pass it all to the template
// if the value didn;t change just override the VALUES
// pull our rows and update
// password field is black
//manually check if they typed something
// IF they typed something hash
// if req.body.pass is not an empty field you need to do the bcrypt and hash again
// create onboarding page (info about users) and then there is signers per city
// user_profile -> insert if necessary or update
// for one POST request two queries should happen at the same time
// pass one promise
// AGE CITY URL
// users can leave this blank
// the url has to be the link, print out in the list name and the city
// city is clickable, leads
// we only wana show users that SIGNED the petition, not the ones that just registered

// Additional database table called users
// we do not store the password  in the database as it can eaisly be comprmised
// we hash the passwords with hashing algorythm
// we remeber the hash and NOT the password.
// the hash is what we store in the database
// once the password is hashed, then we can store the rest of info indatabase
// when user logs in, I take the password hash it, compare it ott existing hash and authenticate
// add a random string to already hashed password, for extra security
// that random string is a 'salt' = this will be saved in database together with hte hash password
// call functions from bcript js library, 1. Generate Salt 2. CReate Hash 3. compare HASH when log ininspect
//
//
/// after user registers, treat them as logged in
// query that uses
//
//
//
// req.body.firstname = will give me access to user input
// write functions that read cookieSession//if user goes to petition rourte and first and last name are undefined
// that means I need to redirect them to relevant pages
// store id of the signature of the //
// if the ID exists in my cookie the user signed my petition and if not //
// write a log out ROUTE that redirects req.session = null ( delete the cookies) and redirect them somewhere
// Never pass actual parameters to query. USE $1, $2... + ARRAY
// This prevents SQL Inject attack, where malicious user could inject code into table
// petition page is a handlebars template
// everytime user clicks or submits a form there is a new page
//get route for rendering template
// post route for submit sugnature button
// 3 get routes 3 pages
// all handled with handlebars

// part 1 is one table

// there has to be 3rd input field which stores canvas as a string
// mousedown on canvas, record the mouse being, listen to mouse move,
// draw a line from where the mouse used to be the where it is now
// that's how you get the string
// var c = document.getQuerySelector('canvas')
// c.toDataURL
// when user clicks submit s/he submits 3 fiels, first, last and image data for the canvas
// NEVER show signature to anyone who isn't the owner
// signers page call function that gets database query
// get;s all signatures. Promise is resolved with1st last name
// render them, in the template you loop through those results, render them and put htem in the template
