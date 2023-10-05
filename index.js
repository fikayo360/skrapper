const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs')
const { parsePhoneNumberFromString } = require('libphonenumber-js');
let scrapping = true
const startingLinks = ['https://www.gistlover.com/']
const maxLinks = 500
let wordsArray = []
const linksScrapped = []
let emailCount = 0
let phoneNumbers = 0

const loadHtml = async(link) => {
   try{
    if(typeof link === 'string'){
      const response = await axios.get(link)
      const html = response.data
      return cheerio.load(html)
      
  }else{
      console.log('enter a valid link type')
  } 
   }catch(error){
    if (error.code === 'ERR_FR_TOO_MANY_REDIRECTS') {
      console.log(`Too many redirects for ${link}. Skipping...`);
    }
    else if (error.response && error.response.status === 403) {
      console.log(`Access to ${link} is forbidden. Skipping...`);
    }
    else if (error.response && error.response.status === 502) {
      console.log(`Access to ${link} is forbidden. Skipping...`);
    }
     else {
        throw error;
    }
   }
   
}

const removeLink = (arr,link) => {
  let index = arr.indexOf(link);
  arr.splice(index, 1);
  index--
}

const extractLink = async(link) => {
  console.log('extract')
  const $ = await loadHtml(link)
  const links = []
  if($){
    $('a').each((index, element) => {
      const relativeLink = $(element).attr('href');
      const absoluteLink = new URL(relativeLink, link).href;
      console.log(relativeLink)
      links.push(absoluteLink);
    })
    startingLinks.push(...links)
  } 
}

const lookup = (array, item) =>{
  return array.includes(item);
}

const isValidEmail = (text) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(text);
}

const isValidPhoneNumber = (text) => {
  const parsedNumber = parsePhoneNumberFromString(text)
  const mainNopattern = /(\+\d{1,}\s\d{1,}-\d{1,}-\d{1,})/
  const otherNumberPattern = /^0[7-9]\d{9}$/

  if (mainNopattern.test(text)) {
    console.log(`${text} is a valid phone number.`);
    return true
  } 

  if (otherNumberPattern.test(text)) {
    console.log(`${text} is a valid phone number.`);
    return true
  } 

  if (parsedNumber && parsedNumber.isValid()) {
    return true;
  }

  return false;
}

const saveText = (item,type) => {
  if(typeof item === 'string'){
    const textWithNewline = item + '\n';
     type === 'email'? fs.appendFileSync('emails.txt', textWithNewline, 'utf8'): type === 'phone'? fs.appendFileSync('phoneNumbers.txt', textWithNewline, 'utf8'): () => {}
  }
}

const checkText = (text) => {
    if(isValidPhoneNumber(text)){
      saveText(text,'phone')
      phoneNumbers++
    }
    
    else if(isValidEmail(text)){
      saveText(text,'email')
      emailCount++
    }
}

const processLinks = async(link) => {
    const $ = await loadHtml(link)
    if($){
      const textContent = $('h, h1, h2, h3, h4, h5, h6, p, a, abbr, button, b, br, footer, form, header, img, input, li, link, nav, ol, table,thead, tr, th, tfoot,href, textarea, tr, u, ul').text();
      if(textContent){
        const extractedTexts = textContent.split(/(\+\d{1,}\s\d{1,}-\d{1,}-\d{1,})/);
        const cleanedTexts = extractedTexts.map((text, index) => {
          if (index % 2 === 0) {
            return text.split(/\s+/);
          } else {
            return [text];
          }
        }).flat().filter(Boolean);
        console.log(cleanedTexts.slice(-100))
        for(let i = 0; i < cleanedTexts.length;i++){
           let cleanedText = cleanedTexts[i];
           checkText(cleanedText)
           cleanedTexts.splice(i, 1);
           i--;
        }
      }
    }  
    await extractLink(link)
    linksScrapped.push(link)
    removeLink(startingLinks,link)
  }

  (async () => {
    while (scrapping && startingLinks.length <= maxLinks) {
      const currentLink = startingLinks.shift()
      if(!lookup(linksScrapped,currentLink)){
        console.log(currentLink)
        console.log('scraping started again');
        await processLinks(currentLink)
        console.log(`current link count: ${startingLinks.length}`)
      }else{
        console.log(`link: ${currentLink} already scraped `)
      }
    }

    console.log({phoneNumbers,emailCount})
  })();
 
