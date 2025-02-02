import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetContractByIdQuery, useUpdateContractByIdMutation } from '../redux/services/contract';
import { useFormik } from 'formik';


const EditForm = () => {


    const { id } = useParams();

    const navigate = useNavigate();

    const { data } = useGetContractByIdQuery({ id });
    const [update, { isLoading: updating, error }] = useUpdateContractByIdMutation();

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: id,
            client_name: data?.client_name,
            status: data?.status,
            description: data?.description,
        },
        onSubmit: async values => {
            await update(values).then((res) => {
                console.log(res);
                alert("Updated Client Contract with " + id)
                navigate("/")
            })
                .catch((err) => {
                    console.log(err)
                })
        },
    });


    return <>
        <div class="md:flex md:justify-center mb-6 mt-24">
            <div class="w-full max-w-xs">
                <form onSubmit={formik.handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            ID
                        </label>
                        <input
                            value={id} contentEditable={false} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />

                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                            Client Name
                        </label>
                        <input
                            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="client_name"
                            name="client_name"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.client_name}
                        />
                        {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
                    </div>

                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.status}
                            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">

                            <option>Draft</option>
                            <option>Finalized</option>
                        </select>
                        {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
                    </div>

                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.description}
                            class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
                        {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
                    </div>

                    <div class="flex items-center justify-between">
                        <button
                            type='submit'
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                            {updating ? "Updating" : "Update"}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    </>
}


export default EditForm