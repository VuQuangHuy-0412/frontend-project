import {
  CREATE_WALLET_COMPARTMENT,
  FETCH_ACCOUNTS,
  FETCH_ACCOUNTS_TOTAL,
  HOLD_BALANCE,
  UN_HOLD_BALANCE,
  FETCH_ACCOUNTS_POPUP,
  SETUP_ACCOUNT, CREATE_SUB_ACCOUNT
} from "./action.type";
import { SET_ACCOUNTS, SET_ACCOUNTS_TOTAL } from "./mutation.type"
import { SUCCESS } from "@/common/config"
import baseMixins from "../components/mixins/base"

const state = {
  accounts: [],
  accountsTotal: 0,
}

const getters = {
  accounts(state) {
    return state.accounts
  },
  accountsTotal(state) {
    return state.accountsTotal
  },
}

const mutations = {
  [SET_ACCOUNTS] (state, payload) {
    state.accounts = payload
  },
  [SET_ACCOUNTS_TOTAL] (state, payload) {
    state.accountsTotal = payload
  }
}

const actions = {
  [FETCH_ACCOUNTS] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account/list', data)
      if (response && response.data && response.status === SUCCESS) {
        context.commit(SET_ACCOUNTS, response.data)
        resolve(response.data)
      } else {
        resolve(null)
      }
    })
  },
  [FETCH_ACCOUNTS_POPUP] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account/list', data)
      if (response && response.data && response.status === SUCCESS) {
        resolve(response.data)
      }
    })
  },
  [FETCH_ACCOUNTS_TOTAL] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account/count', data)
      if (response && response.status === SUCCESS) {
        context.commit(SET_ACCOUNTS_TOTAL, response.data)
        resolve(response.data)
      }
    })
  },
  [HOLD_BALANCE] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account/hold-balance', data)
      if (response && response.status === SUCCESS) {
        resolve(response)
      }
    })
  },
  [UN_HOLD_BALANCE] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account/init-un-hold-balance', data)
      if (response && response.status === SUCCESS) {
        resolve(response)
      }
    })
  },
  [CREATE_WALLET_COMPARTMENT] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account/create', data)
      if (response && response.status === SUCCESS) {
        resolve(response)
      }
    })
  },
  [SETUP_ACCOUNT] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account-setting/init', data)
      if (response && response.status === SUCCESS) {
        resolve(response)
      }
    })
  },
  [CREATE_SUB_ACCOUNT] (context, data) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/account/create-sub-account', data)
      if (response && response.status === SUCCESS) {
        resolve(response)
      }
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
