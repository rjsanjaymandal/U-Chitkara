import React from "react";
import AntCodePlayground from "../Components/core/CodePlayground/AntCodePlayground";

// Import Devicon for language icons
import { Helmet } from "react-helmet";

const CodePlayground = () => {
  return (
    <div>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </Helmet>
      <AntCodePlayground />
    </div>
  );
};

export default CodePlayground;
