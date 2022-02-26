// const fs = require('fs');
const { getQuestionMarkup, getCampaignMarkup } = require('./EmailMarkups');

exports.createForm = (campaign) => {
  campaign = campaign.toObject();
  const emailSubject = campaign.emailSubject;
  const emailContent = campaign.emailContent;
  const campaignId = String(campaign._id);

  campaign.campaignQuestions = campaign.campaignQuestions.sort(
    (a, b) => a.index - b.index
  );
  const questionsMarkupArr = campaign.campaignQuestions.map((question) => {
    return getQuestionMarkup(question);
  });
  const questionsMarkup = questionsMarkupArr.join(' ');

  const emailMarkup = getCampaignMarkup({
    campaign: { emailSubject, emailContent, campaignId },
    questionsMarkup,
  });

  // fs.writeFile('./testEmail.html', emailMarkup, (err) => {
  //   if (err) {
  //     return console.log('error saving file', err);
  //   }
  //   console.log('file saved successfully!');
  // });

  return emailMarkup;
};
