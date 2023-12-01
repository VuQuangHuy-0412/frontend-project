import StorageService from "../common/storage.service"
import {performLogout} from "./utils";

export default function authHeader() {
  let token = StorageService.get('Token');
  console.log(token)

  if (token) {
    let accessToken = JSON.parse(token);
    console.log(accessToken.accessToken)
    return {Authorization: accessToken.accessToken};
  } else {
    performLogout();
  }
}
