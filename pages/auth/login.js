import React, { useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import Router from 'next/router'
import { unauthPage } from '../../middlewares/authorizationPage'

export async function getServerSideProps(ctx) {
    await unauthPage(ctx);

    return { props: {} }
}

export default function Login() {
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });

    const [status, setStatus] = useState('normal');

    // useEffect(() => {
    //     console.log('update')
    // });

    async function loginHandler(e) {
        e.preventDefault()

        setStatus('loading')
        
        const loginReq = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fields)
        });

        if(!loginReq.ok) return setStatus('error ' + loginReq.status);

        const loginRes = await loginReq.json();

        setStatus('success');
        
        Cookie.set('token', loginRes.token);

        Router.push('/posts');
    }

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');

        setFields({
            ...fields,
            [name]: e.target.value
        })
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={loginHandler} style={{padding: 10, display: "flex", flexDirection: "column", maxWidth: "50%"}}>
                <input onChange={fieldHandler} name="email" type="text" placeholder="Masukkan email" /> <br/>
                <input onChange={fieldHandler}  name="password" type="password" placeholder="Masukkan password" /> <br/>
                <button type="submit">
                    Login
                </button>
                <div>Status: {status}</div>
            </form>
        </div>
    );
}