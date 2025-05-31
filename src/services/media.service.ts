import { apiAxios } from "./auth.service";

class MediaService {
  async uploadImage(image: File): Promise<any> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await apiAxios.post("/medias/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
  async uploadVideo(video: File): Promise<any> {
    const formData = new FormData();
    formData.append("video", video);

    const response = await apiAxios.post("/medias/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

const mediaService = new MediaService();
export default mediaService;
