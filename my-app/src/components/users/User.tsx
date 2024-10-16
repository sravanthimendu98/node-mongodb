import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import UserService from '../../services/UserService';
import { useStyles } from '../styles/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

type User = {
  _id: number;
  name: string;
  experience: string;
  address: string;
  role: string;
  dateOfJoining: string;
};

const UserComponent = () => {
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = () => {
    UserService.usersData()
      .then((response: any) => {
        setUsers(response);
      })
      .catch((error: any) => {
        console.error("Failed to fetch user data");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      experience: '',
      role: '',
      dateOfJoining: '',
      address: '',
    },
    
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      experience: Yup.number().required('Experience is required'),
      role: Yup.string().required('Role is required'),
      dateOfJoining: Yup.string().required('Date of Joining is required'),
      address: Yup.string().required('Address is required'),
    }),

    onSubmit: (values) => {
      if (editMode && selectedUser) {
        UserService.editUser(selectedUser._id, values)
          .then(() => {
            fetchUsers();
          })
          .catch((error) => {
            console.error("Failed to update user");
          });
      } else {
        UserService.addUser(values)
          .then(() => {
            fetchUsers();
          })
          .catch((error) => {
            console.error("Failed to add user");
          });
      }
      setOpen(false);
      formik.resetForm();
    },
  });

  const handleOpen = () => {
    formik.resetForm();
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    formik.setValues(user);
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    UserService.deleteUser(id)
      .then(() => {
        fetchUsers();
      })
      .catch((error) => {
        console.error("Failed to delete user");
      });
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'experience', headerName: 'Experience', width: 110 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'dateOfJoining', headerName: 'Date of Joining', width: 150 },
    { field: 'address', headerName: 'Address', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)} variant="contained" color="primary" style={{ marginRight: 8 }}>Edit</Button>
          <Button onClick={() => handleDelete(params.row._id)} variant="contained" color="secondary">Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ height: 400, width: '85%', margin: "auto", marginTop: '5%' }}>
        <Button sx={{ marginBottom: "2%" }} variant="contained" onClick={handleOpen}>Add</Button>
        <Box>
          <DataGrid
            sx={{ ".MuiDataGrid-row--borderBottom": { backgroundColor: '#b4caf3 !important' } }}
            getRowId={(row) => row._id}
            rows={users}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              className={classes.fieldErr}
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              className={classes.fieldErr}
              label="Experience"
              name="experience"
              value={formik.values.experience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.experience && Boolean(formik.errors.experience)}
              helperText={formik.touched.experience && formik.errors.experience}
            />
            <TextField
              className={classes.fieldErr}
              label="Role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            />
            <TextField
              className={classes.fieldErr}
              label="Date of Joining"
              name="dateOfJoining"
              value={formik.values.dateOfJoining}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.dateOfJoining && Boolean(formik.errors.dateOfJoining)}
              helperText={formik.touched.dateOfJoining && formik.errors.dateOfJoining}
            />
            <TextField
              className={classes.fieldErr}
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!formik.isValid || formik.isSubmitting}>
              {editMode ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UserComponent;
