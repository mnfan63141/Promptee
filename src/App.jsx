import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";
import { useEffect } from "react";
// import dotenv from 'dotenv';

// dotenv.config();

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  let [randPrompt, setRandPrompt] = useState([]);
  let [placeholder, setPlaceholder] = useState("");
  let [topic, setTopic] = useState("");
  let [artisticStyle, setStyle] = useState("");

  //const env = process.env.NODE_ENV === 'development' ? import.meta.env : process.env;

  const configuration = new Configuration({
    organization: "org-vtJRcG0HChk5fChxj56c0flx",
    apiKey: "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"
    //apiKey: import.meta.env.VITE_Open_AI_Key,
  });



  const openai = new OpenAIApi(configuration);

  function generateIdeas(base) {
    const capitalizedBase = base[0].toUpperCase() + base.slice(1).toLowerCase();
    return (
      "Given that the chosen topic is about" +
      capitalizedBase +
      ", give three ideas to write about and 3 alternative styles to write them in." +
      "Topic: Comedic; Ideas: A satire on republicans, a critique of incels, a knock knock joke; Styles: First person, haiku, iambic pentameter." +
      "Topic: Nostalgic; Ideas: a favorite memory, describe the feeling of home, what do you miss most about childhood; Styles: Emulate Robert Frost, sonnet, personal memoir." +
      "Topic:" +
      capitalizedBase +
      "; Ideas: " +
      "; Styles: "
    );
  }
  const generatePrompt = async () => {
    setLoading(true);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generateIdeas(topic),
      temperature: 1,
      max_tokens: 300,
      top_p: 1.0,
      frequency_penalty: 0.52,
      presence_penalty: 0.5,
      stop: ["11."],
      n: 5,
    });
    setRandPrompt(
      response.data.choices[
        Math.floor(Math.random() * response.data.choices.length)
      ].text
    );
    setLoading(false);
  };

  

  const generateImage = async () => {
    setPlaceholder(`Write your entry here`);
    setLoading(true);
    const res = await openai.createImage({
      prompt:
        "Generate an image in the style of " +
        artisticStyle +
        " related to the following writing about the topic of " +
        topic +
        ": \n" +
        prompt,
      n: 1,
      size: "512x512",
    });
    setLoading(false);
    setResult(res.data.data[0].url);
  };
  return (
    <div className="app-main">
      {loading ? (
        <>
          <h2>Generating..Please Wait..</h2>
          <div class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </>
      ) : (
        <>
          <h2>Enter some type of noun topic to produce ideas for how to write it and then enter artistic style desired plus your inspired writing to make art</h2>
          <textarea
            className="app-input"
            placeholder={"Enter desired topic here (noun)"}
            onChange={(e) => setTopic(e.target.value)}
            rows="10"
            cols="40"
          />

          <button onClick={generatePrompt}>Generate your Prompt</button>

          {randPrompt.length > 0 ? (
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "20px",
                margin: "10px",
              }}
            >
              <div style={{ backgroundColor: "grey", padding: "10px" }}>
                <h3>{randPrompt}</h3>
              </div>
            </div>
          ) : (
            <></>
          )}

          <textarea
            className="app-input"
            placeholder={"Enter in the style of"}
            onChange={(e) => setStyle(e.target.value)}
            rows="10"
            cols="40"
          />
          <textarea
            className="app-input"
            placeholder={"Write your entry here"}
            onChange={(e) => setPrompt(e.target.value)}
            rows="10"
            cols="40"
          />
          <button onClick={generateImage}>Generate an Image</button>
          {result.length > 0 ? (
            <img className="result-image" src={result} alt="result" />
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}

export default App;
