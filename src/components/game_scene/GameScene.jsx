import React, { useEffect, useState, useRef } from "react";
import Hand from "../objects/Hand";
import OtherPlayerCards from "../objects/OtherPlayerHands";
import StartGameUI from "../objects/startGameUI";
import SpinningWheel from "../objects/SpinningWheel";
import PointsDisplayer from "../objects/PointsDisplayer";
import ActionButton from "../objects/ActionButton";
import Input from "../lobby/util/Input";

import { useGameSetup } from "./hooks/useGameSetup";
import { useGameState } from "./hooks/useGameState";
import { useGameActions } from "./hooks/useGameActions";
import { useVotingPhase } from "./hooks/useVotingPhase";
import { useRoundManagement } from "./hooks/useRoundManagement";

const GameScene = ({ setupContext }) => {
  const {
    setCameraPosition,
    setCameraLookAt,
    setCameraLookAtMultiplier,
    setDirectionalLightPosition,
    setCardsPosition,
    setCardsRotation,
    setPlayerPosition,
    setDirection,
    joined,
    setJoined,
    setChosenWord,
    chosenWord,
    setVotingPhase,
    direction,
    votingPhase,
    round,
    setRound,
    setChosenCard,
    allPhotos,
    setAllPhotos,
    setAfterVoteData,
  } = setupContext;

  const handRef = useRef();
  const chosenWordLabelRef = useRef();
  const acceptButtonRef = useRef();
  const declineButtonRef = useRef();
  const nextRoundButtonRef = useRef();
  const refreshCardsExecuted = useRef(false);

  const {
    gameData,
    players,
    numberOfPlayers,
    isThisPlayerHost,
    setIsThisPlayerHost,
    isThisPlayerWordMaker,
    setIsThisPlayerWordMaker,
    gameStarted,
    inputData,
    chosenWordLabelData,
    acceptButtonSetupData,
    declineButtonSetupData,
    nextRoundButtonData,
    fetchedPhotos,
    setFetchedPhotos,
    setGameData,
    setGameStarted,
    setPlayers,
  } = useGameSetup({
    handRef,
    joined,
    setJoined,
    direction,
    votingPhase,
    allPhotos,
    setAllPhotos,
    setCameraPosition,
    setCameraLookAt,
    setCameraLookAtMultiplier,
    setDirectionalLightPosition,
    setCardsPosition,
    setCardsRotation,
    setPlayerPosition,
    setDirection,
    refreshCardsExecuted,
  });

  // Initialize the hooks in the correct order
  const {
    wordMakerText,
    setWordMakerText,
    afterVoteData,
    setAfterVoteData: setAfterVoteDataLocal,
    pointsAdded,
    setPointsAdded,
    hasVoted,
    setHasVoted,
  } = useGameState({
    gameData,
    players,
    isThisPlayerHost,
    setIsThisPlayerHost,
    setIsThisPlayerWordMaker,
    setVotingPhase,
    votingPhase,
    setChosenWord,
    direction,
    round,
    setRound,
    setGameData,
    setGameStarted,
    setPlayers,
  });

  const {
    votingSelectedCardRef,
    setVotingSelectedCardRef,
    votingSelectedCardPosition,
    setVotingSelectedCardPosition,
    isVotingSelectedCardThisPlayers,
    setIsVotingSelectedCardThisPlayers,
    votingSelectedCardData,
    setVotingSelectedCardData,
    selectedCards,
    setSelectedCards,
    handleAcceptOnVotingPhaseClicked,
    handleDeclineOnVotingPhaseClicked,
  } = useVotingPhase({
    handRef,
    setHasVoted,
  });

  // Make sure useRoundManagement has access to all required state setters
  const { handleNextRound, handleNewRound } = useRoundManagement({
    setRound,
    setPointsAdded,
    setVotingPhase,
    setHasVoted,
    setAfterVoteData: setAfterVoteData || setAfterVoteDataLocal, // Use the one from context if available
    setVotingSelectedCardRef,
    setVotingSelectedCardPosition,
    setIsVotingSelectedCardThisPlayers,
    setVotingSelectedCardData,
    setIsThisPlayerWordMaker,
    setWordMakerText,
    setChosenWord,
    setChosenCard,
    handRef,
    fetchedPhotos,
    setFetchedPhotos,
  });

  // Add this new effect to listen for the newRound event
  useEffect(() => {
    const handleNewRoundEvent = (event) => {
      handleNewRound(event.detail.round);
    };

    window.addEventListener("newRound", handleNewRoundEvent);

    return () => {
      window.removeEventListener("newRound", handleNewRoundEvent);
    };
  }, [handleNewRound]);

  // Sync afterVoteData with context if needed
  useEffect(() => {
    if (setAfterVoteData && afterVoteData !== undefined) {
      setAfterVoteData(afterVoteData);
    }
  }, [afterVoteData, setAfterVoteData]);

  if (!joined || !allPhotos.length) {
    return <SpinningWheel />;
  }

  return (
    <>
      {votingPhase && (
        <PointsDisplayer
          players={players}
          afterVotePhase={typeof afterVoteData === "object"}
        />
      )}

      {typeof afterVoteData === "object" && isThisPlayerHost && (
        <ActionButton
          ref={nextRoundButtonRef}
          onClick={handleNextRound}
          buttonSetupData={nextRoundButtonData}
          color="lightgreen"
          text="next round"
          defaultScale={1}
          fontSize={0.2}
        />
      )}

      {gameStarted ? (
        <>
          {isThisPlayerWordMaker && !chosenWord.length && (
            <Input
              position={[
                inputData.position[0],
                inputData.position[1] + 0.5,
                inputData.position[2],
              ]}
              dimensions={[2, 0.5, 0.01]}
              defaultText={"Your special word..."}
              set={setWordMakerText}
              fontSize={18}
              rotation={inputData.rotation}
              textPosition={inputData.textPosition}
              textScale={inputData.textScaleMultiplier}
            />
          )}

          {(!isThisPlayerWordMaker || chosenWord.length) && (
            <ActionButton
              ref={chosenWordLabelRef}
              onClick={() => {}}
              buttonSetupData={chosenWordLabelData}
              color="lightgray"
              text={chosenWord.length ? chosenWord : "waiting for wordmaker..."}
              defaultScale={1}
              fontSize={0.125}
            />
          )}

          {votingPhase &&
            votingSelectedCardRef &&
            !isVotingSelectedCardThisPlayers &&
            !hasVoted &&
            !isThisPlayerWordMaker && (
              <>
                <ActionButton
                  ref={acceptButtonRef}
                  onClick={handleAcceptOnVotingPhaseClicked}
                  buttonSetupData={acceptButtonSetupData}
                  color="lightgreen"
                  text="accept"
                  defaultScale={1}
                />
                <ActionButton
                  ref={declineButtonRef}
                  onClick={handleDeclineOnVotingPhaseClicked}
                  buttonSetupData={declineButtonSetupData}
                  color="red"
                  text="cancel"
                  defaultScale={1}
                />
              </>
            )}

          <Hand
            ref={handRef}
            numberOfCards={7}
            fetchedPhotos={fetchedPhotos}
            isThisPlayerHost={isThisPlayerHost}
            isThisPlayerWordMaker={isThisPlayerWordMaker}
            wordMakerText={
              wordMakerText === "Your special word..." ? "" : wordMakerText
            }
            setVotingSelectedCardPosition={setVotingSelectedCardPosition}
            setVotingSelectedCardRef={setVotingSelectedCardRef}
            votingSelectedCardRef={votingSelectedCardRef}
            votingSelectedCardPosition={votingSelectedCardPosition}
            setIsVotingSelectedCardThisPlayers={
              setIsVotingSelectedCardThisPlayers
            }
            direction={direction}
            afterVoteData={afterVoteData}
            setFetchedPhotos={setFetchedPhotos}
          />

          <OtherPlayerCards
            setVotingSelectedCardPosition={setVotingSelectedCardPosition}
            setVotingSelectedCardRef={setVotingSelectedCardRef}
            votingSelectedCardRef={votingSelectedCardRef}
            votingSelectedCardPosition={votingSelectedCardPosition}
            setIsVotingSelectedCardThisPlayers={
              setIsVotingSelectedCardThisPlayers
            }
            setVotingSelectedCardData={setVotingSelectedCardData}
            direction={direction}
            afterVoteData={afterVoteData}
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            round={round}
            players={players}
          />
        </>
      ) : (
        <StartGameUI
          numberOfPlayers={numberOfPlayers}
          isThisPlayerHost={isThisPlayerHost}
          gameData={gameData}
          setIsThisPlayerWordMaker={setIsThisPlayerWordMaker}
          direction={direction}
        />
      )}
    </>
  );
};

export default GameScene;
