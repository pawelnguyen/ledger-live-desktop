//@flow
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAddressExplorer, getDefaultExplorerView } from "@ledgerhq/live-common/lib/explorers";
import type { CeloValidatorGroup } from "@ledgerhq/live-common/lib/families/celo/types";
import type { CryptoCurrency, Unit } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import React, { useCallback } from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import type { ValidatorRowProps } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";
import Check from "~/renderer/icons/Check";
import { openURL } from "~/renderer/linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Logo from "~/renderer/icons/Logo";
import { isDefaultValidatorGroup } from "@ledgerhq/live-common/lib/families/celo/logic";

type Props = {
  currency: CryptoCurrency,
  validatorGroup: CeloValidatorGroup,
  active?: boolean,
  onClick?: (v: CeloValidatorGroup) => void,
  unit: Unit,
  pendingAmount: BigNumber,
};

//TODO: consider reusing ValidatorGroupRow and passing sideInfo
function CeloActivateValidatorGroupRow({
  validatorGroup,
  active,
  onClick,
  unit,
  currency,
  pendingAmount,
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
      title={validatorGroup.name}
      onExternalLink={onExternalLink}
      unit={unit}
      sideInfo={
        <Box ml={5} style={{ flexDirection: "row", alignItems: "center" }}>
          <Box>
            <Text textAlign="center" ff="Inter|SemiBold" fontSize={2}>
              {formatCurrencyUnit(unit, pendingAmount, {
                showCode: true,
              })}
            </Text>
          </Box>
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

export default CeloActivateValidatorGroupRow;
