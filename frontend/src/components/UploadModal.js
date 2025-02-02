import React, { useState } from 'react'
import { useUploadFileMutation } from '../redux/services/contract';

const UploadModal = () => {
    const [file, setFile] = useState();
    const [upload,isLoading,error] = useUploadFileMutation()
    console.log('loading',isLoading)
    console.log('error',error)
    return (
        <div>
            <form className="max-w-lg mx-auto">
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload file</label>
                <input
                    onChange={ async(e) => {
                        setFile(e.target.files[0])
                        console.log(e.target.files[0])
                        await upload(file)
                    }}
                    name='file'
                    className="block w-full
                 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" />
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="user_avatar_help">A profile picture is useful to confirm your are logged into your account</div>
            </form>
        </div>
    )
}

export default UploadModal