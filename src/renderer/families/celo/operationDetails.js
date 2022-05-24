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
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";

type OperationDetailsExtraProps = {
  extra: { [key: string]: any },
  type: string,
  account: Account,
};

const OperationDetailsExtra = ({ extra, type, account }: OperationDetailsExtraProps) => {
  switch (type) {
    case "VOTE":
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

const AmountCell = ({ operation, currency, unit }: Props) => {
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

const amountCellExtra = {
  UNLOCK: AmountCell,
  VOTE: AmountCell,
};

export default {
  OperationDetailsExtra,
  amountCellExtra,
};
