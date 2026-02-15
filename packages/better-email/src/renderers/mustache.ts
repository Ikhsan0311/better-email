import type { EmailContext, EmailContextFor, EmailTemplateRenderer, EmailType, RenderedEmail } from '../types';

export interface MustacheRenderedTemplate {
  subject: string;
  template: string;
  text: string;
}

export interface MustacheRendererOptions {
  /**
   * The mustache render function.
   *
   * ```ts
   * import Mustache from 'mustache';
   *
   * const renderer = new MustacheRenderer({
   *   render: (template, data) => Mustache.render(template, data),
   *   templates: { ... },
   * });
   * ```
   */
  render: (template: string, data: Record<string, unknown>) => string;

  /**
   * Map of email type to a function returning `{ subject, template, text }`.
   * Each function receives the typed context for its email type.
   *
   * TypeScript enforces that a `'magic-link'` template receives `MagicLinkContext`,
   * a `'verification-email'` template receives `VerificationEmailContext`, etc.
   *
   * ```ts
   * templates: {
   *   'verification-email': (ctx) => ({
   *     subject: 'Verify your email',
   *     template: `
   *       <html>
   *         <body>
   *           <p>Click <a href="{{url}}">here</a> to verify.</p>
   *         </body>
   *       </html>
   *     `,
   *     text: `Verify your email: ${ctx.url}`,
   *   }),
   * }
   * ```
   */
  templates: { [K in EmailType]?: (context: EmailContextFor<K>) => MustacheRenderedTemplate };

  /**
   * Optional fallback renderer for email types without a template.
   */
  fallback?: EmailTemplateRenderer;
}

export class MustacheRenderer implements EmailTemplateRenderer {
  constructor(private options: MustacheRendererOptions) {}

  async render(context: EmailContext): Promise<RenderedEmail> {
    const templateFn = this.options.templates[context.type];

    if (!templateFn) {
      if (this.options.fallback) {
        return this.options.fallback.render(context);
      }
      throw new Error(`[MustacheRenderer] No template found for email type: ${context.type}`);
    }

    const { subject, template, text } = (templateFn as (context: EmailContext) => MustacheRenderedTemplate)(context);
    const html = this.options.render(template, context as unknown as Record<string, unknown>);

    return { subject, html, text };
  }
}
