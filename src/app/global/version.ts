export const version: string = "v1.13.19";

// vX.Y.Z
// X = Major
// Y = Minor 
// Z = Bugfix

//ToDo
// - Add "Go back" button at waiting screen
// - Add highscore list
// - Add authentication

// 1.13.19
// - Fixed that scores are not dependent on names and uses id to be placed instead
// - Fixed that score are distributed before end of game check

// 1.13.18
// - Moved the results modal to a seperate component and restructred the logic to fit that.
// - Fixed a X instead of 0 when someone crosses a scorerow
// - Fixed that the text "YOUR TURN" warped on smaller devices.

// 1.11.17
// - Fixed bug that didn't send the dice to other sockets.

// 1.11.16
// - Combined minor and feature versioning
// - Fixed bug where single player result window wouldn't trigger (because of deletion of it, woops...)

// 1.3.7.15
// - Potential fix for oval shaped play button for iPhones

// 1.3.7.14
// - Fixed gameDone emit to not be distributed locally but sent through socket. This to avoid double logic for gameDone.
// - Fixed gameDone to be recieved from backend correctly.
// - Fixed bug that caused clients that would play multiple multiplayer games to not have their socket id brought into the next game.
// - Fixed bug that caused the previous hit of dice to be counted for when trying to place 0 if the score row previously had points to place.

// 1.3.7.10
// - Improved the styling overall
// - Added some translation

// 1.2.6.10
// - Hosting from Azure instead

// 1.1.6.10
// - Redesigned the dropdown for languages

// 1.1.5.10
// - Fixed turn-handling bug

// 1.1.5.9
// - Fixed bugs regarding disconnecting players

// 1.1.5.8
// - Fixed some css for smaller devices.

// 1.1.5.7
// - Fixed a bug where yatzy wouldn't place points correctly.
// - Fixed a bug where possible score for house wouldn't display correctly.

// 1.1.5.5
// - Added documentation

// 1.0.5.5
// - Gone through the whole project to add comments.

// 1.0.4.5
// - Fixed sound playing when other player hit dice when muted

// 1.0.4.4
// - Fixed yourTurn text to wrap on mobile devices.

// 1.0.4.3
// - Implemented opacity change on place score button upon not being clientPlayers turn and added some comments to the html file for clarity.

// 1.0.3.3
// - Passed in currentPlayer and clientPlayer into setScore method in order to prevent modal to trigger for the other players.

// 1.0.3.2
// - Made confirmation modal async in order to prevent gameEnd check to go off before score has been placed.

// 1.0.3.1
// - Moved versioning to a separate file.

// 1.0.2.1
// - Prevented possibility to recieve points for yatzy upon having five 0 dices.

// 1.0.2.0
// - Implementation of confirmation modal upon place 0 points.

// 1.0.1.0
// - Implementation of mute sound.



