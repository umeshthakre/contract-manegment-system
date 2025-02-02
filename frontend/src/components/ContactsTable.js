
import { useGetAllContractsQuery } from '../redux/services/contract';
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

export function ContractsTable() {

    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0)

    const [searchType, setSearchType] = useState("name")

    const [searchId, setSearchId] = useState("")

    const [status, setStatus] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false)

    let { data, isLoading, error, refetch } = useGetAllContractsQuery({ searchQuery, searchId, status, page })

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
        const socket = io('ws://localhost:4000');

        console.log('connection', socket.connected)
        socket.on("hi", (msg) => {
            console.log(msg)
        })

        socket.on("update",(msg)=>{
            console.log('msg',msg)
           if(!isLoading){
            console.log('refetching')
            refetch()
           } 
        })

    }, [])



    return (
        <div className='grid grid-row-12'>
            <div className='row-start-1 row-end-3'>
                <select
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
                    className='border border-black rounded-md'
                >Search</button>

                <button
                    onClick={() => {
                        console.log(showModal)
                        setShowModal(true);
                    }}
                >Upload File</button>
            </div>
            <div className="p-2">
                <table>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
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
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
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
                <div className="h-4" />
                {/* <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button> */}

                <div><button

                    onClick={(e) => {
                        if (page != 0) {
                            setPage(page - 1)
                        }

                    }}

                >Prev</button><button
                    onClick={(e) => {
                        setPage(page + 1)
                    }}
                >next</button></div>

            </div>
            {
                showModal && <UploadModal />
            }{
                showEditForm && <EditForm />
            }

        </div>
    );
}