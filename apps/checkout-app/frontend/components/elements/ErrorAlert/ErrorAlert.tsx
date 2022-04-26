import { commonErrorMessages } from "@/frontend/misc/errorMessages";
import { Typography } from "@material-ui/core";
import { Alert } from "@saleor/macaw-ui";
import { IntlShape, useIntl } from "react-intl";
import { useStyles } from "./styles";

interface UnknownError<T> {
  message?: string | null;
  code?: T;
}

interface ErrorAlertProps<T> {
  errors?: UnknownError<T>[];
  getErrorMessage: (
    error: UnknownError<T>,
    intl: IntlShape
  ) => string | null | undefined;
}

const ErrorAlert = <T extends any>({
  errors,
  getErrorMessage,
}: ErrorAlertProps<T>) => {
  const intl = useIntl();
  const classes = useStyles();

  if (!errors?.length) {
    return null;
  }

  return (
    <>
      <Alert
        variant="error"
        title={intl.formatMessage(commonErrorMessages.somethingWentWrong)}
        className={classes.root}
      >
        {errors.map((error, idx) => (
          <Typography key={idx}>
            {getErrorMessage(error, intl) || commonErrorMessages.unknownError}
          </Typography>
        ))}
      </Alert>
    </>
  );
};
export default ErrorAlert;
