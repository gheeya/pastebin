import React, { useState, useCallback } from "react";
import api from "../../api/api";

function useFetch() {
  const [state, setState] = useState({
    loading: false,
    errorMsg: "",
    successMsg: "",
    data: null,
  });
  const fetchData = useCallback(async (config) => {
    try {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));

      const data = await api.request(config);
      setState({
        errorMsg: "",
        data,
        successMsg: "AXIOS REQUEST SUCCESSFULL",
        loading: false,
      });
      console.log("Here is the fetched data", data);
      return data;
    } catch (error) {
      setState({
        loading: false,
        successMsg: "",
        errorMsg: error?.message || "ERROR WHILE FETCHING DATA",
        data: null,
      });
      throw error;
    }
  }, []);

  return [fetchData, state];
}

export default useFetch;
