import TextLabel from "../util/TextLabel";
import Button from "../util/Button";
import Input from "../util/Input";
import { useEffect, useState } from "react";
import { setPlayerName } from "../../firebase/playerMethods";
import FullBackground from "../../background/FullBackground";
import PagesBackground from "../../background/PagesBackground";

const NamePage = ({ setPlayClicked }) => {
  const [name, setName] = useState("");
  const [defaultText, setDefaultText] = useState("");
  useEffect(() => {
    const prevName = localStorage.getItem("name");
    if (prevName) setDefaultText(prevName);
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    localStorage.setItem("name", name);
    setPlayerName(name);
    setPlayClicked(true);
  };
  return (
    <>
      <TextLabel position={[0, 0.24, 0.08]} fontSize={18} text={"YOUR NAME"} font={"/DAIXIT/fonts/ELEGANT.ttf"} textColor={"#FF7600"} emissive={"true"}/>
      <Input
        position={[0, 0.05, 0.08]}
        dimensions={[1, 0.2]}
        set={setName}
        defaultText={defaultText}
        fontSize={6}
        textPosition={[0, 0, 0.01]}
        textScale={[1, 1, 1]}
        rotation={[0, 0, 0]}
        color={"#c300d1"}
        textColor={"#FF7600"}
      />
      <Button
        position={[0, -0.2, 0.1]}
        dimensions={[0.3, 0.1, 0.01]}
        text="Play!"
        disabled={name.length === 0}
        handleClick={handleClick}
        disabledColor="#790079"
        enabledColor="#ff9300"
      />
    </>
  );
};

export default NamePage;
