import { Alert } from "@material-ui/lab";
import { observer } from "mobx-react-lite";
import React from "react";
import { useInjected } from "..";

export const Error = observer(() => {
  const { errorStore } = useInjected();
  const { errors, severity } = errorStore;

  function onClickCloseError(index: number) {
    errors.splice(index, 1);
  }

  return (
    <div>
      {errors.map((error, index) =>
        <Alert
          key={index}
          severity={severity}
          onClose={() => onClickCloseError(index)}
        >
          {error.toString()}
        </Alert>
      )}
    </div>
  );
});