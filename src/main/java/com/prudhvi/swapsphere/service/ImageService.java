package com.prudhvi.swapsphere.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.prudhvi.swapsphere.exception.ImageTooLargeException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return result.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image");
        }
    }
    public List<String> uploadImages(MultipartFile[] images) {

        for (MultipartFile image : images) {
            if (image.getSize() > 5 * 1024 * 1024) {
                throw new ImageTooLargeException("Each image must be less than 5MB.");
            }
        }

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            imageUrls.add(uploadImage(image));

        }
        return imageUrls;
    }
}
