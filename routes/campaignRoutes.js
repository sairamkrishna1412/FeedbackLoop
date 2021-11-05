const express = require('express');
const router = express.Router();

const campaignController = require('../controllers/campaignController');
const { isAuth } = require('../middleware/middleware');

//get campaign
router.get('/myCampaigns', isAuth, campaignController.myCampaigns);

//for creating new campaign
router.post('/new', isAuth, campaignController.newCampaign);
router.post('/campaignQuestions', isAuth, campaignController.campaignQuestions);
router.post('/campaignEmails', isAuth, campaignController.campaignEmails);

//to lauch campaign
router.post('/launch', isAuth, campaignController.launchCampaign);

// for sending same camaign mail to more users
// router.post('/extendMails');

// when we get response from user
router.post('/response');

router
  .route('/:id')
  .get(isAuth, campaignController.getCampaign)
  .patch(isAuth, campaignController.updateCampaign)
  .delete();

module.exports = router;
