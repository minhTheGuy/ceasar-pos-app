import { ThreeDots } from "react-loader-spinner";

const ThreeDotsLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ThreeDots
        visible={true}
        height="90"
        width="90"
        color="#38bdf8"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default ThreeDotsLoader;
