const ScraperController = require('../Controllers/ScraperController');

module.exports = (app) => {
   app.get('/perDay', ScraperController.getPerDay);
   app.get('/perYear', ScraperController.getPerYear);
   app.post('/', ScraperController.post);
}