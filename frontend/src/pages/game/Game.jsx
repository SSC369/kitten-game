import React, { useEffect, useState } from "react";
import "./game.scss";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import card from "../../assets/card.jpg";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { BsArrowRepeat } from "react-icons/bs";

const cardTypes = ["kitten", "defuse", "shuffle", "bomb"];

const Game = () => {
  const [cardCount, setCardCount] = useState(5);
  const [defuseCards, setDefuseCards] = useState(0);
  const [type, setType] = useState("");

  //save data in localstorage
  const navigate = useNavigate();
  const handleCard = async () => {
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const num = getRandomNumber(0, 3);
    const res = cardTypes[num];
    setCardCount((prevCount) => prevCount - 1);
    if (res === "shuffle") {
      setCardCount(5);
    } else if (res === "defuse") {
      setDefuseCards((prevDefuse) => prevDefuse + 1);
    } else if (res === "bomb") {
      setDefuseCards((prevDefuse) => prevDefuse - 1);
    }
    setType(res);
  };

  const uploadScore = async () => {
    const host = `${import.meta.env.VITE_SERVER}/api/leaderboard/addscore`;
    const jwtToken = Cookies.get("jwtToken");
    console.log(host);
    try {
      const { data } = await axios.post(host, null, {
        headers: {
          "auth-token": jwtToken,
        },
      });
      if (data.status) {
        toast.success(data.msg, { duration: 1000 });
      } else {
        toast.error(data.msg, { duration: 1000 });
      }
    } catch (error) {
      toast.error("Something went wrong!", { duration: 1000 });
      console.log(error);
    }
  };

  useEffect(() => {
    if (cardCount === 0) {
      if (type === "bomb") {
        if (defuseCards >= 0) {
          uploadScore();
        } else {
        }
      } else {
        const load = toast.loading("Loading server ...");
        uploadScore();
        toast.dismiss(load);
      }
    }

    const saveData = () => {
      const gameData = {
        cards: cardCount,
        defuses: defuseCards,
      };
      if (defuseCards <= 0 && type === "bomb") {
        const gameData = {
          cards: 5,
          defuses: 0,
        };
        localStorage.setItem("gameData", JSON.stringify(gameData));
      } else {
        localStorage.setItem("gameData", JSON.stringify(gameData));
      }
    };

    return () => {
      saveData();
    };
  }, [cardCount]);

  useEffect(() => {
    const gameData = JSON.parse(localStorage.getItem("gameData"));
    console.log(gameData);
    if (gameData?.cards) {
      setDefuseCards(gameData?.defuses);
      setCardCount(gameData?.cards);
    }
  }, []);

  const cards = [];
  for (let i = 0; i <= cardCount - 1; i++) {
    cards.push(
      <li onClick={handleCard} key={i}>
        <img className="card" src={card} />
      </li>
    );
  }

  const resultTitle = (t) => {
    if (t === "kitten") {
      return (
        <>
          <h1>{"Cat Card 😼"}</h1>
          <p>You've made a friendly feline friend! Meow!</p>
        </>
      );
    } else if (t === "bomb") {
      return (
        <>
          <h1>{"Exploding Kitten Card 💣"}</h1>
          <p>Uh-oh! Brace yourself for a furry explosion!</p>
        </>
      );
    } else if (t === "defuse") {
      return (
        <>
          <h1>{"Defuse Card 🙅‍♂️"}</h1>
          <p>You've found a lifeline - a Defuse Card to save you from bombs!</p>
        </>
      );
    } else {
      return (
        <>
          <h1>{"Shuffle Card 🔀"}</h1>
          <p>Time to mix things up! Shuffle the deck and start anew!</p>
        </>
      );
    }
  };

  const resultCard = (t) => {
    if (t === "kitten") {
      return "😼";
    } else if (t === "bomb") {
      return "💣";
    } else if (t === "defuse") {
      return "🙅‍♂️";
    } else {
      return "🔀";
    }
  };

  return (
    <>
      <div className="game">
        <div className="packer">
          {cardCount === 0 && type !== "bomb" ? (
            <div className="success">
              <h1>Congratulations !</h1>
              <div className="card">🎉</div>
              <p>
                Well done! You've successfully drawn all cards from the deck and
                completed the game.
              </p>
              <p
                style={{
                  borderBottom: "2px solid lightgreen",
                  fontSize: "20px",
                }}
                onClick={() => navigate("/leaderboard")}
              >
                View Leaderboard
              </p>
            </div>
          ) : (
            <>
              <h1>Pick a card</h1>
              <ul className="cards">{cards}</ul>
            </>
          )}
        </div>
      </div>

      {type.length > 0 && (
        <div className="modal">
          {defuseCards < 0 && type === "bomb" ? (
            <div style={{ border: "3px solid crimson" }} className="cardResult">
              {resultTitle(type)}
              <button
                onClick={() => navigate("/")}
                className="repeatButton"
                type="button"
              >
                <BsArrowRepeat />
              </button>
              <div style={{ boxShadow: "0px 0px 20px red" }} className="card">
                {resultCard(type)}
              </div>
              <h3>You Lost :(</h3>
              <p
                style={{
                  borderBottom: "2px solid red",
                  fontSize: "20px",
                }}
                onClick={() => navigate("/leaderboard")}
              >
                View Leaderboard
              </p>
            </div>
          ) : (
            <div className="cardResult">
              {resultTitle(type)}
              {console.log(type)}
              <button
                onClick={() => {
                  setType("");
                }}
                className="closeButton"
                type="button"
              >
                <IoCloseOutline />
              </button>
              <div className="card">{resultCard(type)}</div>
              {type === "bomb" && (
                <p>Defuse card saved you from explosion{" :)"}</p>
              )}
              <p className="defuse">Defuse Cards: {defuseCards}</p>
            </div>
          )}
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Game;
