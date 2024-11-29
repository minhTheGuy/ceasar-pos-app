import { Typography, Button } from "@material-tailwind/react";
import { FlagIcon } from "@heroicons/react/24/solid";

const NotFoundPage = () => {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div>
        <FlagIcon className="w-20 h-20 mx-auto text-dark-purple" />
        <Typography
          variant="h1"
          color="blue-gray"
          className="mt-10 !text-3xl !leading-snug md:!text-4xl"
        >
          Error 404 <br /> It looks like something went wrong.
        </Typography>
        <Typography className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
          The page you are looking for is not available or does not exist.
        </Typography>
        <a href="/">
          <Button className="w-full px-4 md:w-[8rem] bg-dark-purple">
            back home
          </Button>
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
