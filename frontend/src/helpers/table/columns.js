import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useDeleteContractByIdMutation } from '../../redux/services/contract'
import EditForm from '../../components/EditForm'
import { useContext, useState } from 'react'
import { FormContext } from '../context/FormContext'
import { useNavigate } from 'react-router-dom'


const formatDate = (date) => {
    var created_date = new Date(date)

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var year = created_date.getFullYear()
    var month = months[created_date.getMonth()]
    var date = created_date.getDate()
    var hour = created_date.getHours()
    var min = created_date.getMinutes()
    var sec = created_date.getSeconds()
    var updatedDate = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec // final date with time, you can use this according your requirement

    return updatedDate
}

const columnHelper = createColumnHelper()

export const columns = [
    columnHelper.accessor('id', {
        id: 'id',
        cell: info => info.getValue(),
        // footer: info => info.column.id
    }),
    columnHelper.accessor('client_name', {
        id: 'client_name',
        cell: info => info.getValue(),
        // footer: info => info.column.id
    }),
    columnHelper.accessor('status', {
        id: 'status',
        cell: info => info.getValue(),
        // footer: info => info.column.id
    }),
    // columnHelper.accessor('description', {
    //     id: 'description',
    //     cell: info => info.getValue(),
    //     // footer: info => info.column.id
    // }),
    columnHelper.accessor('created_at', {
        id: 'created_at',
        cell: info => formatDate(info.getValue())
        // footer: info => info.column.id
    }),

    columnHelper.accessor('description', {
        cell: info =>
            <DetailsButton id={info?.cell?.row?.original?.id} />

        // footer: info => info.column.id
    }),

    columnHelper.accessor('', {
        // id: 'Delete',
        header: "Delete",
        cell: info => <DeleteButton id={info?.cell?.row?.original?.id} />
    })


]

const DeleteButton = ({ id }) => {
    const [deleteContractById] = useDeleteContractByIdMutation()

    return <>
        <button
            onClick={async () => {
                console.log('info', id)


                await deleteContractById(id).then(() => {
                    alert(`deleted contract with id:` + id);
                }).catch((err) => {
                    console.log(err)
                })


            }}

            className=' border-red-700 text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button>
<button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-red-600 dark:hover:text-white dark:hover:bg-gray-700'
        >Delete</button>

    </>

}

const DetailsButton = ({ id }) => {
    const { showEditForm, setShowEditForm, setId } = useContext(FormContext);
    const navigate = useNavigate()
    return <>
        <button
            onClick={(e) => {
                navigate(`/edit-contracts/${id}`)
            }}
            className='border-blue-600 text-black bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button>
<button type="button" class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        >Details</button>
    </>

}

