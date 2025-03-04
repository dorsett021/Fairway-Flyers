import { Observable, Frame } from '@nativescript/core';

export class ScoreViewModel extends Observable {
  private _throws: number;
  private _scoreMessage: string;

  constructor(throws: number) {
    super();
    
    this._throws = throws;
    this.updateScoreMessage();
  }

  get throws(): number {
    return this._throws;
  }

  get scoreMessage(): string {
    return this._scoreMessage;
  }

  private updateScoreMessage() {
    const par = 3;
    
    if (this._throws < par) {
      this._scoreMessage = `Amazing! You completed the hole in ${this._throws} throws, which is ${par - this._throws} under par!`;
    } else if (this._throws === par) {
      this._scoreMessage = `Good job! You completed the hole in exactly par (${par}).`;
    } else {
      this._scoreMessage = `You completed the hole in ${this._throws} throws, which is ${this._throws - par} over par.`;
    }
    
    this.notifyPropertyChange('scoreMessage', this._scoreMessage);
  }

  onPlayAgain() {
    Frame.topmost().navigate({
      moduleName: 'app/game-page',
      clearHistory: false,
      animated: true
    });
  }

  onMainMenu() {
    Frame.topmost().navigate({
      moduleName: 'app/home-page',
      clearHistory: true,
      animated: true
    });
  }

  onBackButtonTap() {
    Frame.topmost().goBack();
  }
}