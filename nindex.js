const urls = []
const currentUrlsLength = urls.length
let scrapping = true
// let startingLink = 'https://www.entrepreneur.com/living/how-ordinary-people-become-extraordinary/310605'
const startingLinks = ['https://www.entrepreneur.com/living/how-ordinary-people-become-extraordinary/310605']

const loadHtml = async(link) => {
    if(typeof link === 'string'){
        const response = await axios.get(link)
        const html = response.data
        return cheerio.load(html)
    }else{
        console.log('enter a valid link type')
    } 
}

const extractLinks = async(link) => {
    const $ =  await loadHtml(link)
    $('a').each((element,index) => {
        console.log(element.attr('href'))
        // urls.push($(element).attr('href'));
      })
}

// const sample = extractLinks('https://www.entrepreneur.com/living/how-ordinary-people-become-extraordinary/310605')
// console.log(sample)
while(scrapping){
    console.log('scrpapping started')
    console.log(currentUrlsLength)
    if(startingLinks.length === 0){
        scrapping = false
    }else{
        startingLinks.map((link)=> {
        extractLinks(link)
    })
    console.log(urls.length)
    console.log(urls)
    scrapping = false
    }
}

const parseLinkText = (link) => {}
const checkEmail = (text) => {}
const checkPhone = (text) => {}
const verifyPhone = (text) => {}
const verifyEmail = (text) => {}
const saveToFile = (path) => {}
