import "../styles/Button.css";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

const Button = ({ children, disabled = false, type = "button" }: ButtonProps) => {
  return (
    <button className="button" disabled={disabled} type={type}>
      {children}
    </button>
  );
};

export default Button;
