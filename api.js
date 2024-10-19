// Import necessary packages
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Define your API and identity URLs
const API_URL = "https://fermantest.free.beeceptor.com";
const REFRESH_TOKEN_URL = "https://fermantest.free.beeceptor.com/refresh-token";
const clientId = "fermanclientid";
const scope = "fermanscope";

export const ApiClient = () => {
    // Create a new axios instance
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    // Add a request interceptor to add the JWT token to the authorization header
    api.interceptors.request.use(
       async (config) => {
         const token =await AsyncStorage.getItem("token");
         if (token) {
           config.headers.Authorization = `${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
    );
  
    createAxiosResponseInterceptor();

    function createAxiosResponseInterceptor() {
      const interceptor = api.interceptors.response.use(
          (response) => {
            console.log("RETURN REPONSE INSTEAD ERRRO")
            return response
          },
          async (error) => {
            console.log(error.response.status)
              // Reject promise if usual error
              if (error.response.status !== 401) {
                  return Promise.reject(error);
              }
              if (
                error.response.status === 401 &&
                AsyncStorage.getItem("refreshToken")
                ) {
                  try {
                    api.interceptors.response.eject(interceptor);
                    
                    const refreshToken = await AsyncStorage.getItem("refreshToken");
                    console.error("Error at API AXIOS", error.response.status, refreshToken)
                    
                    const url = `${REFRESH_TOKEN_URL}`;
  
                    const body = `grant_type=refresh_token&client_id=${clientId}&scope=${scope}&refresh_token=${refreshToken}`;
                    const headers = {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    };
                    
                    const response = await axios.post(url, body, { headers: headers })
                    
                    console.log(`access_token : ${response.data.access_token}`);
                    console.log(`refresh_token : ${response.data.refresh_token}`);

                    await AsyncStorage.setItem("token", "Bearer " + response.data.access_token);
                    await AsyncStorage.setItem("refreshToken", response.data.refresh_token);
                    console.log("Successfully refresh token")

                    error.response.config.headers["Authorization"] =
                          "Bearer " + response.data.access_token;
                    return axios(error.response.config);
                  }
                  catch(err) {
                    console.error("Error at refresh token", err.response.status);
                    
                    //If refresh token is invalid, you will receive this error status and log user out
                    if (err.response.status === 400) {
                      throw { response: { status: 401 } };
                    }
                    return Promise.reject(err);
                  }
                  finally{createAxiosResponseInterceptor}; 
            }
          }
      );
    }

    const get = (path, params) => {
        return api.get(path,{params}).then((response) => response);
    };

    const post = (path, body, params) => {
        return api.post(path, body, params).then((response) => response);
    };

    const put = (path, body, params) => {
        return api.put(path, body, params).then((response) => response);
    };

    const patch = (path, body, params) => {
      return api.patch(path, body, params).then((response) => response);
  };

    const del = (path) => {
        return api.delete(path).then((response) => response);
    };



    return {
        get,
        post,
        patch,
        put,
        del,
    };
};