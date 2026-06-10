
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

////////////////////////////////

///////////////////////////////
export default function Users() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");

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
        setUsers(response.data.data || []);
      } catch (fetchError) {
        console.error("Error fetching users:", fetchError?.response || fetchError);
        setError(fetchError?.response?.data?.message || fetchError.message || 'Fetch error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>

      <TableContainer
        component={Paper}
        
         sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "#13171a"
                    : "#fff",
                  justifyContent: "",
                  borderRadius: 3,
                  boxShadow: 3,
                  margin : "0 auto",   
              }}
      >
        <Table  sx={{ }} aria-label="users table">
          <TableHead sx={{}}>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/User"
                    state={{ UserId: user.id }}
                  >
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}