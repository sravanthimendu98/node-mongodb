import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import UserService from "../../services/UserService";
import { useStyles } from "../styles/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../navbar/Navbar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteDialog from "../dialogs/DeleteUser";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

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
      name: "",
      experience: "",
      role: "",
      dateOfJoining: "",
      address: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      experience: Yup.number().required("Experience is required"),
      role: Yup.string().required("Role is required"),
      dateOfJoining: Yup.date().required("Date of Joining is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: (values) => {
      console.log(values, "values");

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
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete !== null) {
      UserService.deleteUser(userToDelete)
        .then(() => {
          fetchUsers();
        })
        .catch((error) => {
          console.error("Failed to delete user");
        });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const isFormChanged = () => {
    if (!selectedUser) return true;
    return (
      formik.values.name !== selectedUser.name ||
      formik.values.experience !== selectedUser.experience ||
      formik.values.role !== selectedUser.role ||
      formik.values.dateOfJoining !== selectedUser.dateOfJoining ||
      formik.values.address !== selectedUser.address
    );
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 250 },
    { field: "experience", headerName: "Experience", width: 150 },
    { field: "role", headerName: "Role", width: 200 },
    { field: "dateOfJoining", headerName: "Date of Joining", width: 200 },
    { field: "address", headerName: "Address", width: 230 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => handleEdit(params.row)}
            variant="contained"
            color="primary"
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(params.row._id)}
            variant="contained"
            color="secondary"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "85%",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "2%",
        }}
      >
        <Typography variant="h6">Employee Data</Typography>{" "}
        <Button
          sx={{
            marginBottom: "1%",
            marginTop: "15px",
          }}
          variant="contained"
          onClick={handleOpen}
        >
          Add
        </Button>
      </Box>
      <Box sx={{ height: 500, width: "85%", margin: "auto" }}>
        <DataGrid
          sx={{
            ".MuiDataGrid-row--borderBottom": {
              backgroundColor: "#b4caf3 !important",
            },
          }}
          getRowId={(row) => row._id}
          rows={users}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
        />
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editMode ? "Edit User" : "Add New User"}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              marginTop: "5px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
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
              type="number"
              value={formik.values.experience}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              margin="normal"
              error={
                formik.touched.experience && Boolean(formik.errors.experience)
              }
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                className={classes.fieldErr}
                label="Date of Joining"
                value={
                  formik.values.dateOfJoining
                    ? new Date(formik.values.dateOfJoining)
                    : null
                }
                onChange={(value) => {
                  if (value instanceof Date && !isNaN(value.getTime())) {
                    formik.setFieldValue(
                      "dateOfJoining",
                      value.toISOString().split("T")[0]
                    );
                  } else {
                    formik.setFieldValue("dateOfJoining", "");
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                    error: Boolean(
                      formik.touched.dateOfJoining &&
                        formik.errors.dateOfJoining
                    ),
                    helperText:
                      formik.touched.dateOfJoining &&
                      formik.errors.dateOfJoining
                        ? formik.errors.dateOfJoining
                        : "",
                  },
                }}
              />
            </LocalizationProvider>
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
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={!isFormChanged()}
            >
              {editMode ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default UserComponent;
