import { postReq } from "@/utils/api/api";
import catchAsyncError from "./catchAsyncError";
import axios from "axios";
import environment from "@/utils/environment";

const uploadToAWS = catchAsyncError(
  async (selectedFile: File | null, path = "") => {
    if (!selectedFile) {
      return "";
    }

    const response = await postReq(`/file${path}`, {
      fileType: selectedFile.type,
    });

    console.log("response from server", response);

    const { url, fileKey, fileType } = response;

    // Upload file to S3 using pre-signed URL
    await axios.put(url, selectedFile, {
      headers: {
        "Content-Type": fileType,
      },
    });

    const mediaUrl = `https://${environment.AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}`;

    return mediaUrl;
  }
);

export default uploadToAWS;
