import { NextPage } from "next";

interface props {
  show: boolean;
}

const Loader: React.FC<props> = (props) => {
  return (
    <main className={!props.show ? "hidden" : ""}>
      {props.show && <div className="loader" />}
    </main>
  );
};

export default Loader;
