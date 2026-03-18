package com.portal.teachercontentportal.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class passwordEncamp {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

String raw = "pass123";
String hash = "";

System.out.println(encoder.matches(raw, hash));
    }
}