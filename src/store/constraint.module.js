import {
    CREATE_CONSTRAINT,
    FETCH_CONSTRAINTS,
    UPDATE_CONSTRAINT,
} from "./action.type";
import { SUCCESS } from "@/common/config"
import baseMixins from "../components/mixins/base"
import {SET_CONSTRAINTS} from "@/store/mutation.type";

const state = {
    constraints: [],
}

const getters = {
    constraints(state) {
        return state.constraints
    },
}

const mutations = {
    [SET_CONSTRAINTS] (state, payload) {
        state.constraints = payload
    },
}

const actions = {
    [FETCH_CONSTRAINTS] (context, params) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.getWithBigInt('/constraint/search', '', {params})
            if (response && response.data && response.status === SUCCESS) {
                context.commit(SET_CONSTRAINTS, response.data)
                resolve(response.data)
            } else {
                resolve(null)
            }
        })
    },
    [CREATE_CONSTRAINT](context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.post('/constraint/create', payload)
            resolve(response)
        })
    },
    [UPDATE_CONSTRAINT](context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.post('/constraint/update', payload)
            resolve(response)
        })
    },
}
export default {
    state,
    getters,
    mutations,
    actions
}
