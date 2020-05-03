import Role from "./role";
import RoleEnum from '../enum/role'

export type User = {
  UserId: string,
  UserName: string,
  NickName: string,
  Phone: string,
  Token: string,
  Avatar: string,
  Role: RoleEnum,
}

export default User;
