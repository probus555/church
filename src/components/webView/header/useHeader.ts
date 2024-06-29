import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks/hooks";


const useHeader = () => {
  const {employeeDetails} = useAppSelector(state => state.employee);

  return {employeeDetails};
};
export default useHeader;
