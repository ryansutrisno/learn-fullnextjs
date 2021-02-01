import React, {useState} from 'react'
import Router from 'next/router'
import { authPage } from '../../middlewares/authorizationPage'
import Nav from '../../components/Nav'

export async function getServerSideProps(ctx) {
    const { token } = await authPage(ctx);
    
    const postReq = await fetch('http://localhost:3000/api/posts', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    const posts = await postReq.json();

    return { 
        props: {
            token,
            posts: posts.data
        }
    }
}

export default function PostIndex(props) {
    const [posts, setPosts] = useState(props.posts);

    async function deleteHandler(id, e) {
        e.preventDefault();

        const { token } = props;

        const msg = confirm('Apakah data ini ingin di hapus?');

        if (msg) {
               const deletePost = await fetch('/api/posts/delete/' + id, {
                       method: 'DELETE',
                       headers: {
                            'Authorization': 'Bearer ' + token
                           }
                       });

                const res = await deletePost.json();
                    
                const postsFiltered = posts.filter(post => {
                        return post.id !== id && post;
                });

                setPosts(postsFiltered);
        }
    }

    function editHandler(id) {
        Router.push('/posts/edit/' + id);
    }

    return (
        <div style={{padding: 10}}>
            <h1>Posts</h1>
            <Nav />
            {posts.map(post => (
                    <div key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <button onClick={editHandler.bind(this, post.id)}>Edit</button>
                        <button onClick={deleteHandler.bind(this, post.id)}>Delete</button>
                        <hr/>
                    </div>
            ))}
        </div>
    );
}