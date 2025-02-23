import TextLabel from "../util/TextLabel";
import Button from "../util/Button";
import Input from "../util/Input";
import { useEffect, useState } from "react";
import { setPlayerName } from "../../firebase/playerMethods";

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
      <TextLabel position={[0, 0.45, 0.1]} fontSize={16} text={"Your name:"} />
      <Input
        position={[0, 0.15, 0.1]}
        dimensions={[1, 0.15, 0.01]}
        set={setName}
        defaultText={defaultText}
        fontSize={6}
        textPosition={[0, 0, 0.01]}
        textScale={[1, 1, 1]}
        rotation={[0, 0, 0]}
      />
      <Button
        position={[0.7, -0.45, 0.1]}
        dimensions={[0.2, 0.1, 0.01]}
        text="Play!"
        disabled={name.length === 0}
        handleClick={handleClick}
      />
    </>
  );
};

export default NamePage;
