const cheerio = require('cheerio');
const axios = require('axios')
const urls = []
let scrapping = true
const startingLinks = ['https://www.entrepreneur.com/living/how-ordinary-people-become-extraordinary/310605']
const maxLinks = 100000

const loadHtml = async(link) => {
    if(typeof link === 'string'){
        const response = await axios.get(link)
        const html = response.data
        return cheerio.load(html)
    }else{
        console.log('enter a valid link type')
    } 
}

const extractLink = async(link) => {
  console.log('extract')
  const $ = await loadHtml(link)
  $('a').each((index, element) => {
    const relativeLink = $(element).attr('href');
    const absoluteLink = new URL(relativeLink, link).href;
    startingLinks.push(absoluteLink);
  })
  
}

const isValidEmail = () => {}
const isValidPhoneNumber = () => {}
const checkText = () => {}

const processLinks = async(link) => {
    let wordsArray = []
    const $ = await loadHtml(link)
    const textContent = $('h, h1, h2, h3, h4, h5, h6, p, a, abbr, button, b, br, footer, form, header, img, input, li, link, nav, ol, table,thead, tr, th, tfoot, textarea, tr, u, ul').text();
    const extractedTexts = textContent.match(/\b\w+\b/g);
    wordsArray.push(...extractedTexts)
    await extractLink(link)
  }

  (async () => {
    
    while (scrapping && startingLinks.length <= maxLinks) {
      const currentLink = startingLinks.shift()
      console.log(currentLink)
      console.log('scraping started again');
      await processLinks(currentLink)
      console.log(`current link count: ${startingLinks.length}`)
    }
   
  })();



