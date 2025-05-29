import { create } from 'zustand'

export const useStore = create(set => ({
    request: {
        class: "",
        subject: "",
        type: "",
        answerType: ""
    },
    response: [],
    isLoading: null,

    setRequest: e => set(state => {
        const { name, value } = e
        const temp = { ...state.request }
        temp[name] = value
        return { request: temp }
    }),
    setIsLoading: value => set(() => ({ isLoading: value })),
    updateResponse: value => set(state => {
        const temp = [...state.response, ...value]
        const defineWeight = 100 / temp.length
        const newResponse = temp.map(e => ({
            ...e,
            weight: defineWeight,
        }))
        return { response: newResponse }
    }),
    deleteResponse: index => set(state => ({ response: state.response.filter((_, i) => i != index) })),
    updateResponseByIndex: (index, value) => set(state => {
        const temp = [...state.response]
        temp[index] = {
            ...temp[index],
            ...value,
        }
        return { response: temp }
    }),
    reset: () => set(() => ({
        request: {
            class: "",
            subject: "",
            type: "",
            answerType: ""
        },
        response: [],
        isLoading: null,
    })),
}))