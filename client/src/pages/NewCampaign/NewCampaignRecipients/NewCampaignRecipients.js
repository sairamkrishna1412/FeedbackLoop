import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Container from "../../../components/UI/Container/Container";
import Header from "../../../components/UI/Header/Header";
import CampaignSteps from "../CampaignSteps/CampaignSteps";
import ScrollToTop from "../../../components/UI/ScrollToTop";
import Loader from "../../../components/UI/Loader/Loader";
import styles from "../NewCampaign.module.css";
import { useParams, Redirect } from "react-router";
import { userThunks } from "../../../store/userSlice";
import { Recipients } from "../../../components/NewCampaign/Recipients/Recipients";
import PlainCard from "../../../components/UI/Card/PlainCard/PlainCard";

const NewCampaignRecipients = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  // console.log(recipients);

  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const campaign = useSelector((state) =>
    state.user.campaigns.find((el) => el._id === id)
  );
  // console.log(campaign);

  if (
    campaign &&
    campaign.hasOwnProperty("launchedAt") &&
    campaign.launchedAt
  ) {
    return <Redirect to={`/campaign/${id}`}></Redirect>;
  }
  // why is this wrong
  // let campaignEmails;
  // if (firstLoad && campaign.hasOwnProperty('campaignEmails')) {
  //   firstLoad = false;
  //   campaignEmails = campaign.campaignEmails.map((el) => el.email).join(',');
  //   setRecipients(campaignEmails);
  // }
  // console.log(campaignEmails);
  // const [recipients, setRecipients] = useState(campaignEmails || '');
  // console.log(recipients);

  if (isPageLoading) {
    return <Loader></Loader>;
  }

  if (!isPageLoading && !isLoggedIn) {
    return <Redirect to="/login"></Redirect>;
  }

  const finalRecipientsHandler = (finalRecipients) => {
    // submit
    // console.log(finalRecipients);
    const submitObj = {
      campaign_id: id,
      campaignEmails: finalRecipients,
    };
    dispatch(userThunks.campaignEmails(submitObj));
    history.push(`/newCampaign/${id}/previewLaunch`);
  };

  // had to remove this only then page redirect wont happen as soon as loaded. but should create a error slice or a error property in ui slice to listen for it and make redirects.
  // if (!Object.keys(campaign).length) {
  //   return <Redirect to="/"></Redirect>;
  // }
  // let textareaItem = (
  //   <textarea
  //     name="recipents"
  //     id="recipients"
  //     className={`${styles['form-control']} ${styles['form-control--break']} ${styles['form-control__emails']}`}
  //     cols="30"
  //     rows="10"
  //     onChange={recipientChangeHandler}
  //     value={recipients}
  //   ></textarea>
  // );

  // if (props.preview) {
  //   textareaItem = (
  //     <textarea
  //       name="recipents"
  //       id="recipients"
  //       className={`${styles['form-control']} ${styles['form-control--break']} ${styles['form-control__emails']}`}
  //       cols="30"
  //       rows="10"
  //       value={recipients}
  //       readOnly
  //     ></textarea>
  //   );
  // }

  return (
    <div className="container">
      <ScrollToTop />
      <Header></Header>
      <h2 className={`subHeading`}>
        {campaign.campaignName !== ""
          ? `${campaign.campaignName}`
          : "New Campaign"}
      </h2>
      <Container className={styles["container-wrapper"]}>
        <div className={`${styles["number-box"]} ${styles["number-box--top"]}`}>
          <div className={`${styles["number"]} ${styles["number-big"]}`}>3</div>
        </div>
        <PlainCard className="!w-[95%]" innerClassName="!px-4">
          <Recipients
            campaign={campaign}
            finalRecipients={finalRecipientsHandler}
          ></Recipients>
        </PlainCard>
        <CampaignSteps></CampaignSteps>
      </Container>
    </div>
  );
};

export default NewCampaignRecipients;
