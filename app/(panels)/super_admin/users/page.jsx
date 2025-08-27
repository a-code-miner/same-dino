'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { getUsers, addUser, updateUser, deleteUser } from '@/lib/api'

const UsersManagement = () => {
    const roles = ['super_admin', 'school_admin', 'canteen', 'parents']

    const [form, setForm] = useState({
        name: '',
        father_name: '',
        last_name: '',
        email: '',
        phone: '',
        selectedRole: '',
    })
    const [editForm, setEditForm] = useState({
        id: '',
        name: '',
        father_name: '',
        last_name: '',
        email: '',
        phone: '',
        selectedRole: '',
    })
    const [deleteForm, setDeleteForm] = useState({
        id: '',
        name: '',
        father_name: '',
        last_name: '',
        email: '',
        phone: '',
        selectedRole: '',
    })
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [users, setUsers] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const openEditModal = (user) => {
        setEditForm({
            id: user.id,
            name: user.name,
            father_name: user.father_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            selectedRole: user.selectedRole,
        })
        setIsEditModalOpen(true)
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        await updateUser(editForm.id, editForm)
        console.log('User updated: ', editForm)
        setIsEditModalOpen(false)
    }

    const openDeleteModal = (user) => {
        setDeleteForm({
            id: user.id,
            name: user.name,
            father_name: user.father_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            selectedRole: user.selectedRole
        })
        setIsDeleteModalOpen(true)
    }

    const handleDeleteSubmit = async (e) => {
        e.preventDefault()
        await deleteUser(deleteForm.id)
        console.log('User deleted: ', deleteForm)
        setIsDeleteModalOpen(false)
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addUser(form)
        console.log(form)
    }

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers()
            setUsers(data)
        }
        fetchUsers()
    }, [])

    return (
        <div>
            <form>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    id='name'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    className='border border-blue-400 p-3 m-3 rounded-lg w-64 h-16 text-base outline-0'
                    placeholder='نام را وارد کنید...'
                />
                <br /><br />
                <label htmlFor="father_name">Father Name</label>
                <input
                    type="text"
                    id='father_name'
                    name='father_name'
                    value={form.father_name}
                    onChange={handleChange}
                    className='border border-blue-400 p-3 m-3 rounded-lg w-64 h-16 text-base outline-0'
                    placeholder='نام پدر را وارد کنید...'
                />
                <br /><br />
                <label htmlFor="last_name">Last_name</label>
                <input
                    type="text"
                    id='last_name'
                    name='last_name'
                    value={form.last_name}
                    onChange={handleChange}
                    className='border border-blue-400 p-3 m-3 rounded-lg w-64 h-16 text-base outline-0'
                    placeholder='تخلص را وارد کنید...'
                />
                <br /><br />
                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    id='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    className='border border-blue-400 p-3 m-3 rounded-lg w-64 h-16 text-base outline-0'
                    placeholder='ایمیل را وارد کنید...'
                />
                <br /><br />
                <label htmlFor="phone">Phone</label>
                <input
                    type="number"
                    id='phone'
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                    className='border border-blue-400 p-3 m-3 rounded-lg w-64 h-16 text-base outline-0'
                    placeholder='شماره تماس را وارد کنید...'
                />
                <br /><br />
                <label htmlFor="role">Role</label>
                <select
                    name="selectedRole"
                    id="selectedRole"
                    value={form.selectedRole}
                    onChange={handleChange}
                >
                    <option value="">-- Choose a role --</option>
                    {roles.map((role, index) => (
                        <option key={index} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
                <br /><br />
                <button onClick={handleSubmit}>Submit</button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-right border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Father Name</th>
                            <th className="px-4 py-2">Last Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th>
                            <th className="px-4 py-2">Role</th>
                            <th className='px-4 py-2'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (users.map((user, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">{user.name}</td>
                                <td className="px-4 py-2">{user.father_name}</td>
                                <td className="px-4 py-2">{user.last_name}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.phone}</td>
                                <td className="px-4 py-2">{user.selectedRole}</td>
                                <td className="flex px-4 py-2">
                                    <button
                                        onClick={() => openEditModal(user)}
                                        className='flex justify-center items-center px-2 py-1 ml-3 bg-green-400 rounded-lg'
                                    >
                                        Edit
                                        <FaEdit className='mr-1' />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(user)}
                                        className='flex justify-center items-center px-2 py-1 ml-3 bg-red-400 rounded-lg'
                                    >
                                        Delete
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))) : (
                            <tr>
                                <td colSpan={7}>No users found!</td>
                            </tr>
                        )
                        }
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black/20'>
                    <div className='bg-white rounded-lg p-6 w-96 shadow-lg'>
                        <h2 className='text-xl font-semibold mb-4'>Edit User</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input
                                type="text"
                                name='name'
                                value={editForm.name}
                                onChange={handleEditChange}
                                placeholder='Name'
                                className='border p-2 w-full mb-3 rounded'
                            />
                            <input
                                type="text"
                                name='father_name'
                                value={editForm.father_name}
                                onChange={handleEditChange}
                                placeholder='Father Name'
                                className='border p-2 w-full mb-3 rounded'
                            />
                            <input
                                type="text"
                                name='last_name'
                                value={editForm.last_name}
                                onChange={handleEditChange}
                                placeholder='Last Name'
                                className='border p-2 w-full mb-3 rounded'
                            />
                            <input
                                type="text"
                                name='email'
                                value={editForm.email}
                                onChange={handleEditChange}
                                placeholder='Email'
                                className='border p-2 w-full mb-3 rounded'
                            />
                            <input
                                type="text"
                                name='phone'
                                value={editForm.phone}
                                onChange={handleEditChange}
                                placeholder='Phone'
                                className='border p-2 w-full mb-3 rounded'
                            />
                            <input
                                type="text"
                                name='selectedRole'
                                value={editForm.selectedRole}
                                onChange={handleEditChange}
                                placeholder='Role'
                                className='border p-2 w-full mb-3 rounded'
                            />
                            <button
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-sm transition"
                                type='submit'
                            >
                                Save
                            </button>
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-[700px] p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b pb-3">
                            <h2 className="text-2xl font-bold text-red-600">Delete User</h2>
                            <button
                                onClick={closeDeleteModal}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Body */}
                        <div className="mt-4 space-y-4">
                            <p className="text-gray-700">
                                Are you sure you want to delete this user? This action
                                <span className="font-semibold text-red-500"> cannot be undone</span>.
                            </p>

                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full text-sm text-right border-collapse">
                                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Father Name</th>
                                            <th className="px-4 py-2">Last Name</th>
                                            <th className="px-4 py-2">Email</th>
                                            <th className="px-4 py-2">Phone</th>
                                            <th className="px-4 py-2">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">{deleteForm.name}</td>
                                            <td className="px-4 py-2">{deleteForm.father_name}</td>
                                            <td className="px-4 py-2">{deleteForm.last_name}</td>
                                            <td className="px-4 py-2">{deleteForm.email}</td>
                                            <td className="px-4 py-2">{deleteForm.phone}</td>
                                            <td className="px-4 py-2">{deleteForm.selectedRole}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSubmit}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm transition"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default UsersManagement