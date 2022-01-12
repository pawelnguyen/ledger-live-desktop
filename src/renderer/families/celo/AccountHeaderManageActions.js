// @flow
import { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import type { Account } from "@ledgerhq/live-common/lib/types";

import IconChartLine from "~/renderer/icons/ChartLine";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { openModal } from "~/renderer/actions/modals";

type Props = {
  account: Account,
};

const AccountHeaderManageActions = ({ account }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hasBondedBalance = true;
  const hasPendingBondOperation = false;

  const onClick = useCallback(() => {
    dispatch(
      openModal("MODAL_POLKADOT_REWARDS_INFO", {
        account,
      }),
    );
  }, [dispatch, account, hasBondedBalance, hasPendingBondOperation]);

  const manageEnabled = true;

  const label = "polkadot.manage.title";

  return [
    {
      key: "polkadot",
      onClick: onClick,
      icon: hasBondedBalance ? CryptoCurrencyIcon : IconChartLine,
      disabled: !manageEnabled,
      label,
    },
  ];
};

export default AccountHeaderManageActions;
