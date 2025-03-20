package fr.codecake.spotifyclone.catalogcontext.application.mapper;

import fr.codecake.spotifyclone.catalogcontext.application.dto.ReadSongInfoDTO;
import fr.codecake.spotifyclone.catalogcontext.application.dto.SaveSongDTO;
import fr.codecake.spotifyclone.catalogcontext.domain.Song;
import java.util.Arrays;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-20T17:25:08+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.41.0.z20250213-2037, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class SongMapperImpl implements SongMapper {

    @Override
    public Song saveSongDTOToSong(SaveSongDTO saveSongDTO) {
        if ( saveSongDTO == null ) {
            return null;
        }

        Song song = new Song();

        song.setTitle( songTitleVOToString( saveSongDTO.title() ) );
        song.setAuthor( songAuthorVOToString( saveSongDTO.author() ) );
        byte[] cover = saveSongDTO.cover();
        if ( cover != null ) {
            song.setCover( Arrays.copyOf( cover, cover.length ) );
        }
        song.setCoverContentType( saveSongDTO.coverContentType() );

        return song;
    }

    @Override
    public ReadSongInfoDTO songToReadSongInfoDTO(Song song) {
        if ( song == null ) {
            return null;
        }

        ReadSongInfoDTO readSongInfoDTO = new ReadSongInfoDTO();

        readSongInfoDTO.setTitle( stringToSongTitleVO( song.getTitle() ) );
        readSongInfoDTO.setAuthor( stringToSongAuthorVO( song.getAuthor() ) );
        byte[] cover = song.getCover();
        if ( cover != null ) {
            readSongInfoDTO.setCover( Arrays.copyOf( cover, cover.length ) );
        }
        readSongInfoDTO.setCoverContentType( song.getCoverContentType() );
        readSongInfoDTO.setPublicId( song.getPublicId() );

        return readSongInfoDTO;
    }
}
