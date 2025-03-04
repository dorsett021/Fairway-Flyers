import { EventData, Page } from '@nativescript/core';
import { ScoreViewModel } from './score-view-model';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  
  // Get the score from the navigation context
  const navigationContext = page.navigationContext || { throws: 0 };
  
  page.bindingContext = new ScoreViewModel(navigationContext.throws);
}