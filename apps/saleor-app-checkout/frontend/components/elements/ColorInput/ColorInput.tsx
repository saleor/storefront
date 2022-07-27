import { OutlinedInput, Typography } from "@material-ui/core";
import { useStyles } from "./styles";

interface ColorInputProps {
  name: string;
  label: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const ColorInput: React.FC<ColorInputProps> = ({ name, label, value, onChange, onBlur }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="body2" className={classes.label}>
        {label}
      </Typography>
      <OutlinedInput
        name={name}
        className={classes.input}
        type="color"
        value={value}
        inputProps={{
          className: classes.colorBox,
        }}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};
export default ColorInput;
