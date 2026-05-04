import api from "@/lib/axios";

export interface UserCertificate {
  certificateId: string;
  title: string;
  issueDate: string;
  certificateUrl: string;
}

export const getUserCertificates = async (): Promise<UserCertificate[]> => {
  const response = await api.get<UserCertificate[]>("users/certificates");
  return response.data;
};
