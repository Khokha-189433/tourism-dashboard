// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   MenuItem,
//   TextField,
// } from "@mui/material";

// export default function Update_User({
//   open,
//   handleClose,
//   user,
//   onSave,}) 
// {
//   const [formData, setFormData] = useState({
//     role: "",
//     is_active: true,
//   });
//  useEffect(() => {
//     if (user) {
//       setFormData({
//         role: user.role || "",
//         is_active: user.is_active,
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: name === "is_active" ? value === "true" : value,
//     });
//   };

//   const handleSubmit = () => {
//     onSave(formData);
//   };
//   return (
//     <Dialog open={open} onClose={handleClose} fullWidth>
//       <DialogTitle>Edit User</DialogTitle>

//       <DialogContent>
//         <TextField
//           fullWidth
//           margin="normal"
//           label="Role"
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//         />

//         <TextField
//           select
//           fullWidth
//           margin="normal"
//           label="Status"
//           name="is_active"
//           value={formData.is_active.toString()}
//           onChange={handleChange}
//         >
//           <MenuItem value="true">Active</MenuItem>
//           <MenuItem value="false">Inactive</MenuItem>
//         </TextField>
//       </DialogContent>
    
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>

//         <Button variant="contained" onClick={handleSubmit}>
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }