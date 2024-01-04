import {SET_STUDENTS_BY_TEACHER, SET_INPUT_DATA_STUDENT, SET_TIMETABLING_STUDENT_STATUS} from "@/store/mutation.type";
import {SUCCESS} from "@/common/config"
import baseMixins from "../components/mixins/base"
import {
    CREATE_FILE_TIMETABLING_STUDENT, CREATE_FILE_TIMETABLING_TEACHER,
    FETCH_STUDENTS_BY_TEACHER,
    INPUT_DATA_STUDENT,
    TIMETABLING_STUDENT,
    TIMETABLING_STUDENT_STATUS
} from "@/store/action.type";

const state = {
    inputDataStudent: null,
    timetablingStudentStatus: null,
    studentsByTeacher: [],
}

const getters = {
    inputDataStudent(state) {
        return state.inputDataStudent
    },
    timetablingStudentStatus(state) {
        return state.timetablingStudentStatus
    },
    studentsByTeacher(state) {
        return state.studentsByTeacher
    }
}

const mutations = {
    [SET_INPUT_DATA_STUDENT] (state, payload) {
        state.inputDataStudent = payload
    },
    [SET_TIMETABLING_STUDENT_STATUS] (state, payload) {
        state.timetablingStudentStatus = payload
    },
    [SET_STUDENTS_BY_TEACHER] (state, payload) {
        state.studentsByTeacher = payload
    }
}

const actions = {
    [INPUT_DATA_STUDENT] (context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.getWithBigInt('/timetabling-student/input-data', '', {})
            if (response && response.data && response.status === SUCCESS) {
                context.commit(SET_INPUT_DATA_STUDENT, response.data)
                resolve(response.data)
            } else {
                resolve(null)
            }
        })
    },
    [TIMETABLING_STUDENT_STATUS] (context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.getWithBigInt('/timetabling/student/status', '', {})
            if (response && response.data && response.status === SUCCESS) {
                context.commit(SET_TIMETABLING_STUDENT_STATUS, response.data)
                resolve(response.data)
            } else {
                resolve(null)
            }
        })
    },
    [TIMETABLING_STUDENT](context, payload) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.post('/timetabling/student', payload)
            resolve(response)
        })
    },
    [FETCH_STUDENTS_BY_TEACHER] (context, params) {
        return new Promise(async resolve => {
            let response = await baseMixins.methods.getWithBigInt('/timetable/student', '', {params})
            if (response && response.data && response.status === SUCCESS) {
                context.commit(SET_STUDENTS_BY_TEACHER, response.data)
                resolve(response.data)
            } else {
                resolve(null)
            }
        })
    },
    [CREATE_FILE_TIMETABLING_STUDENT](context, params) {
        baseMixins.methods.get('/admin/timetabling-student/list/excel', '', {params: null, responseType: 'blob'})
            .then(({ data }) => {
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', "student_timetabling.xlsx");
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
