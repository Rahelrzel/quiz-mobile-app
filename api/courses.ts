import api from "../lib/axios";

export interface Course {
  id: number;
  title: string;
  description: string;
  contentUrl: string;
  thumbnail: string;
}

export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get<Course[]>("courses");
  return response.data;
};

export const getCourseById = async (id: string | number): Promise<Course> => {
  const response = await api.get<Course>(`courses/${id}`);
  return response.data;
};

export const createCourse = async (data: {
  title: string;
  description: string;
  contentUrl: string;
  thumbnail: string;
}): Promise<Course> => {
  const response = await api.post<Course>("courses", data);
  return response.data;
};
