import { Observable, Frame } from '@nativescript/core';

export class GameViewModel extends Observable {
  private _playerX: number = 20;
  private _playerY: number = 20;
  private _throws: number = 0;
  private _isAiming: boolean = false;
  private _aimAngle: number = 0;
  private _aimLineLength: number = 0;
  private _power: number = 0;
  private _powerPercent: string = "0";
  private _distanceToBasket: string = "0";
  private _gameAreaWidth: number = 0;
  private _gameAreaHeight: number = 0;
  private _basketX: number = 0;
  private _basketY: number = 0;
  private _touchStartX: number = 0;
  private _touchStartY: number = 0;
  private _maxPower: number = 100;
  private _powerIncreasing: boolean = true;
  private _powerInterval: any = null;

  constructor() {
    super();
    
    // Set initial basket position (will be updated when game area dimensions are set)
    this._basketX = 300;
    this._basketY = 400;
    
    this.updateDistanceToBasket();
  }

  get playerX(): number {
    return this._playerX;
  }

  set playerX(value: number) {
    if (this._playerX !== value) {
      this._playerX = value;
      this.notifyPropertyChange('playerX', value);
      this.updateDistanceToBasket();
    }
  }

  get playerY(): number {
    return this._playerY;
  }

  set playerY(value: number) {
    if (this._playerY !== value) {
      this._playerY = value;
      this.notifyPropertyChange('playerY', value);
      this.updateDistanceToBasket();
    }
  }

  get throws(): number {
    return this._throws;
  }

  set throws(value: number) {
    if (this._throws !== value) {
      this._throws = value;
      this.notifyPropertyChange('throws', value);
    }
  }

  get isAiming(): boolean {
    return this._isAiming;
  }

  set isAiming(value: boolean) {
    if (this._isAiming !== value) {
      this._isAiming = value;
      this.notifyPropertyChange('isAiming', value);
    }
  }

  get aimAngle(): number {
    return this._aimAngle;
  }

  set aimAngle(value: number) {
    if (this._aimAngle !== value) {
      this._aimAngle = value;
      this.notifyPropertyChange('aimAngle', value);
    }
  }

  get aimLineLength(): number {
    return this._aimLineLength;
  }

  set aimLineLength(value: number) {
    if (this._aimLineLength !== value) {
      this._aimLineLength = value;
      this.notifyPropertyChange('aimLineLength', value);
    }
  }

  get powerPercent(): string {
    return this._powerPercent;
  }

  set powerPercent(value: string) {
    if (this._powerPercent !== value) {
      this._powerPercent = value;
      this.notifyPropertyChange('powerPercent', value);
    }
  }

  get distanceToBasket(): string {
    return this._distanceToBasket;
  }

  set distanceToBasket(value: string) {
    if (this._distanceToBasket !== value) {
      this._distanceToBasket = value;
      this.notifyPropertyChange('distanceToBasket', value);
    }
  }

  setGameAreaDimensions(width: number, height: number) {
    this._gameAreaWidth = width;
    this._gameAreaHeight = height;
    
    // Set basket position based on game area dimensions
    this._basketX = width - 50;
    this._basketY = height - 50;
    
    this.updateDistanceToBasket();
  }

  onTouch(args: any) {
    const action = args.action;
    const x = args.getX();
    const y = args.getY();
    
    if (action === 'down') {
      this._touchStartX = x;
      this._touchStartY = y;
      this.isAiming = true;
      this.startPowerMeter();
    } else if (action === 'move' && this.isAiming) {
      // Calculate aim direction
      const dx = this._touchStartX - x;
      const dy = this._touchStartY - y;
      
      // Calculate angle in degrees
      this.aimAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Set aim line length based on distance
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.aimLineLength = Math.min(distance, 100);
    } else if (action === 'up' && this.isAiming) {
      this.throwFrisbee();
    }
  }

  startPowerMeter() {
    this._power = 0;
    this.powerPercent = "0";
    this._powerIncreasing = true;
    
    if (this._powerInterval) {
      clearInterval(this._powerInterval);
    }
    
    this._powerInterval = setInterval(() => {
      if (this._powerIncreasing) {
        this._power += 2;
        if (this._power >= this._maxPower) {
          this._power = this._maxPower;
          this._powerIncreasing = false;
        }
      } else {
        this._power -= 2;
        if (this._power <= 0) {
          this._power = 0;
          this._powerIncreasing = true;
        }
      }
      
      this.powerPercent = Math.round(this._power).toString();
    }, 20);
  }

  throwFrisbee() {
    // Stop power meter
    if (this._powerInterval) {
      clearInterval(this._powerInterval);
      this._powerInterval = null;
    }
    
    // Increment throw counter
    this.throws++;
    
    // Calculate throw distance based on power
    const throwPower = this._power / 100;
    const throwDistance = throwPower * 200; // Max throw distance of 200 units
    
    // Calculate new position based on angle and power
    const angleRadians = this.aimAngle * (Math.PI / 180);
    const moveX = Math.cos(angleRadians) * throwDistance;
    const moveY = Math.sin(angleRadians) * throwDistance;
    
    // Update player position
    let newX = this._playerX - moveX;
    let newY = this._playerY - moveY;
    
    // Keep player within bounds
    newX = Math.max(0, Math.min(newX, this._gameAreaWidth - 20));
    newY = Math.max(0, Math.min(newY, this._gameAreaHeight - 20));
    
    this.playerX = newX;
    this.playerY = newY;
    
    // Reset aiming
    this.isAiming = false;
    this.aimLineLength = 0;
    
    // Check if player reached the basket
    this.checkBasketReached();
  }

  updateDistanceToBasket() {
    // Calculate distance to basket
    const dx = this._basketX - this._playerX;
    const dy = this._basketY - this._playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Convert to meters (arbitrary scale)
    const distanceInMeters = Math.round(distance / 10);
    this.distanceToBasket = distanceInMeters.toString();
  }

  checkBasketReached() {
    // Check if player is close enough to basket
    if (parseInt(this.distanceToBasket) < 2) {
      // Show completion dialog
      setTimeout(() => {
        this.showCompletionDialog();
      }, 500);
    }
  }

  showCompletionDialog() {
    let message = "";
    const par = 3;
    
    if (this.throws < par) {
      message = `Amazing! You completed the hole in ${this.throws} throws, which is ${par - this.throws} under par!`;
    } else if (this.throws === par) {
      message = `Good job! You completed the hole in exactly par (${par}).`;
    } else {
      message = `You completed the hole in ${this.throws} throws, which is ${this.throws - par} over par.`;
    }
    
    const alertOptions = {
      title: "Hole Complete!",
      message: message,
      okButtonText: "Continue",
      cancelButtonText: "Play Again"
    };
    
    require("@nativescript/core").dialogs.confirm(alertOptions).then((result) => {
      if (result) {
        // Continue to next hole (for now, go back to home)
        Frame.topmost().navigate({
          moduleName: 'app/home-page',
          clearHistory: true,
          animated: true
        });
      } else {
        // Play again
        this.resetHole();
      }
    });
  }

  resetHole() {
    // Reset player position
    this.playerX = 20;
    this.playerY = 20;
    
    // Reset throw counter
    this.throws = 0;
    
    // Reset aiming
    this.isAiming = false;
    this.aimLineLength = 0;
    
    // Update distance
    this.updateDistanceToBasket();
  }

  onBackButtonTap() {
    Frame.topmost().goBack();
  }
}