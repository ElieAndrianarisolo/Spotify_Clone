package fr.codecake.spotifyclone.usercontext.mapper;

import fr.codecake.spotifyclone.usercontext.ReadUserDTO;
import fr.codecake.spotifyclone.usercontext.domain.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-03-20T17:25:09+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.41.0.z20250213-2037, environment: Java 21.0.6 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public ReadUserDTO readUserDTOToUser(User entity) {
        if ( entity == null ) {
            return null;
        }

        String firstName = null;
        String lastName = null;
        String email = null;
        String imageUrl = null;

        firstName = entity.getFirstName();
        lastName = entity.getLastName();
        email = entity.getEmail();
        imageUrl = entity.getImageUrl();

        ReadUserDTO readUserDTO = new ReadUserDTO( firstName, lastName, email, imageUrl );

        return readUserDTO;
    }
}
