import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subscription} from 'rxjs';
import {MyTransitionTimingFunction} from '../common/types/animation/animation.types';
import {MySliderRange, MySliderValue} from './slider.types';
import {MySliderThumbDirective} from './slider-thumb.directive';

@Component({
  selector: 'my-slider',
  templateUrl: './slider.component.html',
  styleUrls: [ './slider.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MySliderComponent),
      multi: true
    }
  ]
})
export class MySliderComponent implements ControlValueAccessor, AfterViewInit, OnInit, OnDestroy {

  static readonly defaultMin = 0;
  static readonly defaultMax = 100;
  static readonly pageUpDownMultiplier = 10;
  static readonly addFactor = 0.00000000000009;

  @Output()
  change: EventEmitter<MySliderValue> = new EventEmitter();

  @Output()
  input: EventEmitter<MySliderValue> = new EventEmitter();

  /**
   * Use animation while on track click thumb moving
   */
  @Input()
  animation = true;

  /**
   * Open/Close animation time in ms
   */
  @Input()
  animationTime = 250;

  /**
   * Animation timing function
   */
  @Input()
  timingFunction: MyTransitionTimingFunction = 'ease-in-out';

  /**
   * Internal param for recalculating value
   */
  private distance = MySliderComponent.defaultMax;

  private _min = MySliderComponent.defaultMin;

  get min(): number {
    return this._min;
  }

  /**
   * Min slider value
   */
  @Input()
  set min(value: number) {
    if (value !== this._min) {
      this._min = value;
      this.updateDistance();
      this.updateView();
    }
  }

  private _max = MySliderComponent.defaultMax;

  get max(): number {
    return this._max;
  }

  /**
   * Max slider value
   */
  @Input()
  set max(value: number) {
    if (value !== this._max) {
      this._max = value;
      this.updateDistance();
      this.updateView();
    }
  }

  private stepDigitsAfterComma = 0;

  private _step = 1;

  get step(): number {
    return this._step;
  }

  /**
   * Slider step
   */
  @Input()
  set step(value: number) {
    if (value !== this._step) {
      this._step = value;
      // calculating num digits after comma
      this.updateStepDigitsAfterComma();
      // update value for recalculation using new step
      this.setValue(this.value);
    }
  }

  /**
   * Returns cloned value
   */
  private get clonedValue(): MySliderValue {
    return this.value instanceof Array ? (this.value as MySliderRange).slice() as MySliderRange : this.value;
  }

  private _value: MySliderValue = 0;
  private valueChanged = false;

  get value(): MySliderValue {
    return this._value;
  }

  /**
   * Current slider value
   * It can be number or tuple of [number,number]
   * See TwcSliderValue type
   */
  @Input()
  set value(value: MySliderValue) {
    this.setValue(value);
  }

  private _range = false;

  get range(): boolean {
    return this._range;
  }

  /**
   * Is slider has range
   */
  @Input()
  set range(value: boolean) {
    if (this._range !== value) {
      this._range = value;
      // if value changed then we update value for correction
      this.setValue(this.value);
    }
  }

  /**
   * Track reference
   */
  @ViewChild('track', { read: ElementRef, static: false })
  track: ElementRef;

  /**
   * Selector
   */
  @ViewChildren('selector')
  selector: QueryList<ElementRef>;

  /**
   * Returns selector HTMLElement
   */
  get selectorElement(): HTMLElement {
    return this.selector && this.selector.length > 0 ? this.selector.toArray()[0].nativeElement : null;
  }

  /**
   * List of thumbs
   */
  @ViewChildren(MySliderThumbDirective, {read: ElementRef})
  thumbs: QueryList<ElementRef>;

  /**
   * Then QueryList changed, it stores thumbs before changes
   */
  private lastThumbs: ElementRef[];

  /**
   * Current dragging thumb
   */
  private draggingThumb: HTMLElement;

  private initialized = false;
  private subscriptions: Subscription = new Subscription();

  private animationListenerSet = false;

  private selectedThumbIndex = -1;

  private onChange: Function;
  private onTouched: Function;

  disabled = false;

  ticks: { value: number, pos: string, checked: boolean, selected: boolean }[];

  constructor(
    private host: ElementRef
  ) {
  }

  /**
   * Updates distance param based on "min" and "max"
   */
  private updateDistance(): void {
    this.distance = this.max - this.min;
  }

  /**
   * Calculates step digits after comma
   */
  private updateStepDigitsAfterComma(): void {
    const parts: string[] = this.step.toString().split('.');
    this.stepDigitsAfterComma = (parts.length > 1) ? parts[1].length : 0;
  }

  private setValue(value: MySliderValue, animation: boolean = false): void {

    // while initialization phase just store value
    if (! this.initialized) {
      this._value = value;
      return;
    }

    if (this.min >= this.max) {
      throw Error(`"min" property can't be more than "max" or equal.`);
    }

    value = this.correctSliderValue(value, value > this.value);

    // If passed array but range property equals false
    if (!this.range) {
      if (value instanceof Array) {
        value = value[0];
      }
    }

    // Detecting value change
    let valueChanged = false;

    if (value instanceof Array) {
      if (this._value instanceof Array) {
        valueChanged = (value[0] !== this._value[0]) || (value[1] !== this._value[1]);
      } else {
        valueChanged = true;
      }
    } else {
      if (this._value instanceof Array) {
        valueChanged = true;
      } else {
        valueChanged = value !== this._value;
      }
    }

    if (valueChanged) {

      this._value = value;
      this.valueChanged = true;

      if (this.onChange) {
        if (animation) {
          this.waitAnimationAndEmitOnChange();
        } else {
          this.onChange(value);
          this.input.emit(this.value);
        }
      }

      this.updateView(animation);
      this.updateTicks();
    }
  }

  /**
   * Corrects thumb position based on "trackWidth"
   * @param pos
   */
  private correctThumbPos(pos: number): number {
    if (pos < 0) {
      return 0;
    }

    if (pos > this.trackWidth) {
      return this.trackWidth;
    }

    return pos;
  }

  /**
   * Corrects number value using "min" and "max" boundaries and "step" for precision
   * @param value
   * @param roundUp - while applying step round value up or down
   */
  private correctValue(value: number, roundUp: boolean): number {
    if (value > this.max) {
      value = this.max;
    }

    if (value < this.min) {
      value = this.min;
    }

    return this.applyStep(value, roundUp);
  }

  /**
   * Corrects TwcSliderValue using "min" and "max" boundaries and "step" for precision
   * @param value
   * @param roundUp - while applying step round value up or down
   */
  private correctSliderValue(value: MySliderValue, roundUp: boolean): MySliderValue {

    if (this.range) {
      if (typeof value === 'number') {
        value = [this.value as number, this.max];
      }
    }

    if (value instanceof Array) {
      return [
        this.correctValue(value[0], false),
        this.correctValue(value[1], true)
      ];
    }

    return this.correctValue(value, roundUp);
  }

  /**
   * Apply step to value
   * @param value
   * @param roundUp
   */
  private applyStep(value: number, roundUp: boolean): number {
    let addFactor = 0;

    if (this.stepDigitsAfterComma > 0) {
      addFactor = roundUp ? MySliderComponent.addFactor : -MySliderComponent.addFactor;
    }

    const factor = (value + addFactor) / this.step;
    const newValue = (roundUp ? Math.floor(factor) : Math.ceil(factor)) * this.step;

    // Fixing round error if necessary
    return this.stepDigitsAfterComma > 0 ? parseFloat(newValue.toFixed(this.stepDigitsAfterComma)) : newValue;
  }

  /**
   * Converting value to thumb pos
   * @param pos
   */
  private posToValue(pos: number): number {
    return this.min + (pos * this.distance) / this.trackWidth;
  }

  /**
   * Converting thumb pos to value
   * @param value
   */
  private valueToPos(value: number): number {
    return this.trackOffset + ((value - this.min) * this.trackWidth) / this.distance;
  }

  /**
   * Limit thumbs intersection
   * @param value - value for correction
   * @param index - thumb index
   */
  private limitRange(value: MySliderRange, index: number): MySliderRange {

    const corrected: MySliderRange = value.slice() as MySliderRange;

    if (corrected[0] > corrected[1]) {
      if (index === 0) {
        [corrected[0], corrected[1]] = [corrected[1], corrected[1]];
      } else {
        [corrected[0], corrected[1]] = [corrected[0], corrected[0]];
      }
    }

    return corrected;
  }

  onTickClick( value: number ): void {
    this.setValue( value, false );
  }

  private updateTicks(): void {

    if (!this.thumbs) {
      return;
    }

    Promise.resolve().then( () => {
      this.ticks = [];

      let i = this.min;

      do {
        this.ticks.push( {
          value: i,
          pos: `${this.valueToPos( i ).toString()}px`,
          checked: i < this.value,
          selected: i === this.value
        } );

        i += this.step;
      } while ( i <= this.max );
    } );

  }

  /**
   * Updates component view
   */
  private updateView(animation: boolean = false): void {

    if (!this.thumbs) {
      return;
    }

    let el: HTMLElement;
    const values: number[] = this.value instanceof Array ? this.value : [this.value];

    // positioning thumbs
    this.thumbs.forEach((thumb, i) => {
      el = thumb.nativeElement;
      const pos: number = this.valueToPos(values[i]);

      el.style.transition = animation ? this.getAnimationString('left') : null;
      el.style.left = `${pos}px`;
    });

    // positioning selector
    if (this.selectorElement) {
      el = this.selectorElement;
      const from: number = this.valueToPos(values.length > 1 ? values[0] : this.min);
      const to: number = this.valueToPos(values.length > 1 ? values[1] : values[0]);
      const width: number = to - from;

      el.style.transition = animation ? this.combineAnimation(this.getAnimationString('left'), this.getAnimationString('width')) : null;
      el.style.left = `${from}px`;
      el.style.width = `${width}px`;
    }
  }

  /**
   * Click on track
   * @param event
   */
  onTrackMouseDown(event: MouseEvent): void {

    if (this.disabled) {
      return;
    }

    const rect: ClientRect = (this.track.nativeElement as HTMLElement).getBoundingClientRect();
    const thumbPos: number = this.correctThumbPos(event.clientX - rect.left);
    let index = 0;
    let value: MySliderValue;

    if (this.range) {
      // copy value
      value = this.clonedValue;
      // click value
      const clickValue: number = this.posToValue(thumbPos);
      // distances to thumbs
      const distances: number[] = (value as MySliderRange).map(v => Math.abs(clickValue - v));
      // determine value index
      index = distances[0] < distances[1] ? 0 : 1;

      value[index] = clickValue;
    } else {
      value = this.posToValue(thumbPos);
    }

    // Set selected thumb index
    this.selectedThumbIndex = index;

    this.setValue(value, this.animation);
  }

  /**
   * User start dragging one of thumbs
   * @param event
   */
  private thumbMouseDown: EventListenerOrEventListenerObject = (event: MouseEvent) => {

    if (this.disabled) {
      return;
    }

    this.draggingThumb = event.currentTarget as HTMLElement;

    this.window.addEventListener('mouseup', this.windowMouseUp);
    this.window.addEventListener('mousemove', this.windowMouseMove);

    // if more than one thumbs then move dragging thumb to top
    if (this.thumbs.length > 1) {
      const otherThumb: HTMLElement = this.thumbs.filter(thumb => thumb.nativeElement !== this.draggingThumb)[0].nativeElement;
      this.draggingThumb.parentNode.insertBefore(otherThumb, this.draggingThumb);
    }

    // Set selected thumb index
    this.thumbs.forEach((thumb, i) => {
      if (thumb.nativeElement === this.draggingThumb) {
        this.selectedThumbIndex = i;
      }
    });

    (this.host.nativeElement as HTMLElement).focus();
  }

  /**
   * User finish dragging one of thumbs
   */
  private windowMouseUp: EventListenerOrEventListenerObject = () => {
    this.window.removeEventListener('mouseup', this.windowMouseUp);
    this.window.removeEventListener('mousemove', this.windowMouseMove);
  }

  /**
   * While dragging thumb
   * @param event
   */
  private windowMouseMove: EventListenerOrEventListenerObject = (event: MouseEvent) => {
    const rect: ClientRect = (this.track.nativeElement as HTMLElement).getBoundingClientRect();
    const thumbPos: number = this.correctThumbPos(event.clientX - rect.left);

    if (this.range) {

      // copy value
      let value: MySliderRange = this.clonedValue as MySliderRange;
      const index = this.selectedThumbIndex;

      // Converting thumb pos to value
      value[index] = this.posToValue(thumbPos);

      // Limit position by left or right thumb
      value = this.limitRange(value, index);

      this.setValue(value);
      return;
    }

    this.setValue(this.posToValue(thumbPos));
  }

  private addThumbListeners(): void {
    this.lastThumbs = this.thumbs.toArray();

    this.lastThumbs.forEach((thumb) => {
      (thumb.nativeElement as HTMLElement).addEventListener('mousedown', this.thumbMouseDown);
    });
  }

  private removeThumbListeners(): void {
    this.lastThumbs.forEach((thumb) => {
      (thumb.nativeElement as HTMLElement).removeEventListener('mousedown', this.thumbMouseDown);
    });
  }

  ngAfterViewInit(): void {
    this.subscriptions.add(this.thumbs.changes.subscribe(() => {
      this.removeThumbListeners();
      this.addThumbListeners();
      this.updateView();
    }));

    this.addThumbListeners();
    this.updateView();
    this.updateTicks();
  }

  ngOnInit(): void {
    this.initialized = true;
    this.setValue(this.value);
  }

  ngOnDestroy(): void {
    this.removeThumbListeners();
    this.subscriptions.unsubscribe();
  }

  private get window(): Window {
    return (typeof window === 'undefined') ? null : window;
  }

  private get trackOffset(): number {
    return (this.track.nativeElement as HTMLElement).offsetLeft;
  }

  private get trackWidth(): number {
    return (this.track.nativeElement as HTMLElement).offsetWidth;
  }

  /**
   * Animation routines
   */

  private getAnimationString(param: string): string {
    return this.animation ? `${param} ${this.animationTime}ms ${this.timingFunction}` : null;
  }

  private combineAnimation(...animations: string[]): string {
    return animations.join(',');
  }

  private animationEndListener: EventListenerOrEventListenerObject = () => {
    this.onChange(this.value);
    this.input.emit(this.value);

    const selector: HTMLElement = this.selectorElement;
    selector.removeEventListener('transitionend', this.animationEndListener);

    this.animationListenerSet = false;
  }

  /**
   * Waits animation and then call onChange
   */
  private waitAnimationAndEmitOnChange(): void {
    if (!this.animationListenerSet) {
      const selector: HTMLElement = this.selectorElement;
      selector.addEventListener('transitionend', this.animationEndListener);

      this.animationListenerSet = true;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {

    let value: MySliderValue = this.clonedValue;
    let valueChanged = false;

    switch (event.key) {
      // Decrement value if "left" or "down" key pressed
      case 'ArrowLeft':
      case 'ArrowDown':

        if (this.range) {
          value[this.selectedThumbIndex] -= this.step;
        } else {
          value = value as number - this.step;
        }

        valueChanged = true;

        break;

      // Increment value if "right" or "up" key pressed
      case 'ArrowRight':
      case 'ArrowUp':

        if (this.range) {
          value[this.selectedThumbIndex] += this.step;
        } else {
          value = value as number + this.step;
        }

        valueChanged = true;

        break;

      // Increment the slider value by 10 steps
      case 'PageUp':

        if (this.range) {
          value[this.selectedThumbIndex] += this.step * MySliderComponent.pageUpDownMultiplier;
        } else {
          value = value as number + this.step * MySliderComponent.pageUpDownMultiplier;
        }

        valueChanged = true;

        break;

      // Decrement the slider value by 10 steps
      case 'PageDown':

        if (this.range) {
          value[this.selectedThumbIndex] -= this.step * MySliderComponent.pageUpDownMultiplier;
        } else {
          value = value as number - this.step * MySliderComponent.pageUpDownMultiplier;
        }

        valueChanged = true;

        break;

      // Set the value to the minimum possible
      case 'End':

        if (this.range) {
          value[this.selectedThumbIndex] = this.min;
        } else {
          value = this.min;
        }

        valueChanged = true;

        break;

      // Set the value to the maximum possible
      case 'Home':

        if (this.range) {
          value[this.selectedThumbIndex] = this.max;
        } else {
          value = this.max;
        }

        valueChanged = true;

        break;
    }

    if (valueChanged) {
      if (this.range) {
        value = this.limitRange(value as MySliderRange, this.selectedThumbIndex);
      }
      this.setValue(value);
    }
  }

  @HostListener('focus')
  onFocus(): void {
    if (this.selectedThumbIndex === -1) {
      this.selectedThumbIndex = 0;
    }
  }

  @HostListener('blur')
  onBlur(): void {

    if (this.onTouched) {
      this.onTouched();
    }

    if (this.valueChanged) {
      this.change.emit(this.value);
      this.valueChanged = false;
    }
  }

  /**
   * ControlValueAccessor interface implementation
   */
  writeValue(value: any): void {
    this.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
