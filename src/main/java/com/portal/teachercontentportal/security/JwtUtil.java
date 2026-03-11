package com.portal.teachercontentportal.security;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Date;

public class JwtUtil {

    private static final String SECRET = System.getenv("JWT_SECRET_STRING");

    public static String generateToken(String teacherId, String role) {

        Algorithm algorithm = Algorithm.HMAC256(SECRET);

        return JWT.create()
                .withSubject(teacherId)
                .withClaim("role", role)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 3600000))
                .sign(algorithm);
    }
    public static DecodedJWT validateToken(String token) {

        Algorithm algorithm = Algorithm.HMAC256(SECRET);

        return JWT.require(algorithm)
                .build()
                .verify(token);
    }

}
