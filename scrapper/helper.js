const cheerio = require("cheerio");
const axios = require("axios");
require('console.table')

const siteUrl = [
    `https://www.indianhealthyrecipes.com/chicken-pakora/`,
    `https://www.indianhealthyrecipes.com/chilli-chicken-dry-recipe-indo-chinese-style/`,
    `https://www.indianhealthyrecipes.com/murgh-makhani-recipe-butter-chicken/`,
    `https://www.indianhealthyrecipes.com/kolhapuri-chicken-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-korma-recipe/`,
    `https://www.indianhealthyrecipes.com/simple-chicken-curry-without-coconut/`,
    `https://www.indianhealthyrecipes.com/chicken-65-recipe-no-egg-restaurant-style-chicken-recipes/`,
    `https://www.indianhealthyrecipes.com/chettinad-chicken-curry/`,
    `https://www.indianhealthyrecipes.com/chicken-biryani-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-kebab-recipe-chicken-kabab/`,
    `https://www.indianhealthyrecipes.com/chicken-masala-recipe/`,
    `https://www.indianhealthyrecipes.com/tandoori-chicken-recipe/`,
    `https://www.indianhealthyrecipes.com/methi-chicken/`,
    `https://www.indianhealthyrecipes.com/hyderabadi-biryani-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-shawarma-recipe-make-shawarma/`,
    `https://www.indianhealthyrecipes.com/tangdi-kabab/`,
    `https://www.indianhealthyrecipes.com/andhra-chicken-fry-kodi-vepudu-recipe-restaurant-style-chicken-recipe/`,
    `https://www.indianhealthyrecipes.com/popcorn-chicken-indian-recipe-kfc-style/`,
    `https://www.indianhealthyrecipes.com/garlic-chicken-recipe-how-to-make-easy-garlic-chicken-in-20-minutes/`,
    `https://www.indianhealthyrecipes.com/pepper-chicken-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-cutlet-recipe-chicken-patties/`,
    `https://www.indianhealthyrecipes.com/chicken-pulao/`,
    `https://www.indianhealthyrecipes.com/chicken-lollipop-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-keema-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-noodles-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-pasta-recipe-chicken-spaghetti/`,
    `https://www.indianhealthyrecipes.com/chicken-fry-biryani-kodi-vepudu-biryani/`,
    `https://www.indianhealthyrecipes.com/chicken-burger-recipe-zinger-burger-recipe/`,
    `https://www.indianhealthyrecipes.com/thalassery-chicken-biryani-recipe/`,
    `https://www.indianhealthyrecipes.com/szechuan-chicken/`,
    `https://www.indianhealthyrecipes.com/ambur-biryani/`,
    `https://www.indianhealthyrecipes.com/andhra-chicken-curry-recipe-kodi-kura-with-step-by-step-pictures/`,
    `https://www.indianhealthyrecipes.com/andhra-chili-chicken-recipe-spicy-and-hot-restaurant-style-chicken-starter/`,
    `https://www.indianhealthyrecipes.com/awadhi-chicken-biryani-lucknowi-biryani/`,
    `https://www.indianhealthyrecipes.com/chicken-butter-masala/`,
    `https://www.indianhealthyrecipes.com/chettinad-biryani/`,
    `https://www.indianhealthyrecipes.com/chicken-dum-biryani/`,
    `https://www.indianhealthyrecipes.com/chicken-fried-rice-recipe/`,
    `https://www.indianhealthyrecipes.com/andhra-chicken-iguru-how-to-make-andhra-chicken-iguru-step-by-step-pics/`,
    `https://www.indianhealthyrecipes.com/chicken-ghee-roast-andhra-style-ghee-roast-with-curried-chicken/`,
    `https://www.indianhealthyrecipes.com/chicken-kurma-recipe-chicken-curry/`,
    `https://www.indianhealthyrecipes.com/chicken-majestic-recipe-how-to-make-andhra-chicken-majestic/`,
    `https://www.indianhealthyrecipes.com/chicken-manchurian-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-nuggets-recipe/`,
    `https://www.indianhealthyrecipes.com/andhra-chicken-biryani-recipe-step-by-step-pictures/`,
    `https://www.indianhealthyrecipes.com/chicken-roast-chicken-dry-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-shami-kabab-recipe/`,
    `https://www.indianhealthyrecipes.com/chicken-soup/`,
    `https://www.indianhealthyrecipes.com/indian-chicken-curry-recipes/`,
    `https://www.indianhealthyrecipes.com/chicken-tikka-masala-recipe-sanjeev-kapoor/`,
    `https://www.indianhealthyrecipes.com/chicken-tikka-in-oven/`,
    `https://www.indianhealthyrecipes.com/chettinad-chicken-dry-chicken-fry-recipe-step-by-step-pics/`,
    `https://www.indianhealthyrecipes.com/gongura-chicken-fry-roasted-chicken-with-gongura/`,
    `https://www.indianhealthyrecipes.com/gongura-chicken-curry-chicken-with-red-sorrel-leaves/`,    
]


let siteName = "";
let RecipePage = new Object();
let steps = new Object();
let ingredients = new Array();
let media = new Array();
let helpInfro = new Object();
let preparTimeuni = new String();
let servCount = new String();

const fetchData = async (URL) => {
    const result = await axios.get(URL);
    return cheerio.load(result.data, { decodeEntities: false });
    //const $ = cheerio.load(body, { decodeEntities: false });
};



const getResults = async () => {
    
    let TotalResult = []
    for (let i = 0; i < siteUrl.length; i++) {
        const $ = await fetchData(siteUrl[i]);
        let inerpreparTimeuni
        $(".wprm-recipe-template-ihr-boxes-meta").each((index, element) => {
            let prepatimeTag = $(element).find(".wprm-recipe-prep_time").text()
            preparTimeuni = $(element).find(".wprm-recipe-prep_timeunit-minutes").text()
            servCount = $(element).find(".wprm-recipe-servings").text()
            inerpreparTimeuni = `${prepatimeTag} ${preparTimeuni}` //console.log(RecipePage)

        });
        preparTimeuni = inerpreparTimeuni 


        let incrg = []
        $(".wprm-recipe-ingredients-container").each((index, element) => {
            $(element).find(".wprm-recipe-ingredient-group:nth-of-type(1) ul li").each((index, element) => {
                incrg.push({
                    Name: $(element).find(".wprm-recipe-ingredient-name").text().trim(),
                    Qty: `${$(element).find(".wprm-recipe-ingredient-amount").text().trim()} ${$(element).find(".wprm-recipe-ingredient-unit").text().trim()}` || '',
                    Priority: 'High',
                    imageID: ''
                })
            })
        })
        ingredients = incrg

        $(".wprm-recipe-name").each((index, element) => {
            //let spitedTitle = $(element).text().split(`|`)
            let spitedTitle = $(element).text()
            RecipePage = {
                recipeTitle: spitedTitle.replace(/\s+/g, " ")
            }
        });
        let j=[]    
        $(".wprm-recipe-instructions-container .wprm-recipe-instructions  li").each((index, element) => {
            j.push($(element).text().trim().replace(/\s+/g, " "))
            steps = j
        })

        $(".wp-block-image img").each((index, element) => {
            let url = $(element).attr('src')
            media = {
                image :{
                    logo:'',
                    hero:url,
                    banner: url
                }
            } 
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

        RecipePage.images = media.image
        RecipePage.video = media.video
        RecipePage.instuction = steps
        RecipePage.ingredients = ingredients;
        RecipePage.cookTime = preparTimeuni
        RecipePage.server = servCount
        TotalResult.push(RecipePage)
    }
    return {
        TotalResult
    };
};



module.exports = getResults;
