import React, {useState} from 'react'
import { authPage } from '../../../middlewares/authorizationPage'
import Router from 'next/router'
import Nav from '../../../components/Nav'

export async function getServerSideProps(ctx) {
    const {token} = await authPage(ctx);

    const { id } = ctx.query;
    
    const postReq = await fetch('http://localhost:3000/api/posts/detail/' + id, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const res = await postReq.json();

    return { 
        props: {
            token,
            post: res.data
        }
    }
}

export default function PostUpdate(props) {
    const { post } = props;

    const [fields, setFields] = useState({
        title: post.title,
        content: post.content
    });


    const [status, setStatus] = useState('normal');

    async function createHandler(e) {
        e.preventDefault();
        
        setStatus('loading');

        const {token} = props;
        
        const create = await fetch('/api/posts/update/' + post.id, {
            method: 'PUT',
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

    }

    function fieldHandler(e) {
        const name = e.target.getAttribute('name');

        setFields({
            ...fields,
            [name]: e.target.value
        });
    }

    return (
      <div style={{padding: 10}}>
        <h1>Edit a post</h1>
        <Nav/>
        <form
          onSubmit={createHandler}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            padding: 10,
          }}
        >
          <input
            onChange={fieldHandler.bind(this)}
            style={{ marginBottom: 20, height: 30 }}
            type="text"
            placeholder="Title"
            name="title"
            defaultValue={post.title}
          />
          <textarea
            onChange={fieldHandler.bind(this)}
            style={{ marginBottom: 20 }}
            type="text"
            placeholder="Content"
            name="content"
            defaultValue={post.content}
          ></textarea>
          <button style={{ width: "10%" }} type="submit">
            Save Changes
          </button>
          <div>Status {status}</div>
        </form>
      </div>
    );
}