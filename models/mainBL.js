const { Builder, By, Capabilities } = require('selenium-webdriver');
require('chromedriver');

async function setup() {
    const chromeCapabilities = Capabilities.chrome();
    const chromeOptions = {
        'args': ['--ignore-certificate-errors', '--ignore-ssl-errors']
    };
    chromeCapabilities.set('chromeOptions', chromeOptions);
    return await new Builder()
        .withCapabilities(chromeCapabilities)
        .forBrowser('chrome')
        .build();
}

async function getImage(image) {
    try {
        const img = {};
        img.type = "img";
        const rect = await image.getRect();
        img.x = rect.x;
        img.y = rect.y;
        img.width = rect.width;
        img.height = rect.height;
        img.src = await image.getAttribute('src');
        img.alt = await image.getAttribute('alt');
        img.zIndex = await image.getCssValue('z-index');
        return img;
    } catch (err) {
        console.error(err.message);
    }
}

async function getButton(button) {
    try {
        const btn = {};
        btn.type = "button";
        const rect = await button.getRect();
        btn.x = rect.x;
        btn.y = rect.y;
        btn.width = rect.width;
        btn.height = rect.height;
        btn.label = await button.getText();
        btn.style = {
            backgroundColor: await button.getCssValue('background-color'),
            borderWidth: await button.getCssValue('border-width'),
            borderRadius: await button.getCssValue('border-radius'),
            borderColor: await button.getCssValue('border-color'),
            labelStyle: {
                fontSize: await button.getCssValue('font-size'),
                color: await button.getCssValue('color')
            }
        };
        btn.zIndex = await button.getCssValue('z-index');
        return btn;
    } catch (err) {
        console.error(err.message);
    }
}

async function getContainer(container) {
    try {
        const cont = {};
        cont.type = "container";
        const rect = await container.getRect();
        cont.x = rect.x;
        cont.y = rect.y;
        cont.width = rect.width;
        cont.height = rect.height;
        cont.style = {
            backgroundColor: await container.getCssValue('background-color'),
            borderWidth: await container.getCssValue('border-width'),
            borderRadius: await container.getCssValue('border-radius'),
            borderColor: await container.getCssValue('border-color')
        };
        cont.zIndex = await container.getCssValue('z-index');
        return cont;
    } catch (err) {
        console.error(err.message);
    }
}

async function getText(/*driver,*/ elm) {
    try {
        const txt = {};
        txt.type = "text";
        const rect = await elm.getRect();
        txt.x = rect.x;
        txt.y = rect.y;
        txt.width = rect.width;
        txt.height = rect.height;
        txt.text = styleText(await elm.getAttribute('outerHTML'), '666'/*await getCSS(driver,elm)*/, await elm.getTagName());
        txt.zIndex = await elm.getCssValue('z-index');
        return txt;
    } catch (err) {
        console.error(err.message);
    }
}

function styleText(str, style, tag) {
    const styledTxt = str.replace(/\sclass.*"/g, '');
    return styledTxt.slice(0, tag.length + 1) + ` style="${style}"` + styledTxt.slice(tag.length + 1);
}

async function getCSS(driver, element) {
    const script = "var s = '';" +
        "var o = getComputedStyle(arguments[0]);" +
        "for(var i = 0; i < o.length; i++){" +
        "s+=o[i] + ':' + o.getPropertyValue(o[i])+';';}" +
        "return s;";
    return await driver.executeScript(script, element);
}

async function allDescendants(node) {
    const childNodes = await node.findElements(By.xpath('.//*'));
    await Promise.all(childNodes.map(async (child) => {
        console.log(await getText(child));
    }));
}

async function run() {
    const driver = await setup();
    const site = {};
    const components = [];
    try {
        await driver.get('http://neurosymptomsnew.kk5.org/');

        //---------------texts-----------------------------
        const body = await driver.findElements(By.xpath('//div[contains(@class,"body") or contains(@class,"title")][1]'));
        await Promise.all(body.map(async (parent) => {
            await allDescendants(parent);
        }));

        // //---------------images-----------------------------
        // const imgs = await driver.findElements(By.css('img'));
        // await Promise.all(imgs.map(async (img) => {
        //     components.push(await getImage(img));
        //   }));
        // //---------------containers-----------------------------
        //  const containers = await driver.findElements(By.className('simpleRectangle'));
        //  await Promise.all(containers.map(async (container) => {
        //         components.push(await getContainer(container));
        //       }));
        // //---------------buttons-----------------------------
        // const btns = await driver.findElements(By.xpath('//a[contains(@class,"linkButton")]'));
        // await Promise.all(btns.map(async (btn) => {
        //     components.push(await getButton(btn));
        // }));

        site.components = components;
    }
    catch (err) {
        return { status: 500, data: err.message };
    }
    finally {
        await driver.quit();
    }
    return { status: 200, data: site };
}

module.exports = { run }