import { mediaAxios } from "./auth.service";
import axios from "axios";
const BACKUP_MEDIA_API_URL =
  import.meta.env.VITE_MEDIA_BACKUP_URL || "https://your-media-backup-url.com";

class MediaService {
  async uploadImage(image: File): Promise<any> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await mediaAxios.post("/medias/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async uploadVideo(video: File): Promise<any> {
    const formData = new FormData();
    formData.append("video", video);

    const response = await mediaAxios.post("/medias/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async backupUploadImage(image: File): Promise<any> {
    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      `${BACKUP_MEDIA_API_URL}/medias/upload-images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async backupUploadVideo(video: File): Promise<any> {
    const formData = new FormData();
    formData.append("video", video);

    const response = await axios.post(
      `${BACKUP_MEDIA_API_URL}/medias/upload-videos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
}

const mediaService = new MediaService();
export default mediaService;
