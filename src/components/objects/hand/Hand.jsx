import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import Card from "../card/Card";
import ActionButton from "../ActionButton";
import {
  getAcceptPositionSetupData,
  getDeclinePositionSetupData,
} from "../../firebase/uiMethods";
import { animateActionButtons } from "../../firebase/animations";
import useHandLogic from "./useHandLogic";

const Hand = forwardRef(
  (
    {
      numberOfCards,
      fetchedPhotos,
      setFetchedPhotos,
      isThisPlayerHost,
      isThisPlayerWordMaker,
      wordMakerText,
      setVotingSelectedCardPosition,
      setVotingSelectedCardRef,
      votingSelectedCardRef,
      votingSelectedCardPosition,
      setIsVotingSelectedCardThisPlayers,
      afterVoteData,
    },
    ref
  ) => {
    const acceptButtonRef = useRef();
    const declineButtonRef = useRef();

    const {
      currentHovered,
      setCurrentHovered,
      currentClicked,
      setCurrentClicked,
      selectedCard,
      setSelectedCard,
      inMenu,
      disableHover,
      photoUrls,
      cardsRef,
      cardsLayout,
      direction,
      chosenWord,
      chosenCard,
      votingPhase,
      handleCardClick,
      handleBackToHand,
      acceptClicked,
      declineClicked,
      assignRef,
      playerPosition,
      cardsPosition,
      updateCardUrl,
    } = useHandLogic({
      numberOfCards,
      fetchedPhotos,
      setFetchedPhotos,
      isThisPlayerWordMaker,
      wordMakerText,
      setVotingSelectedCardPosition,
      setVotingSelectedCardRef,
      votingSelectedCardRef,
      votingSelectedCardPosition,
      setIsVotingSelectedCardThisPlayers,
    });

    // Animate action buttons when needed
    useEffect(() => {
      if (currentClicked !== -1 && selectedCard !== currentClicked) {
        animateActionButtons(acceptButtonRef.current, declineButtonRef.current);
      }
    }, [currentClicked, selectedCard]);

    const acceptButtonSetupData = getAcceptPositionSetupData(direction);
    const declineButtonSetupData = getDeclinePositionSetupData(direction);

    useImperativeHandle(ref, () => ({
      cardsRef,
      setDisableHover: (value) => {
        disableHover.current = value;
        setCurrentHovered((prev) => prev); // Force a re-render
      },
      backToHand: handleBackToHand,
      acceptClicked,
      setCurrentClicked,
      setSelectedCard,
      selectedCard,
      updateCardUrl,
    }));

    return (
      <>
        {cardsLayout.map((item, key) => (
          <Card
            index={key}
            key={key}
            selectedCard={selectedCard}
            inMenu={inMenu}
            currentHovered={currentHovered}
            disableHover={disableHover.current}
            setCurrentHovered={setCurrentHovered}
            currentClicked={currentClicked}
            onCardClick={handleCardClick}
            position={item.position}
            rotation={item.rotation}
            imageUrl={photoUrls.current[key]}
            cardsPosition={cardsPosition}
            direction={direction}
            playerPosition={playerPosition}
            ref={(el) => assignRef(el, key)}
            votingPhase={votingPhase}
            afterVoteData={afterVoteData}
            votingSelectedCardRef={votingSelectedCardRef}
          />
        ))}
        {currentClicked !== -1 &&
          selectedCard !== currentClicked &&
          ((!isThisPlayerWordMaker &&
            chosenWord.length &&
            Object.values(chosenCard).length === 0) ||
            (isThisPlayerWordMaker &&
              wordMakerText.length &&
              !chosenWord.length)) && (
            <>
              <ActionButton
                ref={acceptButtonRef}
                onClick={() => acceptClicked()}
                buttonSetupData={acceptButtonSetupData}
                color="lightgreen"
                text="accept"
              />
              <ActionButton
                ref={declineButtonRef}
                onClick={declineClicked}
                buttonSetupData={declineButtonSetupData}
                color="red"
                text="cancel"
              />
            </>
          )}
      </>
    );
  }
);

export default Hand;
