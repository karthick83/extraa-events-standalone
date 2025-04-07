const { Survey } = require("survey-react-ui")
import { Model, FunctionFactory } from "survey-core";
import "survey-core/defaultV2.min.css";
import "./Survey.scss";
import { useRef } from "react";

const defaultTheme = {
  "--primary": "#421C4D",
  "--nxt-btn-col": "#421C4D",
  "--complete-btn-col": "#421C4D",
  "--btn-text-col": "#FFF",
  "--title-font": "'uc-sb', sans-serif",
  "--description-font": "'uc-sb', sans-serif",
  "--input-font": "'uc-sb', sans-serif",
  "--question-font": "uc-sb",
  "--btn-radius": "8px",
  "--btn-border": "#9D8FFA",
  "--row-radius": "24px",
  "--frame-radius": "12px",
  "--progress-bar-height": "4px",
  "--background": "#fff",
  "--background-dim": "transparent",
  "--foreground": "#161616",
  "--primary-foreground": "#421C4D",
  "--background-dim-light": "#fff", // Input background
  "--sd-item-default-background": "#fff",
  // "--number-display": "none",
  "--errbox-margin": "8px",
  "--box-shadow": "none",
  "--base-unit": "8px",
  "--frame-padding": "12px",
  "--input-border": "#DCDCDC",
  // "--banner": "none",
  "--banner-bg": "#FFF",
  "--overflow-scroll": "hidden",
  "--rating-flex-wrap": "wrap",
  "--rating-flex-dir": "row",
  // "--input-box-shadow": "none",
}

function onUploadName(survey2) {
  survey2.onUploadFiles.add((_, options) => {
    const random = Math.floor(Math.random() * 90 + 10)
    // console.log(random, 'date');
    const filename = options.files[0].name
      .replace(/[^a-zA-Z0-9.]/g, "_")
      .replace(/\s+/g, "_");
    // console.log(options.files[0], 'file');
    if (options.files[0]?.size > 2100000) {
      // console.log("compressed");
      new Compressor(options.files[0], {
        quality: 1,
        maxHeight: 1000,
        maxWidth: 1000,
        // The compression process is asynchronous,
        // which means you have to access the `result` in the `success` hook function.
        success(result) {
          const formData = new FormData();
          // The third parameter is required for server
          formData.append('file', result, `${random}_${result.name}`);

          // Send the compressed image file to server with XMLHttpRequest.
          let config = {
            method: "POST",
            body: formData,
            redirect: "follow",
          };

          fetch("https://storage.extraa.in/upload", config)
            .then((response) => response.json())
            .then((data) => {
              // console.log(data.url, 'url');
              options.callback(
                "success",
                options.files.map((file) => {
                  return {
                    file: file,
                    content: data.url,
                  };
                })
              );
            })
            .catch((error) => {
              console.error("Error: ", error);
            });
        },
        error(err) {
          console.log(err.message);
        },
      });
    } else {
      let formData = new FormData();
      formData.append("file", options.files[0], `${random}_${filename}`);
      // console.log("not compressed");
      let config = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      fetch("https://storage.extraa.in/upload", config)
        .then((response) => response.json())
        .then((data) => {
          options.callback(
            "success",
            options.files.map((file) => {
              return {
                file: file,
                content: data.url,
              };
            })
          );
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }
  });
}

const SurveySection = ({ formDetails, submitSurvey }) => {
  // console.log(formDetails, 'formdetails');
  const survey2 = new Model(formDetails);
  onUploadName(survey2)

  return (
    <div
      className="csv-survey"
      style={defaultTheme}
    >
      <Survey
        model={survey2}
        showCompletedPage={false}
        onComplete={submitSurvey}
      />
    </div>

  )
}

export default SurveySection;