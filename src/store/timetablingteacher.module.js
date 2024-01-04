import {SET_CLASSES_BY_TEACHER, SET_INPUT_DATA, SET_TIMETABLING_TEACHER_STATUS} from "@/store/mutation.type";
import {SUCCESS} from "@/common/config"
import baseMixins from "../components/mixins/base"
import {
    CREATE_FILE_TIMETABLING_TEACHER,
    FETCH_CLASSES_BY_TEACHER,
    INPUT_DATA,
    TIMETABLING_TEACHER,
    TIMETABLING_TEACHER_STATUS
} from "@/store/action.type";

const state = {
    inputData: null,
    timetablingTeacherStatus: null,
    classesByTeacher: [],
}

const getters = {
    inputData(state) {
        return state.inputData
    },
    timetablingTeacherStatus(state) {
        return state.timetablingTeacherStatus
    },
    classesByTeacher(state) {
        return state.classesByTeacher
    }
}

const mutations = {
    [SET_INPUT_DATA] (state, payload) {
        state.inputData = payload
    },
    [SET_TIMETABLING_TEACHER_STATUS] (state, payload) {
        state.timetablingTeacherStatus = payload
    },
    [SET_CLASSES_BY_TEACHER] (state, payload) {
        state.classesByTeacher = payload
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
    [TIMETABLING_TEACHER_STATUS] (context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.getWithBigInt('/timetabling/teacher/status', '', {})
            if (response && response.data && response.status === SUCCESS) {
                context.commit(SET_TIMETABLING_TEACHER_STATUS, response.data)
                resolve(response.data)
            } else {
                resolve(null)
            }
        })
    },
    [TIMETABLING_TEACHER](context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.post('/timetabling/teacher', payload)
            resolve(response)
        })
    },
    [FETCH_CLASSES_BY_TEACHER] (context, params) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.getWithBigInt('/timetable/teacher', '', {params})
            if (response && response.data && response.status === SUCCESS) {
                context.commit(SET_CLASSES_BY_TEACHER, response.data)
                resolve(response.data)
            } else {
                resolve(null)
            }
        })
    },
    [CREATE_FILE_TIMETABLING_TEACHER](context, params) {
        baseMixins.methods.get('/admin/timetabling-teacher/list/excel', '', {params: null, responseType: 'blob'})
            .then(({ data }) => {
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "class_timetabling.xlsx");
                document.body.appendChild(link);
                link.click();
            })
            .catch(({ error }) => error);
    },
}

export default {
    state,
    getters,
    mutations,
    actions
}
