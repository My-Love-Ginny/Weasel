import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from './context/AuthContext';
import "./App.css";
import { useNavigate } from "react-router-dom";
import PostModal from "./components/PostModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp, faThumbsDown as farThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { Routes, Route } from "react-router-dom"
import CreatePostPage from "./components/CreatePostPage";
import logo from "./components/final_logo.png";

import ReCAPTCHA from "react-google-recaptcha";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import Popper from '@mui/material/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


var size = 0;

function App() {

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);


  var captcha = "invalidcaptcha";

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const { turn, setturn, dummyData, setdummyData} = useAuth();
  const logOut = () => {

    localStorage.setItem("token", null);

    setName("Refresh to get a Name!")
    localStorage.setItem("name", null);
  }

  const handleLike = async (id, likes, dislikes) => {
    const token = localStorage.getItem("token");
    const type = "likes";
    
    if(id != ""){
      if (type === "likes") {
        dislikes.delete(name);
        if (likes.get(name) === '1') {
            likes.delete(name);
        } else {
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

    }else{
      window.location.reload();
      // fetchData(0);
    }

    // console.log("changed in the locak");
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


    if(id != ""){
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

    }else{
      window.location.reload();
      // fetchData(0);
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



  const [name, setName] = useState("Giving You a Name!");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filters, setFilters] = useState({
    firstYear: false,
    secondYear: false,
    thirdYear: false,
    fourthYear: false,
  });



  

  


  // var size = 0;
  useEffect(() => {
    var token = "null";
    
    const handleRecaptchaChange = async (value) => {
      captcha = value;
      // console.log("valus is ", value);
      // console.log("starting the function");      
      fetchToken(name, token);      
      fetchData(0);
      // console.log("close the swal");
      Swal.close();
    };


    const showSwal = () => {
      withReactContent(Swal).fire({
        title: "Verify You Are Human!!",
        showConfirmButton: false, // Remove the OK button
        allowOutsideClick: false, // Prevent closing when clicked outside
        html: (
          <div className="custom-swal-content" style={{ height: "auto", overflowY: "hidden", display: "flex", justifyContent: "center", flexDirection:"column" }}>
            
            <div style={{display:"flex", justifyContent:"center", paddingBottom:"10px"}}>
            <DelayedReCAPTCHA />
            
            </div>
            <p>If not loading please refresh.</p>
          </div>
        ),
        customClass: {
          container: 'custom-swal-container',
        },
      });
    };
    
    const REACT_APP_KEY = process.env.REACT_APP_KEY;
    const DelayedReCAPTCHA = () => {
      const [loaded, setLoaded] = useState(false);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?key=${REACT_APP_KEY}`;
        script.async = true;
        console.log(script.src);
    
        script.onload = () => {
          setLoaded(true);
        };
    
        script.onerror = (err) => {
          console.error('Error loading Google reCAPTCHA script:', err);
          setError(err);
          setLoaded(false);
        };
    
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);
    
      if (error) {
        return <div>Error loading reCAPTCHA: {error.message}</div>;
      }
    
      return loaded ? <ReCAPTCHA sitekey={REACT_APP_KEY} onChange={handleRecaptchaChange} /> : <div>Loading reCAPTCHA...</div>;
    };



    const fetchRandomUser = async (name) => {
      showSwal();
    };
    
    
    const fetchToken = async (name, token) => {
      try {
        // console.log("name at the time of call is ", name);
        const response = await fetch('https://backend-ra0s.onrender.com/getToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ captcha:captcha}),
        });

        const result = await response.json();
        // console.log("here result is ", result);
        if (result.status === 'success') {
          // console.log(result, "this is result");
          setName(result.name);
          token = (result.token);
          localStorage.setItem("token", token);
          localStorage.setItem("name", result.name);
          // console.log("name is ", name, "toekn is ", localStorage.getItem("token"));
          // console.log("name is ", localStorage.getItem("name"), "toekn is ", localStorage.getItem("token"));
       
        } else {
          console.error('Error:', result.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchName = async (name, token) => {
      // console.log("fetchName")
      try {
        const response = await fetch('https://backend-ra0s.onrender.com/getName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token:token }), // Include the name in the request body
        });

        const result = await response.json();
        // console.log("result is ", result)
        if (result.status === 'success') {
          setName(result.data);
          // console.log(result.data, "this is resul t");
          // console.log("saved name is ", name);
        } else {
          token = null;
        }
      } catch (error) {
        token = null;
        console.error('Error:', error);
      }
    };

    
    const isObject = (obj) => {
      return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    };

    // var size = 0;

    const fetchData = async (flag) => {
      // console.log("fetching the data");
      try {
        let f = 0;
        if(filters.firstYear){
          f += 1<<0;
        }
        if(filters.secondYear){
          f += 1<<1;
        }
        if(filters.thirdYear){
          f += 1<<2;
        }
        if(filters.fourthYear){
          f += 1<<3;
        }
        // console.log("f is ", f);
        // console.log("callind the data function");
        // console.log(dummyData);
        const response = await fetch('https://backend-ra0s.onrender.com/getData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filter:f , size:size, flag:flag}), // Include the name in the request body
        });
        if(flag == 1){
          const result = await response.json();
          // console.log("result is ", result);
          if (result.status === 'success') {
            // console.log("dummy_data is", dummyData);
            // dummyData = result.data;
            // console.log("setting it to", result.data);
            size += result.data.length;
            const modifiedData = result.data.map((post) => ({
              ...post,
              likes: isObject(post.likes) ? new Map(Object.entries(post.likes)) : new Map(),
              dislikes: isObject(post.dislikes) ? new Map(Object.entries(post.dislikes)) : new Map(),
            }));
            // console.log(modifiedData);
            // setdummyData((prevdummydata) => [
            //   ...prevdummydata,
            //   ...modifiedData,
            // ]);
  
            setdummyData(modifiedData);
  
            // setdummyData(result.data);  
            
          } else {
  
          }
            
        }else{
          const result = await response.json();
          // console.log("result is ", result);
          if (result.status === 'success') {
            // console.log("dummy_data is", dummyData);
            // dummyData = result.data;
            // console.log("setting it to", result.data);
            size += result.data.length;
            const modifiedData = result.data.map((post) => ({
              ...post,
              likes: isObject(post.likes) ? new Map(Object.entries(post.likes)) : new Map(),
              dislikes: isObject(post.dislikes) ? new Map(Object.entries(post.dislikes)) : new Map(),
            }));
            // console.log(modifiedData);
            setdummyData((prevdummydata) => [
              ...prevdummydata,
              ...modifiedData,
            ]);
  
            // setdummyData(modifiedData);
  
            // setdummyData(result.data);  
            
          } else {
  
          }
  
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };



    token = localStorage.getItem("token");
    if(turn != "2" && turn != "3"){
      // console.log("no function called");
    }else if(token == "null" || token == null){
      // console.log("first");
      fetchRandomUser(name);
      // fetchData();
    }else{
      // console.log("second");
      fetchName(name, token);
      fetchData(0);
    }
    // console.log("called the data function");
    const intervalId = setInterval(() => {
      // console.log("TIME OUT!!!!!");
      fetchData(1);
    }, 50000);
  

    const targetElement = document.getElementById("yourScrollableElementId");

    const handleScroll = () => {
      const windowHeight = targetElement.clientHeight;
      const scrollHeight = targetElement.scrollHeight;
      const scrollTop = targetElement.scrollTop;
    
      // console.log(windowHeight + scrollTop);
      // console.log(scrollHeight);
      // console.log("comparing it");
    
      if (windowHeight + scrollTop + 1 >= scrollHeight) {
        // console.log(windowHeight + scrollTop);
        // console.log(scrollHeight);
        // console.log("comparing it");
        handleEndOfScroll();
      }
    };

    const handleEndOfScroll = () => {
      // console.log("Reached the end of the scroll!");
      fetchData(0);
    };
    if(targetElement){
      targetElement.addEventListener("scroll", handleScroll);
    }


    // Clear interval on component unmount
    return () => {
      clearInterval(intervalId)
      if(targetElement){
        targetElement.removeEventListener("scroll", handleScroll);
      }
      // intersectionObserver.disconnect();
    };

  }, [filters, turn]);


  const handleCheckboxChange = (year) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [year]: !prevFilters[year],
    }));
  };


  const navigate = useNavigate();
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [toggle, settoggle] = useState(false);
  const openPostModal = (post) => {
    setSelectedPost(post);
    setPostModalOpen(true);
  };

  const closePostModal = () => {
    setSelectedPost(null);
    setPostModalOpen(false);
  };

  const goToPost = () => {
    // console.log("toggle is ", toggle);
    // settoggle(true)
    // console.log("toggle is ", toggle);
    closePostModal();
    
    navigate('/create', { state: { turn }, updateTurn: setturn });
  };

  const toHome=()=>{
    navigate('/');
  }

  return (
    <div className="example app example" style={{backgroundColor:"#191414", height:"100vh", marginBottom:"0px"}}>
      


      <span position="sticky" >

      <AppBar position="sticky" style={{backgroundColor:"#1db954", color:"black"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img style = {{height:"40px", marginRight: "15px"}} src={logo}/>
          <Typography
            onClick={toHome}
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            WEASEL2.0
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem  onClick={handleCloseNavMenu} >
                  <Typography textAlign="center" onClick={toHome}>
                Home
                  </Typography>
              </MenuItem>
              <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" onClick={goToPost}>
                Create New Post
                  </Typography>
              </MenuItem>
              <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" >
                  {name}
                  </Typography>
              </MenuItem>
              <MenuItem  onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" onClick={logOut}>
                    Log Out
                  </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={toHome}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            WEASEL2.0
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex', justifyContent:"right" } }}>
            
              <Button variant="contained" 
                onClick={goToPost} className="abc"
                sx={{ my: 2, backgroundColor:"#1ed760", color: '#EEF5FF', display: 'block', margin:"10px" }}
              >
                Create New Post
              </Button>




              <Button variant="contained" 
                onClick={toHome} className="abc"
                sx={{ my: 2, backgroundColor:"#1ed760", color: '#EEF5FF', display: 'block' , margin:"10px"}}
              >
                {name}
              </Button>

              <Button variant="contained" 
                onClick={logOut} className="abc"
                sx={{ my: 2, backgroundColor:"#1ed760", color: '#EEF5FF', display: 'block', margin:"10px" }}
              >
                Log Out
              </Button>
              
          </Box>

          
        </Toolbar>
      </Container>
      <Grid container  style={{backgroundColor:"black", color:"#EEF5FF", justifyContent:"right", paddingLeft:"24px", paddingRight:"28px", paddingBottom:"2px", marginTop:"2px"}} spacing={{ xs: 1, md: 1 }} columns={{ xs: 8, sm: 16, md: 24}} >
      <Grid item xs={2} sm={4} md={2} style={{display:"flex", justifyContent:"center"}} >

        <Checkbox checked={filters.firstYear}
            onChange={() => handleCheckboxChange('firstYear')} style={{color:"#EEF5FF"}}/>
        <label style={{margin:"auto"}}>1st Year</label>
      </Grid>
      <Grid item xs={2} sm={4} md={2} style={{display:"flex", justifyContent:"center"}} >

      <Checkbox checked={filters.secondYear}
            onChange={() => handleCheckboxChange('secondYear')} style={{color:"#EEF5FF"}}/>
      <label style={{margin:"auto"}}>2nd Year</label>
    </Grid>
        <Grid item xs={2} sm={4} md={2} style={{display:"flex", justifyContent:"center"}} >

        <Checkbox checked={filters.thirdYear}
            onChange={() => handleCheckboxChange('thirdYear')} style={{color:"#EEF5FF"}}/>
        <label style={{margin:"auto"}}>3rd Year</label>
      </Grid>
      <Grid item xs={2} sm={4} md={2} style={{display:"flex", justifyContent:"center"}} >

      <Checkbox checked={filters.fourthYear}
            onChange={() => handleCheckboxChange('fourthYear')} style={{color:"#EEF5FF"}}/>
      <label style={{margin:"auto"}}>4th Year</label>
    </Grid>
    </Grid>

    </AppBar>
    


    </span>


          


























      <Routes>
      <Route path='/' element={
      
      
      
      <div id="yourScrollableElementId" className="example post-container" style={{height:"80vh", overflow:"scroll"}}>
        {dummyData.map((post) => (
          <div key={post.id} style={{margin:"auto", height:"50vh", backgroundColor:"#eeeade", border:"4px solid", borderColor:post.name==="cindy58"?"#1db954":"#eeeade", maxWidth:"300px", minWidth:"300px"}} className="example example post-card">
            <div onClick={() => openPostModal(post)}>
              <div className="example post-header">
                <div className="example post-title">{post.title}</div>
                <div style={{paddingLeft:"5px", color:post.name==="cindy58"?"#1db954":"#8e8e8e"}} className="example post-author">{post.name}</div>
              </div>
              <div className="example post-content">{post.content}</div>
              {/* <div className="example post-comments"> */}
                {/* {post.comments.slice(-2).map((comment, index) => (
                  <div key={index} className="example comment">
                    <div className="example comment-author">{comment.uname == name?"You":comment.uname}</div>
                    <div className="example comment-content">{comment.data}</div>
                  </div>
                ))} */}
              {/* </div> */}
            </div>

            <div className="example lk" style={{'display':'flex','justifyContent':"start"}}>
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
            <span className="example post-author  " style={{'padding-top':'2%'}}>{post.timestamp}</span>
          </div>
        ))}
      </div>}/>
      <Route path = "/create" element={
        <CreatePostPage/>
      }></Route>
      </Routes>
      {
        postModalOpen && (
          <PostModal post={selectedPost} onClose={closePostModal} />
        )      
      }
    </div>
  ); 
}

export default App;