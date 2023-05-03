import React, { useState, useEffect } from "react";
import validator from "validator";
import styles from "../../../pages/NewCampaign/NewCampaign.module.css";
import localStyles from "./MoreRecipients.module.css";
import OverlapRecipients from "../OverlapRecipients/OverlapRecipients";
import { Dialog } from "../../UI/Dialog/Dialog";

const MoreRecipients = (props) => {
  const [recipients, setRecipients] = useState("");
  const [recipientsByGroup, setRecipientsByGroup] = useState({});
  const [valid, setIsValid] = useState(true);
  const [overlap, setIsOverlap] = useState(false);
  const [newAndExisitngReceivedOverlap, setNewAndExisitngReceivedOverlap] =
    useState();
  const [
    newAndExisitngNotReceivedOverlap,
    setNewAndExisitngNotReceivedOverlap,
  ] = useState();
  // const [newAndExisitngOverlapEmails, setNewAndExisitngOverlapEmails] =
  //   useState({ receivedOverlap: null, notReceivedOverlap: null });

  const { campaign } = props;

  useEffect(() => {
    if (campaign && campaign.hasOwnProperty("campaignEmails")) {
      const campaignEmailsBySent = campaign.campaignEmails.reduce(
        (accumulator, curr) => {
          const sent = curr.sent ? "sent" : "unsent";
          accumulator[sent] = accumulator[sent] || [];
          accumulator[sent].push(curr.email);
          return accumulator;
        },
        {}
      );
      const campaignEmailsBySentString = {};
      Object.keys(campaignEmailsBySent).forEach((key) => {
        const stringVal = campaignEmailsBySent[key].join(", ");
        campaignEmailsBySentString[key] = stringVal;
      });
      setRecipientsByGroup(campaignEmailsBySentString);
      console.log(campaignEmailsBySent, campaignEmailsBySentString);
      //   const campaignEmails = campaign.campaignEmails
      //     .map((el) => el.email)
      //     .join(",");
      //   setRecipients(campaignEmails);
    }
  }, [campaign]);

  const recipientChangeHandler = (e) => {
    if (valid) {
      setIsValid(false);
    }
    setRecipients(e.target.value);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    let finalRecipients = `${recipients}`
      .replaceAll("\n", "")
      .replaceAll(" ", "")
      .split(",");
    finalRecipients = Array.from(new Set(finalRecipients));

    if (!valid) {
      setIsOverlap(false);
      finalRecipients = finalRecipients.filter((el) => validator.isEmail(el));
      const newAndExisitngOverlap = finalRecipients.reduce(
        (accumulator, curr) => {
          let group = undefined;
          if (recipientsByGroup["sent"]?.includes(curr)) {
            group = "sent";
          } else if (recipientsByGroup["unsent"]?.includes(curr)) {
            group = "unsent";
          }

          if (group) {
            accumulator[group] = accumulator[group] ?? [];
            accumulator[group].push(curr);
          }
          return accumulator;
        },
        {}
      );
      if (
        newAndExisitngOverlap["sent"]?.length ||
        newAndExisitngOverlap["unsent"]?.length
      ) {
        setIsOverlap(true);
        if (newAndExisitngOverlap["sent"]?.length) {
          setNewAndExisitngReceivedOverlap(newAndExisitngOverlap["sent"]);
        }
        if (newAndExisitngOverlap["unsent"]?.length) {
          setNewAndExisitngNotReceivedOverlap(newAndExisitngOverlap["unsent"]);
        }
      }

      finalRecipients = finalRecipients.join(", ");
      // removing set valid here will cause to reopen the overlap dialog again and again, without ever running below else block
      setIsValid(true);
      setRecipients(finalRecipients);
    } else {
      if (finalRecipients.length) {
        props.finalRecipients(finalRecipients);
        setRecipients("");
      }
    }
  };

  function setOverlapRequiredMails(isReceivedOverlap, overlapRequiredEmails) {
    let notRequiredEmails = [];
    if (isReceivedOverlap) {
      notRequiredEmails = newAndExisitngReceivedOverlap.filter(
        (oldOverlapEmail) => !overlapRequiredEmails.includes(oldOverlapEmail)
      );
      // setNewAndExisitngOverlapEmails((prevState) => {
      //   prevState.receivedOverlap.filter(
      //     (oldOverlapEmail) => !overlapRequiredEmails.includes(oldOverlapEmail)
      //   );
      // });
    } else {
      notRequiredEmails = newAndExisitngNotReceivedOverlap.filter(
        (oldOverlapEmail) => !overlapRequiredEmails.includes(oldOverlapEmail)
      );
      // setNewAndExisitngOverlapEmails((prevState) => {
      //   prevState.notReceivedOverlap.filter(
      //     (oldOverlapEmail) => !overlapRequiredEmails.includes(oldOverlapEmail)
      //   );
      // });
    }

    setRecipients((prevState) => {
      return prevState
        .replaceAll("\n", "")
        .replaceAll(" ", "")
        .split(",")
        .filter((email) => !notRequiredEmails.includes(email))
        .join(", ");
    });
  }

  let overlapJsx = undefined;
  if (overlap) {
    overlapJsx = (
      <Dialog onClose={() => setIsOverlap(false)}>
        {/* we will need a similar final recipients handler in overlap recipients to get the list of emails after user has removed undesired emails */}
        <OverlapRecipients
          receivedOverlap={newAndExisitngReceivedOverlap}
          notReceivedOverlap={newAndExisitngNotReceivedOverlap}
          setOverlapRequiredMails={setOverlapRequiredMails}
        ></OverlapRecipients>
        {/* <MoreRecipients
          campaign={campaign}
          finalRecipients={finalRecipientsHandler}
        ></MoreRecipients> */}
      </Dialog>
    );
  }

  return (
    <>
      {overlapJsx}
      <div className={localStyles["form-wrapper"]}>
        <label htmlFor="recipients">
          Existing Recipients: Response Received
        </label>
        <textarea
          name="recipents"
          id="recipients"
          className={`${localStyles["form-control"]} ${localStyles["form-control__emails"]}`}
          cols="30"
          rows="4"
          disabled={true}
          value={recipientsByGroup.sent}
        ></textarea>
      </div>
      <div className={localStyles["form-wrapper"]}>
        <label htmlFor="recipients">
          Existing Recipients: Response Not Received
        </label>
        <textarea
          name="recipents"
          id="recipients"
          className={`${localStyles["form-control"]} ${localStyles["form-control__emails"]}`}
          cols="30"
          rows="4"
          disabled={true}
          value={recipientsByGroup.unsent}
        ></textarea>
      </div>
      <form onSubmit={formSubmitHandler}>
        <div className={localStyles["form-wrapper"]}>
          <label htmlFor="recipients">New Recipients</label>
          <textarea
            name="recipents"
            id="recipients"
            className={`${localStyles["form-control"]} ${localStyles["form-control__emails"]}`}
            cols="30"
            rows="4"
            onChange={recipientChangeHandler}
            value={recipients}
          ></textarea>
          {/* <input
                className={`${styles['form-control']} ${styles['form-control--break']} ${styles['form-control__emails']}`}
                type="email"
                name="recipients"
                id="recipients"
                multiple="true"
              /> */}
        </div>
        {/* Save & Next */}
        <input
          type="submit"
          value={valid ? "Save & Next" : "Check Emails"}
          className={`btn btn__black ${styles["btn-right"]}`}
        />
      </form>
    </>
  );
};

export default MoreRecipients;
