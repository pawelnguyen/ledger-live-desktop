/* eslint-disable consistent-return */
// @flow
import React from "react";

import { BigNumber } from "bignumber.js";

import type { Currency, Unit, Operation, Account } from "@ledgerhq/live-common/lib/types";

import {
  OpDetailsTitle,
  OpDetailsData,
  OpDetailsSection,
} from "~/renderer/drawers/OperationDetails/styledComponents";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import { useDiscreetMode } from "~/renderer/components/Discreet";

type OperationDetailsExtraProps = {
  extra: { [key: string]: any },
  type: string,
  account: Account,
};

const OperationDetailsExtra = ({ extra, type, account }: OperationDetailsExtraProps) => {
  switch (type) {
    case "FREEZE":
      return (
        <OpDetailsSection>
          <OpDetailsTitle>
            <Trans i18nKey="operationDetails.extra.lockedAmount" />
          </OpDetailsTitle>
          <OpDetailsData>
            <Box>
              <FormattedVal
                val={extra.frozenAmount}
                unit={account.unit}
                showCode
                fontSize={4}
                color="palette.text.shade60"
              />
            </Box>
          </OpDetailsData>
        </OpDetailsSection>
      );
    case "UNFREEZE":
      return (
        <OpDetailsSection>
          <OpDetailsTitle>
            <Trans i18nKey="operationDetails.extra.unfreezeAmount" />
          </OpDetailsTitle>
          <OpDetailsData>
            <Box>
              <FormattedVal
                val={extra.unfreezeAmount}
                unit={account.unit}
                showCode
                fontSize={4}
                color="palette.text.shade60"
              />
            </Box>
          </OpDetailsData>
        </OpDetailsSection>
      );
    default:
      return null;
  }
};

type Props = {
  operation: Operation,
  currency: Currency,
  unit: Unit,
};

const FreezeAmountCell = ({ operation, currency, unit }: Props) => {
  const amount = new BigNumber(operation.value);

  return (
    !amount.isZero() && (
      <>
        <FormattedVal
          val={amount}
          unit={unit}
          showCode
          fontSize={4}
          color={"palette.text.shade80"}
        />

        <CounterValue
          color="palette.text.shade60"
          fontSize={3}
          date={operation.date}
          currency={currency}
          value={amount}
        />
      </>
    )
  );
};

const UnfreezeAmountCell = ({ operation, currency, unit }: Props) => {
  const amount = new BigNumber(operation.value);

  return (
    !amount.isZero() && (
      <>
        <FormattedVal
          val={amount}
          unit={unit}
          showCode
          fontSize={4}
          color={"palette.text.shade80"}
        />

        <CounterValue
          color="palette.text.shade60"
          fontSize={3}
          date={operation.date}
          currency={currency}
          value={amount}
        />
      </>
    )
  );
};

//TODO: rename
const amountCellExtra = {
  LOCK: FreezeAmountCell,
  UNLOCK: UnfreezeAmountCell,
  WITHDRAW: UnfreezeAmountCell,
  VOTE: UnfreezeAmountCell,
};

export default {
  OperationDetailsExtra,
  amountCellExtra,
};
