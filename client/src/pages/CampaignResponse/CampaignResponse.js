import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from '../../store/uiSlice';
import axios from 'axios';
import Assignment from './assignment.svg';
import Person from './person.svg';
import Done from './done.svg';
import Loader from '../../components/UI/Loader/Loader';

const Response = (props) => {
  const dispatch = useDispatch();
  const isPageLoading = useSelector((state) => state.ui.pageLoading);
  const { query } = useParams();
  const [queryStr, setQueryStr] = useState('');

  useEffect(() => {
    dispatch(uiActions.startLoading());
    const decoder = async () => {
      const response = await axios.post('/api/campaign/response/decode', {
        cipher: query,
      });
      if (response.status === 200 && response.data.success) {
        setQueryStr(response.data.data);
      }
    };
    decoder().catch((err) => console.log(err));
    dispatch(uiActions.stopLoading());
  }, [query, dispatch]);

  const fullParams = queryStr.replace('?', '').split('&');
  let params = {};
  for (let i = 0; i < fullParams.length; i++) {
    let item = fullParams[i].split('=');
    params[item[0]] = item[1];
  }
  console.log(params);

  if (isPageLoading) {
    return <Loader></Loader>;
  }

  return (
    <div className="background-blue">
      <div className="container py-8">
        <header>
          <div className={`logo`}>
            <Link to="/" className="link logoLink">
              FeedbackLoop
            </Link>
          </div>
          <div className="mt-12 mb-5">
            <p className="text-center text-[26px] text-primary font-light">
              {params.hasOwnProperty('message')
                ? params.message
                : 'Something went wrong. Please try again.'}
            </p>
          </div>
          <div className="mt-20 text-[18px] font-light">
            {params.hasOwnProperty('campaign') && params.campaign && (
              <div className="flex justify-center gap-4">
                <img src={Assignment} alt="campaign" width={20} />
                <span className="font-medium">Campaign : </span>
                <span>New Campaign From UI</span>
              </div>
            )}
            {params.hasOwnProperty('email') && params.email && (
              <div className="flex justify-center gap-4 mt-6">
                <img src={Person} alt="user" width={20} />
                <span className="font-medium">User : </span>
                <span>sairamkrishna1412@gmail.com</span>
              </div>
            )}
          </div>
          {params.hasOwnProperty('success') && params.success === 'true' && (
            <div className="mt-20 flex justify-center">
              <Link to={''} className={`btn btn__black`}>
                <span className="mr-3">Show Feedback</span>
                <img src={Done} alt="done" width={18} className="inline mb-1" />
              </Link>
            </div>
          )}
        </header>
      </div>
    </div>
  );
};

export default Response;
