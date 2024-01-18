const express = require("express");
const mongoose = require("mongoose");
const app = express();
const fetch = require('node-fetch');
require('dotenv').config();

const axios = require('axios');
const bodyParser = require('body-parser');

const mongoUrl = process.env.MONGO;
const jwt = require("jsonwebtoken");

const cors = require("cors");
app.use(cors())
app.use(express.json());

const jwt_secret = process.env.USER_SECRET;

const RECAPTCHA_SECRET_KEY = process.env.KEY;
const GKEY = process.env.GKEY;


const apiUrl = process.env.apiUrl;
const apiKey = process.env.apiKey;


const secret = process.env.secret;
const moment = require('moment');
const posts_data = require("./posts_data");
const posts = mongoose.model("posts_data");
mongoose.connect(mongoUrl, {useNewUrlParser:true,}).then(() => {console.log("connected");}).catch((e) =>console.log(e));

app.listen(5000 , ()=>{
    console.log("the server is up and running");
});



      
app.post("/getToken",  async(req, res) => {

    const {captcha} = req.body;
    
    var captchaVerified = false;
    try {
        const response = await axios.post(`https://recaptchaenterprise.googleapis.com/v1/projects/weasel-1705305140047/assessments?key=${RECAPTCHA_SECRET_KEY}`, {
            "event": {
                "token": captcha,
                "siteKey": GKEY,
              }
            
        });
        console.log(response.data.tokenProperties);
        // console.log(response);       
    if (response.data.tokenProperties.valid) {
        // console.log("verifieed");
        captchaVerified = true;
    }else{
        // console.log("unverified");
        return res.send({status:"error"});
    }
    } catch (error) {
        // console.log("tring to captcha");
        console.log(error);
        return res.send({status:"error"});
    }

    if(captchaVerified == false){
        return res.send({status:"error"});
    }





    // console.log("captcha verified");



    // console.log("we are trying to take token");
    var name = "";
    
    try {
        // console.log("trying");
        const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
        },
    });
        const result = await response.json();
        name = result.username;  
        // console.log("Result is ", result) 
    }catch (error){
        // console.log("getting erro ", error);
        return res.send({"error":error});
    }    
    
    console.log("newuser is ", name);
    try {
        const token = jwt.sign({name:name, password:secret}, jwt_secret, {});
        return res.send({status:"success", token:token, name:name});  
    } catch (error) { 
        return res.send({status:"error", "error":req.body});
    }
});



app.post("/getName", async (req, res) => {
    
    const token = req.body.token;
    // console.log("token is ", token);
    // console.log("getName")

    try {
        const u_name = jwt.verify(token, jwt_secret, (err, res) =>{
        if(err){
            // console.log(err);
            return "token expired";
        }
        return res;
        });
        // console.log("uname is ", u_name);
        if (u_name.password == secret) {
        return res.send({ status: "success", data: u_name.name });
        } else {
        return res.send({ status: "error", data: "Invalid password" });
        }
    } catch (error) {
        console.error('Token decoding error:', error);
        return res.send({ status: "error", data: error.message });
    }
});
  
app.post("/update", async(req, res) => {
    // console.log("called the api");

    const token = req.body.token;
    // console.log("token is ", token);
    let uname = "";
    try {
        const u_name = jwt.decode(token);
        if(u_name.password == secret){
            uname = u_name.name;
        }else{
            return res.send({status:"error", data:error});
        }
    } catch (error) { 
        return res.send({status:"error", data:error});
    }
    // console.log("we have decripted the token");
    const id = req.body.id;
    const change = req.body.change;
    const type = req.body.type;
    // console.log(id, change, type);
    try {
        const post = await posts.findOne({_id:id});
        // console.log("found a post");
        if(post){

            // console.log("entering if");
            name = post.name;
            title = post.title;
            content = post.content;
            filter = post.filter;
            likes = post.likes;
            dislikes = post.dislikes;
            comments = post.comments;
            
            if (type === "likes") {
                post.dislikes.delete(uname);
                // console.log("entering likes");
                if (post.likes.get(uname) === '1') {
                    // console.log("already set");
                    post.likes.delete(uname);
                } else {
                    // console.log("not already set");
                    post.likes.set(uname, '1');
                }
            } else {
                post.likes.delete(uname);
                if (post.dislikes.get(uname) === '1') {
                    post.dislikes.delete(uname);
                } else {
                    post.dislikes.set(uname, '1');
                }
            }
            
            // console.log("LIKES IS ", likes);
            // console.log("DISLIKES IS", dislikes);
            // console.log("We have reached mid way");

            try {
                await posts.updateOne(
                  {
                    _id:id,
                  },
                  {
                    $set: {
                      name,
                      id,
                      title,
                      content,
                      filter,
                      likes,
                      dislikes,
                      comments,
                    },
                  } 
                );
                // console.log("updted successfully");
                return res.send({"status":"success"});
                
            } catch (error) {
                return res.send({"status": "error", data:error});
            }            
        }else{
            // console.log("entering the else");
        }
        return res.send({"status": "error"})
    } catch (error) { 
      return res.send({status:"error", data:error});
    }
});
  
app.post("/addComment", async (req, res) => {
    // console.log("here");
    const token = req.body.token;
    // const id = req.body;
    const id = req.body.id;
    const data = req.body.data;
    // console.log(data);
    // console.log(token);
    // console.log(id)
    let uname = "";

    
    try {
        const u_name = jwt.verify(token, jwt_secret, (err, res) =>{
            if(err){
                // console.log(err);
                return "token expired";
            }
            return res;
            });
        if (u_name.password == secret) {
            uname = u_name.name;
        }else{
            return res.send({status:"error", data:error});
        }
    } catch (error) { 
        return res.send({status:"error", data:error});
    }
    // console.log("name is ", uname);

    try {
        // console.log("here");
        const post = await posts.findOne({_id:id});
        
        if(post){
            
            // console.log("entering if");
            name = post.name;
            // id = post.id;
            title = post.title;
            content = post.content;
            filter = post.filter;
            likes = post.likes;
            dislikes = post.dislikes;
            comments = post.comments;
            if(comments.length < 50){
                comments.push({data, uname});
            }
            
            // console.log(comments);
            try {
                await posts.updateOne(
                  {
                    _id:id,
                  },
                  {
                    $set: {
                      name,
                      id,
                      title,
                      content,
                      filter,
                      likes,
                      dislikes,
                      comments,
                    },
                  } 
                );
                // console.log("We succeed");
                return res.send({"status":"success"});
            } catch (error) {
                return res.send({"status": "error", data:error});
            }            
        }
        return res.send({"status": "error"})
    } catch (error) { 
      return res.send({status:"error", data:error});
    }
});



function difference(timestamp1, timestamp2) {
  // Assuming timestamps are in the format 'DD/MM/YYYY, hh:mm a'
  const format = 'DD/MM/YYYY, hh:mm a';

  // Parse timestamps using the specified format
  const time1 = moment(timestamp1, format);
  const time2 = moment(timestamp2, format);

  // Calculate the difference in milliseconds
  const differenceMilliseconds = Math.abs(time1 - time2);

  // Convert the difference to a duration
  const duration = moment.duration(differenceMilliseconds);

  // Extract and format the difference components
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const total = days*24*60 + hours*60 + minutes;

  return total;
}



function calculateRatio(timestamp, likes, dislikes, comments) {
    const now = new Date();
    const currentTime = now.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
      });

    // console.log("current time is ", currentTime);
    // console.log("posttime is ", timestamp);
    const timePassed = difference(currentTime, timestamp);
    // console.log("this was the time", timePassed);
    const likesSize = likes && likes.size ? likes.size : 0;
    const dislikesSize = dislikes && dislikes.size ? dislikes.size : 0;
    const commentsSize = comments && comments.length ? comments.length : 0;
    const ratio = timePassed / (likesSize + dislikesSize + commentsSize + 1);
    
    // console.log("Ratio is ", ratio);
    return ratio;
}



let allPosts = []; // Variable to store all posts data

// Function to load and sort posts data
const loadAndSortPosts = async () => {
    const unfiltered_posts = await posts.find({});
    // console.log("Loaded posts data. Sorting...");
    allPosts = unfiltered_posts.slice(); // Copy the data to the variable
    allPosts.sort((a, b) => {
            const ratioA = calculateRatio(a.timestamp, a.likes, a.dislikes, a.comments);
            const ratioB = calculateRatio(b.timestamp, b.likes, b.dislikes, b.comments);        
            return ratioA - ratioB;
    });
    // console.log("Sorted posts data.");
};

// Call the function initially to load and sort data
loadAndSortPosts();

// Schedule the periodic task to reload and sort data every 15 seconds
setInterval(loadAndSortPosts, 15000);

app.post("/getData", (req, res) => {
    var { size, flag } = req.body;
    // console.log("flag is ", flag);
    // console.log("size is", size);
    // console.log(req.body);
    // console.log("called the data function");
    var my_filter = req.body.filter;
    if (my_filter == 0) {
        my_filter = 15;
    }

    if (flag == 1) {
        var now = size;
        const slicedPosts = allPosts.slice(0, now);
        // console.log("size of slised post is ", slicedPosts.length);
        let filteredposts = [];
        for (let i = 0; i < now; i++) {
            if ((slicedPosts[i].filter & my_filter) != 0 || slicedPosts[i].filter == 0) {
                filteredposts.push(slicedPosts[i]);
            }
        }
        // console.log("we send the size of ", filteredposts.length)
        res.send({ "status": "success", "data": filteredposts });
    } else {
        const slicedPosts = allPosts.slice(size, size + 12);
        // console.log("size of slised post is ", slicedPosts.length);
        let filteredposts = [];
        for (let i = 0; i < slicedPosts.length; i++) {
            if (((slicedPosts[i].filter & my_filter) != 0) || (slicedPosts[i].filter == 0)) {
                filteredposts.push(slicedPosts[i]);
            }else{
                // console.log(slicedPosts[i].filter, my_filter);
                // console.log("filer was not met");
            }
        }
        // console.log(filteredposts);
        // console.log("we send the size of ", filteredposts.length)
        res.send({ "status": "success", "data": filteredposts });
    }
});




app.post("/antiSpam", async (req, res) => {
    // console.log("this is ");
    try {
        await posts.deleteMany({
            content: {
                $regex: /^asdf/i  // Case-insensitive regex to match content starting with "Lorem ipsum dolor sit amet"
            }
        });
        // console.log("Done");
        res.send("Posts deleted successfully");
    } catch (error) {
        // console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


app.post("/postData", async(req, res) => {
    const {token, title, content, filter, captcha} = req.body;
    
    var captchaVerified = false;
    try {
        const response = await axios.post(`https://recaptchaenterprise.googleapis.com/v1/projects/weasel-1705305140047/assessments?key=${RECAPTCHA_SECRET_KEY}`, {
            "event": {
                "token": captcha,
                "siteKey": GKEY,
              }
            
        });
        // console.log(response.data.tokenProperties);
        // console.log(response);       
    if (response.data.tokenProperties.valid) {
        // console.log("verifieed");
        captchaVerified = true;
    }else{
        // console.log("unverified");
        return res.send({status:"error"});
    }
    } catch (error) {
        // console.log("tring to captcha");
        // console.log(error);
        return res.send({status:"error"});
    }

    if(captchaVerified == false){
        return res.send({status:"error"});
    }
    // console.log("captcha verified");

    const u_name = jwt.verify(token, jwt_secret, (err, res) =>{
    if(err){
        // console.log(err);
        return res.send({status:"token expired"});
    }
    return res;
    });
    var name = "";
    if (u_name.password == secret) {
        name = u_name.name;
    } else {
        return res.send({ status: "error", data: "token_expired" });
    }
    const now1 = new Date();
    const timestamp = now1.toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata', // Indian Standard Time (IST)
      });

    // console.log(timestamp);
    try { 
        await posts.create({
            name,
            timestamp,
            // id,
            title,
            content,
            filter,
            // likes,
            // dislikes,
            // comments,
        });
        loadAndSortPosts();
        return res.send({"status":"success", "name": name});
    } catch (error) {
       
        return res.send({"status": error})
    }
    
});