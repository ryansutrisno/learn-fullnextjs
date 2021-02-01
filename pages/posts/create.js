import React, {useState} from 'react'
import { authPage } from '../../middlewares/authorizationPage'
import Router from 'next/router'

export async function getServerSideProps(ctx) {
    const {token} = await authPage(ctx);
    return { 
        props: {
            token
        }
    }
}

export default function PostCreate(props) {
    const [fields, setFields] = useState({
        title: '',
        content: ''
    })

    const [status, setStatus] = useState('normal');

    async function createHandler(e) {
        e.preventDefault();
        setStatus('loading');

        const {token} = props;
        
        const create = await fetch('/api/posts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(fields)
        });

        if(!create.ok) return setStatus('error');

        const res = await create.json();

        setStatus('success');

        Router.push('/posts')

        console.log(res)
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
            <h1>Create a post</h1>
            <form onSubmit={createHandler} style={{display: 'flex', flexDirection: 'column', width: '50%', padding: 10}}>
                <input onChange={fieldHandler.bind(this)} style={{marginBottom: 20, height: 30}} type="text" placeholder="Title" name="title" />
                <textarea onChange={fieldHandler.bind(this)} style={{marginBottom: 20}} type="text" placeholder="Content" name="content"></textarea>
                <button style={{width: '10%'}} type="submit">Create Post</button>
                <div>
                    Status {status}
                </div>
            </form>
        </div>
    )
}