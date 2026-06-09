import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
////////////////////
import Header from "../../../components/layout/Header"


export default function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Edit Dialog
  const [openEdit, setOpenEdit] = useState(false);   // open Dialog
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    role: "",
    is_active: true,
  });

  const location = useLocation();
  const userId = location.state.UserId // Assuming you pass the user
  // console.log(userId)
  const adminToken = localStorage.getItem("adminToken");

  // =========================
  // GET USERS
  // =========================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `/api/admin/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${adminToken}`,
            },
          }
        );

        setUsers(response.data.data);
        // console.log(response.data.data)

      } catch (error) {
        console.error("Error fetching users:", error?.response || error);
        setError(error?.response?.data?.message || error.message || 'Fetch error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);



  // =========================
  // OPEN EDIT DIALOG
  // =========================

  const handleEditClick = (users) => {
    setSelectedUser(users);

    setFormData({
      role: users.role,
      is_active: users.is_active,
    });

    setOpenEdit(true);
  };

  // =========================
  // UPDATE USER
  // =========================
  const handleUpdateUser = async () => {
    alert("hi in update")
    try {
      const user = await axios.put(
        `api/admin/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log('Axios response.data:', user.data);
      setOpenEdit(true);


    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // =========================
  // DELETE USER
  // =========================

  //   const handleDeleteUser = async (id) => {
  //     const confirmDelete = window.confirm(
  //       "Are you sure you want to delete this user?"
  //     );

  //     if (!confirmDelete) return;

  //     try {
  //       await axios.delete(`/admin/users/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${adminToken}`,
  //         },
  //       });

  //       setUsers(users.filter((user) => user.id !== id));
  //     } catch (error) {
  //       console.error("Error deleting user:", error);
  //     }
  //   };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <Box
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex' }} >
        <Header />
        <Box component="main" Box sx={{ p: 9, width: "100%"  }}>

          <Typography variant="h4" sx={{ mx: "auto", p: 2 }} >
            User Management
          </Typography>

          <TableContainer component={Paper} sx={{ textAlignLast: 'center', mx: "auto" }}>
            <Table>
              <TableHead sx={{ background: "#0e70e7ba" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Update User</TableCell>

                </TableRow>
              </TableHead>

              <TableBody>

                <TableRow key={users.id}>
                  <TableCell>{users.id}</TableCell>
                  <TableCell>{users.first_name}</TableCell>
                  <TableCell>{users.last_name}</TableCell>
                  <TableCell>{users.email}</TableCell>
                  <TableCell>{users.role}</TableCell>
                  <TableCell>{users.phone}</TableCell>
                  <TableCell>
                    {users.is_active ? "Active" : "Inactive"}
                  </TableCell>

                  <TableCell align="center">
                    <EditIcon  // Button Edit User
                      color="primary"
                      onClick={() => handleEditClick(users)}
                    >
                    </EditIcon>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>

          {/* ========================= */}
          {/* EDIT DIALOG */}
          {/* ========================= */}

          <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
            <DialogTitle>Edit User</DialogTitle>

            <DialogContent>
              <TextField
                fullWidth
                margin="normal"
                label="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                margin="normal"
                label="is_active"
                value={formData.is_active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true", // Convert string to boolean
                  })
                }
              />

            </DialogContent>

            <DialogActions>
              <Button>
                Cancel
              </Button>
              <Button variant="contained" onClick={() => handleUpdateUser(users)} >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>

      </Box>

    </>
  );
}   