import "../scss/pageloader.scoped.scss";

import * as React from "react";
import {HTMLProps} from "react"
import Loader from "react-loader-spinner";;

export interface IFullPageLoaderProps extends HTMLProps<HTMLDivElement> {
  absolutePosition?: boolean;
  color?: string;
  height?: number;
  width?: number;
}

export const PageLoader = (props: IFullPageLoaderProps) => {
  const { absolutePosition = false, color = "grey", height = 100, width = 100, ...restOfProps } = props;
  return (
    <div
      className={"full-page-spinner-overlay " + (absolutePosition ? "full-page-spinner-overlay--absolute" : "")}
      {...restOfProps}
    >
      <Loader
        type="Circles"
        color={color}
        height={height}
        width={width}
      />
    </div>
  );
}