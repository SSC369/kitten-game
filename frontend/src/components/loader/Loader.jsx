import React from "react";
import { InfinitySpin } from "react-loader-spinner";
import "./style.scss";

const Loader = () => {
  return (
    <div>
      <InfinitySpin
        visible={true}
        width="200"
        color="#14ffec"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
};

export default Loader;
