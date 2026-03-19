package com.portal.teachercontentportal.security;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.repository.UserRepository;
import org.springframework.stereotype.Component;
import java.util.Date;
@Component
public class JwtUtil {

    private static final String SECRET = System.getenv("JWT_SECRET_STRING");
    private final UserRepository userRepository;

    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(String userId) {
        User user = userRepository.findByUserId(userId).orElseThrow( () -> new RuntimeException("User not found"));
        String role = user.getRole().name();

        Algorithm algorithm = Algorithm.HMAC256(SECRET);
        final long Expiration = 3600000;

        return JWT.create()
                .withSubject(userId)
                .withClaim("role", role)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + Expiration))
                .sign(algorithm);
    }
    public DecodedJWT validateToken(String token) {

        Algorithm algorithm = Algorithm.HMAC256(SECRET);

        return JWT.require(algorithm)
                .build()
                .verify(token);
    }

}
