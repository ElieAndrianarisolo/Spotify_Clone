package fr.codecake.spotifyclone.catalogcontext.application.mapper;

import fr.codecake.spotifyclone.catalogcontext.application.dto.SaveSongDTO;
import fr.codecake.spotifyclone.catalogcontext.application.dto.SongContentDTO;
import fr.codecake.spotifyclone.catalogcontext.domain.Song;
import fr.codecake.spotifyclone.catalogcontext.domain.SongContent;
import java.util.Arrays;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-20T17:25:09+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.41.0.z20250213-2037, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class SongContentMapperImpl implements SongContentMapper {

    @Override
    public SongContentDTO songContentToSongContentDTO(SongContent songContent) {
        if ( songContent == null ) {
            return null;
        }

        UUID publicId = null;
        byte[] file = null;
        String fileContentType = null;

        publicId = songContentSongPublicId( songContent );
        byte[] file1 = songContent.getFile();
        if ( file1 != null ) {
            file = Arrays.copyOf( file1, file1.length );
        }
        fileContentType = songContent.getFileContentType();

        SongContentDTO songContentDTO = new SongContentDTO( publicId, file, fileContentType );

        return songContentDTO;
    }

    @Override
    public SongContent saveSongDTOToSong(SaveSongDTO songDTO) {
        if ( songDTO == null ) {
            return null;
        }

        SongContent songContent = new SongContent();

        byte[] file = songDTO.file();
        if ( file != null ) {
            songContent.setFile( Arrays.copyOf( file, file.length ) );
        }
        songContent.setFileContentType( songDTO.fileContentType() );

        return songContent;
    }

    private UUID songContentSongPublicId(SongContent songContent) {
        if ( songContent == null ) {
            return null;
        }
        Song song = songContent.getSong();
        if ( song == null ) {
            return null;
        }
        UUID publicId = song.getPublicId();
        if ( publicId == null ) {
            return null;
        }
        return publicId;
    }
}
