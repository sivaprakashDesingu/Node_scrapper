const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const getResults = require("../scrapper/scrap-indianhealthyrecipes");
var Schema = mongoose.Schema;

// Set up mongoose connection
mongoose.connect(`mongodb+srv://admin:Admin123@cluster0-mvq6r.mongodb.net/cookingrecipe?retryWrites=true&w=majority`, {
  useNewUrlParser: true
}).then((data) => {
  console.log("Successfully connected to the database:");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  const result = await getResults();
  //console.log(result.RecipePage)
  result.RecipePage.Recipetags = ["Indian", "Veg","Lunch"]
  result.RecipePage.recipeCuisienId = "Indian"
  result.RecipePage.recepeType = true
  result.RecipePage.availaleStreaming = "TEXTIMAGE"
  result.RecipePage.postedOn = new Date()
  result.RecipePage.postedBy = 'SWASTHI'
  result.RecipePage._id = mongoose.Types.ObjectId()
  result.RecipePage.recipeCategoryId = [
    mongoose.Types.ObjectId('5dd7d6ef50a5553ed17c3b78'),
  ]

  var RecipeSchema = new Schema({
    id: {
      type: Number,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    recipeTitle: {
      type: String,
      required: true,
    },
    Recipetags: {
      type: Array,
      required: true
    },
    recipeCategoryId: [{
      type: Schema.Types.ObjectId,
      ref: 'recipecatagories'
    }],
    cookTime: {
      type: String,
      required: true,
    },
    serve: {
      type: String,
      required: true,
    },
    recipeCuisienId: {
      type: String,
      required: false,
    },
    recepeType: {
      type: Boolean,
      required: true,
    },
    availaleStreaming: {
      type: String,
      required: true,
    },
    postedBy: {
      type: String,
      required: true,
      allowNull: false,
    },
    postedOn: {
      type: String,
      required: true
    },
    images: {
      type: Object,
      required: true
    },
    video: {
      type: String,
      required: false
    }

  });

  var recipeprocessstepSchema = new Schema({
    id: {
      type: Number,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    steps: {
      type: Array,
      required: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "recipes"
    }
  });

  var IngredientSchema = new Schema({
    id: {
      type: Number,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Items: {
      type: Array,
      required: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "recipes"
    }
  });



  var Recipe = mongoose.model("Recipe", RecipeSchema);
  var recipeprocessstep = mongoose.model('recipeprocessstep', recipeprocessstepSchema);
  var Ingredient = mongoose.model('Ingredient', IngredientSchema);
  //console.log(result.RecipePage)
  const recipeInserData = new Recipe({
    _id: result.RecipePage._id,
    recipeTitle: result.RecipePage.recipeTitle,
    Recipetags: result.RecipePage.Recipetags,
    cookTime: result.RecipePage.cookTime,
    serve: result.RecipePage.server,
    recipeCategoryId: result.RecipePage.recipeCategoryId,
    recipeCuisienId: result.RecipePage.recipeCuisienId,
    recepeType: result.RecipePage.recepeType,
    availaleStreaming: result.RecipePage.availaleStreaming,
    postedOn: result.RecipePage.postedOn,
    postedBy: result.RecipePage.postedBy,
    images: result.RecipePage.images,
    video: result.RecipePage.video
  })

  const StepsinsertData = new recipeprocessstep({
    steps: result.RecipePage.instuction,
    recipeId: result.RecipePage._id
  })

  const IngreinserData = new Ingredient({
    Items: result.RecipePage.ingredients,
    recipeId: result.RecipePage._id
  })


  recipeInserData.save(function (err, result) {
    console.log("recipeInserData => Your bee has been saved!");
    StepsinsertData.save(function (err, result) {
      console.log("StepsinsertData => Your bee has been saved!");
      IngreinserData.save(function (err, res) {
        console.log("IngreinserData => Your bee has been saved!");
        if (err) {
          console.error(err);
        }
      })
      if (err) {
        console.error(err);
      }
    })
    if (err) {
      console.error(err);
    }
  })



  res.send({ recipeInserData, StepsinsertData, IngreinserData })


});

module.exports = router;
