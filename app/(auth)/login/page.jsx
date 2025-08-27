'use client'
import React from 'react'
import { useState } from 'react'

import { login } from '@/lib/api'

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        login(form.email, form.password)
    }
    return (
        <div>
            <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="email">ایمیل</label>
                <input
                    type="text"
                    id='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    className='border border-blue-400 p-3 m-3 rounded-lg w-64 h-16 text-base outline-0'
                    placeholder='ایمیل خود را وارد کنید...'
                />

                <label htmlFor="password">رمز عبور</label>
                <input
                    type="password"
                    id='password'
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    className='border border-blue-400 p-3 m-3 rounded-lg w-64 h-16 text-base outline-0'
                    placeholder='رمز عبور خودر را وارد کنید...'
                />
                <button onClick={handleSubmit}>ورود</button>
            </form>
        </div>
    )
}

export default Login