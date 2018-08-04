import { Directive, AfterViewChecked, Input, ElementRef, HostListener, ViewContainerRef, TemplateRef, Renderer2, ViewRef } from "@angular/core";
import { UiService } from "../core/services/ui.service";

@Directive({
    selector: '[albumDetailViewIf]'
})
export class MatchHeightDirective  {

    private selectedElm: HTMLElement;
    private child: HTMLElement;
    private left = 10;

    constructor(
        private renderer: Renderer2,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private uiService: UiService) {

        this.renderer.listen('window', 'resize', (evt) => {
            if (this.selectedElm) {
                this.calculateLeft()
            }
        })
    }

    @Input() set albumDetailViewIf(condition) {
        if (condition === 'open') {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.child = this.templateRef.elementRef.nativeElement.nextElementSibling
            this.selectedElm = this.templateRef.elementRef.nativeElement.parentElement
            // this.uiService.albumDetailDivHeight.next(this.selectedElm.offsetHeight + 'px');
            this.calculateLeft();
        } else {
            this.viewContainer.clear();
        }
    }

    calculateLeft() {
        let viewportOffset = this.selectedElm.getBoundingClientRect();
        this.left = viewportOffset.left + 10;
        this.child.style.left = (0 - this.left) + 'px'
    }


}
