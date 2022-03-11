import { OutlinedInput, Typography } from "@material-ui/core";
import { useStyles } from "./styles";

interface ColorInputProps {
  label: string;
  value?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({ label, value }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body2" className={classes.label}>
        {label}
      </Typography>
      <OutlinedInput
        className={classes.input}
        type="color"
        value={value}
        inputProps={{
          className: classes.colorBox,
        }}
      />
    </div>
  );
};
export default ColorInput;
