// @flow
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { Transaction } from "@ledgerhq/live-common/lib/families/celo/types";
import type { AccountBridge } from "@ledgerhq/live-common/lib/types";
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import LedgerByFigmentTC from "../../shared/components/LedgerByFigmentTCLink";
import ValidatorsField from "../../shared/fields/ValidatorsField";
import type { StepProps } from "../types";
//TODO: move?
import { LEDGER_BY_FIGMENT_VALIDATOR_GROUP_ADDRESS } from "@ledgerhq/live-common/lib/families/celo/api/hubble";

export default function StepValidator({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  error,
  t,
}: StepProps) {
  invariant(
    account && account.celoResources && transaction,
    "celo account, resources and transaction required",
  );

  const updateValidator = ({ address }: { address: string }) => {
    const bridge: AccountBridge<Transaction> = getAccountBridge(account, parentAccount);
    onUpdateTransaction(tx => {
      return bridge.updateTransaction(transaction, {
        recipient: address,
      });
    });
  };

  //TODO: check, rename
  const chosenVoteAccAddr = transaction.recipient;

  return (
    <Box flow={1}>
      <TrackPage category="Celo Voting" name="Step Validator" />
      {error && <ErrorBanner error={error} />}
      <ValidatorsField
        account={account}
        chosenVoteAccAddr={chosenVoteAccAddr}
        onChangeValidator={updateValidator}
        status={status}
        t={t}
      />
    </Box>
  );
}

export function StepValidatorFooter({
  transitionTo,
  account,
  onClose,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  const canNext = !bridgePending && transaction.recipient;
  const displayTC = transaction.recipient === LEDGER_BY_FIGMENT_VALIDATOR_GROUP_ADDRESS;

  return (
    <>
      {displayTC && <LedgerByFigmentTC />}
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
