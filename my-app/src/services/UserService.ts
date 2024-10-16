import { AppUrls } from "../../src/constants/appUrls";
import { AxiosApiService } from "./AxiosApiService";

const axiosApiService = AxiosApiService();

const UserService = {
  usersData: async function () {
    const response = await axiosApiService.get(AppUrls.getUsers);
    return response.data;
  },
  addUser: async function (body: object) {
    const response = await axiosApiService.post(AppUrls.addUser, body);
    return response.data;
  },
  editUser: async function (id: any, body: any) {
    const response = await axiosApiService.put(
      AppUrls.editUser + `/${id}`,
      body
    );
    return response.data;
  },
  deleteUser: async function (id: any) {
    const response = await axiosApiService.delete(
      AppUrls.deleteUser + `/${id}`
    );
    return response.data;
  },
};

export default UserService;
