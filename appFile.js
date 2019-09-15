const express = require("express");
const app = express();
const fs = require('fs');

app.get("/", (req, resp) => {
    resp.send("Hello");
});

app.get("/api/tours1", (req, res) => {
    console.log("start");
    const tour = JSON.parse(
        fs.readFileSync(`${__dirname}/data/tours-simple.json`)
    );
  //  console.log(tour);

});



app.get("/api/tours2", (req, res) => {
    const readable = fs.createReadStream("../Node-tour/data/tours-simple.json");
    const out = readable.pipe(res);  //läse in i stream
    console.log(out);
});

app.get("/api/tours", (req, resp) => {
    resp.send("../Node-tour/data/tours-simple.json");
    resp.status(200).json({
        status: 'sucess',
        data: {
            tours
        }

    });
    console.log(status);
});


const port = "3000";
const hostname = "localhost";
app.listen(port, () => {
    console.log(`App running at http://${hostname}:${port}/`);
});