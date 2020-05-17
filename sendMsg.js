let fs = require('fs');
let puppeteer = require('puppeteer');

let cfile = process.argv[2];

(async function(){
    let browser = await puppeteer.launch({
        headless : false,
        defaultViewport : null,
        slowMo : 30,
        args: ['--start-maximized', '--disable-notifications']
    });
    let contents = await fs.promises.readFile(cfile, 'utf-8');
    let obj = JSON.parse(contents);
    let userId = obj.user;
    let pswd = obj.pass;

    let pages = await browser.pages();
    let page = pages[0];
    page.goto('https://www.facebook.com',{
        waitUntil: 'networkidle2'
    });
    await page.waitForSelector('#email', {
        visible : true
    });
    await page.type('#email', userId);
    await page.type('#pass', pswd);
    await page.click('#loginbutton');
    await page.waitForSelector('.fbChatOrderedList li', {
        visible : true
    });

    let allFriends = await page.$$('.fbChatOrderedList li');
    for(let i = 0; i < allFriends.length; i++){
        let lists = allFriends[i];
        let element = await lists.$("._42fz");
        let links = await (await lists.$("._42fz a")).getProperty('href');
        let linksjson = await links.jsonValue();
        let text = await lists.evaluate(element => element.textContent, element);
        let page2 = pages[1];
        let linksWillBeClicked = await page2.goto(linksjson, {
                                        waitUntil: 'networkidle2'
                                    });
        await page.waitForSelector('._5rp7._5rp8', {
        visible : true
        });
        await page.type('._5rp7._5rp8', 'hi ' + text);
        await page.keyboard.press('Enter');
        await page.close();
    }

})();