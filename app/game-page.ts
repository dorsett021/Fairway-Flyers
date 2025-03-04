import { EventData, Page, GestureTypes, TouchGestureEventData, GridLayout, Frame } from '@nativescript/core';
import { GameViewModel } from './game-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  console.log("Game page navigating to");
  
  if (!page.bindingContext) {
    page.bindingContext = new GameViewModel();
  }
  
  const gameArea = page.getViewById('gameArea') as GridLayout;
  
  // Get the game area dimensions after layout
  gameArea.on('layoutChanged', () => {
    const model = page.bindingContext as GameViewModel;
    model.setGameAreaDimensions(gameArea.getActualSize().width, gameArea.getActualSize().height);
  });
}

export function onTouch(args) {
  const page = args.object.page;
  const model = page.bindingContext;
  model.onTouch(args);
}