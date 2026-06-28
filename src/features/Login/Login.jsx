import { useState } from "react";
import { useNavigate } from "react-router-dom";


//Style 
import './Login.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import api from "../../api/refreshToken";
//////////


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(loading)
  const navigate = useNavigate();
  
  const Submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      console.log(res.data)
   
    // تخزين التوكن
 const token = res.data.data.access_token ;
 localStorage.setItem("accessToken", token);

// // احفظ الـ refresh token ← هذا هو الجديد
const refreshToken = res.data.data.refresh_token ;
localStorage.setItem("refreshToken", refreshToken);
console.log( "RefreshToken"+ refreshToken);
//  

console.log('accessToken'+  token);

navigate("/dashboard");
} catch (err) {
  console.log(err);
} finally {
  setLoading(false);
}
};


 {/* onSubmit */ }

  return (
    <div className="login-page">

      {/* Card */}
      <div className="Card">

        <Card   sx={{ width:600, }} className="Card_login" >

          <CardContent style={{ margin: "4rem" }} >
            {/* Logo / Title */}
            <Typography gutterBottom sx={{ color: ' rgb(152, 172, 173)', fontSize: 30  , width:400}}>
              🌍 Tourism Admin
            </Typography>
            <Typography gutterBottom sx={{  fontSize: 19 , width:400 , color: ' rgb(115, 117, 117)'}}>
              Welcome back, please login
            </Typography>
            {/*..............Form ..................*/}
            <form onSubmit={Submit} >

              {/* Email */}
              <div className="input ">
                <TextField
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  requird="true"
                />

              </div>


              {/* Password */}
              <div className="input ">
                <TextField
                  id=""
                  type="password"
                  label="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  requird="true"
                />

              </div>

              {/* Button */}
              <div className="input ">
                <Stack   >
                  <Button  sx={{background:' rgba(14, 13, 34, 0.253)'}} type="submit ">  Submit  </Button>
                </Stack>
              </div>
            </form>
            {/* variant="contained" */}

          </CardContent>
        </Card>

      </div>

    </div>
  );
}