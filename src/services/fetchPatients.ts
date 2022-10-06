import { PATIENTS_API_URL } from "../constants";
import { Patient } from "../types"

export const fetchPatients = async (searchString: string = "", page?: number, limit?: number): Promise<Patient[]> => {
  try {
      let url = `${PATIENTS_API_URL}?search=${searchString}`;
      if (page !== undefined) {
        url += `&page=${page}`;
      }
      if (limit !== undefined) {
        url += `&limit=${limit}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      return data;
  } catch (error) {
      console.log("error", error);
      return [];
  }
}
