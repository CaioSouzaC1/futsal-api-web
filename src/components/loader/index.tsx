const Loader = () => {
  return (
    <div className="flex flex-row gap-2 w-full h-full justify-center items-center">
      <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce duration-300 [animation-delay:-.1s]"></div>
      <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce duration-300 "></div>
      <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce duration-300 [animation-delay:-.1s]"></div>
    </div>
  );
};

export default Loader;
