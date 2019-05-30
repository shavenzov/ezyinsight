import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {MyTransitionTimingFunction} from '../common/types/animation/animation.types';

@Component({
  selector: 'my-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: [ './accordion.component.scss' ]
})
export class MyAccordionComponent implements AfterViewInit, OnDestroy {

  @ViewChild( 'content', { read: ElementRef, static: false } )
  content: ElementRef;

  private initialized = false;

  private _collapsed = true;

  get collapsed(): boolean {
    return this._collapsed;
  }

  /**
   * Accordion collapsed or not
   * See also opposite property expanded
   * @param value
   */
  @Input('collapsed')
  set collapsed(value: boolean) {
    if (this._collapsed !== value) {
      this._collapsed = value;
      this.updateState(this.animation);
    }
  }

  get expanded(): boolean {
    return !this._collapsed;
  }

  /**
   * Accordion expanded or not
   * See also opposite property collapsed
   * @param value
   */
  @Input('expanded')
  set expanded(value: boolean) {
    this.collapsed = !value;
  }

  /**
   * Accordion with border or not
   */
  @Input()
  bordered: boolean | null = null;

  private _animation = true;

  get animation(): boolean {
    return this._animation;
  }

  /**
   * Use animation while open or not
   */
  @Input('animation')
  set animation(value: boolean | null) {
    if (this._animation !== value) {
      this._animation = value;
      this.updateAnimationListeners();
    }
  }

  onToggleBeforeAnimation: EventEmitter<MyAccordionComponent> = new EventEmitter();

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
   * Emits when accordion changes state (expanded/collapsed)
   */
  // tslint:disable-next-line
  @Output('toggle')
  onToggle: EventEmitter<MyAccordionComponent> = new EventEmitter();

  /**
   * Emits when user presses on header
   */
  // tslint:disable-next-line
  @Output('headerClick')
  onHeaderClick: EventEmitter<MyAccordionComponent> = new EventEmitter();

  /**
   * Emits when user clicks on arrow icon
   */
  @Output()
  arrowClick: EventEmitter<MyAccordionComponent> = new EventEmitter();

  private transitionEndListenerSet = false;
  private transitionEndListener = (e: TransitionEvent) => {

    // Filter all transition properties except height
    if (e.propertyName !== 'height') {
      return;
    }

    const element: HTMLElement = this.content.nativeElement;

    if (this.collapsed) {
      element.style.display = 'none';
    } else {
      element.style.height = 'auto';
    }

    this.onToggle.emit(this);
  }

  toggle(): void {
    this.collapsed = !this.collapsed;

    this.onToggleBeforeAnimation.emit(this);

    if (!this.animation) {
      this.onToggle.emit(this);
    }
  }

  /**
   * Sets accordion state (expanded/collapsed)
   * @param expanded
   * @param animation - use animation while changing state or not
   */
  setState(expanded: boolean, animation: boolean = true): void {
    if (this.expanded !== expanded) {
      this._collapsed = !expanded;
      this.updateState(animation);
    }
  }

  refresh(): void {
    this.updateState(false);
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    this.updateAnimationListeners();
    this.refresh();
  }

  private updateAnimationListeners(): void {

    if (!this.initialized) {
      return;
    }

    if (this.content.nativeElement) {
      const element: HTMLElement = this.content.nativeElement;

      if (this.animation) {
        if (!this.transitionEndListenerSet) {
          element.addEventListener('transitionend', this.transitionEndListener);
          this.transitionEndListenerSet = true;
        }
      } else if (this.transitionEndListenerSet) {
        element.removeEventListener('transitionend', this.transitionEndListener);
        this.transitionEndListenerSet = false;
      }
    }
  }

  private updateState(animation: boolean = true): void {

    if (!this.initialized) {
      return;
    }

    const content: HTMLElement = this.content.nativeElement;

    if (!content) {
      return;
    }

    content.style.transition = animation ? this.contentTransition : null;

    if (this.collapsed) {
      this.collapse(content, animation);
    } else {
      this.expand(content, animation);
    }
  }

  private collapse(element: HTMLElement, animation: boolean): void {

    if (animation) {
      const elHeight: number = element.scrollHeight;

      window.requestAnimationFrame(() => {

        element.style.height = `${elHeight}px`;
        element.style.opacity = '1';

        window.requestAnimationFrame(() => {
          element.style.height = '0px';
          element.style.opacity = '0';
        });
      });

      return;
    }

    element.style.height = '0px';
    element.style.opacity = '0';
    element.style.display = 'none';
  }

  private expand(element: HTMLElement, animation: boolean): void {

    element.style.display = 'block';

    if (animation) {

      const elHeight: number = element.scrollHeight;

      window.requestAnimationFrame(() => {

        element.style.height = '0';
        element.style.opacity = '0';

        window.requestAnimationFrame(() => {
          element.style.height = `${elHeight}px`;
          element.style.opacity = '1';
        });
      });

      return;
    }

    element.style.height = 'auto';
    element.style.opacity = '1';
  }

  private get contentTransition(): string {
    return `height ${this.animationTime}ms ${this.timingFunction}, opacity ${this.animationTime}ms ${this.timingFunction}`;
  }

  ngOnDestroy(): void {

    const content: HTMLElement = this.content.nativeElement;

    // Remove transitionend listener
    if (this.transitionEndListenerSet) {
      content.removeEventListener('transitionend', this.transitionEndListener);
    }

  }

}
