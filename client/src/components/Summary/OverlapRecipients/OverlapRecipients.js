import { React, useState } from "react";
import styles from "../../../pages/NewCampaign/NewCampaign.module.css";

const OverlapRecipients = (props) => {
  const [responseReceivedOverlap, setResponseReceivedOverlap] = useState(
    props?.receivedOverlap ?? []
  );
  const [responseNotReceivedOverlap, setResponseNotReceivedOverlap] = useState(
    props?.notReceivedOverlap ?? []
  );

  const removeResponseReceivedEmail = (email) => {
    setResponseReceivedOverlap((prevState) =>
      prevState.filter((i) => i !== email)
    );
  };

  const removeResponseNotReceivedEmail = (email) => {
    setResponseNotReceivedOverlap((prevState) =>
      prevState.filter((i) => i !== email)
    );
  };

  const responseReceivedJsx = responseReceivedOverlap.map((email) => (
    <div className="h-12 p-3 rounded-3xl flex gap-2 items-center bg-gray-300">
      <span>{email}</span>
      <span
        className="font-semibold cursor-pointer"
        onClick={() => removeResponseReceivedEmail(email)}
      >
        x
      </span>
    </div>
  ));

  const responseNotReceivedJsx = responseNotReceivedOverlap.map((email) => (
    <div className="h-12 p-3 rounded-3xl flex gap-2 items-center bg-gray-300">
      <span>{email}</span>
      <span
        className="font-semibold cursor-pointer"
        onClick={() => removeResponseNotReceivedEmail(email)}
      >
        x
      </span>
    </div>
  ));

  return (
    <div className="text-[1.6rem]">
      <h2 className="text-4xl mb-10">Overlap Emails</h2>
      <div className="my-7">
        <h2 className="my-3 text-[1.8rem]">Overlap Received Response</h2>
        <div className="h-52 p-3 border border-gray-300 rounded-xl flex gap-5 overflow-y-auto flex-wrap">
          {responseReceivedJsx}
        </div>
        <input
          onClick={() =>
            props.setOverlapRequiredMails(true, responseReceivedOverlap)
          }
          type="submit"
          value={"Keep These!"}
          className={`btn btn__black ${styles["btn-right"]} mt-5`}
        />
      </div>
      <div className="my-7">
        <h2 className="my-3 text-[1.8rem]">Overlap Pending Response</h2>
        <div className="h-52 p-3 border border-gray-300 rounded-xl flex gap-5 overflow-y-auto flex-wrap">
          {responseNotReceivedJsx}
        </div>
        <input
          onClick={() =>
            props.setOverlapRequiredMails(false, responseNotReceivedOverlap)
          }
          type="submit"
          value={"Keep These!"}
          className={`btn btn__black ${styles["btn-right"]} mt-5`}
        />
      </div>
    </div>
  );
};

export default OverlapRecipients;
