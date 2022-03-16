// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled, { withTheme } from "styled-components";

import { SyncOneAccountOnMount } from "@ledgerhq/live-common/lib/bridge/react";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import RetryButton from "~/renderer/components/RetryButton";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import SuccessDisplay from "~/renderer/components/SuccessDisplay";
import BroadcastErrorDisclaimer from "~/renderer/components/BroadcastErrorDisclaimer";

import type { StepProps } from "../types";

const Container: ThemedComponent<{ shouldSpace?: boolean }> = styled(Box).attrs(() => ({
  alignItems: "center",
  grow: true,
  color: "palette.text.shade100",
}))`
  justify-content: ${p => (p.shouldSpace ? "space-between" : "center")};
`;

function StepConfirmation({
  account,
  t,
  optimisticOperation,
  error,
  theme,
  device,
  signed,
  transaction,
}: StepProps & { theme: * }) {
  if (optimisticOperation) {
    return (
      <Container>
        <TrackPage category="Celo SimpleOperationFlow" name="Step Confirmed" />
        <SyncOneAccountOnMount priority={10} accountId={optimisticOperation.accountId} />
        <SuccessDisplay
          title={<Trans i18nKey={`celo.simpleOperation.steps.confirmation.success.title`} />}
          description={
            <div>
              <Trans i18nKey={`celo.simpleOperation.steps.confirmation.success.text`}>
                <b></b>
              </Trans>
            </div>
          }
        />
      </Container>
    );
  }

  if (error) {
    return (
      <Container shouldSpace={signed}>
        <TrackPage category="Celo Flow" name="Step Confirmation Error" />
        {signed ? (
          <BroadcastErrorDisclaimer
            title={<Trans i18nKey="celo.simpleOperation.steps.confirmation.broadcastError" />}
          />
        ) : null}
        <ErrorDisplay error={error} withExportLogs />
      </Container>
    );
  }

  return null;
}

export function StepConfirmationFooter({
  transitionTo,
  account,
  parentAccount,
  onRetry,
  error,
  openModal,
  onClose,
  optimisticOperation,
  mode,
}: StepProps) {
  const openLock = useCallback(() => {
    onClose();
    if (account) {
      openModal("MODAL_CELO_LOCK", {
        account: account,
      });
    }
  }, [account, onClose, openModal]);

  return mode === "register" ? (
    <Box horizontal alignItems="right">
      {error ? (
        <RetryButton primary ml={2} onClick={onRetry} />
      ) : (
        <Button ml={2} primary onClick={openLock}>
          <Trans i18nKey="Lock" />
        </Button>
      )}
    </Box>
  ) : (
    <Box horizontal alignItems="right">
      {error ? (
        <RetryButton primary ml={2} onClick={onRetry} />
      ) : (
        <Button primary ml={2} event="ClaimRewards Flow Step 3 View OpD Clicked" onClick={onClose}>
          <Trans i18nKey="celo.simpleOperation.steps.confirmation.success.cta" />
        </Button>
      )}
    </Box>
  );
}

export default withTheme(StepConfirmation);
