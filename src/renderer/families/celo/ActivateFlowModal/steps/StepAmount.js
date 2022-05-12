// @flow
import invariant from "invariant";
import React, { useCallback } from "react";

import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { activatableVotes } from "@ledgerhq/live-common/lib/families/celo/logic";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

import ErrorBanner from "~/renderer/components/ErrorBanner";
import { useCeloPreloadData } from "@ledgerhq/live-common/lib/families/celo/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import ActivateValidatorGroupRow from "~/renderer/families/celo/ActivateFlowModal/components/ActivateValidatorGroupRow";

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  error,
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

  // const {votes} = account.celoResources;
  const votes = activatableVotes(account);

  console.log('votes', votes)

  // TODO: fix
  if (
    (transaction.recipient === null ||
      transaction.recipient === undefined ||
      transaction.recipient === "") &&
    votes[0]
  )
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
          console.log('validatorGroup, address, pendingAmount', validatorGroup, address, pendingAmount);
          return (
            <ActivateValidatorGroupRow
              currency={account.currency}
              active={transaction.recipient === validatorGroup.address}
              onClick={() => onChange(address)}
              key={validatorGroup.address}
              validatorGroup={validatorGroup}
              unit={unit}
              pendingAmount={pendingAmount}
            ></ActivateValidatorGroupRow>
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
