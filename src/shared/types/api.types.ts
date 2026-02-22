export interface ApiResponse<T> {
  status: "success" | "error";
  success: boolean;
  data: T;
  message?: string;
}
