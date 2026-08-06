import {useEffect,useState} from "react";
import axios from "axios";

function MyPosts(){

const[posts,setPosts]=useState([]);

useEffect(()=>{

axios.get("http://localhost:3000/myposts",{

withCredentials:true

})

.then(res=>setPosts(res.data));

},[]);

return(

<div>

<h2>My Posts</h2>

{

posts.map(post=>

<div key={post._id}>

<img src={post.images.url} width={300}/>

<p>{post.caption}</p>

</div>

)

}

</div>

);

}

export default MyPosts;