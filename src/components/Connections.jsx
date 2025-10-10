import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

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
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      // console.log(res?.data?.data)
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);
  if (!connections) return;

  if (connections.length === 0) return <div>No Connections Found</div>;
  return (
    <>
      <h1 className="text-3xl font-bold text-center pt-10 mb-6">Connections</h1>

      <div className="flex justify-center p-4">
        <div className="w-full max-w-2xl">
          <ul className="list bg-base-100 rounded-box shadow-md">
            {connections.map((connection) => {
              const { _id, firstName, lastName, age, gender, about, photoURL } =
                connection;
              const formattedAbout = formatTextWithWordLimit(about, 12, 2);

              return (
                <li key={_id} className="list-row">
                  <div>
                    <img
                      className="size-10 rounded-box"
                      src={photoURL}
                      alt={`${firstName} ${lastName}`}
                    />
                  </div>
                  <div>
                    <div>{firstName + " " + lastName}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      <span>{age}</span> <span>{gender}</span>
                    </div>
                    <div className="text-xs mt-1">
                      {formattedAbout.map((line, index) => (
                        <p key={index} className="list-col-wrap">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Connections;
