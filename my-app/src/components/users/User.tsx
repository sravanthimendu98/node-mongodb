import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import UserService from '../../services/UserService';
import { useStyles } from '../styles/styles';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material';

type User = {
  _id: number;
  name: string;
  age: string;
  fullName: string;
  role: string;
  dateOfJoining: string;
};


const UserComponent = () => {
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    age: '',
    fullName: '',
    role: '',
    dateOfJoining: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    UserService.usersData()
      .then((response: any) => {
        setUsers(response);
      })
      .catch((error: any) => {
        console.error("Failed to fetch user data");
      });
  };

  const handleOpen = () => {
    setNewUser({ name: '', age: '', fullName: '', role: '', dateOfJoining: '' });
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (user: User) => {
    setNewUser(user);
    setSelectedUser(user);
    setEditMode(true);
    setOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateUser = () => {
    if (editMode && selectedUser) {
      UserService.editUser(selectedUser._id, newUser)
        .then(() => {
          fetchUsers();
        })
        .catch((error) => {
          console.error("Failed to update user");
        });
    } else {
      UserService.addUser(newUser)
        .then(() => {
          fetchUsers();
        })
        .catch((error) => {
          console.error("Failed to add user");
        });
    }
    setOpen(false);
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
    { field: 'age', headerName: 'Age', width: 110 },
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'dateOfJoining', headerName: 'Date of Joining', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)} variant="contained" color="primary" style={{ marginRight: 8 }}>Edit</Button>
          <Button  onClick={() => handleDelete(params.row._id)} variant="contained" color="secondary">Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
    <Box sx={{ height: 400, width: '85%', margin:"auto", marginTop: '5%' }}>
        <Button sx={{marginBottom:"2%"}} variant="contained" onClick={handleOpen}>Add</Button>
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
        <DialogContent>
          <TextField label="Name" name="name" value={newUser.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Age" name="age" value={newUser.age} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Full Name" name="fullName" value={newUser.fullName} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Role" name="role" value={newUser.role} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Date of Joining" name="dateOfJoining" value={newUser.dateOfJoining} onChange={handleChange} fullWidth margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddOrUpdateUser} variant="contained">
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserComponent;
