const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ingredientitem = new Schema({
    id: {
      type: Number,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name:{
        type: String,
        allowNull: false,
    },
    tag:{
        type: String,
        allowNull: true, 
    },
    image: {
        type: String,
        allowNull: true, 
    }

  });

var ingredientitem = mongoose.model("ingredientitem", ingredientitem);
// const recipeInserData = new Recipe({

// })
// Set up mongoose connection
// mongoose.connect(`mongodb+srv://admin:Admin123@cluster0-mvq6r.mongodb.net/cookingrecipe?retryWrites=true&w=majority`, {
//   useNewUrlParser: true
// }).then((data) => {
//   console.log("Successfully connected to the database:");
// }).catch(err => {
//   console.log('Could not connect to the database. Exiting now...', err);
//   process.exit();
// });

const nightmare = Nightmare({show:true })
const url = 'https://www.supercook.com/#/recipes'

nightmare
    .goto(url)
    .wait('body')
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then ( result => {
        let ingredientsItem = []
        //console.log(result)
        const $ = cheerio.load(result)
        $(".vAccordion--default v-pane").each((i,ele) => {
            let belongToText = $(ele).children("v-pane-header").text();
            $(ele).children("v-pane-content").find("md-checkbox").each((j,_ele) =>{

                // const recipeInserData = new ingredientitem({
                //     name:$(_ele).text().trim(),
                //     tag:belongToText,
                //     image:''
                // })
                // recipeInserData.save(function (err, result) {
                //     console.log("inserted data" + j)
                // })
                ingredientsItem.push({
                    name:$(_ele).text().trim(),
                    belongTo:belongToText,  
                    image:''
                })
            })
            
        })
        console.log(ingredientsItem.length)
    }).catch( err => {
        console.log(err)
    })


