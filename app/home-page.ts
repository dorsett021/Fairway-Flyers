import { EventData, Page, NavigationEntry, Frame } from '@nativescript/core';
import { HomeViewModel } from './home-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new HomeViewModel();
}

export function onStartGame() {
  Frame.topmost().navigate({
    moduleName: 'app/game-page',
    clearHistory: false,
    animated: true
  });
}

export function onHowToPlay() {
  const alertOptions = {
    title: "How to Play",
    message: "1. Aim your frisbee by dragging on the screen\n2. Set power by holding down\n3. Release to throw\n4. Try to reach the basket in as few throws as possible",
    okButtonText: "Got it!"
  };
  
  require("@nativescript/core").alert(alertOptions);
}

export function onSettings() {
  const alertOptions = {
    title: "Settings",
    message: "Settings will be available in the full version.",
    okButtonText: "OK"
  };
  
  require("@nativescript/core").alert(alertOptions);
}