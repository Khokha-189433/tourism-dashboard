import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

//Style 
import '../Style/Login.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
//////////
import { BrowserRouter} from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flag , setflag]=useState(true)

  //   const [loading, setLoading] = useState(false);
  //   const navigate = useNavigate();

  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     setLoading(true);

  //     try {
  //       const res = await axios.post("http://localhost:5000/api/login", {
  //         email,
  //         password,
  //       });

  //       localStorage.setItem("token", res.data.token);
  //       navigate("/");
  //     } catch (err) {
  //       alert("Invalid email or password");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

 

  {/* onSubmit */ }

  function Submit(e){
    e.preventDefault()
    if(email === '' || password === '' )
    {
      setflag(false)
    }
    if(flag)
    {
      /////se
    }

  }


  return (
    <div className="">

      {/* Card */}
      <div className="Card">

        <Card sx={{ minWidth: 400 }}  >

          <CardContent style={{ margin: "5rem" }} >
            {/* Logo / Title */}
            <Typography gutterBottom sx={{ color: ' rgb(118, 209, 216)', fontSize: 20 }}>
              🌍 Tourism Admin
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 19 }}>
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
                  <Button variant="contained" type="submit">  Submit  </Button>
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