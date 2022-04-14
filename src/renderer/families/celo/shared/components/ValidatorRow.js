//@flow
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAddressExplorer, getDefaultExplorerView } from "@ledgerhq/live-common/lib/explorers";
import type { ValidatorAppValidator } from "@ledgerhq/live-common/lib/families/celo/validator-app";
import type { CryptoCurrency, Unit } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import type { ValidatorRowProps } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";
import Check from "~/renderer/icons/Check";
import { openURL } from "~/renderer/linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  currency: CryptoCurrency,
  validator: ValidatorAppValidator,
  active?: boolean,
  showStake?: boolean,
  onClick?: (v: ValidatorAppValidator) => void,
  unit: Unit,
};

function CeloValidatorRow({ validator, active, showStake, onClick, unit, currency }: Props) {
  const explorerView = getDefaultExplorerView(currency);

  const onExternalLink = useCallback(() => {
    const url = getAddressExplorer(explorerView, validator.address);

    if (url) {
      openURL(url);
    }
  }, [explorerView, validator]);

  return (
    <StyledValidatorRow
      onClick={onClick}
      key={validator.address}
      validator={{ address: validator.address }}
      icon={
        <IconContainer isSR>
          <FirstLetterIcon label={validator.name} />
        </IconContainer>
      }
      title={validator.name}
      onExternalLink={onExternalLink}
      unit={unit}
      subtitle={
        showStake ? (
          <>
            <Trans i18nKey="celo.vote.steps.validator.totalVotes"></Trans>
            <Text style={{ marginLeft: 5 }}>
              {formatCurrencyUnit(unit, new BigNumber(validator.votes), {
                showCode: true,
              })}
            </Text>
          </>
        ) : null
      }
      sideInfo={
        <Box ml={5} style={{ flexDirection: "row", alignItems: "center" }}>
          <Box ml={3}>
            <ChosenMark active={active ?? false} />
          </Box>
        </Box>
      }
    ></StyledValidatorRow>
  );
}

const StyledValidatorRow: ThemedComponent<ValidatorRowProps> = styled(ValidatorRow)`
  border-color: transparent;
  margin-bottom: 0;
`;

const ChosenMark: ThemedComponent<{ active: boolean }> = styled(Check).attrs(p => ({
  color: p.active ? p.theme.colors.palette.primary.main : "transparent",
  size: 14,
}))``;

export default CeloValidatorRow;
