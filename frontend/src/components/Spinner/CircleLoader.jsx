import { Spinner } from "@material-tailwind/react";

const CircleLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner color="blue" className="w-14 h-14" />
    </div>
  );
};

export default CircleLoader;
