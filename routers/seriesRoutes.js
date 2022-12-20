//notes router
const express = require("express");
const router = express.Router();

const Serie = require("../models/seriesModel");

router.get("/", (req , res , next) => {
    console.log("Accept")

    if (req.header("Accept") === "application/json") {
        next();
    } else {
        res.status(415).send();
    }
})

//create route
router.get("/", async (req,res) => {
    console.log("GET request for collection");
    try {
        let series = await Serie.find();

        //create representation for collection as requested in assignment
        //items, _links, pagination
        let seriesCollection = {
            items: series,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}series/`
                },
                collection: {
                    href: `${process.env.BASE_URI}series/`
                }

            },
            pagination: "dit doen we een andere keer!"
        }

        res.json(seriesCollection);
    } catch {
        res.status(500).send()
    }
})

//create route for detail
router.get("/:id", async (req,res) => {
    //find(_id)
    console.log(`GET request for detail ${req.params.id}`);
    try {
        let series = await Serie.findById(req.params.id);
        if(series === null){
            res.status(404).send();
        }
        res.json(series);
    } catch{
        //id not found, send 404 error
        res.status(404).send();
    }
})

// Use middleware to check headers content-type for POST
router.post("/", (req , res , next) => {
    console.log("POST middleware to check Content-Type")

    if (req.header("Content-Type") === "application/json" || req.header("content-type") === "application/x-www-form-urlencoded") {
        next();
    } else {
        res.status(415).send();
    }
})

// Add middleware to disallow empty values
router.post("/", (req , res , next) => {
    console.log("POST middleware to check empty values")

    if (req.body.title && req.body.streamingService && req.body.genre && req.body.description) {
        next();
    } else {
        res.status(400).send();
    }

})

// Add resource to collection: POST
router.post("/", async (req,res) => {
    console.log("POST request for collection /");

    //Deze info moet uit request komen
    let series = new Serie({
        title: req.body.title,
        description: req.body.description,
        genre: req.body.genre,
        streamingService: req.body.streamingService
    })
    try {
        await series.save();
        res.status(201).send();
    } catch {
        res.status(400).send();
    }
})


// create PUT route
router.put('/:id', async (req, res) => {
    console.log(`PUT request for item ${req.params.id}`);

    let updatedSerie = {}
    updatedSerie.title = req.body.title
    updatedSerie.description = req.body.description
    updatedSerie.genre = req.body.genre
    updatedSerie.streamingService = req.body.streamingService

    try {
        if (updatedSerie.title && updatedSerie.description && updatedSerie.genre && updatedSerie.streamingService !== "") {
            await Serie.findByIdAndUpdate(req.params.id, updatedSerie)
            res.status(201).send()
        } else {
            res.status(400).send()
        }
    }catch{
            res.status(500).send()
        }

});

//option for collection: OPTIONS
router.options("/", async (req,res) => {
    console.log("OPTIONS request for collection ");
    res.header("Allow", "GET, POST, OPTIONS");
    res.send();
})

//options for detail: OPTIONS /id
router.options("/:id", async (req, res) => {
    console.log(`OPTIONS request for detail ${req.params.id}`);
    res.set({
        'Allow': 'GET, PUT, OPTIONS, DELETE'
    }).send()
})


// detail: DELETE /id
router.delete("/:id", async (req, res )=> {
    console.log(`DELETE request for detail ${req.params.id}`);
    try{
        let series = await Serie.findByIdAndDelete(req.params.id);
        if(series === null){

            res.status(404).send();
        }
        res.status(204).send();

    } catch {
        //id not found, send 404
        res.status(404).send();
    }
})
//Export router
module.exports = router;
