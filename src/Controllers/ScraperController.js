const puppeteer = require('puppeteer');

async function carregarDados(interval = 'year', link = "https://globalsolaratlas.info/map?c=-3.68817,-40.34626,11&s=-3.687914,-40.345637&m=site7") {
    let result;

    result = await (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(link, {
            waitUntil: 'networkidle0',
        });

        if (interval == 'day') {
            await page.click('.card__action');

            await page.evaluate(() => {
                document.querySelector('.mat-menu-content button').firstElementChild.click();
            });
        }

        const textContent = await page.evaluate(() => {
            let labels = Array.from(document.querySelectorAll('.site-data__layer-name gsa-site-data-key'));
            let numbers = Array.from(document.querySelectorAll('.site-data__unit-value'));
            let response = {};

            let labelsArray = labels.map(element => {
                return element.innerHTML.replace(/<[\w \=\"\-]*>[\w ]*<\/\w*>/g, '').replace(/<![-]+>/g, '');
            });

            for (let i = 0; i < numbers.length; i++) {
                const element = numbers[i].innerHTML.replace(/<[\w \=\"\-]*>/g, '').replace(/<\/[\w\-]*>/g, '').replace(/<![-]+>/g, '').replace('&nbsp;', '');
                response[labelsArray[i]] = element;
            }

            return response;
        });

        browser.close();
        return textContent;
    })();

    return result;
}

exports.getPerDay = async (req, res) => {
    let response = await carregarDados(interval = 'day');
    res.status(200).send(response);
};

exports.getPerYear = async (req, res) => {
    let response = await carregarDados();
    res.status(200).send(response);
};

exports.post = async (req, res) => {
    console.log(req.body)
    let response = await carregarDados(interval = req.body.interval, link = req.body.link);
    res.status(200).send(response);
};