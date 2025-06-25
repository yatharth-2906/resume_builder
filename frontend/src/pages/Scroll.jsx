function Scroll ({ id, children }) {
  const handleClick = (e) => {
    e.preventDefault();
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <a href={`#${id}`} onClick={handleClick}>
      {children}
    </a>
  );
};

export default Scroll;