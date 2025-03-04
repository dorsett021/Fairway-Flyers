import { Observable, Frame } from '@nativescript/core';

export class HomeViewModel extends Observable {
  constructor() {
    super();
  }

  onStartGame() {
    console.log("Start Game button tapped");
    Frame.topmost().navigate({
      moduleName: 'app/game-page',
      clearHistory: false,
      animated: true
    });
  }

  onHowToPlay() {
    const alertOptions = {
      title: "How to Play",
      message: "1. Aim your frisbee by dragging on the screen\n2. Set power by holding down\n3. Release to throw\n4. Try to reach the basket in as few throws as possible",
      okButtonText: "Got it!"
    };
    
    require("@nativescript/core").alert(alertOptions);
  }

  onSettings() {
    const alertOptions = {
      title: "Settings",
      message: "Settings will be available in the full version.",
      okButtonText: "OK"
    };
    
    require("@nativescript/core").alert(alertOptions);
  }
}