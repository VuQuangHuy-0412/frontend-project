import {
    SET_INPUT_DATA
} from "@/store/mutation.type";
import { SUCCESS } from "@/common/config"
import baseMixins from "../components/mixins/base"
import {INPUT_DATA} from "@/store/action.type";

const state = {
    inputData: null
}

const getters = {
    inputData(state) {
        return state.inputData
    }
}

const mutations = {
    [SET_INPUT_DATA] (state, payload) {
        state.inputData = payload
    }
}

const actions = {
    [INPUT_DATA] (context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.getWithBigInt('/timetabling-teacher/input-data', '', {})
            if (response && response.data && response.status === SUCCESS) {
                context.commit(SET_INPUT_DATA, response.data)
                resolve(response.data)
            } else {
                resolve(null)
            }
        })
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}
