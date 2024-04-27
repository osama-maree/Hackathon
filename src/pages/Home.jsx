import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import UserProfile from "../component/Profile.js";
import { assets } from "../assets/assets.js";
import { useState } from "react";
import Dashboard from "../component/Dashboard.js";
import "./home.css";
import { customVitamins } from "../utilties/Data.js";
import axios from "axios";
import MyCard from "../component/Card.js";
import MyGrid from "../component/ResultCard.js";
const Home = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState();
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState([]);
  const [inputValue, setInputValue] = useState();
  const [customInput, setCustomInput] = useState([]);
  const [res, setRes] = useState([]);
  const [recipe, setRecipe] = useState();
  const [img, setImg] = useState();
  const [finalRes, setFinalRes] = useState({
    title: "",
    ingredients: "",
    directions: "",
  });
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setCustomInput([...customInput, inputValue]);
      setInputValue("");
    }
  };

  const handleSend = async () => {
    await axios
      .post("http://localhost:3001/process", {
        columnName: input,
      })
      .then((response) => {
        setData(response.data.max15FromRandomValues);
        setChat([
          ...chat,
          {
            user: input,
            backend: response.data.max15FromRandomValues,
          },
        ]);
        setInput("");
      });
  };
  const runModel = async (textOrLink) => {
    const data1 = { data: textOrLink };
    setLoading(true);
    const res1 = await axios({
      method: "post",
      url: "https://models.aixplain.com/api/v1/execute/64aee5824d34b1221e70ac07",
      data: data1,
      headers: {
        "x-api-key":
          "9582c8edd5e43ae200cbf35ee1ddb91ba019df24e32db74ac88ccf1627924ce0", // Put full API key here
        "content-type": "application/json",
      },
    });
    const urlToPoll = res1.data.data;
    return await new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const statusResponse = await axios({
            method: "get",
            url: urlToPoll,
            headers: {
              "x-api-key":
                "9582c8edd5e43ae200cbf35ee1ddb91ba019df24e32db74ac88ccf1627924ce0", // Put full API key here
              "content-type": "application/json",
            },
          });
          if (statusResponse.data.completed) {
            clearInterval(interval);
            resolve(statusResponse.data.data);
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 1000);
    });
  };
  const handleChange = () => {
    let prompt = "";
    for (let i = 0; i < res.length; i++) {
      prompt = prompt + res[i][0] + ", ";
    }
    for (let i = 0; i < customInput.length; i++) {
      prompt = prompt + customInput[i][0] + ", ";
    }

    async function query(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/flax-community/t5-recipe-generation",
        {
          headers: {
            Authorization: "Bearer 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",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result;
    }

    query(prompt).then((response) => {
      console.log(response);
      const text = response[0].generated_text;
      const titleIndex = text.indexOf("title:");
      const ingredientsIndex = text.indexOf("ingredients:");
      const directionsIndex = text.indexOf("directions:");

      // Extract substrings
      const title = text
        .substring(titleIndex + "title:".length, ingredientsIndex)
        .trim();
      const ingredients = text
        .substring(ingredientsIndex + "ingredients:".length, directionsIndex)
        .trim();
      const directions = text
        .substring(directionsIndex + "directions:".length)
        .trim();
      setFinalRes({ title, ingredients, directions });
      setRecipe(response[0].generated_text);
      console.log(response[0]["generated_text"]);
      runModel(response[0].generated_text).then((data) => {
        setImg(data);
        setLoading(false);
      });
    });
  };
  console.log(finalRes);
  return (
    <Grid container justifyContent="space-around">
      <Grid
        item
        xs={11.5}
        sx={{
          marginTop: 2,
          fontSize: "36px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "space-between",
          marginBottom: "3px",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "white", marginLeft: 2 }}
        >
          AvoCado
        </Typography>{" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            marginRight: 2,
          }}
        >
          <SettingsOutlinedIcon variant="medium" />
          <NotificationsOutlinedIcon variant="medium" />
          <UserProfile name={"osama"} profilePic={assets.profile} />
        </Box>
      </Grid>
      <Grid
        item
        xs={8}
        className="blur"
        sx={{
          borderRadius: "5px",
          padding: 4,
          position: "relative",
        }}
        height={"600px"}
      >
        <Box>
          {!chat.length ? (
            <Dashboard />
          ) : (
            <div className="result">
              {recipe ? (
                <Box>
                  <div className="result-title">
                    <img src={assets.profile} alt="" />
                    <p>{"Generation food"}</p>
                  </div>
                  <div className="result-data">
                    <img src={assets.icon} alt="" />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "start",
                      }}
                    >
                      <h4 style={{ margin: 0 }}>Title:</h4>
                      <p>{finalRes.title}</p>
                      <h4 style={{ margin: 0 }}>Ingredients:</h4>
                      <p>{finalRes.ingredients}</p>
                      <h4 style={{ margin: 0 }}>Direction:</h4>
                      <p>{finalRes.directions}</p>
                    </Box>
                  </div>
                  <div>wait for a few minutes to generate image</div>
                  <Box
                    sx={{
                      height: "350px",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "2rem",
                    }}
                  >
                    {loading || !img ? (
                      <div className="lds-ripple">
                        <div></div>
                        <div></div>
                      </div>
                    ) : (
                      <img
                        src={img}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: "0px",
                        }}
                        alt="food"
                      />
                    )}
                  </Box>
                </Box>
              ) : (
                <>
                  {chat?.map((item, i) => (
                    <Box key={i}>
                      <div className="result-title">
                        <img src={assets.profile} alt="" />
                        <p>{item.user}</p>
                      </div>
                      <div className="result-data">
                        <img src={assets.icon} alt="" />
                        <MyGrid data={item.backend} setRes={setRes} res={res} />
                      </div>
                    </Box>
                  ))}
                </>
              )}
            </div>
          )}
        </Box>
        <div className="main-bottom">
          <div className="search-box">
            <select
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a food name"
            >
              {customVitamins.map((item, i) => (
                <option key={i} value={item.key}>
                  {item.val}
                </option>
              ))}
            </select>
            <div>
              {input ? (
                <img
                  onClick={() => handleSend()}
                  src={assets.send_code}
                  alt=""
                />
              ) : null}
            </div>
          </div>
        </div>
      </Grid>
      <Grid
        item
        xs={3}
        bgcolor={"white"}
        sx={{
          borderRadius: "5px",
          padding: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold" }}
            textAlign={"center"}
          >
            Food Generator
          </Typography>

          <Box
            sx={{
              overflowY: "scroll",
              height: "400px",
              border: "1px solid #5e5e5e5e",
              borderRadius: "15px",

              padding: "2rem",
            }}
          >
            <Box>
              {res?.map((item, i) => (
                <MyCard key={i} head={item[0]} desc={item[1]} />
              ))}
            </Box>
            <Box>
              {customInput?.map((item, i) => (
                <Paper key={i} sx={{ marginBottom: 1 }}>
                  <Typography
                    variant="body2"
                    component="div"
                    textAlign={"center"}
                    paddingY={1}
                  >
                    {item}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          <TextField
            sx={{ backgroundColor: "#f5ffdb" }}
            label="Enter your favorite food"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            maxRows={4}
            fullWidth={true}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#c0d28f",
              "&:hover": { backgroundColor: "#c0d28f" },
            }}
            onClick={handleChange}
            disabled={(!customInput.length && !res.length) || !loading}
          >
            Generate
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Home;
