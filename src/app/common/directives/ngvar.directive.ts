import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface NgVarContext<T> {
  /**
   * using `ngrxLet` to enable `as` syntax: `*ngVar="foo as bar"`
   */
  ngVar: T;
  /**
   * using `$implicit` to enable `let` syntax: `*ngVar="foo; let bar"`
   */
  $implicit: T;
}

/**
 * @ngModule NgVarModule
 *
 * @description
 *
 * The `*ngVar` directive it's a Angular structural directive for sharing data as local variable into html component template..
 *
 * @usageNotes
 *
 * ### Usage
 *
 * ```html
 * <ng-container *ngVar="(num1 + num2); let total"> <!-- single computation -->
 *    <div>
 *       1: {{ total }}
 *     </div>
 *     <div>
 *       2: {{ total }}
 *     </div>
 * </ng-container>
 * ```
 *
 * @publicApi
 */
@Directive({
  selector: '[ngVar]',
  standalone: true,
})
export class NgVarDirective<T> {
  private context: NgVarContext<T | null> = { ngVar: null, $implicit: null };
  private hasView = false;

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<NgVarContext<T>>
  ) {}

  @Input()
  set ngVar(value: T) {
    this.context.$implicit = this.context.ngVar = value;
    if (!this.hasView) {
      this.hasView = true;
      this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

  /** @internal */
  public static ngVarUseIfTypeGuard: void;

  /**
   * Assert the correct type of the expression bound to the `NgVar` input within the template.
   *
   * The presence of this static field is a signal to the Ivy template type check compiler that
   * when the `NgVar` structural directive renders its template, the type of the expression bound
   * to `NgVar` should be narrowed in some way. For `NgVar`, the binding expression itself is used to
   * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `NgVar`.
   */
  static ngTemplateGuard_ngVar: 'binding';

  /**
   * Asserts the correct type of the context for the template that `NgVar` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgVar` structural directive renders its template with a specific context type.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static ngTemplateContextGuard<T>(
    dir: NgVarDirective<T>,
    ctx: any
  ): ctx is NgVarContext<T> {
    return true;
  }
}
