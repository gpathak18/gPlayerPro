import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';


@Directive({ selector: '[hoverClass]' })
export class HoverClassDirective {
    
  @Input()
  hoverClass: string;

  constructor(
    public elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  @HostListener('mouseover') mouseover() {
    this.renderer.addClass(this.elementRef.nativeElement, this.hoverClass);
  }

  @HostListener('mouseout') mouseout() {
    this.renderer.removeClass(this.elementRef.nativeElement, this.hoverClass);
  }
}