import type { EmailContext, EmailContextFor, EmailTemplateRenderer, EmailType, RenderedEmail } from '../types';
import { resolveSubject } from './resolve-subject';

export interface ReactMJMLRendererOptions {
  /**
   * The `render` function from `@faire/mjml-react`.
   *
   * ```ts
   * import { render } from '@faire/mjml-react';
   *
   * const renderer = new ReactMJMLRenderer({
   *   render: (element) => render(element),
   *   createElement,
   *   templates: { ... },
   *   subjects: { ... },
   * });
   * ```
   */
  render: (element: any) => { html: string; errors: any[] };

  /**
   * `React.createElement` from `react`.
   *
   * ```ts
   * import { createElement } from 'react';
   * ```
   */
  createElement: (component: any, props: any) => any;

  /**
   * Map of email type to React component using `@faire/mjml-react` components.
   * Each component receives the typed context for its email type as props.
   *
   * TypeScript enforces that a `'magic-link'` template accepts `MagicLinkContext` props,
   * a `'verification-email'` template accepts `VerificationEmailContext` props, etc.
   *
   * ```ts
   * import { Mjml, MjmlBody, MjmlSection, MjmlColumn, MjmlText } from '@faire/mjml-react';
   *
   * function VerificationEmail({ url }: { url: string }) {
   *   return (
   *     <Mjml>
   *       <MjmlBody>
   *         <MjmlSection>
   *           <MjmlColumn>
   *             <MjmlText>Click <a href={url}>here</a> to verify.</MjmlText>
   *           </MjmlColumn>
   *         </MjmlSection>
   *       </MjmlBody>
   *     </Mjml>
   *   );
   * }
   * ```
   */
  templates: { [K in EmailType]?: (props: EmailContextFor<K>) => any };

  /**
   * Map of email type to subject line (string or function).
   * When using a function, the context is narrowed to the specific email type.
   */
  subjects: { [K in EmailType]?: string | ((context: EmailContextFor<K>) => string) };

  /**
   * Optional fallback renderer for email types without a template.
   */
  fallback?: EmailTemplateRenderer;
}

export class ReactMJMLRenderer implements EmailTemplateRenderer {
  constructor(private options: ReactMJMLRendererOptions) {}

  async render(context: EmailContext): Promise<RenderedEmail> {
    const Component = this.options.templates[context.type];

    if (!Component) {
      if (this.options.fallback) {
        return this.options.fallback.render(context);
      }
      throw new Error(`[ReactMJMLRenderer] No template found for email type: ${context.type}`);
    }

    const element = this.options.createElement(Component, context);
    const { html } = this.options.render(element);
    const subject = resolveSubject('ReactMJMLRenderer', this.options.subjects, context);

    return {
      subject,
      html,
      text: this.htmlToPlainText(html),
    };
  }

  /**
   * Converts HTML to plain text with basic formatting preservation.
   * Handles line breaks, links, lists, and common block elements.
   */
  private htmlToPlainText(html: string): string {
    let text = html;

    // Remove style and script tags with their content
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

    // Convert block elements to line breaks
    text = text.replace(/<\/(div|p|h[1-6]|li|tr|table)>/gi, '\n');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/td>/gi, '\t');

    // Extract link text with URL
    text = text.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (_, href, linkText) => {
      const cleanText = linkText.replace(/<[^>]+>/g, '').trim();
      return cleanText === href ? href : `${cleanText} (${href})`;
    });

    // Remove all remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)));

    // Clean up whitespace
    text = text
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
      .replace(/\n[ \t]+/g, '\n') // Remove leading spaces on lines
      .replace(/[ \t]+\n/g, '\n') // Remove trailing spaces on lines
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive line breaks
      .trim();

    return text;
  }
}
