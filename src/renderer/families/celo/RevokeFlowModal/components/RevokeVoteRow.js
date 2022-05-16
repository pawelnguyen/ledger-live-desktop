//@flow
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAddressExplorer, getDefaultExplorerView } from "@ledgerhq/live-common/lib/explorers";
import type { CeloValidatorGroup } from "@ledgerhq/live-common/lib/families/celo/types";
import type { CryptoCurrency, Unit } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import Box from "~/renderer/components/Box";
import type { ValidatorRowProps } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";
import Check from "~/renderer/icons/Check";
import { openURL } from "~/renderer/linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Logo from "~/renderer/icons/Logo";
import ToolTip from "~/renderer/components/Tooltip";
import { isDefaultValidatorGroup } from "@ledgerhq/live-common/lib/families/celo/logic";
import { Trans } from "react-i18next";
import InfoCircle from "~/renderer/icons/InfoCircle";
import type { TFunction } from "react-i18next";

const Status = styled(Text)`
  font-size: 11px;
  font-weight: 700;
  color: ${p =>
    p.type === "active" ? p.theme.colors.positiveGreen : p.theme.colors.palette.text.shade60};
`;

type Props = {
  currency: CryptoCurrency,
  validatorGroup: CeloValidatorGroup,
  active?: boolean,
  revokable?: boolean,
  onClick?: (v: CeloValidatorGroup) => void,
  unit: Unit,
  amount: BigNumber,
  type: string,
  t: TFunction,
};

//TODO: consider reusing ValidatorGroupRow and passing sideInfo
function CeloRevokeVoteRow({
  validatorGroup,
  active,
  revokable,
  onClick,
  unit,
  currency,
  amount,
  type,
  t,
}: Props) {
  const explorerView = getDefaultExplorerView(currency);

  const onExternalLink = useCallback(() => {
    const url = getAddressExplorer(explorerView, validatorGroup.address);

    if (url) {
      openURL(url);
    }
  }, [explorerView, validatorGroup]);

  return (
    <StyledValidatorRow
      onClick={onClick}
      key={validatorGroup.address}
      validator={{ address: validatorGroup.address }}
      icon={
        <IconContainer isSR>
          {isDefaultValidatorGroup(validatorGroup) ? (
            <Logo size={16} />
          ) : (
            <FirstLetterIcon label={validatorGroup.name} />
          )}
        </IconContainer>
      }
      disabled={!revokable}
      title={validatorGroup.name}
      onExternalLink={onExternalLink}
      unit={unit}
      subtitle={
        <Status type={type}>
          {type === "active" ? (
            <Trans i18nKey="celo.revoke.steps.vote.active" />
          ) : (
            <Trans i18nKey="celo.revoke.steps.vote.pending" />
          )}
        </Status>
      }
      sideInfo={
        <Box ml={5} style={{ flexDirection: "row", alignItems: "center" }}>
          <Box>
            <Text textAlign="center" ff="Inter|SemiBold" fontSize={2}>
              {formatCurrencyUnit(unit, amount, {
                showCode: true,
              })}
            </Text>
          </Box>
          <Box ml={3}>
            {revokable ? (
              <ChosenMark active={active ?? false} />
            ) : (
              <ToolTip content={t("celo.revoke.steps.vote.nonRevokableInfo")}>
                <InfoCircle size={16} />
              </ToolTip>
            )}
          </Box>
        </Box>
      }
    ></StyledValidatorRow>
  );
}

const StyledValidatorRow: ThemedComponent<ValidatorRowProps> = styled(ValidatorRow)`
  border-color: transparent;
  margin-bottom: 0;
  ${p =>
    p.disabled
      ? css`
          cursor: auto;
          ${Text} {
            color: ${p.theme.colors.palette.text.shade20};
          }
          &:hover {
            border-color: transparent;
          }
        `
      : `
        cursor: pointer;
  `};
`;

const ChosenMark: ThemedComponent<{ active: boolean }> = styled(Check).attrs(p => ({
  color: p.active ? p.theme.colors.palette.primary.main : "transparent",
  size: 14,
}))``;

export default CeloRevokeVoteRow;
