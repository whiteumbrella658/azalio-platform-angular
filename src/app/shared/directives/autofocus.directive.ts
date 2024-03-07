import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements OnInit {
  @Input('appAutoFocus') isFocused: boolean;
  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.isFocused) {
        this.elementRef.nativeElement.focus();
      }
    });
  }
}
