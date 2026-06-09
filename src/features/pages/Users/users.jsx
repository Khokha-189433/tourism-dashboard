
import React, { useEffect, useState } from "react";
import {Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button 
} from "@mui/material";
import Header from "../../../components/layout/Header";
////////////////////////////////

///////////////////////////////
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "/api/admin/users?page=1&limit=10&role=customer",
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );
        console.log('Axios response.data:', response.data);
        setUsers(response.data.data)
        setLoading(false);

      } catch (error) {
        console.error("Error fetching users:", error?.response || error);
        setError(error?.response?.data?.message || error.message || 'Fetch error');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);



  if (loading) {
    return (
      <Box
        display="flex"
        // justifyContent="center"
        // alignItems="center"
        // height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
     <Box  sx={{ display: 'flex'  }} >
      <Header />
    <Box  sx={{ p:9   ,width:"100%" }}   >
    
      <Typography variant="h3"  sx={{mx:"auto" , p:3 }} >
        All Users
      </Typography>

      <TableContainer   component={Paper} sx={{  background :"#9ec4f3e1"   ,textAlignLast:'center'  ,mx:"auto"  }}>
        <Table  >
          <TableHead sx={{background :"#0e70e7ba" }}>
            {/*  TableRow  هو الصف بالجدول  */}
            <TableRow >

              {/*  TableCell  هو العامود في الجدولول  */}
              <TableCell>First Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell> User </TableCell>
            </TableRow>
          </TableHead>

          <TableBody  >
            {users.map((user) => (
              <TableRow key={user.id}     >
                <TableCell >{user.first_name}</TableCell>
                <TableCell>{user.email}</TableCell>   
                <TableCell>
                  <Link to="/User"  state={{ UserId : user.id }}>
                  <Button variant="outlined" color="success">
                     Open
                  </Button>
                  </Link>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
     </Box>
   
    </>
  );
}