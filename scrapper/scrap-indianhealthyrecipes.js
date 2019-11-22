const cheerio = require("cheerio");
const axios = require("axios");
require('console.table')

const siteUrl = "https://www.indianhealthyrecipes.com/mango-rice-mamidikaya-pulihora/";
//https://www.indianhealthyrecipes.com/onion-tomato-chutney-recipe/#wprm-recipe-container-38105

let siteName = "";
let RecipePage = new Object();
let steps = new Array();
let ingredients = new Array();
let media = new Array();
let helpInfro = new Object();
let preparTimeuni = new String();
let servCount = new String();

const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data, { decodeEntities: false });
  //const $ = cheerio.load(body, { decodeEntities: false });
};

const getResults = async () => {
  const $ = await fetchData();

  $(".wprm-recipe-template-ihr-boxes-meta").each((index, element) => {
    let  prepatimeTag = $(element).find(".wprm-recipe-prep_time").text()
    preparTimeuni = $(element).find(".wprm-recipe-prep_timeunit-minutes").text()
    servCount = $(element).find(".wprm-recipe-servings").text()
    preparTimeuni !== null ? RecipePage.cookTime = `${prepatimeTag} ${preparTimeuni}` : null
    servCount !== null ? RecipePage.server = servCount : null
    preparTimeuni = `${prepatimeTag} ${preparTimeuni}` //console.log(RecipePage)
    // RecipePage.cookTime = prepatimeTag
    // RecipePage.server = servCount

  });

  $(".wprm-recipe-ingredients-container").each((index, element) => {
    $(element).find(".wprm-recipe-ingredient-group:nth-of-type(1) ul li").each((index, element) => {
      ingredients.push({
        Name: $(element).find(".wprm-recipe-ingredient-name").text().trim(),
        Qty: `${$(element).find(".wprm-recipe-ingredient-amount").text().trim()} ${$(element).find(".wprm-recipe-ingredient-unit").text().trim()}` || '',
        Priority: 'High',
        imageID: ''
      })
    })
  })

  $(".wprm-recipe-name").each((index, element) => {
    let spitedTitle = $(element).text().split(`|`)
    RecipePage = {
      recipeTitle: spitedTitle[0].replace(/\s+/g, " ")
    }
  });

  $(".wprm-recipe-instructions-container .wprm-recipe-instructions  li").each((index, element) => {
    steps.push($(element).text().trim().replace(/\s+/g, " "))
  })

  $(".wprm-recipe-video").each((index, element) => {
    let imageURL = $(element).text().split('<iframe').pop().split('/iframe')[0];
    let urlRegex = /(https?:\/\/[^\s]+)/g
    imageURL.replace(urlRegex, function (url) {
      media = {
        video: url.replace(/['"]+/g, '')
      }
    })


  })
  RecipePage.images = {
    logo: '',
    banner: 'https://i.ytimg.com/vi/E4wtxm42u9Y/hqdefault.jpg',
    hero: 'https://i.ytimg.com/vi/E4wtxm42u9Y/hqdefault.jpg'
  }
  RecipePage.video = media.video
  RecipePage.instuction = steps
  RecipePage.ingredients = ingredients;
  RecipePage.cookTime = preparTimeuni
  RecipePage.server = servCount
  return {
    RecipePage,
  };

};

module.exports = getResults;
