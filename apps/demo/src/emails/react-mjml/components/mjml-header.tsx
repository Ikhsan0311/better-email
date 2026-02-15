import { MjmlColumn, MjmlDivider, MjmlSection, MjmlText } from '@faire/mjml-react';

interface MjmlHeaderProps {
  appName?: string;
}

export function MjmlHeader({ appName = 'Better Email' }: MjmlHeaderProps) {
  return (
    <MjmlSection padding="48px 0 0 0" backgroundColor="#ffffff">
      <MjmlColumn padding="0">
        <MjmlText
          fontSize="18px"
          fontWeight="700"
          color="#09090b"
          padding="0 32px 16px 32px"
          cssClass="dark-heading"
        >
          {appName}
        </MjmlText>
        <MjmlDivider borderColor="#e4e4e7" borderWidth="1px" padding="0 32px" />
      </MjmlColumn>
    </MjmlSection>
  );
}
