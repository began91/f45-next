import { useState, useEffect } from 'react';

export async function getServerSideProps(context) {
    let res = await fetch('http://localhost:3000/api/workouts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let posts = await res.json();

    return {
        props: { posts },
    };
}

export default function Posts({ posts }) {
    const [loading, setLoading] = useState(false);
    const [postsState, setPostsState] = useState([]);

    useEffect(() => {
        setPostsState(posts.data);
        console.log(posts);
    }, [posts]);

    return (
        <div className="container">
            {loading ? 'Loading' : 'Loaded'}
            {postsState.map((post, i) => (
                <div key={i}>{post.title}</div>
            ))}
        </div>
    );
}
