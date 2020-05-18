let fs = require('fs');
let puppeteer = require('puppeteer');

let cfile = process.argv[2];

(async function(){
    let browser = await puppeteer.launch({
        headless : false,
        defaultViewport : null,
        slowMo : 20,
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
        let element = await lists.$("._42fz a");
        let name = await lists.$("div._55lr");
        let text = await lists.evaluate(name => name.textContent, name);
        if(text == 'Create new group' || text == 'Design0'){
            continue;
        }
        let linksWillBeClicked = await element.click();
        await page.waitForSelector('._5rp7._5rp8', {
                                    visible : true
                                    });
        await page.type('._5rp7._5rp8', 'hi ' + text);
        await page.keyboard.press('Enter');
        await page.waitFor(2000);
        await page.click('div.close');
    }
    await page.click('._ohf.rfloat');

})();
