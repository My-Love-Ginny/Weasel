import React, { useEffect, useState } from 'react';
// import './PostModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';


const PostModal = ({ post, onClose }) => {
  const [turn, setturn] = useState(1);
  const [comments, setComments] = useState(post.comments || []);
  // const [name, setName] = useState("Giving You a Name!");
  const [newComment, setNewComment] = useState('');
  var token = localStorage.getItem("token");
  var name = localStorage.getItem("name");


  const handleLike = async (id, likes, dislikes) => {
    // console.log("we called the like");
    const token = localStorage.getItem("token");
    const type = "likes";
    // console.log("name is finally, ", name);

    if (type === "likes") {
      dislikes.delete(name);
      if (likes.get(name) === '1') {
          likes.delete(name);
      } else {
          // console.log("not already set");
          likes.set(name, '1');
      }
  } else {
      likes.delete(name);
      if (dislikes.get(name) === '1') {
          dislikes.delete(name);
      } else {
          dislikes.set(name, '1');
      }
  }
  if(turn){
    setturn(0);
  }else{
    setturn(1);
  }

    try {
      const response = await fetch('https://backend-ra0s.onrender.com/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, id: id, type: type }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDislike = async (id, likes, dislikes) => {
    // console.log("we called the dislike");
    const token = localStorage.getItem("token");
    const type = "dislikes";
    if (type === "likes") {
      dislikes.delete(name);
      if (likes.get(name) === '1') {
          likes.delete(name);
      } else {
          // console.log("not already set");
          likes.set(name, '1');
      }
  } else {
      likes.delete(name);
      if (dislikes.get(name) === '1') {
          dislikes.delete(name);
      } else {
          dislikes.set(name, '1');
      }
  }
  if(turn){
    setturn(0);
  }else{
    setturn(1);
  }
    try {
      const response = await fetch('https://backend-ra0s.onrender.com/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token, id: id, type: type }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const addComment = async (data) => {
    // console.log("addComment");
    const id = post._id;
    try {
      const response = await fetch('https://backend-ra0s.onrender.com/addComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "token":token, "data":data , "id":id}), // Include the name in the request body
      });
      
      const result = await response.json();
      // console.log("result is ", result)
      if (result.status === 'success') {
        // console.log("commented successfully");
        // setName(result.data);
        // console.log("saved name is ", name);
      } else {
        // token = null;
      }
    } catch (error) {
 
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '') {

      setComments((prevComments) => [
        ...prevComments,
        { uname: 'You', data: newComment, },
      ]);
      setNewComment('');
      addComment(newComment);
    }
  };

  useEffect(() =>{

    // console.log("use effect is called");
  }, [turn]);


  return (
    <div>

    
    <Box position="sticky" style={{position:"absolute", bottom:"0" , "z-index":"1100", "position": "fixed", height:"80vh", color:"#ffffff"}} sx={{display: { xs: 'none', md: 'flex' }}} className="post-modal">
      
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{height:"100vh", color:"white"}}>
        <Grid item xs={6} className='example' style={{height:"75vh", overflowY:"scroll"}}>
        <div className="" style={{justifyContent:"space-between",  alignItems:"center", padding:"20px"}}>
          <div className="modal-title" style={{paddingBottom:"5vh", color:"white"}}>{post.title}</div>
          <div className="">{post.content}</div>
        </div>
        </Grid>
        <Grid style={{backgroundColor:"#1b1717", color:"white", borderLeft:"1px solid grey"}} item xs={6}>
        
        <div className="modal-author" style={{color:"#fffeee", display:"flex", justifyContent:"space-between", textAlign:"center", alignItems:"center", paddingY:"10px", borderBottom:"1px solid grey"}}>
          {post.name}
          <button style={{background:"transparent", color:"#1ed760"}} className="abcd" onClick={onClose}>
            <CloseIcon/> 
          </button>    
        </div>
        
        <div className='' style={{height:"44vh", overflowY:"scroll"}}>    
          {comments.map((comment, index) => (
            <div key={index} className="comment" style={{padding:"0", backgroundColor:"#1b1717", color:"#ffffff", border:"0px"}}>
              <div className="comment-header">
                <div   className="comment-author"style={{color:comment.uname==="cindy58"?"#1db954":"#ffffff"}}>{comment.uname == name?"You":comment.uname}</div>
                <div className="comment-likes-dislikes">
                </div>
              </div>
              <div className="comment-content" style={{color:comment.uname==="cindy58"?"#1db954":"#ffffff", margin:"0px"}}>{comment.data}</div>
            </div>
          ))}
        </div>

        <div style={{position:"absolute", bottom:"0", paddingBottom:"2vh", paddingTop:"10px", borderTop:"1px solid grey"}}>
        <span className="example " style={{'padding-top':'2%'}}>{post.timestamp}</span>

        <div className="example " style={{'display':'flex','justifyContent':"start"}}>
              <div className="example like-outer">
                <div id="like-counter" className="example like-area" >
                  <ul style={{padding:"0px"}}>
                    <li >
                    <a style={{ paddingLeft: "0px" }} onClick={() => handleLike(post._id, post.likes, post.dislikes)}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span className="example like-no" style={{paddingLeft:"10px"}}>
                        {post.likes.size ? post.likes.size : 0}</span>
                      </a>
                    </li>
                    <li>
                      <a style={{paddingLeft:"0px"}} onClick={() => handleDislike(post._id, post.likes, post.dislikes)}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span className="example like-no" style={{paddingLeft:"10px"}}>
                          {post.dislikes.size ? post.dislikes.size : 0}
                          </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="add-comment" style={{padding:"0px", paddingLeft:"0px", paddingTop:"0px", width:"40vw"}}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === "Enter"){
                    handleAddComment();
                  }
                }}
              />
              <button className="abc" style={{backgroundColor:"#1ed760"}} onClick={handleAddComment}>Post</button>
            </div>
        </div>

        </Grid>
      </Grid>
      
    </Box>

    












































































    <Box  className="post-modal"style={{top:"7vh" , "z-index":"1100", padding:"0px", margin:"0px", border:"0px", borderRadius:"0"}} sx={{display: { xs: 'flex', md: 'none' }}}>
        <div position="sticky" className="modal-author" style={{position:"absolute", top:"0", display:"fle", justifyContent:"space-between", textAlign:"center", alignItems:"center", backgroundColor:"#191515", width:"100%", zIndex:"10000", color:"white", borderBottom:"62px solid grey"}}>
          <div style={{position:"absolute", left:"0", padding:"2vh", backgroundColor:"#191515", width:"100%"}}>
            {post.name}
          </div>
          
          <button style={{background:"transparent", color:"#1ed760", position:"absolute", right:"0", padding:"2vh", backgroundColor:"#191515"}} className="abcd" onClick={onClose}>
            <CloseIcon/> 
          </button>       
        </div>

        <div style={{maxHeight:"65vh",position:"absolute", top:"0", margin:"0px", overflowY:"scroll", paddingTop:"6vh"}}>



      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} style={{maxHeight:"100vh"}}>
        <Grid item xs={6} className='example' style={{maxheight:"70vh", overflowY:"scroll"}}>
        
        
        <div className="" style={{justifyContent:"space-between",  alignItems:"center", padding:"20px"}}>
          <div className="modal-title" style={{paddingBottom:"5vh", color:"#ffffff"}}>{post.title}</div>
          <div className="">{post.content}</div>

        </div>
        

        </Grid>

        <Grid style={{backgroundColor:"", color:"black", padding:"20px"}} item xs={6}>
        
        
        <div className='' style={{maxHeight:"45vh", overflowY:"scroll", borderTop:"1px solid grey", width:"80vw"}}>    
        {comments.map((comment, index) => (
            <div key={index} className="comment" style={{margin:"0", paddingBottom:"10px", backgroundColor:"#1b1717", color:"#ffffff", border:"0px"}}>
              <div className="comment-header">
                <div   className="comment-author" style={{color:comment.uname==="cindy58"?"#1db954":"#ffffff"}}>{comment.uname == name?"You":comment.uname}</div>
                <div className="comment-likes-dislikes">
                </div>
              </div>
              <div className="comment-content" style={{color:comment.uname==="cindy58"?"#1db954":"#ffffff", margin:"0px"}}>{comment.data}</div>
            </div>
          ))}
        </div>

        
        </Grid>
      </Grid>
      </div>
      
      <>
      <div style={{position:"absolute", bottom:"0", padding:"2vh", marginBottom:"0",  width:"100%", borderTop:"1px solid grey"}}>
        <span className="example " style={{'padding-top':'2%'}}>{post.timestamp}</span> 

        <div className="example " style={{'display':'flex','justifyContent':"start"}}>
              <div className="example like-outer">
                <div id="like-counter" className="example like-area" >
                  <ul style={{padding:"0px"}}>
                    <li >
                    <a style={{ paddingLeft: "0px" }} onClick={() => handleLike(post._id, post.likes, post.dislikes)}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span className="example like-no" style={{paddingLeft:"10px"}}>
                        {post.likes.size ? post.likes.size : 0}</span>
                      </a>
                    </li>
                    <li>
                      <a style={{paddingLeft:"0px"}} onClick={() => handleDislike(post._id, post.likes, post.dislikes)}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span className="example like-no" style={{paddingLeft:"10px"}}>
                          {post.dislikes.size ? post.dislikes.size : 0}
                          </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="add-comment" style={{padding:"0px", paddingLeft:"0px", paddingTop:"0px", width:"100%"}}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="abc" style={{backgroundColor:"#1ed760"}} onClick={handleAddComment}>Post</button>
            </div>
        </div> 
</>

      
      {/* <div className="modal-header">
        <div>
          <div className="modal-title">{post.title}</div>
          <div className="modal-author">{post.author}</div>
        </div>
      </div>
      <div className="modal-content-container">
        <div className="modal-content-box">{post.content}</div>
        <div className="modal-comments-box">
          <div className='cmmts'>

          
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-header">
                <div className="comment-author">{comment.uname == name?"You":comment.uname}</div>
                <div className="comment-likes-dislikes">
                </div>
              </div>
              <div className="comment-content">{comment.data}</div>
            </div>
          ))}

          </div>
          
          <div className='xyz'>
          
          <div className="lk" style={{'display':'flex','justifyContent':"space-between",'color':'white','text-align':'center'}}>
          <div className="lk" style={{'display':'flex','justifyContent':"start"}}>
              <div className="like-outer">
                <div id="like-counter" className="like-area" >
                  <ul style={{padding:"0px"}}>
                    <li >
                    <a style={{ paddingLeft: "0px" }} onClick={() => handleLike(post._id, post.likes, post.dislikes)}>
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span className="like-no" style={{paddingLeft:"10px"}}>
                        {post.likes.size ? post.likes.size : 0}</span>
                      </a>
                    </li>
                    <li>
                      <a style={{paddingLeft:"0px"}} onClick={() => handleDislike(post._id, post.likes, post.dislikes)}>
                        <FontAwesomeIcon icon={faThumbsDown} />
                        <span className="like-no" style={{paddingLeft:"10px"}}>
                          {post.dislikes.size ? post.dislikes.size : 0}
                          </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div></div></div>
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>
          </div>
        </div>
      </div>
      <button className="close-modal" onClick={onClose}>
          Close
        </button> */}
    </Box>


    </div>

  );
};

export default PostModal;
