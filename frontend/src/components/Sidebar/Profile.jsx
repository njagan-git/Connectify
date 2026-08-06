import {useEffect,useState} from "react";
import axios from "axios";

function Profile(){

const[user,setUser]=useState(null);

useEffect(()=>{

axios.get("http://localhost:3000/me",{
withCredentials:true
})
.then(res=>setUser(res.data.user));

},[]);

if(!user)
return<h2>Loading...</h2>

return(

<div>

<h1>{user.username}</h1>

<img
  src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
  alt="Profile"
/>
<p>{user.email}</p>

<p>{user.bio}</p>

</div>

);

}

export default Profile;