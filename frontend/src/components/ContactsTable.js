
import { contractsApi, useGetAllContractsQuery } from '../redux/services/contract';
import {

    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { columns } from '../helpers/table/columns';
import { useEffect, useState } from 'react';
import UploadModal from './UploadModal';
import EditForm from './EditForm';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';


export function ContractsTable() {

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0)
    const { pathname } = useLocation();
    const [searchType, setSearchType] = useState("name")

    const [searchId, setSearchId] = useState("")

    const [status, setStatus] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false)

    const dispatch = useDispatch();

    let { data, isLoading, error, refetch, isFetching, isUninitialized } = useGetAllContractsQuery({ searchQuery, searchId, status, page })

    data = isLoading ? [] : data;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    if (!isLoading) {
        console.log(data)
    }


    useEffect(() => {
        const socket = io('ws://34.230.45.237:4000');

        console.log('connection', socket.connected)
        socket.on("hi", (msg) => {
            console.log(msg)
        })

        socket.on("update", (msg) => {
            console.log('msg', msg)
            console.log('loading', isLoading)
            console.log('fetching', isFetching)
            console.log("pathname", pathname)
            console.log('url', window.location.href.split("/"))
            console.log("condition", window.location.href.split("/") == "")
            // if (window.location.href.split("/")[3] == "") {
                dispatch(contractsApi.util.invalidateTags(["contracts"]))
            // }

        })

    }, [refetch])



    return (
        <div className='grid grid-row-12'>
            <div className='row-start-1 row-end-3 flex justify-center mt-5 '>
                <select
                    className=' outline-none border-spacing-2 border-2 border-gray-400  mx-3 rounded-md'
                    onChange={(e) => {
                        if (e.target.value == "name") {
                            setSearchId("");
                        } else if (e.target.value == "id") {
                            setSearchQuery("")
                        }
                        setSearchType(e.target.value)
                    }}
                >
                    <option
                        value={""}
                    >Select Search Type</option>
                    <option
                        value={"name"}
                    >Client name</option>
                    <option
                        value={"id"}
                    >Id</option>
                </select>

                <select
                    className=' outline-none border-spacing-2 border-2 border-gray-400  mx-3 rounded-md'
                    onChange={(e) => {
                        setStatus(e.target.value)
                    }}
                >
                    <option
                        value={""}
                    >All</option>
                    <option
                        value={"Draft"}
                    >Draft</option>
                    <option
                        value={"Finalized"}
                    >Finalized</option>
                </select>

                <input
                    className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username'
                    value={searchType == "name" ? searchQuery : searchId}
                    onChange={(e) => {
                        if (searchType != "id") {
                            setSearchQuery(e.target.value)
                        } else {
                            setSearchId(e.target.value)
                        }

                    }}
                    type='text'
                />
                <button
                    className='border border-black rounded-md py-1 px-2 mx-1'
                >Search</button>

                <button
                    className='border border-black rounded-md py-1 px-2 mx-1'
                    onClick={() => {
                        console.log(showModal)
                        setShowModal(!showModal);
                    }}
                >Upload File</button>
            </div>
            {
                showModal && <UploadModal
                setShowModal = {setShowModal}
                />
            }
            <div className=' mt-8 flex justify-center align-middle'>
                <table >
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr className='border border-spacing-1 border-black' key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th className='border border-spacing-1 border-black' key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr className='border border-spacing-1 border-black ' key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td className='border border-spacing-1 border-black py-2 px-4' key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        {table.getFooterGroups().map(footerGroup => (
                            <tr key={footerGroup.id}>
                                {footerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.footer,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tfoot>
                    

                </table>
                <span><button

                    className='outline-none border-spacing-2 border-2 border-gray-400 px-2 py-2  mx-2 my-4 rounded-lg'

                        onClick={(e) => {
                            if (page != 0) {
                                setPage(page - 1)
                            }

                        }}

                    >Prev</button><button
                    className='outline-none border-spacing-2 border-2 border-gray-400 px-2 py-2  mx-2 my-4 rounded-lg'
                        onClick={(e) => {
                            setPage(page + 1)
                        }}
                    >next</button></span>

                <div className="h-4" />
                {/* <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button> */}


            </div>
            {
                showEditForm && <EditForm />
            }

        </div>
    );
}