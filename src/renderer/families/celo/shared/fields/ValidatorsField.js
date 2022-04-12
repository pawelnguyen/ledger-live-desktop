// @flow
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { ValidatorAppValidator } from "@ledgerhq/live-common/lib/families/celo/validator-app";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import invariant from "invariant";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { TFunction } from "react-i18next";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import { NoResultPlaceholder } from "~/renderer/components/Delegation/ValidatorSearchInput";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ValidatorRow from "../components/ValidatorRow";

import { useCeloPreloadData } from "@ledgerhq/live-common/lib/families/celo/react";

type Props = {
  t: TFunction,
  account: Account,
  status: TransactionStatus,
  chosenVoteAccAddr: ?string,
  onChangeValidator: (v: ValidatorAppValidator) => void,
};

const ValidatorField = ({ t, account, onChangeValidator, chosenVoteAccAddr, status }: Props) => {
  if (!status) return null;

  invariant(account && account.celoResources, "celo account and resources required");

  // const { celoResources } = account;

  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const unit = getAccountUnit(account);

  //TODO: check this method
  // const validators = useLedgerFirstShuffledValidators(account.currency);

  //TODO: validator groups
  const preloaded = useCeloPreloadData();
  const { validatorGroups: validators } = preloaded;

  const chosenValidator = useMemo(() => {
    if (chosenVoteAccAddr !== null) {
      return validators.find(v => v.address === chosenVoteAccAddr);
    }
  }, [validators, chosenVoteAccAddr]);

  const validatorsFiltered = useMemo(() => {
    return validators.filter(validator => {
      return (
        validator.name?.toLowerCase().includes(search) ||
        validator.address.toLowerCase().includes(search)
      );
    });
  }, [validators, search]);

  const containerRef = useRef();

  /** auto focus first input on mount */
  useEffect(() => {
    /** $FlowFixMe */
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = (validator: ValidatorAppValidator, validatorIdx: number) => {
    return (
      <ValidatorRow
        currency={account.currency}
        active={chosenVoteAccAddr === validator.address}
        showStake={validatorIdx !== 0}
        onClick={onChangeValidator}
        key={validator.address}
        validator={validator}
        unit={unit}
      ></ValidatorRow>
    );
  };

  return (
    <ValidatorsFieldContainer>
      <Box p={1}>
        <ScrollLoadingList
          data={showAll ? validators : [chosenValidator ?? validators[0]]}
          style={{ flex: showAll ? "1 0 240px" : "1 0 56px", marginBottom: 0, paddingLeft: 0 }}
          renderItem={renderItem}
          noResultPlaceholder={
            validatorsFiltered.length <= 0 &&
            search.length > 0 && <NoResultPlaceholder search={search} />
          }
        />
      </Box>
      <SeeAllButton expanded={showAll} onClick={() => setShowAll(shown => !shown)}>
        <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
          <Trans i18nKey={showAll ? "distribution.showLess" : "distribution.showAll"} />
        </Text>
        <IconAngleDown size={16} />
      </SeeAllButton>
    </ValidatorsFieldContainer>
  );
};

const ValidatorsFieldContainer: ThemedComponent<{}> = styled(Box)`
  border: 1px solid ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
`;

const SeeAllButton: ThemedComponent<{ expanded: boolean }> = styled.div`
  display: flex;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  height: 40px;
  cursor: pointer;

  &:hover ${Text} {
    text-decoration: underline;
  }

  > :nth-child(2) {
    margin-left: 8px;
    transform: rotate(${p => (p.expanded ? "180deg" : "0deg")});
  }
`;

export default ValidatorField;
