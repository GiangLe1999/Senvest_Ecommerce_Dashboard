import type { FC } from "react";

interface Props {}

const LoadingPage: FC<Props> = (): JSX.Element => {
  return (
    <div className="w-full h-[calc(100vh_-_64px)] flex items-center justify-center">
      <div className="w-20 h-[50px] relative">
        <span className="absolute text-primary/20 animate-[text\_713_3.5s_ease_both_infinite] text-[0.8rem] tracking-[1px] m-0 p-0 top-0">
          loading
        </span>
        <span className="bg-primary block h-4 w-4 absolute translate-x-16 animate-[loading\_713_3.5s_ease_both_infinite] rounded-[50px] bottom-0 before:absolute before:content-[''] before:w-full before:h-full before:bg-[#D1C2FF] before:animate-[loading2\_713_3.5s_ease_both_infinite] before:rounded-[inherit]"></span>
      </div>
    </div>
  );
};

export default LoadingPage;
