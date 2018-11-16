const redis = require("redis");
const client = redis.createClient({
    host: "localhost",
    port: 6379
});
const promisify = require("util");

client.on("error", function(err) {
    console.log(err);
});

exports.get = promisify(client.get).bind(client);

exports.get("funky").then(console.log);

exports.setex = promisify(client.setex).bind(client);
exports.del = promisify(client.del).bind(client);

client.setex("catnip", 20, "cute as a button", function(err, data) {
    if (err) {
        console.log(err);
    } else {
        client.get("catnip", function(err, data) {
            console.log(err || data);
        });
    }
});

// client.get("funky", function(err, data) {
//     console.log(err || data);
// });
