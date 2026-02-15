import type { EmailContext, EmailContextFor, EmailTemplateRenderer, EmailType, RenderedEmail } from '../types';
import { resolveSubject } from './resolve-subject';

export interface ReactEmailRendererOptions {
  /**
   * The `render` function from `@react-email/render`.
   *
   * ```ts
   * import { render } from '@react-email/render';
   * ```
   */
  render: (element: any, options?: { plainText?: boolean }) => Promise<string>;

  /**
   * `React.createElement` from `react`.
   *
   * ```ts
   * import { createElement } from 'react';
   * ```
   */
  createElement: (component: any, props: any) => any;

  /**
   * Map of email type to React Email component.
   * Each component receives the typed context for its email type as props.
   *
   * TypeScript enforces that a `'magic-link'` template accepts `MagicLinkContext` props,
   * a `'verification-email'` template accepts `VerificationEmailContext` props, etc.
   *
   * ```ts
   * templates: {
   *   'verification-email': VerificationEmail,
   *   'reset-password': ResetPasswordEmail,
   * }
   * ```
   */
  templates: { [K in EmailType]?: (props: EmailContextFor<K>) => any };

  /**
   * Map of email type to subject line (string or function).
   * When using a function, the context is narrowed to the specific email type.
   *
   * ```ts
   * subjects: {
   *   'verification-email': 'Verify your email',
   *   'reset-password': (ctx) => `Reset password for ${ctx.user.name}`,
   * }
   * ```
   */
  subjects: { [K in EmailType]?: string | ((context: EmailContextFor<K>) => string) };

  /**
   * Optional: Custom plain text renderer. If not provided, uses `render(element, { plainText: true })`.
   *
   * You can use `renderToPlainText` from `@react-email/render` for more control:
   *
   * ```ts
   * import { render, renderToPlainText } from '@react-email/render';
   *
   * const renderer = new ReactEmailRenderer({
   *   render,
   *   renderPlainText: renderToPlainText,
   *   // ...
   * });
   * ```
   */
  renderPlainText?: (element: any) => Promise<string> | string;

  /**
   * Optional fallback renderer for email types without a template.
   */
  fallback?: EmailTemplateRenderer;
}

export class ReactEmailRenderer implements EmailTemplateRenderer {
  constructor(private options: ReactEmailRendererOptions) {}

  async render(context: EmailContext): Promise<RenderedEmail> {
    const Component = this.options.templates[context.type];

    if (!Component) {
      if (this.options.fallback) {
        return this.options.fallback.render(context);
      }
      throw new Error(`[ReactEmailRenderer] No template found for email type: ${context.type}`);
    }

    const element = this.options.createElement(Component, context);
    const [html, text] = await Promise.all([
      this.options.render(element),
      this.options.renderPlainText
        ? Promise.resolve(this.options.renderPlainText(element))
        : this.options.render(element, { plainText: true }),
    ]);
    const subject = resolveSubject('ReactEmailRenderer', this.options.subjects, context);

    return { subject, html, text };
  }
}
