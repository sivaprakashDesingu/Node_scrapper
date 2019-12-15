const express = require("express");
const mongoose = require("mongoose");
const async = require('async')
const router = express.Router();
//const getResults = require("../scrapper/scrap-indianhealthyrecipes");
const getResults = require("../scrapper/helper");
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
  result.TotalResult.forEach((element, i) => {
    element.Recipetags = ["Indian", "Non Veg", "Lunch"]
    element.recipeCuisienId = "Indian"
    element.recepeType = false
    element.availaleStreaming = element.video !== undefined ? "TEXTVIDEO" : "TEXTIMAGE"
    element.postedOn = new Date()
    element.postedBy = 'SWASTHI'
    element._id = mongoose.Types.ObjectId()
    element.recipeCategoryId = [
      mongoose.Types.ObjectId('5de244001c9d44000082858a'),
    ]
  });

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
      required: false
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

  var ingredientitem = new Schema({
    id: {
      type: Number,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: String,
      required: false
    },
    tag: {
      type: String,
      required: false
    },
    images: {
      type: String,
      required: false
    }
  })


  var Recipe = mongoose.model("Recipe", RecipeSchema);
  var recipeprocessstep = mongoose.model('recipeprocessstep', recipeprocessstepSchema);
  var Ingredient = mongoose.model('Ingredient', IngredientSchema);
  var ingredientitem = mongoose.model('ingredientitem', ingredientitem);


  const recipeInserData = result.TotalResult.map(function (data) {
    let recipe = {
      _id: data._id,
      recipeTitle: data.recipeTitle,
      Recipetags: data.Recipetags,
      cookTime: data.cookTime,
      serve: data.server,
      recipeCategoryId: data.recipeCategoryId,
      recipeCuisienId: data.recipeCuisienId,
      recepeType: data.recepeType,
      availaleStreaming: data.availaleStreaming,
      postedOn: data.postedOn,
      postedBy: data.postedBy,
      images: data.images,
      video: data.video
    }

    return recipe
  })
  const StepsinsertData = result.TotalResult.map(function (data) {
    let setpsColection = {
      steps: data.instuction,
      recipeId: data._id
    }
    return setpsColection
  })

  const allID = result.TotalResult.map(function (data) {
    return data.ingredients.map(function (data2) {
      return data2.Name
    })
  })

  async.waterfall([
    ingredienceFindOrCreate,
    pushRecipesIntoDB,
  ], function (err, result) {
    res.send(result)
  });
  function ingredienceFindOrCreate(callback) {

    async.map(allID, function (data, cb) {
      return async.map(data, function (item, cbc) {

        ingredientitem.find(
          { name: item }, function (err, doc) {
            if (doc.length == 0) {
              ingredientitem.create({
                "name": item,
                "tag": '',
                "image": ''
              }, function (err, idoc) {
                //console.log(idoc._id)
                cbc(null, idoc._id)
              })
            } else {
              //console.log(doc)
              cbc(null, doc[0]._id)
            }
          })
      }, cb)
    }, callback)

  }
  function pushRecipesIntoDB(PrevResult, callback) {
    // arg1 now equals 'one' and arg2 now equals 'two'
    // async.map(PrevResult, function (data, cb) {
    //   async.map(data, function (item, cb) {
    //     async.map(item, function (item2, cb) {
    //       cb(null, item2._id)
    //     }, cb)
    //   }, cb)
    // }, callback)

    callback(null,{PrevResult,recipeInserData,StepsinsertData})

  }


  const IngreinserData = result.TotalResult.map(function (data) {

    let ingCollection = {
      Items: data.ingredients,
      recipeId: data._id
    }
    return ingCollection
  })


  // Recipe.insertMany(recipeInserData, function (error, docs) {
  //   console.log(error)
  //   console.log("Recipe Data inserted")
  //   recipeprocessstep.insertMany(StepsinsertData, function (error, docs) {
  //     console.log(error)
  //     console.log("recipeprocessstep Data inserted")
  //     Ingredient.insertMany(IngreinserData, function (error, docs) {
  //       console.log(error)
  //       console.log("Ingredient Data inserted")
  //     });
  //   });
  // });


  //res.send({ recipeInserData, StepsinsertData, IngreinserData })


});

module.exports = router;
