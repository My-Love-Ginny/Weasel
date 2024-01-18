import React, { useState , useEffect} from "react";
import "./CreatePostPage.css"; // Import the CSS for styling
import { Routes, Route } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReCAPTCHA from "react-google-recaptcha";
import back from "../back.jpg";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CreatePostPage = () => {
  const { turn, setturn , dummydata, setdummyData} = useAuth();
  const REACT_APP_KEY = process.env.REACT_APP_KEY;


  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };



  const location = useLocation();
  const navigate = useNavigate();

  const toHome=()=>{
    if(turn == "2"){
      const newTurn = "3";
      setturn(newTurn);  
    }else{
      const newTurn = "2";
      setturn(newTurn);
    }
    console.log("turn is turn");
    navigate('/');
  }

  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filters, setFilters] = useState({
    firstYear: false,
    secondYear: false,
    thirdYear: false,
    fourthYear: false,
  });
  const [toggle, setToggle] = useState(false);
  var captcha = "invalidcaptcha";
  const handleCheckboxChange = (filter) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };
  
  const createPost = async () => {
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
      if(false){
        alert("The title and description are required!!");
      }else{
        const response = await fetch('https://backend-ra0s.onrender.com/postData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
  
          body: JSON.stringify({ token:token, title:title, content:description, filter:f, captcha:captcha}), // Include the name in the request body
        });
  
        const result = await response.json();
        console.log("here are we made the request of post");
        console.log(result.name);
        if (result.status === 'success') {
          // alert("you have posted successfully", result.name);
  
          // dummydata.set({_id:"", name:"You", timestamp:"Now", title:title, content:description});  
          setdummyData((prevdummydata) => [
            { _id: "", name: "You", timestamp: "Now", title: title, content: description, comments:[], likes:{}, dislikes:{}}, 
            ...prevdummydata,
          ]);
  
          toHome();
          
          
        } else if (result.data == "token_expired"){
          localStorage.setItem("token", "null");
        }else{
          alert("Error occured");
          window.location.reload();
        }
      }


     

      
    } catch (error) {
      console.error('Error:', error);
    }
  };  



  const handleRecaptchaChange = async (value) => {

    captcha = value;
    createPost();
  };
  const captchaVisible = () =>{
    if(title == "" || description == ""){
      alert("The title and description are required!!");
    }else{
      setToggle(true);
    }
  }
  

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"8vh", height:"84vh", backgroundImage: `url(${back})`, backgroundColor:"black"}} >
<Card sx={{ minWidth: 345 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        <div className="create-post-contai1ner"  >
      <div className="create-post-for1m">
        <h2>Create Your Post</h2>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <p>Filters:</p>
        <div className="form-group" >
          <div style={{'display':'flex','margin-left':'10%'}}>

          
          <label style={{'margin-right':'10%'}}>
            <input style={{paddingRight:"5px"}}
              type="checkbox"
              checked={filters.firstYear}
              onChange={() => handleCheckboxChange("firstYear")}
            />
            &nbsp;&nbsp;1st_year
          </label>
          <label>
            <input style={{paddingRight:"5px"}}
              type="checkbox"
              checked={filters.secondYear}
              onChange={() => handleCheckboxChange("secondYear")}
            />
            &nbsp;&nbsp;2nd_year
          </label>
          </div>
          <div style={{'display':'flex','margin-left':'10%'}}>
          <label style={{'margin-right':'10%'}}>
            <input style={{paddingRight:"5px"}}
              type="checkbox"
              checked={filters.thirdYear}
              onChange={() => handleCheckboxChange("thirdYear")}
            />
            &nbsp;&nbsp;3rd_year 
          </label>
         
          <label>
            <input style={{paddingRight:"5px"}}
              type="checkbox"
              checked={filters.fourthYear}
              onChange={() => handleCheckboxChange("fourthYear")}
            />
            &nbsp;&nbsp;4th_year 
          </label>
          </div>
        </div>
      
        {toggle?<ReCAPTCHA 
        sitekey={REACT_APP_KEY}
        onChange={handleRecaptchaChange}
      />:<></>}


        <button onClick={captchaVisible} className="abc" style={{backgroundColor:"#1ed760"}}>Submit</button>
      </div>
    </div>
        </Typography>

      </CardContent>
    </Card>


    
    </div>
  );
};

export default CreatePostPage;
