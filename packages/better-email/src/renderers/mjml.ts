import type { EmailContext, EmailContextFor, EmailTemplateRenderer, EmailType, RenderedEmail } from '../types';

export interface MJMLRenderedTemplate {
  subject: string;
  mjml: string;
  text: string;
}

export interface MJMLRendererOptions {
  /**
   * The `mjml` compile function.
   *
   * ```ts
   * import mjml2html from 'mjml';
   *
   * const renderer = new MJMLRenderer({
   *   compile: (mjmlString) => mjml2html(mjmlString).html,
   *   templates: { ... },
   * });
   * ```
   */
  compile: (mjml: string) => string;

  /**
   * Map of email type to a function returning `{ subject, mjml, text }`.
   * Each function receives the typed context for its email type.
   *
   * TypeScript enforces that a `'magic-link'` template receives `MagicLinkContext`,
   * a `'verification-email'` template receives `VerificationEmailContext`, etc.
   *
   * ```ts
   * templates: {
   *   'verification-email': (ctx) => ({
   *     subject: 'Verify your email',
   *     mjml: `
   *       <mjml>
   *         <mj-body>
   *           <mj-section>
   *             <mj-column>
   *               <mj-text>Click <a href="${ctx.url}">here</a> to verify.</mj-text>
   *             </mj-column>
   *           </mj-section>
   *         </mj-body>
   *       </mjml>
   *     `,
   *     text: `Verify your email: ${ctx.url}`,
   *   }),
   * }
   * ```
   */
  templates: { [K in EmailType]?: (context: EmailContextFor<K>) => MJMLRenderedTemplate };

  /**
   * Optional fallback renderer for email types without a template.
   */
  fallback?: EmailTemplateRenderer;
}

export class MJMLRenderer implements EmailTemplateRenderer {
  constructor(private options: MJMLRendererOptions) {}

  async render(context: EmailContext): Promise<RenderedEmail> {
    const templateFn = this.options.templates[context.type];

    if (!templateFn) {
      if (this.options.fallback) {
        return this.options.fallback.render(context);
      }
      throw new Error(`[MJMLRenderer] No template found for email type: ${context.type}`);
    }

    const { subject, mjml, text } = (templateFn as (context: EmailContext) => MJMLRenderedTemplate)(context);
    const html = this.options.compile(mjml);

    return { subject, html, text };
  }
}
