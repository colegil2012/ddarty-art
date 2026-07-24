package com.studio.api.config;

import com.studio.api.model.Artwork;
import com.studio.api.repository.ArtworkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

/**
 * Populates the gallery on first local run so the frontend has something to
 * render before real work is uploaded. Never active under "prod".
 */
@Configuration
@Profile("local")
public class SeedData {

    private static final Logger log = LoggerFactory.getLogger(SeedData.class);

    /*
    @Bean
    CommandLineRunner seedArtwork(ArtworkRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                log.info("Gallery already seeded ({} pieces)", repository.count());
                return;
            }

            List<Artwork> pieces = List.of(
                    piece("Low Tide, Second Morning", "oil on linen", "2024",
                            List.of("painting", "landscape"), 1400, 1050, true,
                            "Painted over three visits to the same stretch of shoreline, "
                          + "chasing the twenty minutes when the water pulls back far enough "
                          + "to leave the sandbars lit."),
                    piece("Study for a Longer Winter", "graphite and gouache", "2024",
                            List.of("drawing", "study"), 900, 1200, true,
                            "A working drawing that stopped being a study somewhere around "
                          + "the fourth session."),
                    piece("Kitchen Window, 6am", "oil on panel", "2023",
                            List.of("painting", "interior"), 1000, 1000, true,
                            "Small panel, painted standing up, finished before the light moved."),
                    piece("Ferns (Unresolved)", "ink on paper", "2023",
                            List.of("drawing", "botanical"), 850, 1150, false,
                            "One of nine attempts. The only one that kept any air in it."),
                    piece("Red Barn, Overcast", "oil on canvas", "2023",
                            List.of("painting", "landscape"), 1500, 1000, false,
                            "The barn is gone now. This was the last summer it stood."),
                    piece("Hands, Borrowed", "charcoal", "2022",
                            List.of("drawing", "figure"), 950, 1250, false,
                            "Drawn from a friend who sat far longer than she agreed to."),
                    piece("Threshold", "mixed media on board", "2022",
                            List.of("mixed-media"), 1100, 1400, true,
                            "Built up and sanded back four times. The under-layers still show "
                          + "through where the board took the most abuse."),
                    piece("Night Field", "oil on linen", "2022",
                            List.of("painting", "landscape", "nocturne"), 1600, 900, false,
                            "Almost entirely mixed from three colors. The restriction was the point.")
            );

            repository.saveAll(pieces);
            log.info("Seeded {} pieces into the gallery", pieces.size());
        };
    }

    private Artwork piece(String title, String medium, String year, List<String> tags,
                          int width, int height, boolean featured, String description) {
        Artwork a = new Artwork();
        a.setTitle(title);
        a.setMedium(medium);
        a.setYear(year);
        a.setTags(tags);
        a.setDescription(description);
        a.setWidth(width);
        a.setHeight(height);
        a.setFeatured(featured);

        String slug = title.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        a.setImageKey("artwork/" + slug + ".jpg");
        a.setThumbKey("artwork/" + slug + "-thumb.jpg");
        // Neutral placeholder tone; replaced by a real LQIP at upload time.
        a.setLqip("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=");
        return a;
    }*/
}
