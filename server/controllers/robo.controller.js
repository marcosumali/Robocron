require('dotenv').config()
const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require("path")

// Variable declaration - Selector
let heartSelector = '.coreSpriteHeartOpen'
let likeSelector = 'button > span[aria-label="Like"]'
let unlikeSelector = 'button > span[aria-label="Unlike"]'
let pictureSelector = 'div > div'
let videoSelector = 'div > a'
let firstImgSelector = 'div > a'
let firstImgSelectorAct = 'a > div'
let firstImgSelectorClick = 'a > div > div > img'
let checkLikeSelector = 'button > span'
let checkLikeActSelector = 'span > button > span'
let nextSelector = '.coreSpriteRightPaginationArrow'

function extractInstaElements() {
  const extractedElements = document.querySelectorAll('div > a')
  const items = [];
  for (let element of extractedElements) {
    items.push(element.getAttribute("href"));
  }
  return items;
}

function extractHomepageElements() {
  const extractedElements = document.querySelectorAll('div > div > div > a')
  const items = [];
  for (let element of extractedElements) {
    items.push(element.getAttribute("href"));
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}

async function instaLogin(page) {
  // Variable declaration - Login Purposes
  let targetWebsite = `https://www.instagram.com/accounts/login/`
  let emailSelector = 'input[name="username"]'
  let passwordSelector = 'input[name="password"]'

  // page.setViewport({ width: 1280, height: 926 });

  await page.goto(targetWebsite);

  await page.waitForSelector(emailSelector);
  await page.click(emailSelector);
  await page.keyboard.type(process.env.INSTAEMAIL, {delay: 100});
  await page.click(passwordSelector);
  await page.keyboard.type(process.env.INSTAPASSWORD, {delay: 100});
  console.log('Login on account', process.env.INSTAEMAIL)

  await page.click('button');

  await page.waitForNavigation();
}

async function likeInfiniteItems(
  page,
  itemTargetCount
) {
  let likeCounter = 0
  try {
    while(likeCounter < itemTargetCount) {
      await page.waitForSelector(checkLikeSelector);

      let pageCheckLike = await page.$eval(checkLikeSelector, span => span.getAttribute('aria-label'))
      // console.log('await', pageCheckLike)
  
      if (pageCheckLike == 'Like') {
        await page.waitForSelector(likeSelector);
        await page.click(likeSelector)
        likeCounter++
        // console.log('like Counter', likeCounter)
        await page.waitFor(1000)
      }
  
      await page.waitForSelector(nextSelector);
      await page.click(nextSelector)

    }
  } catch (error) { }
  return likeCounter
}

async function homepageLikeInfiniteItems(
  page,
  itemTargetCount,
  scrollDelay = 3000
) {
  let likeCounter = 0
  try {
    while(likeCounter < itemTargetCount) {
      await page.waitForSelector(checkLikeSelector);

      let pageCheckLike = await page.$eval(checkLikeSelector, span => span.getAttribute('aria-label'))
      // console.log('await', pageCheckLike) 
  
      if (pageCheckLike == 'Like') {
        await page.waitForSelector(likeSelector);
        await page.click(likeSelector)
        likeCounter++
        // console.log('like Counter', likeCounter)
      }

      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch (error) { }

}

async function activityLikeInfiniteItems(
  page,
  itemTargetCount
) {
  let likeCounter = 0
  try {
    while(likeCounter < itemTargetCount) {
      await page.waitForSelector(checkLikeActSelector);

      let pageCheckLike = await page.$eval(checkLikeActSelector, span => span.getAttribute('aria-label'))
      // console.log(pageCheckLike)
  
      if (pageCheckLike == 'Like') {
        await page.waitForSelector(likeSelector);
        await page.click(likeSelector)
        likeCounter++
        // console.log('like Counter', likeCounter)
        await page.waitFor(1000)
      }

      let pageCheckNext = await page.$eval(nextSelector, a => a.className)
      let pageCheckNextSplitted = pageCheckNext.split(' ')
      let nextIndex = pageCheckNextSplitted.indexOf('coreSpriteRightPaginationArrow')

      if (nextIndex > -1) {
        await page.waitForSelector(nextSelector);
        await page.click(nextSelector)
      }

    }
  } catch (error) { }
  return likeCounter
}

//-----------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//

module.exports = {
  async hashtagLike (req, res, next) {
    console.log('Executing Hashtaglike')
    // // Variable declaration - obtaining data from csv
    let hashtagsData = fs.readFileSync(path.join(__dirname, './hashtags.csv'), 'utf8').trim().split('\r\n')
    // console.log(hashtagsData)
    let hashtags = [];
    for (let i = 0; i < hashtagsData.length; i++) {
        hashtags.push(hashtagsData[i].split(','));
    }
    // console.log(hashtags)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
  
    await instaLogin(page)

    let score = 0;
    for (let i = 0; i < hashtags.length; i++) {
      let targetTagWebsite = `https://www.instagram.com/explore/tags/${hashtags[i][0]}/`
      await page.goto(targetTagWebsite);
      await page.waitForSelector(firstImgSelectorClick)
      await page.click(firstImgSelectorClick);
      let updateScore = await likeInfiniteItems(page, hashtags[i][1])
      score += updateScore
      // console.log('check update score', updateScore, score)
    }

    await browser.close();

    console.log(`HashtagLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now()))
    res.status(200).json({
      message: `HashtagLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now())  
    })
  },
  async homepageLike (req, res , next) {
    console.log('Executing Homepagelike')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
  
    await instaLogin(page)

    // // Variable declaration - Go to targeted tags website
    let targetWebsite = `https://www.instagram.com/`
    await page.goto(targetWebsite);

    // // Homepage accounts extractions
    let hrefs = await scrapeInfiniteScrollItems(page, extractHomepageElements, 10);
    // console.log('hrefs', hrefs)

    let slashIndex = hrefs.indexOf('/')
    let slicedhrefs = hrefs.slice(0, slashIndex)

    let uniquehrefs = slicedhrefs.filter(function(elem, index) {
      return slicedhrefs.indexOf(elem) == index;
    });
    
    let jsIndex = uniquehrefs.indexOf('javascript:;')
    uniquehrefs.splice(jsIndex, 1)    
    let exploreIndex = uniquehrefs.indexOf('/explore/people/')
    uniquehrefs.splice(exploreIndex, 1)
    // console.log('unique', uniquehrefs)

    // // Liking post from each extracted activity accounts
    let score = 0
    for (let i = 0; i < uniquehrefs.length; i++) {
      await page.goto(`https://www.instagram.com${uniquehrefs[i]}`)
            
      // // Process for passing accounts that is private and no post (expected element check length is 1)
      let getElement =  await page.$eval('article > div > div > div', div => div.className)
      // console.log('check element', getElement)

      let elementSplitted = getElement.split(' ')
      // console.log('check element split', elementSplitted)
      
      let spaceIndex = elementSplitted.indexOf('')
      if (spaceIndex > -1) {
        elementSplitted.splice(spaceIndex, 1)
      }
      // console.log('check element after remove', elementSplitted)

      let elementObtainedLength = elementSplitted.length
      // console.log('check element length', elementObtainedLength)

      if (elementObtainedLength > 1) {
        await page.waitForSelector(firstImgSelectorAct);
        await page.click(firstImgSelectorAct)
        let updateScore = await activityLikeInfiniteItems(page, 3)
        score += updateScore
        // console.log('check update score', updateScore, score)
      }
    }
    await browser.close();

    console.log(`HomepageLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now()))
    res.status(200).json({
      message: `HomepageLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now())  
    })
  },
  async activityLike (req, res , next) {
    console.log('Executing Activitylike')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
  
    await instaLogin(page)

    // // Variable declaration - Go to targeted tags website
    let targetWebsite = `https://www.instagram.com/accounts/activity/`

    await page.goto(targetWebsite);

    // // Activity accounts extractions
    let hrefs = await scrapeInfiniteScrollItems(page, extractInstaElements, 10);
    // console.log(hrefs)
    let slashIndex = hrefs.indexOf('/')
    let slicedhrefs = hrefs.slice(0, slashIndex)

    let uniquehrefs = slicedhrefs.filter(function(elem, index) {
      return slicedhrefs.indexOf(elem) == index;
    });
    // console.log(uniquehrefs)

    // // Liking post from each extracted activity accounts
    let score = 0
    for (let i = 0; i < uniquehrefs.length; i++) {
      await page.goto(`https://www.instagram.com${uniquehrefs[i]}`)

      // // Target Website Testing - to execute like passing account with no post and private accounts
      // // await page.goto(`https://www.instagram.com/yamada_eruhu/`) // no post, expect length 1
      // // await page.goto(`https://www.instagram.com/anjanalohar03/`) // no post, expect length 1
      // // await page.goto(`https://www.instagram.com/marcosumali/`) // with post, expect length 2
      // // await page.goto(`https://www.instagram.com/hendrik_we/`) // with post, expect length 2
      // // await page.goto(`https://www.instagram.com/elvienamutiara/`) // private acc, expect length 1
      // // await page.goto(`https://www.instagram.com/mellisalistiani/`) // private acc, expect length 1
      
      // // Process for passing accounts that is private and no post (expected element check length is 1)
      let getElement =  await page.$eval('article > div > div > div', div => div.className)
      // console.log('check element', getElement)

      let elementSplitted = getElement.split(' ')
      // console.log('check element split', elementSplitted)
      
      let spaceIndex = elementSplitted.indexOf('')
      if (spaceIndex > -1) {
        elementSplitted.splice(spaceIndex, 1)
      }
      // console.log('check element after remove', elementSplitted)

      let elementObtainedLength = elementSplitted.length
      // console.log('check element length', elementObtainedLength)

      if (elementObtainedLength > 1) {
        await page.waitForSelector(firstImgSelectorAct);
        await page.click(firstImgSelectorAct)
        let updateScore = await activityLikeInfiniteItems(page, 3)
        score += updateScore
        // console.log('check update score', updateScore, score)
      }
    }
    await browser.close();

    console.log(`ActivityLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now()))
    res.status(200).json({
      message: `ActivityLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now())  
    })
  },
  async discoveryLike (req, res , next) {
    console.log('Executing Discoverylike')
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
  
    await instaLogin(page)

    // // Variable declaration - Go to targeted tags website
    let targetWebsite = `https://www.instagram.com/explore/people/suggested/`

    await page.goto(targetWebsite);

    // // Activity accounts extractions
    let hrefs = await scrapeInfiniteScrollItems(page, extractInstaElements, 10);
    // console.log(hrefs)
    let slashIndex = hrefs.indexOf('/')
    let slicedhrefs = hrefs.slice(0, slashIndex)

    let uniquehrefs = slicedhrefs.filter(function(elem, index) {
      return slicedhrefs.indexOf(elem) == index;
    });
    // console.log(uniquehrefs)

    // // Liking post from each extracted activity accounts
    let score = 0
    for (let i = 0; i < uniquehrefs.length; i++) {
      await page.goto(`https://www.instagram.com${uniquehrefs[i]}`)
   
      // // Process for passing accounts that is private and no post (expected element check length is 1)
      let getElement =  await page.$eval('article > div > div > div', div => div.className)
      // console.log('check element', getElement)

      let elementSplitted = getElement.split(' ')
      // console.log('check element split', elementSplitted)
      
      let spaceIndex = elementSplitted.indexOf('')
      if (spaceIndex > -1) {
        elementSplitted.splice(spaceIndex, 1)
      }
      // console.log('check element after remove', elementSplitted)

      let elementObtainedLength = elementSplitted.length
      // console.log('check element length', elementObtainedLength)

      if (elementObtainedLength > 1) {
        await page.waitForSelector(firstImgSelectorAct);
        await page.click(firstImgSelectorAct)
        let updateScore = await activityLikeInfiniteItems(page, 3)
        score += updateScore
        // console.log('check update score', updateScore, score)
      }
    }
    await browser.close();

    console.log(`DicoveryLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now()))
    res.status(200).json({
      message: `DicoveryLike checked ! Success likes: ${score}, Date: ` + new Date(Date.now())  
    })
  },
  

}