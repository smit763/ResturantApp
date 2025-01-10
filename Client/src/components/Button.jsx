const Button = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
