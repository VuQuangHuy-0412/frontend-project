import {
  CREATE_GROUP_TEACHER,
  FETCH_GROUP_TEACHERS,
  UPDATE_GROUP_TEACHER,
  ALL_GROUP_TEACHER,
} from "./action.type";
import { SUCCESS } from "@/common/config"
import baseMixins from "../components/mixins/base"
import {SET_GROUP_TEACHERS, SET_ALL_GROUP_TEACHERS} from "@/store/mutation.type";

const state = {
  groupTeachers: [],
  allGroupTeachers: [],
}

const getters = {
  groupTeachers(state) {
    return state.groupTeachers
  },
  allGroupTeachers(state) {
    return state.allGroupTeachers
  },
}

const mutations = {
  [SET_GROUP_TEACHERS] (state, payload) {
    state.groupTeachers = payload
  },
  [SET_ALL_GROUP_TEACHERS] (state, payload) {
    state.allGroupTeachers = payload
  },
}

const actions = {
  [FETCH_GROUP_TEACHERS] (context, params) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.getWithBigInt('/group-teacher/search', '', {params})
      if (response && response.data && response.status === SUCCESS) {
        context.commit(SET_GROUP_TEACHERS, response.data)
        resolve(response.data)
      } else {
        resolve(null)
      }
    })
  },
  [CREATE_GROUP_TEACHER](context, payload) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/group-teacher/create', payload)
      resolve(response)
    })
  },
  [UPDATE_GROUP_TEACHER](context, payload) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/group-teacher/update', payload)
      resolve(response)
    })
  },
  [ALL_GROUP_TEACHER] (context) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.getWithBigInt('/group-teacher/all', '', {})
      if (response && response.data && response.status === SUCCESS) {
        context.commit(SET_ALL_GROUP_TEACHERS, response.data)
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
