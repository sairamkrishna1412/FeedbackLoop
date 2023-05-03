import { React, useState, useEffect } from "react";
import validator from "validator";
import styles from "../../../pages/NewCampaign/NewCampaign.module.css";

export const Recipients = (props) => {
  const [recipients, setRecipients] = useState("");
  const [valid, setIsValid] = useState(true);

  const { campaign } = props;

  useEffect(() => {
    if (campaign && campaign.hasOwnProperty("campaignEmails")) {
      const campaignEmails = campaign.campaignEmails
        .map((el) => el.email)
        .join(",");
      setRecipients(campaignEmails);
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
      finalRecipients = finalRecipients
        .filter((el) => validator.isEmail(el))
        .join(", ");
      setIsValid(true);
      setRecipients(finalRecipients);
    } else {
      if (finalRecipients.length) {
        props.finalRecipients(finalRecipients);
        setRecipients("");
      }
    }
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <div className={styles["form-wrapper"]}>
        <label htmlFor="recipients">Recipients</label>
        <textarea
          name="recipents"
          id="recipients"
          className={`${styles["form-control"]} ${styles["form-control--break"]} ${styles["form-control__emails"]}`}
          cols="30"
          rows="10"
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
  );
};
