import { UPDATE_VAULTS, UPDATE_REWARDS_TOKEN, UPDATE_HATS_PRICE, UPDATE_WITHDRAW_SAFETY_PERIOD, NFT_AIRDROP_ELIGIBLE_TOKENS } from '../constants/action-types';
import { EligibleTokens, IVault } from '../types/types';

interface IDataReducer {
  vaults: Array<IVault>
  rewardsToken: string
  hatsPrice: string
  withdrawSafetyPeriod: Object
  airdropEligibleTokens: EligibleTokens
}

const initialState: IDataReducer = {
  vaults: [],
  rewardsToken: "",
  hatsPrice: "",
  withdrawSafetyPeriod: {},
  airdropEligibleTokens: {}
};

export const dataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_VAULTS: {
      return {
        ...state,
        vaults: action.vaults as IVault[]
      }
    }
    case UPDATE_REWARDS_TOKEN: {
      return {
        ...state,
        rewardsToken: action.rewardsToken
      }
    }
    case UPDATE_HATS_PRICE: {
      return {
        ...state,
        hatsPrice: action.hatsPrice
      }
    }
    case UPDATE_WITHDRAW_SAFETY_PERIOD: {
      return {
        ...state,
        withdrawSafetyPeriod: action.withdrawSafetyPeriod
      }
    }
    case NFT_AIRDROP_ELIGIBLE_TOKENS: {
      return {
        ...state,
        airdropEligibleTokens: action.airdropEligibleTokens
      }
    }
    default: return state;
  }
};
