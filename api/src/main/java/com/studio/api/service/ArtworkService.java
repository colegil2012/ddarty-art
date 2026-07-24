package com.studio.api.service;

import com.studio.api.dto.ArtworkDto;
import com.studio.api.model.Artwork;
import com.studio.api.repository.ArtworkRepository;
import com.studio.api.storage.ImageStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtworkService {

    private final ArtworkRepository repository;
    private final ImageStore imageStore;

    public ArtworkService(ArtworkRepository repository, ImageStore imageStore) {
        this.repository = repository;
        this.imageStore = imageStore;
    }

    public List<ArtworkDto> findAll() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public List<ArtworkDto> findFeatured() {
        return repository.findByFeaturedTrue().stream().map(this::toDto).toList();
    }

    public List<ArtworkDto> findRandom(int limit) {
        int safeLimit = Math.clamp(limit, 1, 60);
        return repository.findRandom(safeLimit).stream().map(this::toDto).toList();
    }

    public List<ArtworkDto> findByTag(String tag) {
        return repository.findByTagsContaining(tag).stream().map(this::toDto).toList();
    }

    public Optional<ArtworkDto> findById(String id) {
        return repository.findById(id).map(this::toDto);
    }

    /** Resolves storage keys into URLs for the active profile. */
    private ArtworkDto toDto(Artwork a) {
        return new ArtworkDto(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getMedium(),
                a.getYear(),
                a.getTags(),
                a.getImageKey() == null ? null : imageStore.urlFor(a.getImageKey()),
                a.getThumbKey() == null ? null : imageStore.urlFor(a.getThumbKey()),
                a.getWidth(),
                a.getHeight(),
                a.getLqip(),
                a.isFeatured()
        );
    }
}
