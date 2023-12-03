import {
  FETCH_TEACHERS,
} from "./action.type";
import { SUCCESS } from "@/common/config"
import baseMixins from "../components/mixins/base"
import {SET_TEACHERS} from "@/store/mutation.type";

const state = {
  teachers: [],
}

const getters = {
  teachers(state) {
    return state.teachers
  },
}

const mutations = {
  [SET_TEACHERS] (state, payload) {
    state.teachers = payload
  },
}

const actions = {
  [FETCH_TEACHERS] (context, params) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.getWithBigInt('/teacher/search', '', {params})
      if (response && response.data && response.status === SUCCESS) {
        context.commit(SET_TEACHERS, response.data)
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
