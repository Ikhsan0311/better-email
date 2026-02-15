import { MjmlColumn, MjmlDivider, MjmlSection, MjmlText } from '@faire/mjml-react';

interface MjmlFooterProps {
  appName?: string;
  securityNotice?: string;
}

export function MjmlFooter({ appName = 'Better Email', securityNotice }: MjmlFooterProps) {
  return (
    <MjmlSection padding="32px 0 48px 0" backgroundColor="#ffffff">
      <MjmlColumn padding="0">
        <MjmlDivider borderColor="#e4e4e7" borderWidth="1px" padding="0 32px 16px 32px" />
        {securityNotice && (
          <MjmlText
            fontSize="12px"
            lineHeight="18px"
            color="#71717a"
            padding="0 32px 8px 32px"
            cssClass="dark-muted"
          >
            {securityNotice}
          </MjmlText>
        )}
        <MjmlText
          fontSize="12px"
          lineHeight="18px"
          color="#71717a"
          padding="0 32px 0 32px"
          cssClass="dark-muted"
        >
          Sent by {appName}
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
}
