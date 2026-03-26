import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourses,
  getCourseById,
  createCourse,
  Course,
} from "../api/courses";

export const useCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};

export const useCourseById = (id: string | number) => {
  return useQuery<Course>({
    queryKey: ["courses", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
