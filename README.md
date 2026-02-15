# Better Email

A Better Auth plugin that centralizes all email-sending callbacks through a single ESP-agnostic provider and template renderer.

## Problem

Better Auth scatters email-sending across 8+ independent callback sites (4 core, 4+ plugin-level). Each must be independently wired to an email provider and template. This leads to duplicated send logic, inconsistent error handling, and templates spread across multiple locations.

## Solution

`better-email` decouples **what you send** from **how you send it** through two independent interfaces:

- **Provider** (`EmailProvider`) handles email delivery. Swap providers (Nuntly, SES, Resend, Postmark, Mailgun, SMTP) without touching a single template.
- **Renderer** (`EmailTemplateRenderer`) handles HTML/text generation. Switch from plain HTML to React Email or MJML without changing your provider config.

This separation means you can mix and match freely: use Postmark for delivery with React Email for templates, then later migrate to SES without rewriting any template code.

`better-email` also provides:

- **7 built-in providers**: Nuntly (default), SES, Resend, Postmark, Mailgun, SMTP, Console
- **5 built-in renderers**: plain HTML (default), React Email, MJML, Mustache, React MJML
- **Core callback defaults** injected via `init()` for `sendVerificationEmail` and `sendResetPassword`
- **Factory wrappers** for plugin-level callbacks (magic link, email OTP, organization invitation, two-factor OTP, change email, delete account)
- **Lifecycle hooks** (`onBeforeSend`, `onAfterSend`, `onSendError`) applied consistently across all email types
- **Tag management** with default tags and per-type tags for analytics/tracking

## Setup with Next.js 16 + Better Auth

### 1. Install

```bash
npm install @nuntly/better-email
# or
pnpm add @nuntly/better-email
# or
yarn add @nuntly/better-email
# or
bun add @nuntly/better-email
```

### 2. Pick a provider

Choose one of the built-in providers or implement the `EmailProvider` interface. The default provider is `NuntlyProvider`.

### 3. Pick a template renderer

Choose one of the built-in renderers or implement the `EmailTemplateRenderer` interface.

### 4. Configure Better Auth

```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth';
import { organization, twoFactor } from 'better-auth/plugins';
import { magicLink } from 'better-auth/plugins/magic-link';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { betterEmail, NuntlyProvider, DefaultTemplateRenderer } from '@repo/better-email';

const email = betterEmail({
  provider: new NuntlyProvider({
    apiKey: process.env.NUNTLY_API_KEY!,
    from: 'noreply@yourdomain.com',
  }),
  templateRenderer: new DefaultTemplateRenderer(),
  defaultTags: [{ name: 'app', value: 'my-app' }],
  tags: {
    'verification-email': [{ name: 'category', value: 'auth' }],
  },
  onAfterSend: async (context, message) => {
    console.log(`Email sent: ${context.type} to ${message.to}`);
  },
  onSendError: async (context, message, error) => {
    console.error(`Email failed: ${context.type} to ${message.to}`, error);
  },
});

export const auth = betterAuth({
  // ...your database, session, social providers config...
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: email.helpers.changeEmail,
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: email.helpers.deleteAccount,
    },
  },
  plugins: [
    email,
    twoFactor({
      sendOTP: email.helpers.twoFactor,
    }),
    organization({
      sendInvitationEmail: email.helpers.invitation,
    }),
    magicLink({
      sendMagicLink: email.helpers.magicLink,
    }),
    emailOTP({
      sendVerificationOTP: email.helpers.otp,
    }),
  ],
});
```

### 5. Export the auth handler (Next.js 16 App Router)

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth.handler);
```

## Providers

Providers handle **delivery only**. They receive a ready-to-send message (`to`, `subject`, `html`, `text`, `tags`) and deliver it through a service. They know nothing about templates or rendering.

All providers implement the `EmailProvider` interface:

```typescript
interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}
```

Switching provider never requires changes to your templates. You can use a built-in provider or create your own by implementing the interface.

### NuntlyProvider (default)

Sends emails via the Nuntly REST API. No external dependencies.

```typescript
import { NuntlyProvider } from '@repo/better-email';

const provider = new NuntlyProvider({
  apiKey: process.env.NUNTLY_API_KEY!,
  from: 'noreply@yourdomain.com',
  // Optional: defaults to https://api.nuntly.com
  baseUrl: 'https://api.nuntly.com',
});
```

| Option    | Type     | Required | Description                                         |
| --------- | -------- | -------- | --------------------------------------------------- |
| `apiKey`  | `string` | Yes      | Your Nuntly API key.                                |
| `from`    | `string` | Yes      | Sender email address.                               |
| `baseUrl` | `string` | No       | API base URL. Defaults to `https://api.nuntly.com`. |

### SESProvider

Sends emails via AWS SES v2. Requires `@aws-sdk/client-sesv2`. The provider handles building the full SES payload internally.

```typescript
import { SESProvider } from '@repo/better-email';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const provider = new SESProvider({
  client: new SESv2Client({ region: 'us-east-1' }),
  SendEmailCommand,
  from: 'noreply@yourdomain.com',
  configurationSetName: 'my-config-set', // optional
});
```

| Option                 | Type          | Required | Description                                                |
| ---------------------- | ------------- | -------- | ---------------------------------------------------------- |
| `client`               | `SESv2Client` | Yes      | An `SESv2Client` instance from `@aws-sdk/client-sesv2`.    |
| `SendEmailCommand`     | `class`       | Yes      | The `SendEmailCommand` class from `@aws-sdk/client-sesv2`. |
| `from`                 | `string`      | Yes      | Sender email address.                                      |
| `configurationSetName` | `string`      | No       | SES configuration set name for tracking.                   |

### ResendProvider

Sends emails via the Resend REST API. No external dependencies.

```typescript
import { ResendProvider } from '@repo/better-email';

const provider = new ResendProvider({
  apiKey: process.env.RESEND_API_KEY!,
  from: 'noreply@yourdomain.com',
});
```

| Option    | Type     | Required | Description                                         |
| --------- | -------- | -------- | --------------------------------------------------- |
| `apiKey`  | `string` | Yes      | Your Resend API key.                                |
| `from`    | `string` | Yes      | Sender email address.                               |
| `baseUrl` | `string` | No       | API base URL. Defaults to `https://api.resend.com`. |

### PostmarkProvider

Sends emails via the Postmark REST API. No external dependencies.

```typescript
import { PostmarkProvider } from '@repo/better-email';

const provider = new PostmarkProvider({
  serverToken: process.env.POSTMARK_SERVER_TOKEN!,
  from: 'noreply@yourdomain.com',
  messageStream: 'outbound', // optional
});
```

| Option          | Type     | Required | Description                                              |
| --------------- | -------- | -------- | -------------------------------------------------------- |
| `serverToken`   | `string` | Yes      | Your Postmark server token.                              |
| `from`          | `string` | Yes      | Sender email address.                                    |
| `messageStream` | `string` | No       | Postmark message stream.                                 |
| `baseUrl`       | `string` | No       | API base URL. Defaults to `https://api.postmarkapp.com`. |

### MailgunProvider

Sends emails via the Mailgun REST API. No external dependencies.

```typescript
import { MailgunProvider } from '@repo/better-email';

const provider = new MailgunProvider({
  apiKey: process.env.MAILGUN_API_KEY!,
  domain: 'mg.yourdomain.com',
  from: 'noreply@yourdomain.com',
  // Optional: use EU region
  baseUrl: 'https://api.eu.mailgun.net',
});
```

| Option    | Type     | Required | Description                                          |
| --------- | -------- | -------- | ---------------------------------------------------- |
| `apiKey`  | `string` | Yes      | Your Mailgun API key.                                |
| `domain`  | `string` | Yes      | Your Mailgun sending domain.                         |
| `from`    | `string` | Yes      | Sender email address.                                |
| `baseUrl` | `string` | No       | API base URL. Defaults to `https://api.mailgun.net`. |

### SMTPProvider

Sends emails via SMTP using a nodemailer transporter. Requires `nodemailer`. The provider handles message formatting internally.

```typescript
import { SMTPProvider } from '@repo/better-email';
import nodemailer from 'nodemailer';

const provider = new SMTPProvider({
  transporter: nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    auth: { user: 'user', pass: 'pass' },
  }),
  from: 'noreply@yourdomain.com',
});
```

| Option        | Type                   | Required | Description                                       |
| ------------- | ---------------------- | -------- | ------------------------------------------------- |
| `transporter` | nodemailer transporter | Yes      | A pre-configured nodemailer transporter instance. |
| `from`        | `string`               | Yes      | Sender email address.                             |

### ConsoleProvider

Logs emails to the console instead of sending them. Useful for development and testing.

```typescript
import { ConsoleProvider } from '@repo/better-email';

const provider = new ConsoleProvider();
```

### Custom provider

Implement the `EmailProvider` interface for any email service:

```typescript
import type { EmailProvider, EmailMessage } from '@repo/better-email';

const customProvider: EmailProvider = {
  async send(message: EmailMessage) {
    await yourEmailApi.send({
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });
  },
};
```

## Template renderers

Renderers handle **HTML/text generation only**. They receive a typed context (user, url, token, etc.) and produce `{ subject, html, text }`. They know nothing about how the email is delivered.

All renderers implement the `EmailTemplateRenderer` interface:

```typescript
interface EmailTemplateRenderer {
  render(context: EmailContext): Promise<RenderedEmail>;
}
```

Switching renderer never requires changes to your transport config. The `render` method receives a discriminated union (`EmailContext`) where you switch on `context.type` to access type-specific fields.

### DefaultTemplateRenderer

Renders minimal plain HTML for all 8 email types. No dependencies required. Useful for prototyping and testing.

```typescript
import { DefaultTemplateRenderer } from '@repo/better-email';

const renderer = new DefaultTemplateRenderer();
```

### ReactMJMLRenderer

Renders templates built with [React MJML](https://github.com/Faire/mjml-react) components. Requires `react` and `@faire/mjml-react`.

**Automatic plain text generation:** The renderer automatically converts the HTML output to plain text, preserving links, line breaks, and basic formatting.

```typescript
import { ReactMJMLRenderer } from '@repo/better-email';
import { render } from '@faire/mjml-react';
import { createElement } from 'react';
import VerificationEmail from './emails/verification-mjml';
import ResetPasswordEmail from './emails/reset-password-mjml';

const renderer = new ReactMJMLRenderer({
  render: (element) => render(element),
  createElement,
  templates: {
    'verification-email': VerificationEmail,
    'reset-password': ResetPasswordEmail,
  },
  subjects: {
    'verification-email': 'Verify your email',
    'reset-password': 'Reset your password',
  },
});
```

Each template component uses `@faire/mjml-react` MJML components and receives the typed context as props:

```tsx
// emails/verification-mjml.tsx
import { Mjml, MjmlBody, MjmlSection, MjmlColumn, MjmlText } from '@faire/mjml-react';
import type { EmailProps } from '@repo/better-email';

export default function VerificationEmail({ user, url }: EmailProps<'verification-email'>) {
  return (
    <Mjml>
      <MjmlBody>
        <MjmlSection>
          <MjmlColumn>
            <MjmlText>Hi {user.name},</MjmlText>
            <MjmlText>
              Click <a href={url}>here</a> to verify your email.
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
      </MjmlBody>
    </Mjml>
  );
}
```

| Option          | Type                                             | Required | Description                                     |
| --------------- | ------------------------------------------------ | -------- | ----------------------------------------------- |
| `render`        | `(element) => { html: string; errors: any[] }`   | Yes      | The `render` function from `@faire/mjml-react`. |
| `createElement` | `(component, props) => any`                      | Yes      | `React.createElement`.                          |
| `templates`     | `Partial<Record<EmailType, Component>>`          | Yes      | Map of email type to React MJML component.      |
| `subjects`      | `Partial<Record<EmailType, string \| Function>>` | Yes      | Map of email type to subject line or function.  |
| `fallback`      | `EmailTemplateRenderer`                          | No       | Fallback renderer for missing templates.        |

### ReactEmailRenderer

Renders templates built with [React Email](https://react.email) components. Requires `react` and `@react-email/render`.

**Automatic plain text generation:** The renderer automatically generates plain text versions of emails using `{ plainText: true }` option. You can optionally provide a custom `renderPlainText` function for more control.

```typescript
import { ReactEmailRenderer } from '@repo/better-email';
import { render } from '@react-email/render';
import { createElement } from 'react';
import VerificationEmail from './emails/verification';
import ResetPasswordEmail from './emails/reset-password';

const renderer = new ReactEmailRenderer({
  render,
  // Optional: Custom plain text renderer
  // renderPlainText: (element) => render(element, { plainText: true }),
  createElement,
  templates: {
    'verification-email': VerificationEmail,
    'reset-password': ResetPasswordEmail,
  },
  subjects: {
    'verification-email': 'Verify your email',
    'reset-password': 'Reset your password',
  },
});
```

Each template component receives the typed context as props. Use the `EmailProps<T>` utility type to get the props for a given email type (strips the `type` discriminator automatically):

```tsx
// emails/verification.tsx
import { Html, Head, Body, Text, Link } from '@react-email/components';
import type { EmailProps } from '@repo/better-email';

export default function VerificationEmail({ user, url }: EmailProps<'verification-email'>) {
  return (
    <Html>
      <Head />
      <Body>
        <Text>Hi {user.name},</Text>
        <Text>Click the link below to verify your email:</Text>
        <Link href={url}>Verify email</Link>
      </Body>
    </Html>
  );
}
```

| Option            | Type                                             | Required | Description                                                                     |
| ----------------- | ------------------------------------------------ | -------- | ------------------------------------------------------------------------------- |
| `render`          | `(element, options?) => Promise<string>`         | Yes      | The `render` function from `@react-email/render`.                               |
| `createElement`   | `(component, props) => any`                      | Yes      | `React.createElement`.                                                          |
| `templates`       | `Partial<Record<EmailType, Component>>`          | Yes      | Map of email type to React component.                                           |
| `subjects`        | `Partial<Record<EmailType, string \| Function>>` | Yes      | Map of email type to subject line or function.                                  |
| `renderPlainText` | `(element) => Promise<string> \| string`         | No       | Custom plain text renderer. Defaults to `render(element, { plainText: true })`. |
| `fallback`        | `EmailTemplateRenderer`                          | No       | Fallback renderer for missing templates.                                        |

### MJMLRenderer

Renders templates written in [MJML](https://mjml.io) markup. Requires the `mjml` package.

```typescript
import { MJMLRenderer } from '@repo/better-email';
import mjml2html from 'mjml';

const renderer = new MJMLRenderer({
  compile: (mjmlString) => mjml2html(mjmlString).html,
  templates: {
    'verification-email': (ctx) => ({
      subject: 'Verify your email',
      mjml: `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>
                  Click <a href="${ctx.url}">here</a> to verify your email.
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `,
      text: `Verify your email: ${ctx.url}`,
    }),
    'reset-password': (ctx) => ({
      subject: 'Reset your password',
      mjml: `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>
                  Click <a href="${ctx.url}">here</a> to reset your password.
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `,
      text: `Reset your password: ${ctx.url}`,
    }),
  },
});
```

Each template function receives the typed `EmailContext` and returns `{ subject, mjml, text }`.

**Loading templates from files:**

Since MJML templates are plain strings (not JavaScript template literals), you need a templating engine to inject dynamic values. Use Mustache syntax in your MJML files:

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';
import Mustache from 'mustache';

const loadTemplate = (filename: string) => readFileSync(join(__dirname, 'templates', filename), 'utf-8');

const renderer = new MJMLRenderer({
  compile: (mjmlString) => mjml2html(mjmlString).html,
  templates: {
    'verification-email': (ctx) => {
      // Template file uses Mustache syntax: <a href="{{url}}">
      const mjmlTemplate = loadTemplate('verification.mjml');
      const mjmlWithData = Mustache.render(mjmlTemplate, ctx);

      return {
        subject: 'Verify your email',
        mjml: mjmlWithData,
        text: `Verify your email: ${ctx.url}`,
      };
    },
  },
});
```

**templates/verification.mjml:**
```xml
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          Click <a href="{{url}}">here</a> to verify your email.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
```

| Option      | Type                                   | Required | Description                                                                 |
| ----------- | -------------------------------------- | -------- | --------------------------------------------------------------------------- |
| `compile`   | `(mjml: string) => string`             | Yes      | Compiles MJML to HTML. Wraps `mjml2html(...).html`.                         |
| `templates` | `Partial<Record<EmailType, Function>>` | Yes      | Map of email type to template function returning `{ subject, mjml, text }`. |
| `fallback`  | `EmailTemplateRenderer`                | No       | Fallback renderer for missing templates.                                    |

### MustacheRenderer

Renders templates using [Mustache](https://mustache.github.io/) templating syntax. Requires the `mustache` package.

```typescript
import { MustacheRenderer } from '@repo/better-email';
import Mustache from 'mustache';

const renderer = new MustacheRenderer({
  render: (template, data) => Mustache.render(template, data),
  templates: {
    'verification-email': (ctx) => ({
      subject: 'Verify your email',
      template: `
        <html>
          <body>
            <p>Click <a href="{{url}}">here</a> to verify your email.</p>
          </body>
        </html>
      `,
      text: `Verify your email: ${ctx.url}`,
    }),
    'reset-password': (ctx) => ({
      subject: 'Reset your password',
      template: `
        <html>
          <body>
            <p>Click <a href="{{url}}">here</a> to reset your password.</p>
          </body>
        </html>
      `,
      text: `Reset your password: ${ctx.url}`,
    }),
  },
});
```

Each template function receives the typed `EmailContext` and returns `{ subject, template, text }`. The template string uses Mustache syntax (`{{variable}}`), and the full context is passed as data to `Mustache.render`.

**Loading templates from files:**

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

const loadTemplate = (filename: string) => readFileSync(join(__dirname, 'templates', filename), 'utf-8');

const renderer = new MustacheRenderer({
  render: (template, data) => Mustache.render(template, data),
  templates: {
    'verification-email': (ctx) => ({
      subject: 'Verify your email',
      template: loadTemplate('verification.mustache'), // {{url}} will be replaced automatically
      text: `Verify your email: ${ctx.url}`,
    }),
  },
});
```

**templates/verification.mustache:**
```html
<html>
  <body>
    <p>Hi {{user.name}},</p>
    <p>Click <a href="{{url}}">here</a> to verify your email.</p>
  </body>
</html>
```

The `MustacheRenderer` automatically passes the full context to `Mustache.render()`, so all fields (url, user.name, etc.) are available in your template.

| Option      | Type                                                          | Required | Description                                                                     |
| ----------- | ------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `render`    | `(template: string, data: Record<string, unknown>) => string` | Yes      | Mustache render function. Wraps `Mustache.render(template, data)`.              |
| `templates` | `Partial<Record<EmailType, Function>>`                        | Yes      | Map of email type to template function returning `{ subject, template, text }`. |
| `fallback`  | `EmailTemplateRenderer`                                       | No       | Fallback renderer for missing templates.                                        |

### Custom renderer

Implement the `EmailTemplateRenderer` interface:

```typescript
import type { EmailTemplateRenderer, EmailContext, RenderedEmail } from '@repo/better-email';

const customRenderer: EmailTemplateRenderer = {
  async render(context: EmailContext): Promise<RenderedEmail> {
    switch (context.type) {
      case 'verification-email':
        return {
          subject: 'Verify your email',
          html: `<p>Verify: <a href="${context.url}">${context.url}</a></p>`,
          text: `Verify: ${context.url}`,
        };
      // handle other types...
      default: {
        const _exhaustive: never = context;
        throw new Error(`Unhandled email type: ${(_exhaustive as EmailContext).type}`);
      }
    }
  },
};
```

The `never` check ensures TypeScript reports a compile-time error if a new email type is added to `EmailContext` without being handled in your renderer.

### Combining renderers with fallback

All built-in renderers accept an optional `fallback` renderer. If a template is not found for an email type, the fallback is used instead. This lets you use React Email for your main templates while the `DefaultTemplateRenderer` covers any types you haven't customized yet:

```typescript
import { ReactEmailRenderer, DefaultTemplateRenderer } from '@repo/better-email';

const renderer = new ReactEmailRenderer({
  render: (element, options) => render(element, options),
  createElement,
  templates: {
    'verification-email': VerificationEmail,
    'reset-password': ResetPasswordEmail,
  },
  subjects: {
    'verification-email': 'Verify your email',
    'reset-password': 'Reset your password',
  },
  fallback: new DefaultTemplateRenderer(),
});
```

## How it works

### `init()` and `defu` semantics

Better Auth merges plugin `init()` options with user options via `defu(userOptions, pluginOptions)`. This means the plugin's callbacks act as **defaults**: if you provide your own `sendVerificationEmail` or `sendResetPassword`, your callback wins.

### Core callbacks (via `init()`)

The plugin automatically provides defaults for:

| Callback                | Better Auth option path                   |
| ----------------------- | ----------------------------------------- |
| `sendVerificationEmail` | `emailVerification.sendVerificationEmail` |
| `sendResetPassword`     | `emailAndPassword.sendResetPassword`      |

### Helpers (for plugin-level callbacks)

The plugin exposes pre-configured helpers via `email.helpers.*`. Each helper is a callback matching the signature its target plugin expects:

| Helper                  | Plugin         | Plugin option                                   |
| ----------------------- | -------------- | ----------------------------------------------- |
| `helpers.changeEmail`   | core           | `user.changeEmail.sendChangeEmailVerification`  |
| `helpers.deleteAccount` | core           | `user.deleteUser.sendDeleteAccountVerification` |
| `helpers.magicLink`     | `magicLink`    | `sendMagicLink`                                 |
| `helpers.otp`           | `emailOTP`     | `sendVerificationOTP`                           |
| `helpers.invitation`    | `organization` | `sendInvitationEmail`                           |
| `helpers.twoFactor`     | `twoFactor`    | `sendOTP`                                       |

The standalone factory functions (`betterEmailMagicLink`, `betterEmailOTP`, etc.) are still exported for cases where you need to create helpers with different options.

### Email flow

For every email (both core defaults and helpers), the flow is:

1. `templateRenderer.render(context)` produces `{ subject, html, text }`
2. Tags are merged: `[...defaultTags, ...perTypeTags, { name: 'type', value: context.type }]`
3. `onBeforeSend(context, message)` is called (return `false` to skip sending)
4. `transport.send(message)` delivers the email
5. `onAfterSend(context, message)` or `onSendError(context, message, error)` is called

## Email types

The `EmailContext` discriminated union covers 8 email types. Each type has a corresponding exported interface:

| Type                          | Context interface                  | Key fields                                       |
| ----------------------------- | ---------------------------------- | ------------------------------------------------ |
| `verification-email`          | `VerificationEmailContext`         | `user`, `url`, `token`                           |
| `reset-password`              | `ResetPasswordContext`             | `user`, `url`, `token`                           |
| `change-email-verification`   | `ChangeEmailVerificationContext`   | `user`, `newEmail`, `url`, `token`               |
| `delete-account-verification` | `DeleteAccountVerificationContext` | `user`, `url`, `token`                           |
| `magic-link`                  | `MagicLinkContext`                 | `email`, `url`, `token`                          |
| `verification-otp`            | `VerificationOTPContext`           | `email`, `otp`, `otpType`                        |
| `organization-invitation`     | `OrganizationInvitationContext`    | `email`, `organization`, `inviter`, `invitation` |
| `two-factor-otp`              | `TwoFactorOTPContext`              | `user`, `otp`                                    |

### Utility types

Two utility types simplify working with email contexts:

- **`EmailContextFor<T>`** extracts the full context interface for a given email type from the `EmailContext` union:

  ```typescript
  type EmailContextFor<'verification-email'> // => VerificationEmailContext
  ```

- **`EmailProps<T>`** strips the `type` discriminator, giving you just the data fields. Use this to type template props and callback data:
  ```typescript
  type EmailProps<'verification-email'> // => { user: User; url: string; token: string }
  ```

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2026 Nuntly
