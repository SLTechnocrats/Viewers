import classNames from "classnames";
import { FunctionComponent } from "react";

interface LabelContainerProps {
  label: string;
  children: React.ReactNode;
  bold?: boolean;
  style?: React.CSSProperties;
  center?: boolean;
}

const LabelContainer: FunctionComponent<LabelContainerProps> = ({
  label,
  children,
  bold,
  style,
  center,
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col gap-y-[6px]",
        center && "items-center justify-center",
      )}
    >
      <h3
        style={style}
        className={classNames(
          "text-base !font-normal text-black",
          bold && "!font-bold",
        )}
      >
        {label}
      </h3>
      <div>{children}</div>
    </div>
  );
};

export default LabelContainer;
