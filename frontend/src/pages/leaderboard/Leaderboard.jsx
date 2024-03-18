import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios"; // Import axios for making HTTP requests
import Loader from "../../components/loader/Loader";
import { MdLeaderboard } from "react-icons/md";
import { FaMedal } from "react-icons/fa6";
import "./leaderboard.scss";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = io(import.meta.env.VITE_SERVER); // Establish WebSocket connection

  useEffect(() => {
    // Fetch leaderboard data when the component mounts
    fetchLeaderboard();
    // Listen for leaderboard updates from the WebSocket server
    socket.on("leaderboardUpdate", (updatedLeaderboard) => {
      setData(updatedLeaderboard);
      setLoading(false);
    });
    // Clean up function to disconnect WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array to run the effect only once

  const fetchLeaderboard = async () => {
    try {
      const host = `${import.meta.env.VITE_SERVER}/api/leaderboard/getscores`;
      const { data } = await axios.get(host);
      setData(data.leaderboard);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loadingContainer">
          <Loader />
        </div>
      ) : (
        <div className="leaderboard">
          <div className="packer">
            <div className="title">
              <h1>Leaderboard</h1>
              <MdLeaderboard />
            </div>

            <div className="scores">
              {data.map((player, index) => (
                <li key={index}>
                  <div className="position">
                    <p>{index + 1}.</p>
                    {index === 0 && <FaMedal color="gold" />}
                    {index === 1 && <FaMedal color="silver" />}
                    {index === 2 && <FaMedal color="bronze" />}
                  </div>
                  <p className="name">{player.playerName}</p>
                  <p className="score">{player.score} Points</p>
                </li>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Leaderboard;
