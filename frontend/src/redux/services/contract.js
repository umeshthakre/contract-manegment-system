import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const contractsApi = createApi({
    reducerPath: 'contractsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
    tagTypes: ["contracts"],
    endpoints: (builder) => ({
        getAllContracts: builder.query({
            query: ({ searchQuery, searchId, status, page }) => ({
                url: `/contracts?search=${searchQuery}&searchId=${searchId}&status=${status}&page=${page}`,
                method: "GET"
            }),
            providesTags: ["contracts"]
        }),
        deleteContractById: builder.mutation({
            query: (id) => ({
                url: `/contracts/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["contracts"]
        }),
        uploadFile: builder.mutation({
            query: (body) => ({
                url: '/contracts/uploads',
                method: "POST",
                body: body
            })
        }),
        getContractById: builder.query({
            query: ({ id }) => ({
                url: `/contracts/${id}`,
                method: "GET",
            }),
            providesTags: ["contract"]
        }),
        updateContractById:builder.mutation({
            query:(body)=>({
                url:`/contracts/update/${body?.id}`,
                method:"POST",
                body
            }),
            invalidatesTags:["contracts","contract"]
        })
    })
})

export const {
    useGetAllContractsQuery,
    useDeleteContractByIdMutation,
    useUploadFileMutation,
    useGetContractByIdQuery,
    useUpdateContractByIdMutation,
} = contractsApi
