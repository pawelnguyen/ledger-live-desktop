// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";
import moment from "moment";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import CheckBox from "~/renderer/components/CheckBox";
import Clock from "~/renderer/icons/Clock";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

import ErrorBanner from "~/renderer/components/ErrorBanner";
import type { AccountBridge } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/celo/types";
import { useCeloPreloadData } from "@ledgerhq/live-common/lib/families/celo/react";
import ValidatorGroupRow from "~/renderer/families/celo/shared/components/ValidatorGroupRow";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";

const Description = styled(Text).attrs(({ isPill }) => ({
  ff: isPill ? "Inter|SemiBold" : "Inter|Regular",
  fontSize: isPill ? 2 : 3,
  color: "palette.text.shade60",
}))`
  ${p =>
    p.isPill
      ? `
    text-transform: uppercase;
  `
      : ""}
`;

const SelectResource = styled(Box).attrs(() => ({
  horizontal: true,
  p: 3,
  mt: 2,
  alignItems: "center",
  justifyContent: "space-between",
}))`
  height: 58px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  border-radius: 4px;
  ${p =>
    p.disabled
      ? `
          opacity: 0.7;
          cursor: auto;
        `
      : ``}
`;

const TimerWrapper = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  ff: "Inter|Medium",
  fontSize: 3,
  color: "palette.text.shade60",
  bg: "palette.text.shade10",
  borderRadius: 4,
  p: 1,
  mr: 4,
}))`
  align-self: center;

  ${Description} {
    margin-left: 5px;
  }
`;

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  error,
  bridgePending,
  t,
}: StepProps) {
  invariant(
    account && transaction && account.celoResources && account.celoResources.pendingWithdrawals,
    "account with pending withdrawals and transaction required",
  );

  const bridge = getAccountBridge(account, parentAccount);

  const onChange = useCallback(
    (recipient: string) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          recipient,
        }),
      );
    },
    [bridge, transaction, onChangeTransaction],
  );

  const { votes } = account.celoResources;

  console.log('votes', votes)

  // TODO: fix
  if ((transaction.recipient === null || transaction.recipient === undefined) && votes[0])
    onChange(votes[0].validatorGroup);

  // TODO: filter by activatable, logic.js

  const { validatorGroups } = useCeloPreloadData();

  const unit = getAccountUnit(account);

  return (
    <Box flow={1}>
      <TrackPage category="Withdraw Flow" name="Step 1" />
      {error ? <ErrorBanner error={error} /> : null}
      <Box vertical>
        {votes.map(({ validatorGroup: address, pendingAmount }) => {
          const validatorGroup = validatorGroups.find(v => v.address === address);
          return (
            <ValidatorGroupRow
              currency={account.currency}
              active={transaction.recipient === validatorGroup.address}
              showStake={false}
              onClick={() => onChange(validatorGroup)}
              key={validatorGroup.address}
              validatorGroup={validatorGroup}
              unit={unit}
            ></ValidatorGroupRow>

            // <SelectResource key={validatorGroup.address}>
            //   <Text ff="Inter|SemiBold">{validatorGroup.name}</Text>
            //   <Box horizontal alignItems="center">
            //     <FormattedVal
            //       val={pendingAmount}
            //       unit={account.unit}
            //       style={{ textAlign: "right", width: "auto", marginRight: 10 }}
            //       showCode
            //       fontSize={4}
            //       color="palette.text.shade60"
            //     />
            //     <CheckBox
            //       isRadio
            //       isChecked={}
            //       onChange={}
            //     />
            //   </Box>
            // </SelectResource>
          );
        })}
      </Box>
    </Box>
  );
}

export function StepAmountFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
