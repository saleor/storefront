interface RadioGroupProps {
  label: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, children }) => {
  return <div className="radio-group">{children}</div>;
};
