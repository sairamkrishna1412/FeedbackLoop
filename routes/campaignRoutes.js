const express = require('express');
const router = express.Router();

const campaignController = require('../controllers/campaignController');
const { isAuth } = require('../middleware/middleware');

/* get all user campaigns */
router.get('/myCampaigns', isAuth, campaignController.myCampaigns);

/* for creating new campaign, step 1*/
router.post('/new', isAuth, campaignController.newCampaign);

/* for adding questions to campaign, step 2 */
router.post('/campaignQuestions', isAuth, campaignController.campaignQuestions);

/* for adding emails to campaign, step 3 */
router.post('/campaignEmails', isAuth, campaignController.campaignEmails);

/* to launch campaign, step 4 */
router.post('/launch', isAuth, campaignController.launchCampaign);

/* for sending same camaign mail to more users */
// router.post('/extendMails');

/* when we get response from user */
router.post('/response/decode', campaignController.decodeQuery);
router.post('/response', campaignController.response);

/* get all responses of a campaign. These are answers to to each question and not full feedbacks. */
router.get(
  '/responses/:id',
  campaignController.checkCampaignOwner,
  campaignController.getResponses
);

/* for calculating summary of a campaign */
router.get(
  '/summary/:id',
  campaignController.checkCampaignOwner,
  campaignController.getSummary
);

/* 
  clear responses and feedbacks of a campaign. 
  This doesn't make the launchedAt property of campaign null,
  So it can be used only for delete responses and feedbacks and sending 
  emails again(which means launching again anyway, need to think again).
  problem : decide if launchedAt property should be set to null in clearResponses function. 
*/
router.patch(
  '/clearResponses/:id',
  campaignController.checkCampaignOwner,
  campaignController.clearResponses
);

/* get, update, delete campaign */
router
  .route('/:id')
  .get(isAuth, campaignController.getCampaign)
  .patch(isAuth, campaignController.updateCampaign)
  .delete(
    isAuth,
    campaignController.checkCampaignOwner,
    campaignController.deleteCampaign
  );

module.exports = router;
