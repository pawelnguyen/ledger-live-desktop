// @flow
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import RevokeVoteRow from "../components/RevokeVoteRow";
import type { StepProps } from "../types";
import { useCeloPreloadData } from "@ledgerhq/live-common/lib/families/celo/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";

export default function StepVote({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  error,
}: StepProps) {
  invariant(
    account && account.celoResources && transaction,
    "celo account, resources and transaction required",
  );

  const bridge = getAccountBridge(account, parentAccount);

  const onChange = useCallback(
    (recipient: string, index: number) => {
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          recipient,
          index,
        }),
      );
    },
    [bridge, transaction, onChangeTransaction],
  );

  // TODO: fetch flatten votes? with an index. revokable votes?
  const { votes } = account.celoResources;

  const revokableVotes = votes.map(vote => {
    return { ...vote, index: 1 };
  });

  if (!transaction.recipient && revokableVotes[0])
    onChange(revokableVotes[0].validatorGroup, revokableVotes[0].index);

  const { validatorGroups } = useCeloPreloadData();

  const unit = getAccountUnit(account);

  return (
    <Box flow={1}>
      <TrackPage category="Withdraw Flow" name="Step 1" />
      {error ? <ErrorBanner error={error} /> : null}
      <Box vertical>
        {revokableVotes.map(({ validatorGroup: address, index, pendingAmount, activeAmount }) => {
          const validatorGroup = validatorGroups.find(v => v.address === address);
          return (
            <RevokeVoteRow
              currency={account.currency}
              active={transaction.recipient === validatorGroup.address}
              onClick={() => onChange(address, index)}
              key={validatorGroup.address}
              validatorGroup={validatorGroup}
              unit={unit}
              amount={activeAmount}
            ></RevokeVoteRow>
          );
        })}
      </Box>
    </Box>
  );
}

export function StepVoteFooter({
  transitionTo,
  account,
  onClose,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");

  const canNext = !bridgePending && transaction.recipient && transaction.index;

  return (
    <>
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          id="vote-continue-button"
          disabled={!canNext}
          primary
          onClick={() => transitionTo("amount")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
