package com.studio.api.controller;

import com.studio.api.dto.ArtworkDto;
import com.studio.api.service.ArtworkService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    private final ArtworkService service;

    public GalleryController(ArtworkService service) {
        this.service = service;
    }

    /**
     * GET /api/gallery
     * GET /api/gallery?random=true&limit=8   -> homepage carousel
     * GET /api/gallery?featured=true         -> curated selection
     * GET /api/gallery?tag=ink
     */
    @GetMapping
    public List<ArtworkDto> list(
            @RequestParam(defaultValue = "false") boolean random,
            @RequestParam(defaultValue = "false") boolean featured,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "12") int limit) {

        if (random) return service.findRandom(limit);
        if (featured) return service.findFeatured();
        if (tag != null && !tag.isBlank()) return service.findByTag(tag);
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtworkDto> byId(@PathVariable String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
