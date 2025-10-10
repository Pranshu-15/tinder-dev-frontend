import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequest } from '../utils/requestSlice'

const Requests = () => {
  const requests = useSelector((store) => store.requests)
  const dispatch = useDispatch();
  const reviewRequest = async (status, _id) => {
    try{
      const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {withCredentials:true})
      dispatch(removeRequest(_id))
    }catch(err){
      console.log(err)
    }
  }
  const fetchRequest = async() => {
    try{
      const res = await axios.get(BASE_URL + "/user/requests/recived", {withCredentials: true})
      dispatch(addRequests(res?.data?.data))
    }catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    fetchRequest()
  }, [])
  
  const formatTextWithWordLimit = (text, wordsPerLine = 12, maxLines = 2) => {
    if (!text) return [];

    const words = text.split(" ");
    const lines = [];
    const maxWords = wordsPerLine * maxLines;

    // Limit total words
    const limitedWords = words.slice(0, maxWords);

    // Split into lines with specific words per line
    for (let i = 0; i < limitedWords.length; i += wordsPerLine) {
      lines.push(limitedWords.slice(i, i + wordsPerLine).join(" "));
    }

    // Add ellipsis if text was truncated
    const isTruncated = words.length > maxWords;
    if (isTruncated && lines.length > 0) {
      lines[lines.length - 1] += "...";
    }

    return lines;
  };
   if(!requests) return;
   if(requests.length === 0) return <div>No Requests Pending</div>
  
  
  return (
    <div className="flex justify-center pt-10 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Connection Requests</h1>
        
        <ul className="list bg-base-100 rounded-box shadow-md">
          {requests.map((request) => {
            const {_id, firstName, lastName, photoURL, gender, age, about} = request?.fromUserId
            const formattedAbout = formatTextWithWordLimit(about, 12, 2);
            return (
              <li key={_id} className="list-row">
                <div>
                  <img className="size-10 rounded-box" src={photoURL} alt={firstName + " " + lastName}/>
                </div>
                <div>
                  <div>{firstName + " "  + lastName}</div>
                  <div className="text-xs uppercase font-semibold opacity-60"><span>{age}</span> <span>{gender}</span></div>
                  <div className="text-xs mt-1">
                    {formattedAbout.map((line, index) => (
                      <p key={index} className="list-col-wrap">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <button className="btn btn-square btn-ghost text-success" onClick={() => reviewRequest("accepted", request._id)}>
                  <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button className="btn btn-square btn-ghost text-error" onClick={() => reviewRequest("rejected", request._id)}>
                  <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  )
}

export default Requests