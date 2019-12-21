const cheerio = require("cheerio");
const axios = require("axios");
require('console.table')

const siteUrl = [
    'https://www.indianhealthyrecipes.com/punjabi-egg-curry-anda-curry-dhaba-style/',
    'https://www.indianhealthyrecipes.com/egg-masala-curry-for-biryanichapathipulao/',
    'https://www.indianhealthyrecipes.com/egg-roast-biryani-recipe/',
    'https://www.indianhealthyrecipes.com/egg-fried-rice/',
    'https://www.indianhealthyrecipes.com/egg-bhurji-andhra-egg-porutu/',
    'https://www.indianhealthyrecipes.com/egg-noodles-recipe/',
    'https://www.indianhealthyrecipes.com/spicy-andhra-egg-curry-south-indian-egg-recipes/',
    'https://www.indianhealthyrecipes.com/egg-butter-masala-egg-makhani-recipe/',
    'https://www.indianhealthyrecipes.com/egg-bread-toast-recipe/',
    'https://www.indianhealthyrecipes.com/spinach-omelette-palak-omelet-recipe/',
    'https://www.indianhealthyrecipes.com/egg-paratha-recipe-anda-paratha/',
    'https://www.indianhealthyrecipes.com/egg-bonda-recipe-egg-bajji/',
    'https://www.indianhealthyrecipes.com/egg-biryani-recipe-how-to-make-easy-egg-biryani/',
    'https://www.indianhealthyrecipes.com/bread-omelet-sandwich-recipe/',
    'https://www.indianhealthyrecipes.com/potato-egg-curry-aloo-egg-curry-recipe/',
    'https://www.indianhealthyrecipes.com/chettinad-egg-curry-recipes/',
    'https://www.indianhealthyrecipes.com/oats-egg-omelette-oats-omelet-egg-recipes-for-breakfast/',
    'https://www.indianhealthyrecipes.com/simple-cheese-omelette-recipe/',
    'https://www.indianhealthyrecipes.com/chutney-egg-sandwich-recipe/',
    'https://www.indianhealthyrecipes.com/kadai-egg-masala-egg-capsicum-curry/',
    'https://www.indianhealthyrecipes.com/egg-bhurji-sandwich-recipe/',
    'https://www.indianhealthyrecipes.com/hyderabadi-egg-biryani-recipe-dum-biryani/',
    'https://www.indianhealthyrecipes.com/egg-dosa-recipe/',
    'https://www.indianhealthyrecipes.com/egg-fry-make-egg-fry/',
    'https://www.indianhealthyrecipes.com/egg-in-a-hole-baked-egg-bread/',
    'https://www.indianhealthyrecipes.com/egg-curry-recipes/',
    'https://www.indianhealthyrecipes.com/egg-keema-recipe/',
    'https://www.indianhealthyrecipes.com/egg-kurma-recipe-egg-korma-recipe/',
    'https://www.indianhealthyrecipes.com/munaga-kaaya-tomato-kura-drumstick-tomato-curry/',
    'https://www.indianhealthyrecipes.com/egg-mayo-sandwich-recipe/',
    'https://www.indianhealthyrecipes.com/egg-oats-recipe/',
    'https://www.indianhealthyrecipes.com/vegetable-omelette-vegetable-omelette-recipe/',
    'https://www.indianhealthyrecipes.com/egg-pulao-recipe-how-to-make-easy-egg-pulao-in-pressure-cooker/',
    'https://www.indianhealthyrecipes.com/egg-pulusu-recipe-south-indian-egg-curry/',
    'https://www.indianhealthyrecipes.com/egg-roast-recipe/',
    'https://www.indianhealthyrecipes.com/egg-salad-recipe-egg-recipes-breakfast/',
    'https://www.indianhealthyrecipes.com/egg-sandwich-recipe/',
    'https://www.indianhealthyrecipes.com/egg-vindaloo-recipe-how-to-make-goan-vindaloo-egg/',
    'https://www.indianhealthyrecipes.com/french-toast-recipe/',
    'https://www.indianhealthyrecipes.com/fried-egg-sandwich-egg-breakfast-recipe/',
    'https://www.indianhealthyrecipes.com/ghee-rice/',
    'https://www.indianhealthyrecipes.com/mushroom-omelette-recipe/',
    'https://www.indianhealthyrecipes.com/oatmeal-pancakes-recipe/',
    'https://www.indianhealthyrecipes.com/paneer-egg-gravy-recipe/',
    'https://www.indianhealthyrecipes.com/tomato-egg-curry-how-to-make-egg-curry-with-tomato-gravy/',
    'https://www.indianhealthyrecipes.com/beerakaya-kodi-guddu-kura-andhra-ridge-gourd-egg-curry-recipe/',
    'https://www.indianhealthyrecipes.com/egg-pasta-recipe/',
    'https://www.indianhealthyrecipes.com/healthy-banana-oat-muffins/',
    'https://www.indianhealthyrecipes.com/oats-scrambled-eggs/'
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
        preparTimeuni = inerpreparTimeuni || ''


        let incrg = []
        $(".entry-title-link").each((index, element) => {
            let url = $(element).attr('href')
            console.log(`'${url}',`)
        })

        $(".wprm-recipe-ingredients-container").each((index, element) => {
            $(element).find(".wprm-recipe-ingredient-group:nth-of-type(1) ul li").each((index, element) => {
                incrg.push({
                    ingredient_id: $(element).find(".wprm-recipe-ingredient-name").text().trim(),
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
        let j = []
        $(".wprm-recipe-instructions-container .wprm-recipe-instructions  li").each((index, element) => {
            j.push($(element).text().trim().replace(/\s+/g, " "))
            steps = j
        })

        $(".wp-block-image img").each((index, element) => {
            let url = $(element).attr('src')
            media = {
                image: {
                    logo: '',
                    hero: url,
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
        RecipePage.cookTime = preparTimeuni || ''
        RecipePage.server = servCount || ''
        TotalResult.push(RecipePage)
    }
    return {
        TotalResult
    };
};



module.exports = getResults;
