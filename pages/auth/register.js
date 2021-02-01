import React, { useState } from 'react';
import { unauthPage } from '../../middlewares/authorizationPage'

export async function getServerSideProps(ctx) {
    await unauthPage(ctx);

    return { props: {} }
}

export default function Register() {
    const [fields, setFields] = useState({
        email: '',
        password: ''
    });

    const [status, setStatus] = useState('normal');

    async function registerHandler(e) {
        e.preventDefault();
        
        setStatus('loading')

        const registerReq = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(fields),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!registerReq.ok) return setStatus('error ' + registerReq.status)

        const registerRes = await registerReq.json();

        setStatus('success')
        
    }

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');

        setFields({
            ...fields,
            [name]: e.target.value
        });
    }


    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={registerHandler} style={{padding: 10, display: "flex", flexDirection: "column", maxWidth: "50%"}}>
                <input onChange={fieldHandler} name="email" type="text" placeholder="Email" /> <br/>
                <input onChange={fieldHandler}  name="password" type="password" placeholder="Password" /> <br/>
                <button type="submit">
                    Register
                </button>
                <div>Output: {status}</div>
            </form>
        </div>
    )
}