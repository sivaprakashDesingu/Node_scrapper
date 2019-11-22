const cheerio = require("cheerio");
const axios = require("axios");
require('console.table')

const siteUrl = "http://www.indian-cooking.info/Recipes/South-Indian/Masala-Dosa.htm";
//const siteUrl = "http://www.indian-cooking.info/Recipes/Rice-Recipes/Kashmiri-Pulao.htm";

let siteName = "";
let RecipePage = new Object();
let steps = new Array();
let ingredients = new Array();
//const categories = new Set();
//const RecipeName = new Set();
let helpInfro = new Object();
//const positions = new Set();

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data,{ decodeEntities: false });
  //const $ = cheerio.load(body, { decodeEntities: false });
};

const getResults = async () => {
  const $ = await fetchData();

  

  $("#content_block #content_recipe_name .body_H1-B").each((index, element) => {
    //RecipeName.add($(element).text());
    RecipePage = {
      recipeTitle: $(element).text().replace(/\s+/g, " ")
    }
  });

  $("#content_recipe_time .body_text").each((index, element) => {
    helpInfro = $(element).html()
    helpInfro = helpInfro.split("<br>")
    helpInfro[0] = helpInfro[0].replace(`<span class="body_text_bold">`, '')
    helpInfro[1] = helpInfro[1].replace(`<span class="body_text_bold">`, '')
    helpInfro[0] = helpInfro[0].replace(`Preparation Time :</span>`, '')
    helpInfro[1] = helpInfro[1].replace(`Serves :</span>`, '')
    RecipePage.cookTime =helpInfro[0].trim()
    RecipePage.server = helpInfro[1].trim()

  });

  $("#content_ingre_1  li p,#content_ingre_2  li p").each((index, element) => {
    //console.log($(element).text())
    let item = $(element).text().split("-")
    item = $(element).text().split("\ufffd")
    console.log(item)
    ingredients.push({
      Name: item[0].replace("\n\t    \t\t",''),
      Qty: item[1] || '',
      Priority:'High',
      imageID:''
    })
    
  });

  $("#content_method ul li:first-child img").each((index, element) => {
    //console.log($(element).prop("src"))
    RecipePage.images = {
      logo: '',
      banner: $(element).prop("src").replace("../../",'http://www.indian-cooking.info/'),
      hero: $(element).prop("src").replace("../../",'http://www.indian-cooking.info/')
    }
  })
  $("#content_method ul li").each((index, element) => {
    var _t = $(element).text().trim().replace(/\n/g,'')
    steps.push(_t.replace(/\s+/g, " "))

  })
  RecipePage.instuction =steps
  RecipePage.ingredients = ingredients;
  
  //console.log(RecipePage.instuction)
  return {
    RecipePage,
  };
};

module.exports = getResults;
